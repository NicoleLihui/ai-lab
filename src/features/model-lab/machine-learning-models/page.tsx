"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RotateCcw, Plus, Edit, Eye, Send, Rocket, Trash2 } from 'lucide-react';
import { MdInput, MdButton, MdTable, MdBadge } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { toast } from 'sonner';

interface MachineLearningModel {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  createdTime: string;
  accuracy: number;
  description: string;
  published: boolean; // 是否已发布到模型广场
  deployed: boolean; // 是否已部署到生产环境
}

const MachineLearningModelsPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<MachineLearningModel[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { current: currentPage, pageSize } = pagination;

  // Mock data for machine learning models
  const mockData: MachineLearningModel[] = [
    {
      id: 1,
      name: '客户流失预测模型',
      type: '分类模型',
      version: 'v1.2.0',
      status: '已发布',
      createdTime: '2023-06-15',
      accuracy: 0.92,
      description: '基于历史客户数据预测客户流失概率',
      published: true,
      deployed: true
    },
    {
      id: 2,
      name: '销售预测模型',
      type: '回归模型',
      version: 'v2.1.0',
      status: '已发布',
      createdTime: '2023-06-20',
      accuracy: 0.87,
      description: '预测未来销售额',
      published: true,
      deployed: false
    },
    {
      id: 3,
      name: '信用评分模型',
      type: '分类模型',
      version: 'v1.0.5',
      status: '测试中',
      createdTime: '2023-07-01',
      accuracy: 0.94,
      description: '评估客户信用风险等级',
      published: false,
      deployed: false
    },
    {
      id: 4,
      name: '需求预测模型',
      type: '时间序列',
      version: 'v1.1.2',
      status: '开发中',
      createdTime: '2023-07-05',
      accuracy: 0.89,
      description: '预测产品需求量',
      published: false,
      deployed: false
    },
    {
      id: 5,
      name: '欺诈检测模型',
      type: '分类模型',
      version: 'v1.3.0',
      status: '已发布',
      createdTime: '2023-05-20',
      accuracy: 0.96,
      description: '实时检测交易欺诈行为',
      published: true,
      deployed: true
    },
    {
      id: 6,
      name: '推荐系统模型',
      type: '协同过滤',
      version: 'v2.0.1',
      status: '测试中',
      createdTime: '2023-06-30',
      accuracy: 0.85,
      description: '个性化商品推荐',
      published: false,
      deployed: true
    },
    {
      id: 7,
      name: '情感分析模型',
      type: 'NLP模型',
      version: 'v1.0.8',
      status: '已发布',
      createdTime: '2023-07-10',
      accuracy: 0.91,
      description: '分析文本情感倾向',
      published: true,
      deployed: false
    },
    {
      id: 8,
      name: '图像识别模型',
      type: 'CNN模型',
      version: 'v1.5.0',
      status: '已发布',
      createdTime: '2023-06-25',
      accuracy: 0.95,
      description: '识别图像中的物体',
      published: true,
      deployed: true
    }
  ];

  // 加载数据
  const loadData = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery) => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        let filteredData = [...mockData];
        
        if (query) {
          filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        const startIndex = (page - 1) * size;
        const paginatedData = filteredData.slice(startIndex, startIndex + size);
        
        setTableData(paginatedData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: filteredData.length,
        }));
      } catch (error) {
        console.error('加载数据失败:', error);
        toast.error('加载数据失败');
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
    setSearchQuery('');
    loadData(1, pagination.pageSize, '');
  };

  // 新建模型
  const handleCreate = () => {
    router.push('/categories/model-lab/model-development/machine-learning-models-create');
  };

  // 编辑模型
  const handleEdit = (row: MachineLearningModel) => {
    if (row.status === '已发布') {
      toast.warning('已发布的模型不能编辑');
      return;
    }
    router.push(`/categories/model-lab/model-development/machine-learning-models-create?id=${row.id}`);
  };

  // 查看
  const handleView = (row: MachineLearningModel) => {
    router.push(`/categories/model-lab/model-development/machine-learning-models-detail?id=${row.id}`);
  };

  // 发布
  const handlePublish = (row: MachineLearningModel) => {
    if (row.published) {
      toast.warning('模型已发布');
      return;
    }
    if (row.status === '开发中') {
      toast.warning('开发中的模型不能发布');
      return;
    }
    if (confirm(`确定要将模型"${row.name}"发布到模型广场吗？`)) {
      // TODO: 调用发布API
      toast.success('模型已发布到模型广场');
      loadData();
    }
  };

  // 部署
  const handleDeploy = (row: MachineLearningModel) => {
    if (row.deployed) {
      toast.warning('模型已部署');
      return;
    }
    if (row.status === '开发中') {
      toast.warning('开发中的模型不能部署');
      return;
    }
    router.push(`/categories/model-lab/model-development/machine-learning-models-deploy?id=${row.id}`);
  };

  // 删除
  const handleDelete = (row: MachineLearningModel) => {
    if (row.status !== '开发中') {
      toast.warning('只能删除开发中的模型');
      return;
    }
    if (confirm('确定删除当前模型?')) {
      // TODO: 调用删除API
      toast.success('删除成功');
      loadData();
    }
  };

  // 点击模型名称跳转详情
  const handleModelNameClick = (row: MachineLearningModel) => {
    handleView(row);
  };

  // 定义表格列
  const columns: Column<Record<string, unknown>>[] = [
    {
      key: 'index',
      title: '序号',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, __: Record<string, unknown>, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: 'name',
      title: '模型名称',
      align: 'center' as const,
      minWidth: 150,
      render: (value: unknown, row: Record<string, unknown>) => {
        const item = row as MachineLearningModel;
        return (
          <span
            className="text-primary-600 cursor-pointer hover:underline"
            onClick={() => handleModelNameClick(item)}
          >
            {String(value || '')}
          </span>
        );
      },
    },
    {
      key: 'type',
      title: '模型类型',
      align: 'center' as const,
      minWidth: 120,
    },
    {
      key: 'version',
      title: '版本',
      align: 'center' as const,
      minWidth: 100,
    },
    {
      key: 'status',
      title: '状态',
      align: 'center' as const,
      minWidth: 100,
      render: (value: unknown) => {
        const status = String(value ?? '');
        let variant: 'success' | 'warning' | 'secondary' = 'secondary';
        if (status === '已发布') variant = 'success';
        if (status === '测试中') variant = 'warning';
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: 'published',
      title: '发布状态',
      align: 'center' as const,
      minWidth: 120,
      render: (value: unknown) => {
        const published = Boolean(value);
        return (
          <MdBadge variant={published ? 'success' : 'secondary'}>
            {published ? '已发布' : '未发布'}
          </MdBadge>
        );
      },
    },
    {
      key: 'deployed',
      title: '部署状态',
      align: 'center' as const,
      minWidth: 120,
      render: (value: unknown) => {
        const deployed = Boolean(value);
        return (
          <MdBadge variant={deployed ? 'success' : 'secondary'}>
            {deployed ? '已部署' : '未部署'}
          </MdBadge>
        );
      },
    },
    {
      key: 'accuracy',
      title: '准确率',
      align: 'center' as const,
      minWidth: 100,
      render: (value: unknown) => {
        const accuracy = Number(value ?? 0);
        return <span>{(accuracy * 100).toFixed(2)}%</span>;
      },
    },
    {
      key: 'createdTime',
      title: '创建时间',
      align: 'center' as const,
      minWidth: 120,
    },
    {
      key: 'description',
      title: '描述',
      align: 'center' as const,
      minWidth: 200,
    },
    {
      key: 'actions',
      title: '操作',
      width: 350,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const item = row as MachineLearningModel;
        return (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleView(item)}
              leftIcon={<Eye className="h-3 w-3" />}
            >
              查看
            </MdButton>
            {item.status !== '已发布' && (
              <MdButton
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(item)}
                leftIcon={<Edit className="h-3 w-3" />}
              >
                编辑
              </MdButton>
            )}
            {!item.published && item.status !== '开发中' && (
              <MdButton
                variant="ghost"
                size="sm"
                onClick={() => handlePublish(item)}
                leftIcon={<Send className="h-3 w-3" />}
              >
                发布
              </MdButton>
            )}
            {!item.deployed && item.status !== '开发中' && (
              <MdButton
                variant="ghost"
                size="sm"
                onClick={() => handleDeploy(item)}
                leftIcon={<Rocket className="h-3 w-3" />}
              >
                部署
              </MdButton>
            )}
            {item.status === '开发中' && (
              <MdButton
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item)}
                leftIcon={<Trash2 className="h-3 w-3" />}
              >
                删除
              </MdButton>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索区域 */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <MdButton onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />} className="h-9 px-3">
          创建模型
        </MdButton>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索模型名称或描述"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              clearable
              onClear={() => {
                setSearchQuery('');
                loadData(1, pagination.pageSize, '');
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
      </div>

      {/* 数据表格 */}
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
    </div>
  );
};

export default MachineLearningModelsPage;
