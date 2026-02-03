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
  Tag,
  BarChart3,
  FileText,
  Shield,
  History,
  Filter,
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdSelect, MdCard } from '@/components/enterprise-ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Column } from '@/components/enterprise-ui';
import { DataClassification, FieldClassification, ClassificationStatistics } from './types';
import { DataClassificationDrawer } from './data-classification-drawer';
import { FieldClassificationModal } from './field-classification-modal';
import { ClassificationStatisticsPanel } from './classification-statistics-panel';
import { ClassificationAuditLogPanel } from './classification-audit-log-panel';

export function DataClassificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'list' | 'statistics' | 'audit'>('list');
  
  // 列表相关状态
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    businessObject: '',
    dataType: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<DataClassification[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 抽屉相关状态
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingClassification, setEditingClassification] = useState<DataClassification | null>(null);

  // 字段分类模态框
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<DataClassification | null>(null);

  // 统计信息
  const [statistics, setStatistics] = useState<ClassificationStatistics | null>(null);

  // 业务对象选项
  const businessObjectOptions = [
    { value: '水量', label: '水量' },
    { value: '水质', label: '水质' },
    { value: '设备', label: '设备' },
    { value: '设施', label: '设施' },
    { value: '工单', label: '工单' },
    { value: '化验', label: '化验' },
    { value: '经营', label: '经营' },
  ];

  // 数据类型选项
  const dataTypeOptions = [
    { value: '基础信息', label: '基础信息' },
    { value: '化验工单', label: '化验工单' },
    { value: '运行数据', label: '运行数据' },
    { value: '维护记录', label: '维护记录' },
    { value: '财务数据', label: '财务数据' },
    { value: '统计数据', label: '统计数据' },
  ];

  // 状态选项
  const statusOptions = [
    { value: '启用', label: '启用' },
    { value: '禁用', label: '禁用' },
  ];

  // 加载数据
  const loadData = useCallback(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: DataClassification[] = [
        {
          id: '1',
          classificationCode: 'BASIC_INFO',
          classificationName: '基础信息',
          businessObject: '水量',
          dataType: '基础信息',
          description: '水厂基础信息数据分类',
          status: '启用',
          fieldCount: 25,
          creator: '张三',
          createTime: '2024-01-15 14:20:00',
          updateTime: '2024-01-20 10:30:00',
        },
        {
          id: '2',
          classificationCode: 'LAB_WORK_ORDER',
          classificationName: '化验工单',
          businessObject: '化验',
          dataType: '化验工单',
          description: '化验工单数据分类',
          status: '启用',
          fieldCount: 18,
          creator: '李四',
          createTime: '2024-01-16 09:15:00',
          updateTime: '2024-01-18 16:45:00',
        },
        {
          id: '3',
          classificationCode: 'RUNNING_DATA',
          classificationName: '运行数据',
          businessObject: '设备',
          dataType: '运行数据',
          description: '设备运行数据分类',
          status: '启用',
          fieldCount: 32,
          creator: '王五',
          createTime: '2024-01-17 11:30:00',
          updateTime: '2024-01-19 14:20:00',
        },
      ];

      // 应用搜索和筛选
      let filteredData = mockData;
      
      if (searchQuery) {
        filteredData = filteredData.filter(item => 
          item.classificationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.classificationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filters.businessObject) {
        filteredData = filteredData.filter(item => item.businessObject === filters.businessObject);
      }

      if (filters.dataType) {
        filteredData = filteredData.filter(item => item.dataType === filters.dataType);
      }

      if (filters.status) {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }

      setTableData(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
      setLoading(false);
    }, 500);
  }, [searchQuery, filters]);

  // 加载统计信息
  const loadStatistics = useCallback(() => {
    // 模拟API调用
    setTimeout(() => {
      const mockStats: ClassificationStatistics = {
        totalCount: 15,
        enabledCount: 12,
        disabledCount: 3,
        fieldCount: 256,
        businessObjectCount: 7,
        byDataType: {
          '基础信息': 3,
          '化验工单': 2,
          '运行数据': 4,
          '维护记录': 3,
          '财务数据': 2,
          '统计数据': 1,
        },
        byBusinessObject: {
          '水量': 3,
          '水质': 2,
          '设备': 4,
          '设施': 2,
          '工单': 2,
          '化验': 1,
          '经营': 1,
        },
      };
      setStatistics(mockStats);
    }, 300);
  }, []);

  useEffect(() => {
    if (activeTab === 'list') {
      loadData();
    } else if (activeTab === 'statistics') {
      loadStatistics();
    }
  }, [activeTab, loadData, loadStatistics]);

  // 搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  // 重置
  const handleReset = () => {
    setSearchQuery("");
    setFilters({
      businessObject: '',
      dataType: '',
      status: '',
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 新增
  const handleAdd = () => {
    setEditingClassification(null);
    setShowDrawer(true);
  };

  // 编辑
  const handleEdit = (record: DataClassification) => {
    setEditingClassification(record);
    setShowDrawer(true);
  };

  // 删除
  const handleDelete = (record: DataClassification) => {
    if (confirm(`确定要删除数据分类"${record.classificationName}"吗？`)) {
      // 模拟API调用
      toast.success('删除成功');
      loadData();
    }
  };

  // 字段分类
  const handleFieldClassification = (record: DataClassification) => {
    setSelectedClassification(record);
    setShowFieldModal(true);
  };

  // 查看详情
  const handleViewDetail = (record: DataClassification) => {
    router.push(`/categories/data-platform/data-catalog/classification-detail?id=${record.id}`);
  };

  // 提交表单
  const handleSubmit = () => {
    setShowDrawer(false);
    toast.success(editingClassification ? '更新成功' : '创建成功');
    loadData();
  };

  // 表格列定义
  const columns: Column<DataClassification>[] = [
    {
      key: 'index',
      title: '序号',
      width: 80,
      align: 'center',
      render: (_: unknown, __: unknown, index: number) => 
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: 'classificationCode',
      title: '分类编码',
      align: 'center',
      width: 150,
    },
    {
      key: 'classificationName',
      title: '分类名称',
      align: 'center',
      width: 150,
    },
    {
      key: 'businessObject',
      title: '业务对象',
      align: 'center',
      width: 120,
      render: (value: unknown) => (
        <MdBadge variant="info">{String(value)}</MdBadge>
      ),
    },
    {
      key: 'dataType',
      title: '数据类型',
      align: 'center',
      width: 120,
      render: (value: unknown) => (
        <MdBadge variant="outline">{String(value)}</MdBadge>
      ),
    },
    {
      key: 'fieldCount',
      title: '关联字段数',
      align: 'center',
      width: 120,
      render: (value: unknown) => (
        <span className="font-medium">{Number(value) ?? 0}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: (value: unknown) => (
        <MdBadge variant={value === '启用' ? 'success' : 'secondary'}>
          {String(value)}
        </MdBadge>
      ),
    },
    {
      key: 'description',
      title: '描述',
      align: 'left',
      ellipsis: true,
    },
    {
      key: 'creator',
      title: '创建人',
      align: 'center',
      width: 100,
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      width: 180,
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 280,
      fixed: 'right',
      render: (_: unknown, record: DataClassification) => (
        <div className="flex items-center justify-center gap-2">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetail(record)}
            leftIcon={<Eye className="h-4 w-4" />}
          >
            详情
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleFieldClassification(record)}
            leftIcon={<Tag className="h-4 w-4" />}
          >
            字段分类
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(record)}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record)}
            leftIcon={<Trash2 className="h-4 w-4" />}
            className="text-destructive hover:text-destructive"
          >
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-6">
      {/* 顶部标题和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">数据分类管理</h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton
            variant="outline"
            onClick={() => setActiveTab('statistics')}
            leftIcon={<BarChart3 className="h-4 w-4" />}
          >
            统计分析
          </MdButton>
          <MdButton
            variant="outline"
            onClick={() => setActiveTab('audit')}
            leftIcon={<History className="h-4 w-4" />}
          >
            审计日志
          </MdButton>
          <MdButton
            onClick={handleAdd}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            新增分类
          </MdButton>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="list">分类列表</TabsTrigger>
          <TabsTrigger value="statistics">统计分析</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
        </TabsList>

        {/* 分类列表 */}
        <TabsContent value="list" className="mt-4">
          <MdCard className="p-4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex-1 min-w-[300px]">
                <MdInput
                  placeholder="搜索分类名称、编码或描述"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <MdSelect
                placeholder="业务对象"
                value={filters.businessObject}
                onChange={(value) => setFilters(prev => ({ ...prev, businessObject: value }))}
                options={businessObjectOptions}
                className="w-[150px]"
              />
              <MdSelect
                placeholder="数据类型"
                value={filters.dataType}
                onChange={(value) => setFilters(prev => ({ ...prev, dataType: value }))}
                options={dataTypeOptions}
                className="w-[150px]"
              />
              <MdSelect
                placeholder="状态"
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                options={statusOptions}
                className="w-[120px]"
              />
              <MdButton
                variant="outline"
                onClick={handleSearch}
                leftIcon={<Search className="h-4 w-4" />}
              >
                搜索
              </MdButton>
              <MdButton
                variant="outline"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                重置
              </MdButton>
            </div>

            {/* 表格 */}
            <MdTable<DataClassification>
              columns={columns}
              data={tableData}
              loading={loading}
              pagination={{
                ...pagination,
                onChange: (page, pageSize) =>
                  setPagination((prev) => ({ ...prev, current: page, pageSize })),
              }}
              rowKey="id"
            />
          </MdCard>
        </TabsContent>

        {/* 统计分析 */}
        <TabsContent value="statistics" className="mt-4">
          <ClassificationStatisticsPanel statistics={statistics} />
        </TabsContent>

        {/* 审计日志 */}
        <TabsContent value="audit" className="mt-4">
          <ClassificationAuditLogPanel />
        </TabsContent>
      </Tabs>

      {/* 编辑抽屉 */}
      <DataClassificationDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSubmit={handleSubmit}
        editingClassification={editingClassification}
        businessObjectOptions={businessObjectOptions}
        dataTypeOptions={dataTypeOptions}
      />

      {/* 字段分类模态框 */}
      {selectedClassification && (
        <FieldClassificationModal
          open={showFieldModal}
          onClose={() => {
            setShowFieldModal(false);
            setSelectedClassification(null);
          }}
          classification={selectedClassification}
          onSuccess={() => {
            setShowFieldModal(false);
            setSelectedClassification(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
