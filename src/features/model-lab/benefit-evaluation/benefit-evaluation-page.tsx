"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, RotateCcw, Edit, RefreshCw, FileText, User, X } from "lucide-react";
import { MdInput, MdButton, MdCard, MdBadge, MdSelect, AdvancedSearch, FormItem, type SelectOption } from "@/components/enterprise-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 定义指标数据类型
interface IndicatorData {
  metricStr: string; // 指标名称
  base: number; // 应用前均值
  applied: number; // 应用期均值
  rate: string; // 变化率
}

// 定义项目数据类型
interface ProjectData {
  id: string;
  name: string; // 项目名称
  tag: string; // 项目标签
  region: string; // 所属大区
  beforeStart: string; // 应用前开始时间
  beforeEnd: string; // 应用前结束时间
  afterStart: string; // 应用期开始时间
  afterEnd: string; // 应用期结束时间
  summaryData: IndicatorData[]; // 指标数据列表
}

// 扁平化后的表格行数据
interface FlattenedRow extends ProjectData, IndicatorData {
  rowKey: string; // 唯一标识
}

// Mock数据
const mockProjectData: ProjectData[] = [
  {
    id: "proj-1",
    name: "智能调度优化项目",
    tag: "生产优化",
    region: "华东大区",
    beforeStart: "2024-01-01",
    beforeEnd: "2024-06-30",
    afterStart: "2024-07-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "能耗降低率",
        base: 100.5,
        applied: 85.2,
        rate: "-15.2%"
      },
      {
        metricStr: "生产效率",
        base: 78.3,
        applied: 92.1,
        rate: "+17.6%"
      },
      {
        metricStr: "故障率",
        base: 5.2,
        applied: 3.1,
        rate: "-40.4%"
      }
    ]
  },
  {
    id: "proj-2",
    name: "水质预测模型项目",
    tag: "质量监控",
    region: "华南大区",
    beforeStart: "2024-02-01",
    beforeEnd: "2024-07-31",
    afterStart: "2024-08-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "预测准确率",
        base: 82.5,
        applied: 91.3,
        rate: "+10.7%"
      },
      {
        metricStr: "异常检出率",
        base: 65.8,
        applied: 78.4,
        rate: "+19.1%"
      }
    ]
  },
  {
    id: "proj-3",
    name: "设备维护优化项目",
    tag: "设备管理",
    region: "华北大区",
    beforeStart: "2024-03-01",
    beforeEnd: "2024-08-31",
    afterStart: "2024-09-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "维护成本",
        base: 125.6,
        applied: 98.3,
        rate: "-21.7%"
      },
      {
        metricStr: "设备可用率",
        base: 88.2,
        applied: 94.5,
        rate: "+7.1%"
      },
      {
        metricStr: "维护响应时间",
        base: 45.3,
        applied: 32.1,
        rate: "-29.1%"
      },
      {
        metricStr: "预防性维护覆盖率",
        base: 72.4,
        applied: 89.6,
        rate: "+23.8%"
      }
    ]
  },
  {
    id: "proj-4",
    name: "智能加药系统项目",
    tag: "工艺优化",
    region: "华东大区",
    beforeStart: "2024-04-01",
    beforeEnd: "2024-09-30",
    afterStart: "2024-10-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "药剂使用量",
        base: 150.8,
        applied: 128.5,
        rate: "-14.8%"
      },
      {
        metricStr: "水质达标率",
        base: 95.2,
        applied: 98.7,
        rate: "+3.7%"
      }
    ]
  }
];

export function BenefitEvaluationPage() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<ProjectData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 搜索表单数据
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    region: "",
  });

  // 项目名称下拉选项
  const [projectOptions, setProjectOptions] = useState<SelectOption[]>([]);

  // 选中的行（用于批量授权）
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // 弹窗状态
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState<FlattenedRow | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 扁平化数据
  const flattenedTableData = useMemo<FlattenedRow[]>(() => {
    const result: FlattenedRow[] = [];
    tableData.forEach((project) => {
      project.summaryData.forEach((indicator, index) => {
        result.push({
          ...project,
          ...indicator,
          rowKey: `${project.id}-${index}`,
        });
      });
    });
    return result;
  }, [tableData]);

  // 计算行合并信息
  const spanArr = useMemo(() => {
    const spans: number[] = [];
    if (flattenedTableData.length === 0) return spans;

    let pos = 0;
    let currentName = flattenedTableData[0].name;
    spans.push(1);

    for (let i = 1; i < flattenedTableData.length; i++) {
      if (flattenedTableData[i].name === currentName) {
        spans[pos] += 1;
        spans.push(0);
      } else {
        spans.push(1);
        pos = i;
        currentName = flattenedTableData[i].name;
      }
    }
    return spans;
  }, [flattenedTableData]);

  // 获取行合并信息
  const getSpanInfo = (rowIndex: number, columnIndex: number) => {
    // 项目信息列(0)、对比周期列(1)、操作列(7)需要合并
    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 7) {
      const rowspan = spanArr[rowIndex];
      return {
        rowSpan: rowspan > 0 ? rowspan : 0,
        colSpan: rowspan > 0 ? 1 : 0,
      };
    }
    return { rowSpan: 1, colSpan: 1 };
  };

  // 加载数据（带过滤条件）
  const loadDataWithFilters = useCallback(async (
    page: number,
    size: number,
    filters: { name: string; tag: string; region: string }
  ) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟数据过滤
      let filteredData = mockProjectData.filter((item) => {
        if (filters.name && item.id !== filters.name) return false;
        if (filters.tag && !item.tag.includes(filters.tag)) return false;
        if (filters.region && !item.region.includes(filters.region)) return false;
        return true;
      });

      const total = filteredData.length;
      const startIndex = (page - 1) * size;
      const endIndex = Math.min(startIndex + size, total);
      const paginatedData = filteredData.slice(startIndex, endIndex);

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
  }, []);

  // 加载数据（使用当前 formData）
  const loadData = useCallback(async (page = pagination.current, size = pagination.pageSize) => {
    await loadDataWithFilters(page, size, formData);
  }, [formData, loadDataWithFilters]);

  // 加载项目名称选项
  const loadProjectOptions = useCallback(() => {
    const options: SelectOption[] = mockProjectData.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setProjectOptions(options);
  }, []);

  useEffect(() => {
    loadProjectOptions();
    loadDataWithFilters(1, pagination.pageSize, formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜索
  const handleSearch = (data: Record<string, any>) => {
    const newFormData = {
      name: data.name || "",
      tag: data.tag || "",
      region: data.region || "",
    };
    setFormData(newFormData);
    setPagination((prev) => ({ ...prev, current: 1 }));
    // 使用新的 formData 进行搜索
    loadDataWithFilters(1, pagination.pageSize, newFormData);
  };

  // 重置
  const handleReset = () => {
    const newFormData = {
      name: "",
      tag: "",
      region: "",
    };
    setFormData(newFormData);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadDataWithFilters(1, pagination.pageSize, newFormData);
  };

  // 清空某个搜索项
  const handleClear = (primaryKey: string) => {
    setFormData((prev) => ({
      ...prev,
      [primaryKey]: "",
    }));
  };

  // 分页变化
  const handlePageChange = (page: number, size: number) => {
    loadData(page, size);
  };

  // 行选择变化
  const handleSelectionChange = (rowKey: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowKey]);
    } else {
      setSelectedRows((prev) => prev.filter((key) => key !== rowKey));
    }
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(flattenedTableData.map((row) => row.rowKey));
    } else {
      setSelectedRows([]);
    }
  };

  // 授权
  const handleAuthorization = (row: FlattenedRow) => {
    toast.info("授权功能待实现");
  };

  // 批量授权
  const handleBatchAuthorization = () => {
    if (selectedRows.length === 0) {
      toast.warning("请选择授权项目!");
      return;
    }
    toast.info("批量授权功能待实现");
  };

  // 编辑
  const handleEdit = (row: FlattenedRow) => {
    toast.info("编辑功能待实现");
  };

  // 更新
  const handleUpdate = async (row: FlattenedRow) => {
    setUpdatingId(row.id);
    setIsUpdating(true);
    try {
      // 模拟更新请求
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("更新成功");
      loadData();
    } catch (error) {
      toast.error("更新失败");
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  // 明细
  const handleDetail = (row: FlattenedRow) => {
    setCurrentRow(row);
    setIsShowDetail(true);
  };

  // 关闭明细弹窗
  const handleCloseDetail = () => {
    setIsShowDetail(false);
    setCurrentRow(null);
  };

  // 搜索表单配置
  const formItemList: FormItem[] = [
    {
      type: "select",
      label: "项目名称",
      paramKey: "name",
      placeholder: "请选择",
      modelValue: formData.name,
      selectOptions: projectOptions,
    },
    {
      type: "input",
      label: "项目标签",
      paramKey: "tag",
      placeholder: "请输入",
      modelValue: formData.tag,
    },
    {
      type: "input",
      label: "所属大区",
      paramKey: "region",
      placeholder: "请输入",
      modelValue: formData.region,
    },
  ];

  // 判断变化率颜色
  const getRateColor = (rate: string) => {
    if (rate.startsWith("+")) {
      return "text-emerald-600 bg-emerald-50";
    } else if (rate.startsWith("-")) {
      return "text-red-600 bg-red-50";
    }
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索区域 */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        <AdvancedSearch
          formItemList={formItemList}
          onSearch={handleSearch}
          onReset={handleReset}
          onClear={handleClear}
        />
        
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-start">
          <MdButton onClick={handleBatchAuthorization} leftIcon={<User className="h-3 w-3" />}>
            批量授权
          </MdButton>
        </div>
        
        <div className="overflow-auto h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="border-r border-border p-3 text-left text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === flattenedTableData.length && flattenedTableData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="cursor-pointer"
                  />
                </th>
                <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[200px]">
                  项目信息
                </th>
                <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[120px]">
                  对比周期
                </th>
                <th className="border-r border-border p-3 text-left text-sm font-semibold min-w-[150px]">
                  指标名称
                </th>
                <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[120px]">
                  应用前均值
                </th>
                <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[120px]">
                  应用期均值
                </th>
                <th className="border-r border-border p-3 text-center text-sm font-semibold min-w-[120px]">
                  变化率
                </th>
                <th className="p-3 text-center text-sm font-semibold min-w-[100px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-muted-foreground">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : flattenedTableData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              ) : (
                flattenedTableData.map((row, rowIndex) => {
                  const spanInfo = getSpanInfo(rowIndex, 0);
                  return (
                    <tr
                      key={row.rowKey}
                      className={cn(
                        "border-b border-border hover:bg-muted/30 transition-colors",
                        rowIndex % 2 === 1 && "bg-muted/10"
                      )}
                    >
                      {/* 选择框 */}
                      <td className="border-r border-border p-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.rowKey)}
                          onChange={(e) => handleSelectionChange(row.rowKey, e.target.checked)}
                          className="cursor-pointer"
                        />
                      </td>

                      {/* 项目信息 */}
                      <td
                        className="border-r border-border p-3"
                        rowSpan={spanInfo.rowSpan}
                        style={{ display: spanInfo.rowSpan === 0 ? "none" : "table-cell" }}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-base">{row.name}</div>
                          <div className="text-primary text-sm">{row.region}</div>
                          <MdBadge variant="secondary" className="text-xs">
                            {row.tag}
                          </MdBadge>
                        </div>
                      </td>

                      {/* 对比周期 */}
                      {(() => {
                        const spanInfo = getSpanInfo(rowIndex, 1);
                        return (
                          <td
                            className="border-r border-border p-3"
                            rowSpan={spanInfo.rowSpan}
                            style={{ display: spanInfo.rowSpan === 0 ? "none" : "table-cell" }}
                          >
                            <div className="space-y-1 text-sm">
                              <div>{row.beforeStart} ~ {row.beforeEnd}</div>
                              <div className="text-muted-foreground">vs</div>
                              <div>{row.afterStart} ~ {row.afterEnd}</div>
                            </div>
                          </td>
                        );
                      })()}

                      {/* 指标名称 */}
                      <td className="border-r border-border p-3">
                        <div className="font-semibold">{row.metricStr}</div>
                      </td>

                      {/* 应用前均值 */}
                      <td className="border-r border-border p-3 text-center">
                        {row.base.toFixed(2)}
                      </td>

                      {/* 应用期均值 */}
                      <td className="border-r border-border p-3 text-center">
                        {row.applied.toFixed(2)}
                      </td>

                      {/* 变化率 */}
                      <td className="border-r border-border p-3 text-center">
                        <span
                          className={cn(
                            "inline-block px-3 py-1 rounded-full font-bold text-sm font-mono",
                            getRateColor(row.rate)
                          )}
                        >
                          {row.rate}
                        </span>
                      </td>

                      {/* 操作 */}
                      {(() => {
                        const spanInfo = getSpanInfo(rowIndex, 7);
                        return (
                          <td
                            className="p-3 text-center"
                            rowSpan={spanInfo.rowSpan}
                            style={{ display: spanInfo.rowSpan === 0 ? "none" : "table-cell" }}
                          >
                            <div className="flex flex-col gap-1 items-center">
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAuthorization(row)}
                                leftIcon={<User className="h-3 w-3" />}
                                className="w-full"
                              >
                                授权
                              </MdButton>
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(row)}
                                leftIcon={<Edit className="h-3 w-3" />}
                                className="w-full"
                              >
                                编辑
                              </MdButton>
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdate(row)}
                                disabled={isUpdating && updatingId === row.id}
                                leftIcon={<RefreshCw className={cn("h-3 w-3", isUpdating && updatingId === row.id && "animate-spin")} />}
                                className="w-full"
                              >
                                {isUpdating && updatingId === row.id ? "更新中..." : "更新"}
                              </MdButton>
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDetail(row)}
                                leftIcon={<FileText className="h-3 w-3" />}
                                className="w-full"
                              >
                                明细
                              </MdButton>
                            </div>
                          </td>
                        );
                      })()}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {!loading && flattenedTableData.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              共 {pagination.total} 条数据
            </div>
            <div className="flex items-center gap-2">
              <MdButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current === 1}
              >
                上一页
              </MdButton>
              <span className="text-sm text-foreground">
                第 {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)} 页
              </span>
              <MdButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                下一页
              </MdButton>
            </div>
          </div>
        )}
      </div>

      {/* 明细弹窗 */}
      {isShowDetail && currentRow && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseDetail} />
          <div className="relative ml-auto h-full w-[600px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">项目明细</div>
              <MdButton variant="text" size="sm" onClick={handleCloseDetail}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <MdCard className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">项目名称</h4>
                      <p>{currentRow.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">项目标签</h4>
                      <p>{currentRow.tag}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">所属大区</h4>
                      <p>{currentRow.region}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">指标名称</h4>
                      <p>{currentRow.metricStr}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用前开始时间</h4>
                      <p>{currentRow.beforeStart}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用前结束时间</h4>
                      <p>{currentRow.beforeEnd}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用期开始时间</h4>
                      <p>{currentRow.afterStart}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用期结束时间</h4>
                      <p>{currentRow.afterEnd}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用前均值</h4>
                      <p>{currentRow.base.toFixed(2)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">应用期均值</h4>
                      <p>{currentRow.applied.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">变化率</h4>
                      <p>
                        <span className={cn("inline-block px-3 py-1 rounded-full font-bold text-sm font-mono", getRateColor(currentRow.rate))}>
                          {currentRow.rate}
                        </span>
                      </p>
                    </div>
                  </div>
                </MdCard>
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
