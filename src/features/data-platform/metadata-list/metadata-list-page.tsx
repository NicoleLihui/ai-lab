'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  RefreshCw, 
  FileText, 
  Settings, 
  Database, 
  Link, 
  GitBranch 
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdDrawer, Column } from '@/components/enterprise-ui';
import { AdvancedSearch } from '@/components/enterprise-ui/advanced-search';
import { CardInfo } from '@/components/enterprise-ui/card-info';
import { LineageGraphComponent } from '@/features/data-platform/metadata-lineage-graph';

interface MetadataItem {
  id: string;
  tableName: string;
  displayName: string;
  description: string;
  dataSource: string;
  syncStatus: '已同步' | '同步中' | '未同步';
  lastSyncTime: string;
  owner: string;
  creator: string;
  createTime: string;
  updateTime: string;
  lineageStatus: '已解析' | '解析中' | '未解析';
  upstreamCount: number;
  downstreamCount: number;
  [key: string]: unknown;
}

export function MetadataListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<MetadataItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showLineageGraph, setShowLineageGraph] = useState(false);
  const [selectedTable, setSelectedTable] = useState<MetadataItem | null>(null);

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery) => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 模拟数据
        const mockData: MetadataItem[] = [
          {
            id: '1',
            tableName: 'customer_info',
            displayName: '客户信息表',
            description: '存储客户基本信息',
            dataSource: 'MySQL-PROD',
            syncStatus: '已同步',
            lastSyncTime: '2024-01-20 10:30:00',
            owner: '数据分析部',
            creator: '张三',
            createTime: '2023-12-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
            lineageStatus: '已解析',
            upstreamCount: 3,
            downstreamCount: 5,
          },
          {
            id: '2',
            tableName: 'order_details',
            displayName: '订单详情表',
            description: '存储订单详细信息',
            dataSource: 'PostgreSQL-PROD',
            syncStatus: '同步中',
            lastSyncTime: '2024-01-21 15:45:00',
            owner: '电商运营部',
            creator: '李四',
            createTime: '2023-11-10 09:15:00',
            updateTime: '2024-01-21 15:45:00',
            lineageStatus: '解析中',
            upstreamCount: 2,
            downstreamCount: 7,
          },
          {
            id: '3',
            tableName: 'product_catalog',
            displayName: '产品目录表',
            description: '存储产品分类及信息',
            dataSource: 'MongoDB-PROD',
            syncStatus: '未同步',
            lastSyncTime: '-',
            owner: '商品管理部',
            creator: '王五',
            createTime: '2023-10-05 11:30:00',
            updateTime: '2023-10-05 11:30:00',
            lineageStatus: '未解析',
            upstreamCount: 0,
            downstreamCount: 3,
          },
          {
            id: '4',
            tableName: 'user_behavior_log',
            displayName: '用户行为日志表',
            description: '记录用户在平台的行为轨迹',
            dataSource: 'ClickHouse-PROD',
            syncStatus: '已同步',
            lastSyncTime: '2024-01-21 22:10:00',
            owner: '数据工程部',
            creator: '赵六',
            createTime: '2023-09-18 16:45:00',
            updateTime: '2024-01-21 22:10:00',
            lineageStatus: '已解析',
            upstreamCount: 5,
            downstreamCount: 8,
          },
          {
            id: '5',
            tableName: 'payment_records',
            displayName: '支付记录表',
            description: '存储用户支付相关信息',
            dataSource: 'Oracle-PROD',
            syncStatus: '已同步',
            lastSyncTime: '2024-01-20 08:15:00',
            owner: '财务部',
            creator: '孙七',
            createTime: '2023-08-22 13:20:00',
            updateTime: '2024-01-20 08:15:00',
            lineageStatus: '已解析',
            upstreamCount: 4,
            downstreamCount: 6,
          },
        ];

        const filteredData = query 
          ? mockData.filter(item => 
              item.tableName.toLowerCase().includes(query.toLowerCase()) || 
              item.displayName.toLowerCase().includes(query.toLowerCase())
            )
          : mockData;

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
    },
    [currentPage, pageSize, searchQuery]
  );

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

  // 自动同步数据
  const handleAutoSync = (row: MetadataItem) => {
    toast.info(`正在同步表: ${row.tableName}`);
    // 模拟同步操作
    setTimeout(() => {
      toast.success(`表 ${row.tableName} 同步完成`);
      loadData(); // 刷新数据
    }, 1500);
  };

  // 血缘解析
  const handleLineageAnalysis = (row: MetadataItem) => {
    toast.info(`正在解析表: ${row.tableName} 的血缘关系`);
    // 模拟血缘解析操作
    setTimeout(() => {
      toast.success(`表 ${row.tableName} 血缘解析完成`);
      loadData(); // 刷新数据
    }, 2000);
  };
  
  // 查看血缘图
  const handleViewLineageGraph = (row: MetadataItem) => {
    setSelectedTable(row);
    setShowLineageGraph(true);
  };

  // 查看详情
  const handleViewDetail = (row: MetadataItem) => {
    router.push(`/categories/data-platform/metadata/metadata-detail?id=${row.id}`);
  };

  // 批量同步
  const handleBatchSync = () => {
    toast.info("正在批量同步选中的表...");
    setTimeout(() => {
      toast.success("批量同步完成");
      loadData(); // 刷新数据
    }, 2000);
  };

  // 批量血缘解析
  const handleBatchLineage = () => {
    toast.info("正在批量解析血缘关系...");
    setTimeout(() => {
      toast.success("批量血缘解析完成");
      loadData(); // 刷新数据
    }, 2500);
  };

  // 定义表格列
  const columns: Column<MetadataItem>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "tableName",
      title: "表名",
      align: "center" as const,
      width: 150,
      render: (value: unknown, row: MetadataItem) => {
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{String(value || "")}</span>
            <span className="text-xs text-muted-foreground">{row.displayName}</span>
          </div>
        );
      },
    },
    {
      key: "description",
      title: "描述",
      align: "center" as const,
      width: 200,
    },
    {
      key: "dataSource",
      title: "数据源",
      align: "center" as const,
      width: 120,
      render: (value: unknown) => (
        <div className="flex items-center justify-center gap-1">
          <Database className="h-3 w-3" />
          <span>{String(value || "")}</span>
        </div>
      ),
    },
    {
      key: "syncStatus",
      title: "同步状态",
      align: "center" as const,
      width: 100,
      render: (value: unknown) => {
        const status = String(value ?? "");
        let variant: 'secondary' | 'success' | 'warning' | 'primary' | 'danger' | 'info' | 'outline' = "secondary";
        if (status === "已同步") variant = "success";
        if (status === "同步中") variant = "warning";
        if (status === "未同步") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "lastSyncTime",
      title: "最后同步时间",
      align: "center" as const,
      width: 150,
    },
    {
      key: "lineageStatus",
      title: "血缘状态",
      align: "center" as const,
      width: 100,
      render: (value: unknown) => {
        const status = String(value ?? "");
        let variant: 'secondary' | 'success' | 'warning' | 'primary' | 'danger' | 'info' | 'outline' = "secondary";
        if (status === "已解析") variant = "success";
        if (status === "解析中") variant = "warning";
        if (status === "未解析") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "upstreamCount",
      title: "上游数量",
      align: "center" as const,
      width: 100,
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <GitBranch className="h-4 w-4 mr-1 rotate-90" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: "downstreamCount",
      title: "下游数量",
      align: "center" as const,
      width: 100,
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <GitBranch className="h-4 w-4 mr-1 -rotate-90" />
          <span>{String(value)}</span>
        </div>
      ),
    },
    {
      key: "owner",
      title: "负责人",
      align: "center" as const,
      width: 120,
    },
    {
      key: "creator",
      title: "创建人",
      align: "center" as const,
      width: 100,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center" as const,
      width: 150,
    },
    {
      key: "updateTime",
      title: "更新时间",
      align: "center" as const,
      width: 150,
    },
    {
      key: "actions",
      title: "操作",
      width: 220,
      align: "center" as const,
      render: (_: unknown, row: MetadataItem) => {
        return (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetail(row)}
              leftIcon={<FileText className="h-3 w-3" />}
            >
              详情
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleAutoSync(row)}
              leftIcon={<RefreshCw className="h-3 w-3" />}
              disabled={row.syncStatus === '同步中'}
            >
              同步
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleViewLineageGraph(row)}
              leftIcon={<GitBranch className="h-3 w-3" />}
            >
              血缘图谱
            </MdButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 统计信息：页面最上方 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardInfo 
          data={{
            name: "总表数",
            description: "数据表总数",
            version: "1,248",
            statusName: "+12%"
          }}
        />
        <CardInfo 
          data={{
            name: "已同步",
            description: "已完成同步的表",
            version: "1,102",
            statusName: "+8%"
          }}
        />
        <CardInfo 
          data={{
            name: "已解析血缘",
            description: "已完成血缘解析",
            version: "876",
            statusName: "+15%"
          }}
        />
        <CardInfo 
          data={{
            name: "待同步",
            description: "等待同步的表",
            version: "146",
            statusName: "-3%"
          }}
        />
      </div>

      {/* 查询区域 */}
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索表名或描述"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            clearable
            onClear={() => {
              setSearchQuery("");
              loadData(1, pagination.pageSize, "");
            }}
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

      {/* 批量操作：列表上方、查询项下方 */}
      <div className="flex items-center gap-2">
        <MdButton 
          onClick={handleBatchSync} 
          leftIcon={<RefreshCw className="h-4 w-4" />} 
          className="h-9 px-3"
        >
          批量同步
        </MdButton>
        <MdButton 
          onClick={handleBatchLineage} 
          leftIcon={<Link className="h-4 w-4" />} 
          className="h-9 px-3"
        >
          批量血缘
        </MdButton>
      </div>

      {/* 数据表格 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable<MetadataItem>
          columns={columns}
          data={tableData}
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
      
      {/* 血缘图抽屉 */}
      {selectedTable && (
        <LineageGraphComponent
          isOpen={showLineageGraph}
          onClose={() => setShowLineageGraph(false)}
          targetTable={selectedTable}
          lineageData={{
            upstream: [
              {
                id: 'up1',
                tableName: 'user_register_log',
                displayName: '用户注册日志',
                dataSource: 'MySQL-DEV',
                type: 'upstream' as const,
              },
              {
                id: 'up2',
                tableName: 'customer_profile',
                displayName: '客户档案表',
                dataSource: 'PostgreSQL-PROD',
                type: 'upstream' as const,
              },
            ],
            downstream: [
              {
                id: 'down1',
                tableName: 'sales_report',
                displayName: '销售报表',
                dataSource: 'ClickHouse-PROD',
                type: 'downstream' as const,
              },
              {
                id: 'down2',
                tableName: 'customer_analysis',
                displayName: '客户分析表',
                dataSource: 'Hive-PROD',
                type: 'downstream' as const,
              },
              {
                id: 'down3',
                tableName: 'customer_segmentation',
                displayName: '客户分群表',
                dataSource: 'Spark-PROD',
                type: 'downstream' as const,
              },
            ],
          }}
        />
      )}
    </div>
  );
}