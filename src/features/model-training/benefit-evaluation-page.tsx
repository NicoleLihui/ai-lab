"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, RotateCcw, TrendingUp, TrendingDown, X } from "lucide-react";
import { MdInput, MdButton, MdTable, MdCard, MdBadge } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { toast } from "sonner";

// 定义回测收益评估数据类型
interface BenefitEvaluationItem {
  id: string;
  strategyName: string;
  backtestName: string;
  startTime: string;
  endTime: string;
  totalReturn: number; // 总收益率
  annualizedReturn: number; // 年化收益率
  volatility: number; // 波动率
  maxDrawdown: number; // 最大回撤
  sharpeRatio: number; // 夏普比率
  winRate: number; // 胜率
  profitFactor: number; // 盈利因子
  status: string; // 状态
  riskLevel: string; // 风险等级
  createTime: string;
}

// Mock数据
const mockBenefitEvaluationData: BenefitEvaluationItem[] = [
  {
    id: "1",
    strategyName: "趋势跟踪策略",
    backtestName: "趋势跟踪回测v1.0",
    startTime: "2025-01-01",
    endTime: "2025-12-31",
    totalReturn: 12.5,
    annualizedReturn: 12.5,
    volatility: 8.2,
    maxDrawdown: -3.2,
    sharpeRatio: 1.25,
    winRate: 65.3,
    profitFactor: 2.15,
    status: "已完成",
    riskLevel: "中等",
    createTime: "2026-01-10 14:30:25"
  },
  {
    id: "2",
    strategyName: "均值回归策略",
    backtestName: "均值回归回测v2.1",
    startTime: "2025-01-01",
    endTime: "2025-12-31",
    totalReturn: 8.7,
    annualizedReturn: 8.7,
    volatility: 6.5,
    maxDrawdown: -2.1,
    sharpeRatio: 1.18,
    winRate: 72.1,
    profitFactor: 1.89,
    status: "已完成",
    riskLevel: "低",
    createTime: "2026-01-09 11:20:15"
  },
  {
    id: "3",
    strategyName: "动量策略",
    backtestName: "动量策略回测v1.5",
    startTime: "2025-06-01",
    endTime: "2025-12-31",
    totalReturn: 15.2,
    annualizedReturn: 16.8,
    volatility: 12.3,
    maxDrawdown: -5.7,
    sharpeRatio: 1.05,
    winRate: 58.9,
    profitFactor: 1.92,
    status: "进行中",
    riskLevel: "高",
    createTime: "2026-01-08 16:45:32"
  },
  {
    id: "4",
    strategyName: "套利策略",
    backtestName: "统计套利回测v3.0",
    startTime: "2025-03-01",
    endTime: "2025-12-31",
    totalReturn: 6.3,
    annualizedReturn: 7.1,
    volatility: 3.8,
    maxDrawdown: -1.2,
    sharpeRatio: 1.52,
    winRate: 78.4,
    profitFactor: 2.35,
    status: "已完成",
    riskLevel: "低",
    createTime: "2026-01-07 09:15:28"
  },
  {
    id: "5",
    strategyName: "机器学习预测",
    backtestName: "ML价格预测回测",
    startTime: "2025-01-01",
    endTime: "2025-12-31",
    totalReturn: 18.9,
    annualizedReturn: 18.9,
    volatility: 15.7,
    maxDrawdown: -8.4,
    sharpeRatio: 1.08,
    winRate: 55.6,
    profitFactor: 1.78,
    status: "已完成",
    riskLevel: "高",
    createTime: "2026-01-06 13:22:45"
  },
  {
    id: "6",
    strategyName: "波动率策略",
    backtestName: "波动率交易回测",
    startTime: "2025-09-01",
    endTime: "2025-12-31",
    totalReturn: -2.1,
    annualizedReturn: -8.4,
    volatility: 18.2,
    maxDrawdown: -12.3,
    sharpeRatio: -0.35,
    winRate: 42.7,
    profitFactor: 0.85,
    status: "已完成",
    riskLevel: "高",
    createTime: "2026-01-05 10:30:12"
  }
];

export function BenefitEvaluationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<BenefitEvaluationItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // 抽屉状态
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  
  // 当前选中的项目
  const [currentItem, setCurrentItem] = useState<BenefitEvaluationItem | null>(null);

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = useCallback(async (page = currentPage, size = pageSize, query = searchQuery) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据过滤和分页
      let filteredData = mockBenefitEvaluationData.filter(item => 
        !query || 
        item.strategyName.toLowerCase().includes(query.toLowerCase()) ||
        item.backtestName.toLowerCase().includes(query.toLowerCase())
      );

      const total = filteredData.length;
      const startIndex = (page - 1) * size;
      const endIndex = Math.min(startIndex + size, total);
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setTableData(paginatedData);
      setPagination(prev => ({
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
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSearch = () => {
    loadData(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    loadData(1, pagination.pageSize, "");
  };

  // 定义表格列
  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: Record<string, unknown>, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "strategyName",
      title: "策略名称",
      width: 140,
      align: "center" as const,
      render: (value: unknown) => (
        <div className="text-left">
          <div className="font-medium">{value as string}</div>
        </div>
      )
    },
    {
      key: "backtestName",
      title: "回测名称",
      width: 160,
      align: "center" as const,
    },
    {
      key: "totalReturn",
      title: "总收益率",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const returnVal = Number(value);
        return (
          <div className={`font-medium ${returnVal >= 0 ? 'text-success' : 'text-destructive'}`}>
            {returnVal >= 0 ? '+' : ''}{returnVal.toFixed(2)}%
            {returnVal >= 0 ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />}
          </div>
        );
      }
    },
    {
      key: "annualizedReturn",
      title: "年化收益率",
      width: 120,
      align: "center" as const,
      render: (value: unknown) => {
        const annualized = Number(value);
        return (
          <div className={`font-medium ${annualized >= 0 ? 'text-success' : 'text-destructive'}`}>
            {annualized >= 0 ? '+' : ''}{annualized.toFixed(2)}%
          </div>
        );
      }
    },
    {
      key: "volatility",
      title: "波动率",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => (
        <span className="font-medium">{Number(value).toFixed(2)}%</span>
      )
    },
    {
      key: "maxDrawdown",
      title: "最大回撤",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const drawdown = Number(value);
        return (
          <span className={`font-medium ${drawdown < 0 ? 'text-destructive' : 'text-success'}`}>
            {drawdown.toFixed(2)}%
          </span>
        );
      }
    },
    {
      key: "sharpeRatio",
      title: "夏普比率",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const ratio = Number(value);
        return (
          <span className={`font-medium ${ratio > 0 ? 'text-success' : 'text-destructive'}`}>
            {ratio.toFixed(2)}
          </span>
        );
      }
    },
    {
      key: "winRate",
      title: "胜率",
      width: 80,
      align: "center" as const,
      render: (value: unknown) => (
        <span className="font-medium">{Number(value).toFixed(1)}%</span>
      )
    },
    {
      key: "riskLevel",
      title: "风险等级",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const level = String(value);
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary";
        if (level === "低") variant = "success";
        if (level === "中等") variant = "warning";
        if (level === "高") variant = "danger";
        return <MdBadge variant={variant}>{level}</MdBadge>;
      }
    },
    {
      key: "status",
      title: "状态",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const status = String(value);
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary";
        if (status === "已完成") variant = "success";
        if (status === "进行中") variant = "info";
        if (status === "已停止") variant = "warning";
        if (status === "失败") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      }
    },
    {
      key: "createTime",
      title: "创建时间",
      width: 160,
      align: "center" as const,
    },
    {
      key: "actions",
      title: "操作",
      width: 120,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center justify-center gap-2">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDetail(row)}
          >
            详情
          </MdButton>
        </div>
      ),
    },
  ];

  // 操作处理函数
  const handleDetail = (row: Record<string, unknown>) => {
    const item = row as unknown as BenefitEvaluationItem;
    setCurrentItem(item);
    setDetailDrawerOpen(true);
  };
  
  // 关闭抽屉函数
  const closeDetailDrawer = () => {
    setDetailDrawerOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-4 gap-3">
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索策略名称或回测名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable
          columns={columns}
          data={tableData as any}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => loadData(page, size),
          }}
          className="h-full"
        />
      </div>
      
      {/* 抽屉组件 - 详情 */}
      {detailDrawerOpen && currentItem && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={closeDetailDrawer} />
          <div className="relative ml-auto h-full w-[600px] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">
                回测详情
              </div>
              <MdButton variant="text" size="sm" onClick={closeDetailDrawer}>
                <X className="h-4 w-4" />
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <MdCard className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">策略名称</h4>
                      <p>{currentItem.strategyName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">回测名称</h4>
                      <p>{currentItem.backtestName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">开始时间</h4>
                      <p>{currentItem.startTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">结束时间</h4>
                      <p>{currentItem.endTime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">总收益率</h4>
                      <p className={`${currentItem.totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {currentItem.totalReturn >= 0 ? '+' : ''}{currentItem.totalReturn.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">年化收益率</h4>
                      <p className={`${currentItem.annualizedReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {currentItem.annualizedReturn >= 0 ? '+' : ''}{currentItem.annualizedReturn.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">波动率</h4>
                      <p>{currentItem.volatility.toFixed(2)}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">最大回撤</h4>
                      <p className={`${currentItem.maxDrawdown < 0 ? 'text-destructive' : 'text-success'}`}>
                        {currentItem.maxDrawdown.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">夏普比率</h4>
                      <p>{currentItem.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">胜率</h4>
                      <p>{currentItem.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">盈利因子</h4>
                      <p>{currentItem.profitFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">风险等级</h4>
                      <p>{currentItem.riskLevel}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">状态</h4>
                      <p>{currentItem.status}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">创建时间</h4>
                      <p>{currentItem.createTime}</p>
                    </div>
                  </div>
                </MdCard>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <MdButton variant="outline" onClick={closeDetailDrawer}>关闭</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}