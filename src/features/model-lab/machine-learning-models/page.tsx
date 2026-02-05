"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Search, RotateCcw, Plus, Edit, Eye, Send, Rocket, Trash2, Play, MoreVertical } from 'lucide-react';
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
  deployTestStatus: number; // 部署测试状态：0-未部署，1-已部署
  deployProdStatus: number; // 部署生产状态：0-未部署，1-已部署，2-审核中
  runId?: string; // MLflow Run ID
  modelId?: string; // 模型ID
}

// Mock data for machine learning models
const mockData: MachineLearningModel[] = [
    {
      id: 1,
      name: '水质预测模型',
      type: '回归模型',
      version: 'v1.2.0',
      status: '已发布',
      createdTime: '2023-06-15',
      accuracy: 0.92,
      description: '基于历史水质数据预测pH、浊度、余氯等水质指标',
      published: true,
      deployTestStatus: 1,
      deployProdStatus: 1,
      runId: 'run-001',
      modelId: 'model-001'
    },
    {
      id: 2,
      name: '用水量预测模型',
      type: '时间序列',
      version: 'v2.1.0',
      status: '已发布',
      createdTime: '2023-06-20',
      accuracy: 0.87,
      description: '预测未来用水量，支持日、周、月预测',
      published: true,
      deployTestStatus: 1,
      deployProdStatus: 0,
      runId: 'run-002',
      modelId: 'model-002'
    },
    {
      id: 3,
      name: '管网漏损检测模型',
      type: '分类模型',
      version: 'v1.0.5',
      status: '测试中',
      createdTime: '2023-07-01',
      accuracy: 0.94,
      description: '基于压力、流量数据检测管网漏损位置',
      published: false,
      deployTestStatus: 0,
      deployProdStatus: 0,
      runId: 'run-003',
      modelId: 'model-003'
    },
    {
      id: 4,
      name: '水压预测模型',
      type: '时间序列',
      version: 'v1.1.2',
      status: '开发中',
      createdTime: '2023-07-05',
      accuracy: 0.89,
      description: '预测管网各节点水压变化趋势',
      published: false,
      deployTestStatus: 0,
      deployProdStatus: 0,
      runId: 'run-004',
      modelId: 'model-004'
    },
    {
      id: 5,
      name: '水质异常检测模型',
      type: '分类模型',
      version: 'v1.3.0',
      status: '已发布',
      createdTime: '2023-05-20',
      accuracy: 0.96,
      description: '实时检测水质异常，及时预警',
      published: true,
      deployTestStatus: 1,
      deployProdStatus: 1,
      runId: 'run-005',
      modelId: 'model-005'
    },
    {
      id: 6,
      name: 'COD去除率预测模型',
      type: '回归模型',
      version: 'v2.0.1',
      status: '测试中',
      createdTime: '2023-06-30',
      accuracy: 0.85,
      description: '预测污水处理过程中COD去除率',
      published: false,
      deployTestStatus: 1,
      deployProdStatus: 2, // 审核中
      runId: 'run-006',
      modelId: 'model-006'
    },
    {
      id: 7,
      name: '曝气池溶解氧预测模型',
      type: '时间序列',
      version: 'v1.0.8',
      status: '已发布',
      createdTime: '2023-07-10',
      accuracy: 0.91,
      description: '预测曝气池溶解氧浓度，优化曝气控制',
      published: true,
      deployTestStatus: 1,
      deployProdStatus: 0,
      runId: 'run-007',
      modelId: 'model-007'
    },
    {
      id: 8,
      name: '污泥浓度识别模型',
      type: 'CNN模型',
      version: 'v1.5.0',
      status: '已发布',
      createdTime: '2023-06-25',
      accuracy: 0.95,
      description: '基于图像识别技术检测污泥浓度',
      published: true,
      deployTestStatus: 1,
      deployProdStatus: 1,
      runId: 'run-008',
      modelId: 'model-008'
    }
];

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

  // 部署测试（开发/测试环境，无需审核）
  const handleDeployTest = async (row: MachineLearningModel) => {
    if (row.deployTestStatus === 1) {
      toast.warning('模型已部署到测试环境');
      return;
    }
    if (row.status === '开发中') {
      toast.warning('开发中的模型不能部署');
      return;
    }
    if (!row.runId || !row.modelId) {
      toast.error('模型缺少必要的训练信息，请先完成训练');
      return;
    }
    
    try {
      // TODO: 调用部署测试API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('部署测试成功');
      loadData();
    } catch (error) {
      toast.error('部署测试失败');
    }
  };

  // 部署生产（生产环境，需要审核）
  const handleDeployProduction = (row: MachineLearningModel) => {
    if (row.deployProdStatus === 1) {
      toast.warning('模型已部署到生产环境');
      return;
    }
    if (row.deployProdStatus === 2) {
      toast.warning('模型正在审核中，请等待审核结果');
      return;
    }
    if (row.status === '开发中') {
      toast.warning('开发中的模型不能部署');
      return;
    }
    if (!row.runId || !row.modelId) {
      toast.error('模型缺少必要的训练信息，请先完成训练');
      return;
    }
    
    router.push(
      `/categories/model-lab/model-development/machine-learning-models-deploy-prod?id=${row.id}&runId=${row.runId}&version=${row.version}`
    );
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

  // 操作菜单组件
  const ActionMenu: React.FC<{ row: MachineLearningModel }> = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const menuItems = [
      {
        label: '查看',
        icon: Eye,
        onClick: () => handleView(row),
        show: true,
      },
      {
        label: '编辑',
        icon: Edit,
        onClick: () => handleEdit(row),
        show: row.status !== '已发布',
      },
      {
        label: '发布',
        icon: Send,
        onClick: () => handlePublish(row),
        show: !row.published && row.status !== '开发中',
      },
      {
        label: '部署测试',
        icon: Play,
        onClick: () => handleDeployTest(row),
        show: row.status !== '开发中' && row.deployTestStatus !== 1,
      },
      {
        label: '部署生产',
        icon: Rocket,
        onClick: () => handleDeployProduction(row),
        show: row.status !== '开发中' && row.deployProdStatus !== 1 && row.deployProdStatus !== 2,
      },
      {
        label: '删除',
        icon: Trash2,
        onClick: () => handleDelete(row),
        show: row.status === '开发中',
      },
    ].filter(item => item.show);

    const getMenuPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0, maxHeight: 'none' };
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuItems.length * 36 + 8;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuWidth = 140;
      
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
      
      const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      const top = showAbove ? rect.top - menuHeight - 4 : rect.bottom + 4;
      
      const maxHeight = showAbove 
        ? Math.min(menuHeight, spaceAbove - 8)
        : Math.min(menuHeight, spaceBelow - 8);
      
      return {
        top,
        left,
        maxHeight: maxHeight > 100 ? maxHeight : 100,
      };
    };

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
          aria-label="更多操作"
        >
          <MoreVertical className="h-4 w-4 text-foreground" />
        </button>
        {isOpen &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 py-1 min-w-[140px] overflow-y-auto"
              style={{
                top: getMenuPosition().top,
                left: getMenuPosition().left,
                maxHeight: getMenuPosition().maxHeight,
              }}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>,
            document.body
          )}
      </div>
    );
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
      width: 150,
      render: (value: unknown, row: Record<string, unknown>) => {
        const item = row as unknown as MachineLearningModel;
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
      width: 120,
    },
    {
      key: 'version',
      title: '版本',
      align: 'center' as const,
      width: 150,
      render: (value: unknown, row: Record<string, unknown>) => {
        const item = row as unknown as MachineLearningModel;
        const version = String(value || '');
        const published = item.published;
        return (
          <div className="flex items-center justify-center gap-2">
            <span>{version}</span>
            <MdBadge variant={published ? 'success' : 'secondary'}>
              {published ? '已发布' : '未发布'}
            </MdBadge>
          </div>
        );
      },
    },
    // {
    //   key: 'status',
    //   title: '状态',
    //   align: 'center' as const,
    //   minWidth: 100,
    //   render: (value: unknown) => {
    //     const status = String(value ?? '');
    //     let variant: 'success' | 'warning' | 'secondary' = 'secondary';
    //     if (status === '已发布') variant = 'success';
    //     if (status === '测试中') variant = 'warning';
    //     return <MdBadge variant={variant}>{status}</MdBadge>;
    //   },
    // },
    {
      key: 'deployTestStatus',
      title: '测试部署',
      align: 'center' as const,
      width: 120,
      render: (value: unknown) => {
        const status = Number(value ?? 0);
        return (
          <MdBadge variant={status === 1 ? 'success' : 'secondary'}>
            {status === 1 ? '已部署' : '未部署'}
          </MdBadge>
        );
      },
    },
    {
      key: 'deployProdStatus',
      title: '生产部署',
      align: 'center' as const,
      width: 120,
      render: (value: unknown) => {
        const status = Number(value ?? 0);
        if (status === 2) {
          return <MdBadge variant="warning">审核中</MdBadge>;
        }
        return (
          <MdBadge variant={status === 1 ? 'success' : 'secondary'}>
            {status === 1 ? '已部署' : '未部署'}
          </MdBadge>
        );
      },
    },
    {
      key: 'accuracy',
      title: '准确率',
      align: 'center' as const,
      width: 100,
      render: (value: unknown) => {
        const accuracy = Number(value ?? 0);
        return <span>{(accuracy * 100).toFixed(2)}%</span>;
      },
    },
    {
      key: 'createdTime',
      title: '创建时间',
      align: 'center' as const,
      width: 120,
    },
    {
      key: 'description',
      title: '描述',
      align: 'center' as const,
      width: 200,
    },
    {
      key: 'actions',
      title: '操作',
      width: 80,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const item = row as unknown as MachineLearningModel;
        return <ActionMenu row={item} />;
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
