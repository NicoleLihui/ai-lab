'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Edit, 
  Trash2, 
  Eye,
  Table2,
  FileText,
  Database,
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdSelect } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LogicalDataModel, ModelType } from './types';
import { LogicalDataModelDrawer } from './logical-data-model-drawer';

export function LogicalDataModelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ModelType>('dimension');
  
  // 维度表相关状态
  const [dimensionSearchQuery, setDimensionSearchQuery] = useState("");
  const [dimensionFilters, setDimensionFilters] = useState({
    businessDomain: '',
    dataSource: '',
    lifecycleStatus: '',
    accessPermissions: '',
  });
  const [dimensionLoading, setDimensionLoading] = useState(false);
  const [dimensionTableData, setDimensionTableData] = useState<LogicalDataModel[]>([]);
  const [dimensionPagination, setDimensionPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 明细表相关状态
  const [detailSearchQuery, setDetailSearchQuery] = useState("");
  const [detailFilters, setDetailFilters] = useState({
    businessDomain: '',
    dataSource: '',
    lifecycleStatus: '',
    accessPermissions: '',
  });
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTableData, setDetailTableData] = useState<LogicalDataModel[]>([]);
  const [detailPagination, setDetailPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 抽屉相关状态
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingModel, setEditingModel] = useState<LogicalDataModel | null>(null);

  // 业务域选项
  const businessDomainOptions = [
    { value: '水量', label: '水量' },
    { value: '电量', label: '电量' },
    { value: '污泥', label: '污泥' },
    { value: '药剂', label: '药剂' },
    { value: '水质', label: '水质' },
    { value: '设备', label: '设备' },
    { value: '设施', label: '设施' },
    { value: '工单', label: '工单' },
    { value: '经营', label: '经营' },
  ];

  // 数据来源选项
  const dataSourceOptions = [
    { value: '数采', label: '数采' },
    { value: '基础数据', label: '基础数据' },
    { value: '工单数据', label: '工单数据' },
    { value: '台账数据', label: '台账数据' },
    { value: '填报数据', label: '填报数据' },
  ];

  // 状态选项
  const lifecycleStatusOptions = [
    { value: '已上线', label: '已上线' },
    { value: '测试中', label: '测试中' },
    { value: '设计', label: '设计' },
    { value: '归档', label: '归档' },
    { value: '失效', label: '失效' },
  ];

  // 访问权限选项
  const accessPermissionsOptions = [
    { value: '受权限控制', label: '受权限控制' },
    { value: '公开访问', label: '公开访问' },
  ];

  // 加载维度表数据
  const loadDimensionData = useCallback(
    async (page = dimensionPagination.current, size = dimensionPagination.pageSize, query = dimensionSearchQuery, filters = dimensionFilters) => {
      setDimensionLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockData: LogicalDataModel[] = [
          {
            id: '1',
            entity: '水厂维度表',
            entityCode: 'DIM_PLANT',
            fieldCount: 45,
            businessDomain: '设施',
            dataSource: '基础数据',
            businessEntity: '水厂',
            versionInfo: 'v1.0',
            businessDefinition: '整合水厂所有基础信息的大宽表，包含水厂基本信息、设施信息、设备信息等',
            businessRules: '数据来源于基础数据系统，每日更新',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'dimension',
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            entity: '设施维度表',
            entityCode: 'DIM_FACILITY',
            fieldCount: 38,
            businessDomain: '设施',
            dataSource: '基础数据',
            businessEntity: '设施',
            versionInfo: 'v1.0',
            businessDefinition: '整合设施所有信息的大宽表',
            businessRules: '数据来源于基础数据系统',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'dimension',
            creator: '李四',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            entity: '设备维度表',
            entityCode: 'DIM_EQUIPMENT',
            fieldCount: 52,
            businessDomain: '设备',
            dataSource: '基础数据',
            businessEntity: '设备',
            versionInfo: 'v1.1',
            businessDefinition: '整合设备所有信息的大宽表',
            businessRules: '数据来源于基础数据系统，实时更新',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '测试中',
            accessPermissions: '受权限控制',
            modelType: 'dimension',
            creator: '王五',
            createTime: '2024-01-05 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
        ];

        let filteredData = mockData;
        
        // 关键词搜索
        if (query) {
          filteredData = filteredData.filter(item => 
            item.entity.toLowerCase().includes(query.toLowerCase()) || 
            item.entityCode.toLowerCase().includes(query.toLowerCase())
          );
        }

        // 筛选条件
        if (filters.businessDomain) {
          filteredData = filteredData.filter(item => item.businessDomain === filters.businessDomain);
        }
        if (filters.dataSource) {
          filteredData = filteredData.filter(item => item.dataSource === filters.dataSource);
        }
        if (filters.lifecycleStatus) {
          filteredData = filteredData.filter(item => item.lifecycleStatus === filters.lifecycleStatus);
        }
        if (filters.accessPermissions) {
          filteredData = filteredData.filter(item => item.accessPermissions === filters.accessPermissions);
        }

        const total = filteredData.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setDimensionTableData(paginatedData);
        setDimensionPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: total,
        }));
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setDimensionLoading(false);
      }
    },
    [dimensionPagination.current, dimensionPagination.pageSize, dimensionSearchQuery, dimensionFilters]
  );

  // 加载明细表数据
  const loadDetailData = useCallback(
    async (page = detailPagination.current, size = detailPagination.pageSize, query = detailSearchQuery, filters = detailFilters) => {
      setDetailLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockData: LogicalDataModel[] = [
          {
            id: '4',
            entity: '工单明细表',
            entityCode: 'DETAIL_WORK_ORDER',
            fieldCount: 28,
            businessDomain: '工单',
            dataSource: '工单数据',
            businessEntity: '工单',
            versionInfo: 'v1.0',
            businessDefinition: '工单过程数据明细表，包含工单创建、处理、完成等全流程信息',
            businessRules: '数据来源于工单系统，实时同步',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'detail',
            creator: '赵六',
            createTime: '2024-01-12 10:20:00',
            updateTime: '2024-01-19 14:30:00',
          },
          {
            id: '5',
            entity: '填报明细表',
            entityCode: 'DETAIL_REPORT',
            fieldCount: 35,
            businessDomain: '经营',
            dataSource: '填报数据',
            businessEntity: '填报',
            versionInfo: 'v1.0',
            businessDefinition: '填报过程数据明细表，包含各类业务填报信息',
            businessRules: '数据来源于填报系统，每日更新',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'detail',
            creator: '孙七',
            createTime: '2024-01-08 09:15:00',
            updateTime: '2024-01-16 11:45:00',
          },
          {
            id: '6',
            entity: '数采明细表',
            entityCode: 'DETAIL_DATA_COLLECTION',
            fieldCount: 42,
            businessDomain: '水量',
            dataSource: '数采',
            businessEntity: '数采',
            versionInfo: 'v1.1',
            businessDefinition: '数采过程数据明细表，包含各类传感器采集的数据',
            businessRules: '数据来源于数采系统，实时采集',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '测试中',
            accessPermissions: '受权限控制',
            modelType: 'detail',
            creator: '周八',
            createTime: '2024-01-03 13:20:00',
            updateTime: '2024-01-14 16:10:00',
          },
        ];

        let filteredData = mockData;
        
        // 关键词搜索
        if (query) {
          filteredData = filteredData.filter(item => 
            item.entity.toLowerCase().includes(query.toLowerCase()) || 
            item.entityCode.toLowerCase().includes(query.toLowerCase())
          );
        }

        // 筛选条件
        if (filters.businessDomain) {
          filteredData = filteredData.filter(item => item.businessDomain === filters.businessDomain);
        }
        if (filters.dataSource) {
          filteredData = filteredData.filter(item => item.dataSource === filters.dataSource);
        }
        if (filters.lifecycleStatus) {
          filteredData = filteredData.filter(item => item.lifecycleStatus === filters.lifecycleStatus);
        }
        if (filters.accessPermissions) {
          filteredData = filteredData.filter(item => item.accessPermissions === filters.accessPermissions);
        }

        const total = filteredData.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setDetailTableData(paginatedData);
        setDetailPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: total,
        }));
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setDetailLoading(false);
      }
    },
    [detailPagination.current, detailPagination.pageSize, detailSearchQuery, detailFilters]
  );

  useEffect(() => {
    if (activeTab === 'dimension') {
      loadDimensionData(1);
    } else {
      loadDetailData(1);
    }
  }, [activeTab]);

  // 维度表操作
  const handleDimensionSearch = () => {
    loadDimensionData(1);
  };

  const handleDimensionReset = () => {
    setDimensionSearchQuery("");
    setDimensionFilters({
      businessDomain: '',
      dataSource: '',
      lifecycleStatus: '',
      accessPermissions: '',
    });
    loadDimensionData(1, dimensionPagination.pageSize, "", {
      businessDomain: '',
      dataSource: '',
      lifecycleStatus: '',
      accessPermissions: '',
    });
  };

  const handleDimensionCreate = () => {
    setEditingModel(null);
    setShowDrawer(true);
  };

  const handleDimensionEdit = (row: LogicalDataModel) => {
    setEditingModel(row);
    setShowDrawer(true);
  };

  const handleDimensionDelete = (row: LogicalDataModel) => {
    if (confirm(`确定删除逻辑数据模型 "${row.entity}"?`)) {
      toast.success(`逻辑数据模型 "${row.entity}" 删除成功`);
      loadDimensionData();
    }
  };

  const handleDimensionDetail = (row: LogicalDataModel) => {
    router.push(`/categories/data-platform/data-catalog/logical-model-detail?id=${row.id}`);
  };

  // 明细表操作
  const handleDetailSearch = () => {
    loadDetailData(1);
  };

  const handleDetailReset = () => {
    setDetailSearchQuery("");
    setDetailFilters({
      businessDomain: '',
      dataSource: '',
      lifecycleStatus: '',
      accessPermissions: '',
    });
    loadDetailData(1, detailPagination.pageSize, "", {
      businessDomain: '',
      dataSource: '',
      lifecycleStatus: '',
      accessPermissions: '',
    });
  };

  const handleDetailCreate = () => {
    setEditingModel(null);
    setShowDrawer(true);
  };

  const handleDetailEdit = (row: LogicalDataModel) => {
    setEditingModel(row);
    setShowDrawer(true);
  };

  const handleDetailDelete = (row: LogicalDataModel) => {
    if (confirm(`确定删除逻辑数据模型 "${row.entity}"?`)) {
      toast.success(`逻辑数据模型 "${row.entity}" 删除成功`);
      loadDetailData();
    }
  };

  const handleDetailDetail = (row: LogicalDataModel) => {
    router.push(`/categories/data-platform/data-catalog/logical-model-detail?id=${row.id}`);
  };

  const handleDrawerSubmit = () => {
    setShowDrawer(false);
    if (activeTab === 'dimension') {
      loadDimensionData();
    } else {
      loadDetailData();
    }
  };

  // 表格列定义
  const getTableColumns = (modelType: ModelType): Column<LogicalDataModel>[] => [
    {
      key: "index",
      title: "序号",
      width: 80,
      align: "center",
      render: (_: unknown, __: unknown, index: number) => {
        const pagination = modelType === 'dimension' ? dimensionPagination : detailPagination;
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      key: "entity",
      title: "实体/表名",
      align: "center",
      width: 180,
    },
    {
      key: "entityCode",
      title: "实体编码",
      align: "center",
      width: 150,
    },
    {
      key: "fieldCount",
      title: "字段数量",
      align: "center",
      width: 100,
      render: (value: unknown) => (
        <MdBadge variant="info">{String(value || 0)}</MdBadge>
      ),
    },
    {
      key: "businessDomain",
      title: "业务域",
      align: "center",
      width: 120,
    },
    {
      key: "dataSource",
      title: "数据来源",
      align: "center",
      width: 120,
    },
    {
      key: "businessEntity",
      title: "业务实体",
      align: "center",
      width: 120,
    },
    {
      key: "versionInfo",
      title: "版本信息",
      align: "center",
      width: 100,
      render: (value: unknown) => (
        <MdBadge variant="outline">{String(value || "")}</MdBadge>
      ),
    },
    {
      key: "lifecycleStatus",
      title: "状态",
      align: "center",
      width: 100,
      render: (value: unknown) => {
        const status = String(value ?? "");
        let variant: 'secondary' | 'success' | 'warning' | 'primary' | 'danger' | 'info' | 'outline' = "secondary";
        if (status === "已上线") variant = "success";
        if (status === "测试中") variant = "warning";
        if (status === "设计") variant = "info";
        if (status === "归档") variant = "secondary";
        if (status === "失效") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "creator",
      title: "创建人",
      align: "center",
      width: 100,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center",
      width: 150,
    },
    {
      key: "actions",
      title: "操作",
      width: 200,
      align: "center",
      render: (_: unknown, row: LogicalDataModel) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => modelType === 'dimension' ? handleDimensionEdit(row) : handleDetailEdit(row)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => modelType === 'dimension' ? handleDimensionDetail(row) : handleDetailDetail(row)}
            leftIcon={<Eye className="h-3 w-3" />}
          >
            详情
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => modelType === 'dimension' ? handleDimensionDelete(row) : handleDetailDelete(row)}
            leftIcon={<Trash2 className="h-3 w-3" />}
          >
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  // 获取统计数据
  const getDimensionStats = () => {
    const total = dimensionPagination.total;
    const online = dimensionTableData.filter(item => item.lifecycleStatus === '已上线').length;
    const testing = dimensionTableData.filter(item => item.lifecycleStatus === '测试中').length;
    const designing = dimensionTableData.filter(item => item.lifecycleStatus === '设计').length;
    return { total, online, testing, designing };
  };

  const getDetailStats = () => {
    const total = detailPagination.total;
    const online = detailTableData.filter(item => item.lifecycleStatus === '已上线').length;
    const testing = detailTableData.filter(item => item.lifecycleStatus === '测试中').length;
    const designing = detailTableData.filter(item => item.lifecycleStatus === '设计').length;
    return { total, online, testing, designing };
  };

  const dimensionStats = getDimensionStats();
  const detailStats = getDetailStats();

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* Tab 切换 */}
      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-border shadow-sm">
        <MdButton
          variant={activeTab === 'dimension' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('dimension')}
          leftIcon={<Table2 className="h-4 w-4" />}
          className="h-9 px-4"
        >
          维度表
        </MdButton>
        <MdButton
          variant={activeTab === 'detail' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('detail')}
          leftIcon={<FileText className="h-4 w-4" />}
          className="h-9 px-4"
        >
          明细表
        </MdButton>
      </div>

      {/* 维度表管理 */}
      {activeTab === 'dimension' && (
        <>
          {/* 统计信息：页面最上方 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">维度表总数</p>
                  <p className="font-semibold text-lg">{dimensionStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已上线</p>
                  <p className="font-semibold text-lg">{dimensionStats.online}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Database className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">测试中</p>
                  <p className="font-semibold text-lg">{dimensionStats.testing}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">设计中</p>
                  <p className="font-semibold text-lg">{dimensionStats.designing}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 查询区域 */}
          <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2 w-80">
                <MdInput
                  placeholder="搜索实体/表名、实体编码"
                  value={dimensionSearchQuery}
                  onChange={(e) => setDimensionSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDimensionSearch()}
                  clearable
                  onClear={() => {
                    setDimensionSearchQuery("");
                    loadDimensionData(1, dimensionPagination.pageSize, "");
                  }}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="h-9"
                />
              </div>
              <MdButton
                onClick={handleDimensionSearch}
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9 px-3"
              >
                查询
              </MdButton>
              <MdButton
                variant="outline"
                onClick={handleDimensionReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="h-9 px-3"
              >
                重置
              </MdButton>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <MdSelect
                placeholder="业务域"
                value={dimensionFilters.businessDomain}
                onChange={(value) => {
                  const newFilters = {...dimensionFilters, businessDomain: value};
                  setDimensionFilters(newFilters);
                  loadDimensionData(1, dimensionPagination.pageSize, dimensionSearchQuery, newFilters);
                }}
                options={businessDomainOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="数据来源"
                value={dimensionFilters.dataSource}
                onChange={(value) => {
                  const newFilters = {...dimensionFilters, dataSource: value};
                  setDimensionFilters(newFilters);
                  loadDimensionData(1, dimensionPagination.pageSize, dimensionSearchQuery, newFilters);
                }}
                options={dataSourceOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="状态"
                value={dimensionFilters.lifecycleStatus}
                onChange={(value) => {
                  const newFilters = {...dimensionFilters, lifecycleStatus: value};
                  setDimensionFilters(newFilters);
                  loadDimensionData(1, dimensionPagination.pageSize, dimensionSearchQuery, newFilters);
                }}
                options={lifecycleStatusOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="访问权限"
                value={dimensionFilters.accessPermissions}
                onChange={(value) => {
                  const newFilters = {...dimensionFilters, accessPermissions: value};
                  setDimensionFilters(newFilters);
                  loadDimensionData(1, dimensionPagination.pageSize, dimensionSearchQuery, newFilters);
                }}
                options={accessPermissionsOptions}
                className="h-9"
              />
            </div>
          </div>

          {/* 批量操作 */}
          <div className="flex items-center gap-2">
            <MdButton 
              onClick={handleDimensionCreate} 
              leftIcon={<Plus className="h-4 w-4" />} 
              className="h-9 px-3"
            >
              新建维度表
            </MdButton>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <MdTable<LogicalDataModel>
              columns={getTableColumns('dimension')}
              data={dimensionTableData}
              loading={dimensionLoading}
              pagination={{
                current: dimensionPagination.current,
                pageSize: dimensionPagination.pageSize,
                total: dimensionPagination.total,
                onChange: (page, size) => loadDimensionData(page, size),
              }}
              className="h-full"
            />
          </div>
        </>
      )}

      {/* 明细表管理 */}
      {activeTab === 'detail' && (
        <>
          {/* 统计信息：页面最上方 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">明细表总数</p>
                  <p className="font-semibold text-lg">{detailStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已上线</p>
                  <p className="font-semibold text-lg">{detailStats.online}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">测试中</p>
                  <p className="font-semibold text-lg">{detailStats.testing}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">设计中</p>
                  <p className="font-semibold text-lg">{detailStats.designing}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 查询区域 */}
          <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2 w-80">
                <MdInput
                  placeholder="搜索实体/表名、实体编码"
                  value={detailSearchQuery}
                  onChange={(e) => setDetailSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDetailSearch()}
                  clearable
                  onClear={() => {
                    setDetailSearchQuery("");
                    loadDetailData(1, detailPagination.pageSize, "");
                  }}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="h-9"
                />
              </div>
              <MdButton
                onClick={handleDetailSearch}
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9 px-3"
              >
                查询
              </MdButton>
              <MdButton
                variant="outline"
                onClick={handleDetailReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                className="h-9 px-3"
              >
                重置
              </MdButton>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <MdSelect
                placeholder="业务域"
                value={detailFilters.businessDomain}
                onChange={(value) => {
                  const newFilters = {...detailFilters, businessDomain: value};
                  setDetailFilters(newFilters);
                  loadDetailData(1, detailPagination.pageSize, detailSearchQuery, newFilters);
                }}
                options={businessDomainOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="数据来源"
                value={detailFilters.dataSource}
                onChange={(value) => {
                  const newFilters = {...detailFilters, dataSource: value};
                  setDetailFilters(newFilters);
                  loadDetailData(1, detailPagination.pageSize, detailSearchQuery, newFilters);
                }}
                options={dataSourceOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="状态"
                value={detailFilters.lifecycleStatus}
                onChange={(value) => {
                  const newFilters = {...detailFilters, lifecycleStatus: value};
                  setDetailFilters(newFilters);
                  loadDetailData(1, detailPagination.pageSize, detailSearchQuery, newFilters);
                }}
                options={lifecycleStatusOptions}
                className="h-9"
              />
              <MdSelect
                placeholder="访问权限"
                value={detailFilters.accessPermissions}
                onChange={(value) => {
                  const newFilters = {...detailFilters, accessPermissions: value};
                  setDetailFilters(newFilters);
                  loadDetailData(1, detailPagination.pageSize, detailSearchQuery, newFilters);
                }}
                options={accessPermissionsOptions}
                className="h-9"
              />
            </div>
          </div>

          {/* 批量操作 */}
          <div className="flex items-center gap-2">
            <MdButton 
              onClick={handleDetailCreate} 
              leftIcon={<Plus className="h-4 w-4" />} 
              className="h-9 px-3"
            >
              新建明细表
            </MdButton>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <MdTable<LogicalDataModel>
              columns={getTableColumns('detail')}
              data={detailTableData}
              loading={detailLoading}
              pagination={{
                current: detailPagination.current,
                pageSize: detailPagination.pageSize,
                total: detailPagination.total,
                onChange: (page, size) => loadDetailData(page, size),
              }}
              className="h-full"
            />
          </div>
        </>
      )}

      {/* 创建/编辑抽屉 */}
      <LogicalDataModelDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSubmit={handleDrawerSubmit}
        editingModel={editingModel}
        modelType={activeTab}
        businessDomainOptions={businessDomainOptions}
        dataSourceOptions={dataSourceOptions}
        lifecycleStatusOptions={lifecycleStatusOptions}
        accessPermissionsOptions={accessPermissionsOptions}
      />
    </div>
  );
}
