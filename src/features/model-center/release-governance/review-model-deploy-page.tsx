"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { AdvancedSearch } from '@/components/enterprise-ui/advanced-search';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Eye, User, Calendar, CheckCircle, XCircle, Clock, MoreVertical, Check, X } from 'lucide-react';

// 定义模型部署审核数据接口
interface ModelDeployReview {
  id: string;
  modelId: string;
  modelName: string;
  modelType: string;
  version: string;
  reviewStatus: '审核中' | '审核通过' | '审核未通过';
  description: string;
  paramInStr: string;
  paramOutStr: string;
  applicableScenario: string;
  paramEva: string;
  trialTimes: number;
  instructions: string;
  createBy: string;
  createTime: string;
  workflowId?: string;
  taskId?: string;
  busId?: string;
  busType?: string;
}


// 主页面组件
const ReviewModelDeployPage: React.FC = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<ModelDeployReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ModelDeployReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  
  // 搜索表单数据
  const [formData, setFormData] = useState({
    modelName: '',
    modelType: '',
    applicationStatus: ''
  });
  

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: '1', label: '审核中' },
    { value: '2', label: '审核通过' },
    { value: '3', label: '审核未通过' },
  ];

  // 模型类型选项
  const modelTypeOptions = [
    { value: '1', label: '机器学习' },
    { value: '2', label: '智能体' },
    { value: '3', label: '数据规则模型' },
  ];

  // 模拟数据
  useEffect(() => {
    const mockData: ModelDeployReview[] = [
      {
        id: '1',
        modelId: 'ML001',
        modelName: 'A2O外回流比推理模型',
        modelType: '机器学习',
        version: 'v3.0',
        reviewStatus: '审核中',
        description: '用于预测A2O工艺中各池溶解氧浓度变化趋势',
        paramInStr: 'SV30、SVI、FM',
        paramOutStr: '污泥膨胀状态（"膨胀"/"正常"）',
        applicableScenario: 'A2O',
        paramEva: '节能率 15%±2%',
        trialTimes: 720,
        instructions: 'XX申请说明',
        createBy: '张三',
        createTime: '2024-01-15 10:30:00',
        workflowId: 'wf001',
        taskId: 'task001',
        busId: 'bus001',
        busType: 'deploy'
      },
      {
        id: '2',
        modelId: 'ML002',
        modelName: '用水量预测模型',
        modelType: '机器学习',
        version: 'v2.1.0',
        reviewStatus: '审核中',
        description: '预测未来用水量，支持日、周、月预测',
        paramInStr: '历史用水量、温度、节假日',
        paramOutStr: '预测用水量',
        applicableScenario: '供水调度',
        paramEva: '准确率 87%',
        trialTimes: 1520,
        instructions: '使用说明',
        createBy: '李四',
        createTime: '2024-01-16 14:22:15',
        workflowId: 'wf002',
        taskId: 'task002',
        busId: 'bus002',
        busType: 'deploy'
      },
      {
        id: '3',
        modelId: 'AG001',
        modelName: '智能客服助手',
        modelType: '智能体',
        version: 'v2.1.0',
        reviewStatus: '审核通过',
        description: '智能客服对话系统',
        paramInStr: '用户问题',
        paramOutStr: '回答内容',
        applicableScenario: '客服场景',
        paramEva: '满意度 95%',
        trialTimes: 3200,
        instructions: '使用说明',
        createBy: '王五',
        createTime: '2024-01-17 09:15:00',
        workflowId: 'wf003',
        taskId: 'task003',
        busId: 'bus003',
        busType: 'deploy'
      },
      {
        id: '4',
        modelId: 'DR001',
        modelName: '数据规则模型',
        modelType: '数据规则模型',
        version: 'v1.0.5',
        reviewStatus: '审核未通过',
        description: '数据质量检测规则',
        paramInStr: '数据字段',
        paramOutStr: '检测结果',
        applicableScenario: '数据质量',
        paramEva: '准确率 85%',
        trialTimes: 500,
        instructions: '使用说明',
        createBy: '赵六',
        createTime: '2024-01-18 11:20:00',
        workflowId: 'wf004',
        taskId: 'task004',
        busId: 'bus004',
        busType: 'deploy'
      }
    ];
    setReviews(mockData);
    setFilteredReviews(mockData);
    setTotal(mockData.length);
  }, []);

  // 加载表格数据
  const loadTableData = useCallback(() => {
    setIsLoading(true);
    // TODO: 调用实际API
    // getmodelApprovalList({
    //   currentPage,
    //   pageSize,
    //   modelType: formData.modelType,
    //   modelName: formData.modelName,
    //   pageType: 2,
    //   reviewStatus: formData.applicationStatus === 'all' ? '' : formData.applicationStatus,
    // }).then((res) => {
    //   if (res.success) {
    //     setReviews(res.data.records);
    //     setTotal(res.data.total);
    //   }
    // }).finally(() => {
    //   setIsLoading(false);
    // });
    
    // 模拟API调用
    setTimeout(() => {
      let result = [...reviews];
      
      // 按模型名称过滤
      if (formData.modelName) {
        result = result.filter(item => 
          item.modelName.toLowerCase().includes(formData.modelName.toLowerCase())
        );
      }
      
      // 按模型类型过滤
      if (formData.modelType) {
        result = result.filter(item => {
          const typeMap: Record<string, string> = {
            '1': '机器学习',
            '2': '智能体',
            '3': '数据规则模型'
          };
          return item.modelType === typeMap[formData.modelType as string];
        });
      }
      
      // 按状态过滤
      if (formData.applicationStatus && formData.applicationStatus !== 'all') {
        const statusMap: Record<string, string> = {
          '1': '审核中',
          '2': '审核通过',
          '3': '审核未通过'
        };
        result = result.filter(item => 
          item.reviewStatus === statusMap[formData.applicationStatus as string]
        );
      }
      
      setFilteredReviews(result);
      setTotal(result.length);
      setIsLoading(false);
    }, 300);
  }, [reviews, formData]);

  useEffect(() => {
    loadTableData();
  }, [currentPage, pageSize, formData, loadTableData]);

  // 搜索
  const handleFilterSearch = (data: any) => {
    setFormData(data);
    setCurrentPage(1);
  };

  // 重置
  const handleFilterReset = () => {
    setFormData({
      modelName: '',
      modelType: '',
      applicationStatus: ''
    });
    setCurrentPage(1);
  };

  // 操作菜单组件
  const ActionMenu: React.FC<{ row: ModelDeployReview; onCommand: (command: string, row: ModelDeployReview) => void }> = ({ row, onCommand }) => {
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
        label: row.reviewStatus === '审核中' ? '审批' : '详情',
        icon: row.reviewStatus === '审核中' ? CheckCircle : Eye,
        onClick: () => {
          onCommand('detail', row);
          setIsOpen(false);
        },
        show: true,
      },
    ].filter(item => item.show);

    // 如果只有一个操作项，直接显示按钮，不使用折叠菜单
    if (menuItems.length === 1) {
      const item = menuItems[0];
      const Icon = item.icon;
      return (
        <MdButton
          variant="ghost"
          size="sm"
          onClick={() => item.onClick()}
          className="h-8"
        >
          <Icon className="h-4 w-4 mr-1" />
          {item.label}
        </MdButton>
      );
    }

    const getMenuPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0 };
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 4,
        left: rect.right - 140,
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
              className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 py-1 min-w-[140px]"
              style={{
                top: getMenuPosition().top,
                left: getMenuPosition().left,
              }}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={item.onClick}
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


  // 查看详情
  const handleViewDetail = (row: ModelDeployReview) => {
    router.push(
      `/categories/model-lab/release-governance/deploy-review-detail?id=${row.id}&busId=${row.busId || row.modelId}&modelId=${row.modelId}`
    );
  };

  // 表格列定义
  const columns = [
    {
      type: 'index',
      prop: 'index',
      label: '序号',
      align: 'center',
      width: 60
    },
    {
      prop: 'reviewStatus',
      label: '申请状态',
      align: 'center',
      minWidth: 100,
      render: (row: ModelDeployReview) => {
        const statusConfig = {
          '审核中': { color: '#1775ff', icon: Clock },
          '审核未通过': { color: '#ff9900', icon: XCircle },
          '审核通过': { color: '#19be6b', icon: CheckCircle }
        };
        const config = statusConfig[row.reviewStatus];
        const Icon = config.icon;
        return (
          <div className="flex items-center justify-center">
            <Icon className="h-4 w-4 mr-1" style={{ color: config.color }} />
            <span style={{ color: config.color }}>{row.reviewStatus}</span>
          </div>
        );
      }
    },
    {
      prop: 'modelId',
      label: '模型ID',
      align: 'center'
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'modelType',
      label: '模型类型',
      align: 'center',
      render: (row: ModelDeployReview) => (
        <MdBadge variant="secondary">{row.modelType}</MdBadge>
      )
    },
    {
      prop: 'version',
      label: '当前版本',
      align: 'center'
    },
    {
      prop: 'description',
      label: '功能描述',
      align: 'center',
      width: 150
    },
    {
      prop: 'paramInStr',
      label: '输入数据',
      align: 'center'
    },
    {
      prop: 'paramOutStr',
      label: '输出参数',
      align: 'center'
    },
    {
      prop: 'applicableScenario',
      label: '应用场景',
      align: 'center'
    },
    {
      prop: 'paramEva',
      label: '评估指标',
      align: 'center'
    },
    {
      prop: 'trialTimes',
      label: '试用次数',
      align: 'center'
    },
    {
      prop: 'instructions',
      label: '使用说明',
      align: 'center'
    },
    {
      prop: 'createBy',
      label: '申请人',
      align: 'center',
      render: (row: ModelDeployReview) => (
        <div className="flex items-center justify-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.createBy}
        </div>
      )
    },
    {
      prop: 'createTime',
      label: '申请时间',
      align: 'center',
      render: (row: ModelDeployReview) => (
        <div className="flex items-center justify-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.createTime}
        </div>
      )
    },
    {
      type: 'actions',
      label: '操作',
      width: 80,
      align: 'center',
      render: (row: ModelDeployReview) => (
        <ActionMenu row={row} onCommand={(command, r) => {
          switch (command) {
            case 'detail':
              handleViewDetail(r);
              break;
            case 'trialDetail':
              handleViewTrialDetail(r);
              break;
          }
        }} />
      )
    }
  ];

  // 搜索表单配置
  const searchFormItems = [
    {
      type: 'input' as const,
      label: '模型名称',
      paramKey: 'modelName',
      placeholder: '请输入模型名称',
      modelValue: formData.modelName
    },
    {
      type: 'select' as const,
      label: '模型类型',
      paramKey: 'modelType',
      placeholder: '请选择',
      modelValue: formData.modelType,
      selectOptions: modelTypeOptions
    },
    {
      type: 'select' as const,
      label: '申请状态',
      paramKey: 'applicationStatus',
      placeholder: '请选择',
      modelValue: formData.applicationStatus,
      selectOptions: statusOptions
    }
  ];

  return (
    <div className="space-y-6">

      <MdCard>
        <MdCardHeader className="border-b">
          <AdvancedSearch
            formItemList={searchFormItems}
            onSearch={handleFilterSearch}
            onReset={handleFilterReset}
          />
        </MdCardHeader>
        <MdCardContent className="p-0">
          <BeTable
            tableData={filteredReviews}
            columns={columns}
            options={{ 
              rowKey: 'id',
              loading: isLoading,
              paginationConfig: {
                currentPage,
                pageSize,
                total
              }
            }}
            onCommand={(command, row) => {
              const model = row as ModelDeployReview;
              switch (command) {
                case 'detail':
                  handleViewDetail(model);
                  break;
              }
            }}
          />
        </MdCardContent>
      </MdCard>

    </div>
  );
};

export { ReviewModelDeployPage };
