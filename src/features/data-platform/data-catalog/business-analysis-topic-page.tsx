'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Edit, 
  Trash2, 
  Eye,
  FolderTree,
} from 'lucide-react';
import { 
  MdButton, 
  MdInput, 
  MdTable, 
  MdBadge, 
  MdDrawer, 
  MdSelect,
} from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';

// 业务分析主题数据类型
interface BusinessAnalysisTopic {
  id: string;
  categoryName: string;
  categoryCode: string;
  parentCategory: string;
  categoryDescription: string;
  businessOwner: string;
  dataOwner: string;
  relatedReports?: string;
  parentId?: string; // 用于支持子主题
  level: '主题' | '子主题'; // 主题层级
  children?: BusinessAnalysisTopic[]; // 子主题列表
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

// 所属分类选项
const categoryOptions = [
  { value: '水质分析', label: '水质分析' },
  { value: '水量分析', label: '水量分析' },
  { value: '水质监测', label: '水质监测' },
  { value: '水量监测', label: '水量监测' },
  { value: '一厂一策', label: '一厂一策' },
  { value: '水厂星级模型评价', label: '水厂星级模型评价' },
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

export default function BusinessAnalysisTopicPage() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<BusinessAnalysisTopic[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 搜索条件
  const [searchParams, setSearchParams] = useState({
    categoryName: '',
    parentCategory: '',
    businessOwner: '',
    dataOwner: '',
    relatedReports: '',
  });

  // 抽屉相关状态
  const [showDrawer, setShowDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingTopic, setEditingTopic] = useState<BusinessAnalysisTopic | null>(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryCode: '',
    parentCategory: '',
    categoryDescription: '',
    businessOwner: '',
    dataOwner: '',
    relatedReports: '',
    parentId: '', // 父主题ID，用于创建子主题
    level: '主题' as '主题' | '子主题',
  });

  // 表格列定义
  const columns: Column<BusinessAnalysisTopic>[] = [
    {
      key: 'categoryName',
      title: '主题名称',
      width: 200,
    },
    {
      key: 'parentCategory',
      title: '所属分类',
      width: 150,
    },
    {
      key: 'categoryCode',
      title: '主题编码',
      width: 150,
    },
    {
      key: 'level',
      title: '层级',
      width: 100,
      render: (value: unknown) => (
        <MdBadge variant={String(value) === '主题' ? 'primary' : 'secondary'}>
          {String(value)}
        </MdBadge>
      ),
    },
    {
      key: 'categoryDescription',
      title: '主题描述',
      width: 250,
    },
    {
      key: 'businessOwner',
      title: '业务负责人',
      width: 120,
    },
    {
      key: 'dataOwner',
      title: '数据负责人',
      width: 120,
    },
    {
      key: 'relatedReports',
      title: '关联报表',
      width: 150,
    },
    {
      key: 'actions',
      title: '操作',
      width: 200,
      render: (_: unknown, record: BusinessAnalysisTopic) => (
        <div className="flex gap-2">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetail(record)}
          >
            <Eye className="w-4 h-4 mr-1" />
            查看
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            <Edit className="w-4 h-4 mr-1" />
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  // 加载数据
  const loadData = useCallback(
    async (page = pagination.current, size = pagination.pageSize) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 模拟数据
        const mockData: BusinessAnalysisTopic[] = [
          {
            id: '1',
            categoryName: '水质分析',
            categoryCode: 'WATER_QUALITY_ANALYSIS',
            parentCategory: '水质',
            categoryDescription: '对水质数据进行多维度分析，包括pH值、COD、BOD等指标',
            businessOwner: '张三',
            dataOwner: '李四',
            relatedReports: '水质分析月报',
            level: '主题',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            categoryName: '水量分析',
            categoryCode: 'WATER_VOLUME_ANALYSIS',
            parentCategory: '水量',
            categoryDescription: '对水量数据进行统计分析，包括日处理量、月处理量等',
            businessOwner: '王五',
            dataOwner: '赵六',
            relatedReports: '水量分析月报',
            level: '主题',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            categoryName: '水质监测',
            categoryCode: 'WATER_QUALITY_MONITOR',
            parentCategory: '水质',
            categoryDescription: '实时监测水质指标，预警异常情况',
            businessOwner: '孙七',
            dataOwner: '周八',
            relatedReports: '水质监测日报',
            level: '主题',
            createTime: '2024-01-05 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
          {
            id: '4',
            categoryName: '工单月度绩效分析',
            categoryCode: 'ORDER_MONTHLY_PERFORMANCE',
            parentCategory: '工单',
            categoryDescription: '从工单明细加工出工单月度绩效分析',
            businessOwner: '吴九',
            dataOwner: '郑十',
            relatedReports: '工单绩效月报',
            level: '子主题',
            parentId: '1',
            createTime: '2024-01-12 13:20:00',
            updateTime: '2024-01-19 14:30:00',
          },
          {
            id: '5',
            categoryName: '一厂一策',
            categoryCode: 'FACTORY_STRATEGY',
            parentCategory: '经营',
            categoryDescription: '针对每个水厂制定个性化策略和方案',
            businessOwner: '钱一',
            dataOwner: '钱二',
            relatedReports: '一厂一策报告',
            level: '主题',
            createTime: '2023-12-18 16:45:00',
            updateTime: '2024-01-10 14:30:00',
          },
          {
            id: '6',
            categoryName: '水厂星级模型评价',
            categoryCode: 'FACTORY_STAR_RATING',
            parentCategory: '经营',
            categoryDescription: '基于多维度指标对水厂进行星级评价',
            businessOwner: '钱三',
            dataOwner: '钱四',
            relatedReports: '星级评价报告',
            level: '主题',
            createTime: '2023-12-22 13:20:00',
            updateTime: '2024-01-05 09:15:00',
          },
        ];

        // 应用搜索过滤
        let filteredData = mockData;
        if (searchParams.categoryName) {
          filteredData = filteredData.filter(item =>
            item.categoryName.toLowerCase().includes(searchParams.categoryName.toLowerCase())
          );
        }
        if (searchParams.parentCategory) {
          filteredData = filteredData.filter(item =>
            item.parentCategory === searchParams.parentCategory
          );
        }
        if (searchParams.businessOwner) {
          filteredData = filteredData.filter(item =>
            item.businessOwner.toLowerCase().includes(searchParams.businessOwner.toLowerCase())
          );
        }
        if (searchParams.dataOwner) {
          filteredData = filteredData.filter(item =>
            item.dataOwner.toLowerCase().includes(searchParams.dataOwner.toLowerCase())
          );
        }
        if (searchParams.relatedReports) {
          filteredData = filteredData.filter(item =>
            item.relatedReports?.toLowerCase().includes(searchParams.relatedReports.toLowerCase())
          );
        }

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
    [pagination.current, pagination.pageSize, searchParams]
  );

  // 初始化加载
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      categoryName: '',
      parentCategory: '',
      businessOwner: '',
      dataOwner: '',
      relatedReports: '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => {
      loadData(1, pagination.pageSize);
    }, 0);
  };

  // 新增
  const handleAdd = () => {
    setIsEdit(false);
    setEditingTopic(null);
    setFormData({
      categoryName: '',
      categoryCode: '',
      parentCategory: '',
      categoryDescription: '',
      businessOwner: '',
      dataOwner: '',
      relatedReports: '',
      parentId: '',
      level: '主题',
    });
    setShowDrawer(true);
  };

  // 编辑
  const handleEdit = (record: BusinessAnalysisTopic) => {
    setIsEdit(true);
    setEditingTopic(record);
    setFormData({
      categoryName: record.categoryName,
      categoryCode: record.categoryCode,
      parentCategory: record.parentCategory,
      categoryDescription: record.categoryDescription,
      businessOwner: record.businessOwner,
      dataOwner: record.dataOwner,
      relatedReports: record.relatedReports || '',
      parentId: record.parentId || '',
      level: record.level,
    });
    setShowDrawer(true);
  };

  // 查看详情
  const handleViewDetail = (record: BusinessAnalysisTopic) => {
    setIsEdit(true);
    setEditingTopic(record);
    setFormData({
      categoryName: record.categoryName,
      categoryCode: record.categoryCode,
      parentCategory: record.parentCategory,
      categoryDescription: record.categoryDescription,
      businessOwner: record.businessOwner,
      dataOwner: record.dataOwner,
      relatedReports: record.relatedReports || '',
      parentId: record.parentId || '',
      level: record.level,
    });
    setShowDrawer(true);
  };

  // 删除
  const handleDelete = async (record: BusinessAnalysisTopic) => {
    if (!confirm(`确定要删除主题"${record.categoryName}"吗？`)) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success('删除成功');
      loadData();
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  // 保存表单
  const handleSave = async () => {
    // 表单验证
    if (!formData.categoryName.trim()) {
      toast.error('请输入主题名称');
      return;
    }
    if (!formData.categoryCode.trim()) {
      toast.error('请输入主题编码');
      return;
    }
    if (!formData.parentCategory) {
      toast.error('请选择所属分类');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(isEdit ? '更新成功' : '创建成功');
      setShowDrawer(false);
      loadData();
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败");
    }
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingTopic(null);
    setIsEdit(false);
  };

  // 获取父主题选项（用于创建子主题）
  const parentTopicOptions = tableData
    .filter(item => item.level === '主题')
    .map(item => ({
      value: item.id,
      label: item.categoryName,
    }));

  return (
    <div className="w-full p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">业务分析主题管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            按照业务主题对公式、模型进行分类管理，支持分析主题-子主题两层结构
          </p>
        </div>
        <MdButton variant="primary" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增主题
        </MdButton>
      </div>

      {/* 搜索区域 */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主题名称
            </label>
            <MdInput
              placeholder="请输入主题名称"
              value={searchParams.categoryName}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, categoryName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所属分类
            </label>
            <MdSelect
              placeholder="请选择"
              value={searchParams.parentCategory}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, parentCategory: value as string }))
              }
              options={categoryOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              业务负责人
            </label>
            <MdInput
              placeholder="请输入业务负责人"
              value={searchParams.businessOwner}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, businessOwner: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数据负责人
            </label>
            <MdInput
              placeholder="请输入数据负责人"
              value={searchParams.dataOwner}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, dataOwner: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关联报表
            </label>
            <MdInput
              placeholder="请输入关联报表"
              value={searchParams.relatedReports}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, relatedReports: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex gap-2">
          <MdButton variant="primary" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            搜索
          </MdButton>
          <MdButton variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </MdButton>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="bg-white rounded-lg border">
        <MdTable
          columns={columns}
          data={tableData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({ ...prev, current: page, pageSize }));
              loadData(page, pageSize);
            },
          }}
          rowKey="id"
        />
      </div>

      {/* 新增/编辑抽屉 */}
      <MdDrawer
        open={showDrawer}
        onClose={handleCloseDrawer}
        title={isEdit ? (editingTopic ? '查看业务分析主题' : '编辑业务分析主题') : '新增业务分析主题'}
        width={600}
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主题名称 <span className="text-red-500">*</span>
            </label>
            <MdInput
              placeholder="请输入主题名称"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryName: e.target.value }))
              }
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主题编码 <span className="text-red-500">*</span>
            </label>
            <MdInput
              placeholder="请输入主题编码"
              value={formData.categoryCode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryCode: e.target.value }))
              }
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              层级
            </label>
            <MdSelect
              placeholder="请选择层级"
              value={formData.level}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, level: value as '主题' | '子主题' }))
              }
              options={[
                { value: '主题', label: '主题' },
                { value: '子主题', label: '子主题' },
              ]}
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          {formData.level === '子主题' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                父主题
              </label>
              <MdSelect
                placeholder="请选择父主题"
                value={formData.parentId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, parentId: value as string }))
                }
                options={parentTopicOptions}
                disabled={isEdit && editingTopic ? true : false}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所属分类 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              placeholder="请选择分类"
              value={formData.parentCategory}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, parentCategory: value as string }))
              }
              options={categoryOptions}
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主题描述
            </label>
            <textarea
              placeholder="请输入主题描述"
              value={formData.categoryDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryDescription: e.target.value }))
              }
              rows={3}
              disabled={isEdit && editingTopic ? true : false}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              业务负责人
            </label>
            <MdInput
              placeholder="请输入业务负责人"
              value={formData.businessOwner}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, businessOwner: e.target.value }))
              }
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数据负责人
            </label>
            <MdInput
              placeholder="请输入数据负责人"
              value={formData.dataOwner}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dataOwner: e.target.value }))
              }
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关联报表
            </label>
            <MdInput
              placeholder="请输入关联报表"
              value={formData.relatedReports}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, relatedReports: e.target.value }))
              }
              disabled={isEdit && editingTopic ? true : false}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <MdButton variant="outline" onClick={handleCloseDrawer}>
            取消
          </MdButton>
          {!(isEdit && editingTopic) && (
            <MdButton variant="primary" onClick={handleSave}>
              保存
            </MdButton>
          )}
        </div>
      </MdDrawer>
    </div>
  );
}
