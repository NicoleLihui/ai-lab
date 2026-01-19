"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, RotateCcw, FileText, X } from "lucide-react";
import { MdInput, MdButton, MdTable, MdBadge, type Column } from "@/components/enterprise-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getMockEvaluationMgmtData, type EvaluationMgmtModel } from "./mock-evaluation-mgmt-data";

export function BenefitEvaluationMgmtPage() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<EvaluationMgmtModel[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // 详情弹窗状态
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [currentModel, setCurrentModel] = useState<EvaluationMgmtModel | null>(null);

  // 加载数据
  const loadData = useCallback(async (page = pagination.current, size = pagination.pageSize, query = searchQuery) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 获取所有数据
      let allData = getMockEvaluationMgmtData();

      // 搜索过滤
      if (query && query.trim()) {
        allData = allData.filter((item) => 
          item.modelName?.toLowerCase().includes(query.toLowerCase().trim())
        );
      }

      const total = allData.length;
      const startIndex = (page - 1) * size;
      const endIndex = Math.min(startIndex + size, total);
      const paginatedData = allData.slice(startIndex, endIndex);

      setTableData(paginatedData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: total,
      }));
    } catch (error) {
      console.error("加载数据失败:", error);
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchQuery]);

  useEffect(() => {
    loadData();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, searchQuery);
  };

  // 重置
  const handleReset = () => {
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, "");
  };

  // 分页变化
  const handlePageChange = (page: number, size: number) => {
    loadData(page, size, searchQuery);
  };

  // 详情
  const handleDetail = (row: EvaluationMgmtModel) => {
    setCurrentModel(row);
    setIsShowDetail(true);
  };

  // 关闭详情弹窗
  const handleCloseDetail = () => {
    setIsShowDetail(false);
    setCurrentModel(null);
  };

  // 解析评估指标
  const parseEvaluateIndex = (evaluateIndex: string | null | undefined) => {
    if (!evaluateIndex) return [];
    try {
      const parsed = JSON.parse(evaluateIndex);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // 排序评估指标数据
  const sortEvaluateIndexData = (data: Array<{ desc?: string; name: string; value: string }>) => {
    const priority: Record<string, number> = {
      'mean': 1,
      'MAE': 2,
      'rmae': 3,
      'r2_score': 4,
    };

    return [...data].sort((a, b) => {
      const aDesc = a.desc || '';
      const bDesc = b.desc || '';

      let aPriority = Infinity;
      let bPriority = Infinity;

      for (const [key, value] of Object.entries(priority)) {
        if (aDesc.includes(key)) {
          aPriority = value;
          break;
        }
      }

      for (const [key, value] of Object.entries(priority)) {
        if (bDesc.includes(key)) {
          bPriority = value;
          break;
        }
      }

      return aPriority - bPriority;
    });
  };

  // 表格列定义
  const columns: Column<EvaluationMgmtModel>[] = useMemo(() => [
    {
      title: "序号",
      key: "index",
      width: 60,
      align: "center",
      render: (_: unknown, _record: EvaluationMgmtModel, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "模型名称",
      key: "modelName",
      width: 200,
      render: (_: unknown, record: EvaluationMgmtModel) => (
        <div className="space-y-1">
          {record.modelName && (
            <div className="font-semibold text-base text-foreground">{record.modelName}</div>
          )}
          {record.modelId && (
            <div className="text-sm text-muted-foreground">ID: {record.modelId}</div>
          )}
        </div>
      ),
    },
    {
      title: "模型类型",
      key: "modelType",
      width: 150,
      align: "center",
      render: (_: unknown, record: EvaluationMgmtModel) => 
        record.modelType ? (
          <MdBadge variant="secondary">{record.modelType}</MdBadge>
        ) : null,
    },
    {
      title: "版本号",
      key: "version",
      width: 100,
      align: "center",
      render: (_: unknown, record: EvaluationMgmtModel) => 
        record.version ? (
          <span className="font-mono font-semibold bg-muted px-2 py-1 rounded text-sm">
            {record.version}
          </span>
        ) : null,
    },
    {
      title: "最后一次训练时间",
      key: "createTime",
      width: 180,
      render: (_: unknown, record: EvaluationMgmtModel) => (
        <div className="font-semibold text-foreground">{record.createTime || "-"}</div>
      ),
    },
    {
      title: "训练次数",
      key: "runCount",
      width: 100,
      align: "center",
      render: (_: unknown, record: EvaluationMgmtModel) => (
        <div className="font-semibold text-foreground">{record.runCount || "-"}</div>
      ),
    },
    {
      title: "核心评估指标",
      key: "evaluateIndex",
      width: 200,
      render: (_: unknown, record: EvaluationMgmtModel) => {
        const evaluateIndexData = parseEvaluateIndex(record.evaluateIndex);
        const sortedData = sortEvaluateIndexData(evaluateIndexData);
        
        if (sortedData.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }

        return (
          <div className="space-y-1 py-1">
            {sortedData.map((item, index) => (
              item.desc ? (
                <div key={index} className="flex items-center text-sm">
                  <span className="font-semibold text-foreground mr-2">{item.desc}:</span>
                  <span className="font-semibold text-foreground">
                    {Number(item.value).toFixed(4)}
                  </span>
                </div>
              ) : null
            ))}
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      align: "center",
      render: (_: unknown, record: EvaluationMgmtModel) => (
        <MdButton
          variant="ghost"
          size="sm"
          onClick={() => handleDetail(record)}
          leftIcon={<FileText className="h-3 w-3" />}
        >
          详情
        </MdButton>
      ),
    },
  ], [pagination.current, pagination.pageSize]);

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索区域 */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索模型名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              clearable
              onClear={handleReset}
              leftIcon={<Search className="h-4 w-4" />}
              className="h-9"
            />
          </div>
          <MdButton
            onClick={handleSearch}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9 px-3"
          >
            查询
          </MdButton>
          <MdButton
            variant="outline"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            className="h-9 px-3"
          >
            重置
          </MdButton>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden p-4">
        <MdTable
          columns={columns}
          data={tableData}
          rowKey="modelId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
          className="h-full"
        />
      </div>

      {/* 详情弹窗 */}
      {isShowDetail && currentModel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseDetail} />
          <div className="relative ml-auto h-full w-[800px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">模型详情</div>
              <MdButton variant="text" size="sm" onClick={handleCloseDetail}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型名称</h4>
                      <p className="font-semibold">{currentModel.modelName || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型ID</h4>
                      <p className="font-semibold">{currentModel.modelId || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">模型类型</h4>
                      <p className="font-semibold">{currentModel.modelType || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">版本号</h4>
                      <p className="font-semibold">{currentModel.version || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">开发者</h4>
                      <p className="font-semibold">{currentModel.creator || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">最后一次训练时间</h4>
                      <p className="font-semibold">{currentModel.createTime || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">训练次数</h4>
                      <p className="font-semibold">{currentModel.runCount || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">开发语言</h4>
                      <p className="font-semibold">{currentModel.developLanguage || "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">适用场景</h4>
                      <p className="font-semibold">{currentModel.applicableScenarioStr || "-"}</p>
                    </div>
                    {currentModel.notes && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">备注</h4>
                        <p className="text-sm whitespace-pre-wrap">{currentModel.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 评估指标 */}
                {currentModel.evaluateIndex && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">核心评估指标</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const evaluateIndexData = parseEvaluateIndex(currentModel.evaluateIndex);
                        const sortedData = sortEvaluateIndexData(evaluateIndexData);
                        return sortedData.map((item, index) => (
                          item.desc ? (
                            <div key={index}>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">{item.desc}</h5>
                              <p className="font-semibold">{Number(item.value).toFixed(4)}</p>
                            </div>
                          ) : null
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <MdButton variant="outline" onClick={handleCloseDetail}>关闭</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
