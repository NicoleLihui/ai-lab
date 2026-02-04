"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Eye, Check, X, Clock, User, Calendar, GitBranch, FileText, Activity } from 'lucide-react';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';

// 定义模型发布审核数据接口
interface ModelReleaseReview {
  id: string;
  modelName: string;
  modelType: string;
  version: string;
  submitter: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已拒绝';
  reason?: string;
  approver?: string;
  approveTime?: string;
  description: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  evaluationDate?: string;
  fileSize?: string;
  framework?: string;
  actions?: React.ReactNode;
  workflowId?: string;
  admissionCheckId?: string;
  admissionCheckResult?: '通过' | '未通过';
}

interface WorkflowHistory {
  taskName: string;
  userName: string;
  endTime: string;
  status: string;
  message: string;
}

// 审核操作弹窗组件
interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'approve' | 'reject', reason?: string) => void;
  model: ModelReleaseReview | null;
}

const ReviewActionModal: React.FC<ReviewActionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  model 
}) => {
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setAction('approve');
    }
  }, [isOpen]);

  if (!isOpen || !model) return null;

  const handleSubmit = () => {
    onConfirm(action, reason);
  };

  return (
    <MdDrawer
      open={isOpen}
      onClose={onClose}
      title={`${action === 'approve' ? '通过审核' : '拒绝审核'} - ${model?.modelName || ''}`}
      width="500px"
    >
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            操作类型
          </label>
          <div className="flex space-x-4">
            <MdButton
              variant={action === 'approve' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => setAction('approve')}
            >
              通过
            </MdButton>
            <MdButton
              variant={action === 'reject' ? 'danger' : 'outline'}
              fullWidth
              onClick={() => setAction('reject')}
            >
              拒绝
            </MdButton>
          </div>
        </div>
        
        {(action === 'reject') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              拒绝原因
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              placeholder="请输入拒绝原因..."
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <MdButton variant="outline" onClick={onClose}>
            取消
          </MdButton>
          <MdButton 
            variant={action === 'approve' ? 'primary' : 'danger'} 
            onClick={handleSubmit}
          >
            {action === 'approve' ? '确认通过' : '确认拒绝'}
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
};

// 主页面组件
const ReviewModelReleasePage: React.FC = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<ModelReleaseReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ModelReleaseReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelReleaseReview | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [workflowDrawerOpen, setWorkflowDrawerOpen] = useState(false);
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory[]>([]);

  // 模拟数据
  useEffect(() => {
    const mockData: ModelReleaseReview[] = [
      {
        id: '1',
        modelName: '污水处理效果预测模型',
        modelType: '机器学习',
        version: 'v1.2.3',
        submitter: '张三',
        submitTime: '2024-01-15 10:30:00',
        status: '待审核',
        description: '基于历史污水处理数据预测出水水质指标，支持COD、BOD、NH3-N等关键参数预测',
        accuracy: 0.92,
        precision: 0.89,
        recall: 0.91,
        f1Score: 0.90,
        evaluationDate: '2024-01-14',
        fileSize: '125MB',
        framework: 'TensorFlow',
        workflowId: 'wf-001',
        admissionCheckId: 'test-001',
        admissionCheckResult: '通过'
      },
      {
        id: '2',
        modelName: '水质监测预警模型',
        modelType: '深度学习',
        version: 'v2.1.0',
        submitter: '李四',
        submitTime: '2024-01-16 14:22:15',
        status: '待审核',
        description: '实时监测水质参数，预测水质异常并提前预警，支持多种污染物指标监测',
        accuracy: 0.87,
        precision: 0.85,
        recall: 0.88,
        f1Score: 0.86,
        evaluationDate: '2024-01-15',
        fileSize: '89MB',
        framework: 'PyTorch',
        workflowId: 'wf-002',
        admissionCheckId: 'test-002',
        admissionCheckResult: '通过'
      },
      {
        id: '3',
        modelName: '污水流量预测模型',
        modelType: '时序预测',
        version: 'v1.0.5',
        submitter: '王五',
        submitTime: '2024-01-17 09:15:00',
        status: '已通过',
        approver: '赵六',
        approveTime: '2024-01-17 16:45:22',
        description: '基于时间序列分析预测污水流量变化趋势，支持短期和中期预测',
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.93,
        f1Score: 0.925,
        evaluationDate: '2024-01-16',
        fileSize: '210MB',
        framework: 'Transformers',
        workflowId: 'wf-003',
        admissionCheckId: 'test-003',
        admissionCheckResult: '通过'
      },
      {
        id: '4',
        modelName: '污泥处理优化模型',
        modelType: '优化算法',
        version: 'v3.0.1',
        submitter: '孙七',
        submitTime: '2024-01-18 11:20:00',
        status: '已拒绝',
        reason: '模型准确率未达到上线标准',
        approver: '周八',
        approveTime: '2024-01-18 15:30:10',
        description: '优化污泥处理工艺参数，提高处理效率并降低能耗',
        accuracy: 0.72,
        precision: 0.70,
        recall: 0.75,
        f1Score: 0.725,
        evaluationDate: '2024-01-17',
        fileSize: '356MB',
        framework: 'OpenCV',
        workflowId: 'wf-004',
        admissionCheckId: 'test-004',
        admissionCheckResult: '未通过'
      }
    ];
    
    // 模拟工作流历史数据
    setWorkflowHistory([
      {
        taskName: '提交审核',
        userName: '张三',
        endTime: '2024-01-15 10:30:00',
        status: '已完成',
        message: '提交模型发布申请'
      },
      {
        taskName: '技术审核',
        userName: '李四',
        endTime: '2024-01-15 14:20:00',
        status: '已完成',
        message: '技术审核通过'
      },
      {
        taskName: '业务审核',
        userName: '王五',
        endTime: '2024-01-16 09:15:00',
        status: '进行中',
        message: ''
      }
    ]);
    // 为每个数据项添加操作按钮
    const mockDataWithActions = mockData.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 导航到详情页面
                            router.push(`/categories/model-center/release-governance/model-detail?id=${item.id}`)
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
        </div>
      )
    }));
    
    setReviews(mockData);
    setFilteredReviews(mockDataWithActions);
  }, []);

  // 过滤数据
  useEffect(() => {
    let result = reviews;
    
    // 按搜索词过滤
    if (searchTerm) {
      result = result.filter(review => 
        review.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.submitter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(review => review.status === statusFilter);
    }
    
    // 为过滤后的数据项添加操作按钮
    const resultWithActions = result.map(item => ({
      ...item,
      actions: (
        <div className="flex space-x-2">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 导航到详情页面
                            router.push(`/categories/model-center/release-governance/model-detail?id=${item.id}`)
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            详情
          </MdButton>
        </div>
      )
    }));
    
    setFilteredReviews(resultWithActions);
  }, [searchTerm, statusFilter, reviews]);

  // 处理审核操作
  const handleReviewAction = (model: ModelReleaseReview, action: 'approve' | 'reject') => {
    setSelectedModel(model);
    setActionType(action);
    setShowActionModal(true);
  };

  // 确认审核操作
  const confirmReviewAction = (action: 'approve' | 'reject', reason?: string) => {
    if (!selectedModel) return;
    
    // 这里应该调用API更新审核状态
    console.log(`对模型 ${selectedModel.modelName} 执行${action === 'approve' ? '通过' : '拒绝'}操作`, reason);
    
    // 更新本地状态
    const updatedReviews = reviews.map(review => {
      if (review.id === selectedModel.id) {
        let updatedReview;
        if (action === 'approve') {
          updatedReview = {
            ...review,
            status: '已通过' as '待审核' | '已通过' | '已拒绝',
            approver: '当前审核员',
            approveTime: new Date().toLocaleString('zh-CN')
          };
        } else {
          updatedReview = {
            ...review,
            status: '已拒绝' as '待审核' | '已通过' | '已拒绝',
            reason: reason,
            approver: '当前审核员',
            approveTime: new Date().toLocaleString('zh-CN')
          };
        }
        
        // 为更新后的数据项添加操作按钮
        return {
          ...updatedReview,
                  actions: (
                    <div className="flex space-x-2">
                      <MdButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          router.push(`/categories/model-center/release-governance/model-detail?id=${updatedReview.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        详情
                      </MdButton>
                      {updatedReview.workflowId && (
                        <MdButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedModel(updatedReview);
                            setWorkflowDrawerOpen(true);
                          }}
                        >
                          <GitBranch className="h-4 w-4 mr-1" />
                          工作流
                        </MdButton>
                      )}
                    </div>
                  )
        };
      }
      
      // 确保其他数据项也有操作按钮
      return {
        ...review,
        actions: (
          <div className="flex space-x-2">
            <MdButton 
              variant="outline" 
              size="sm"
              onClick={() => {
                router.push(`/categories/model-center/release-governance/model-detail?id=${review.id}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              详情
            </MdButton>
            {review.workflowId && (
              <MdButton 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedModel(review);
                  setWorkflowDrawerOpen(true);
                }}
              >
                <GitBranch className="h-4 w-4 mr-1" />
                工作流
              </MdButton>
            )}
          </div>
        )
      };
    });
    
    setReviews(updatedReviews);
    setShowActionModal(false);
    setSelectedModel(null);
  };

  // 表格列定义
  const columns = [
    {
      prop: 'modelName',
      label: '模型名称',
      width: 150,
      align: 'left',
      render: (row: ModelReleaseReview) => (
        <div className="font-medium">{row.modelName}</div>
      )
    },
    {
      prop: 'modelType',
      label: '模型类型',
      width: 120,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <MdBadge variant="secondary">{row.modelType}</MdBadge>
      )
    },
    {
      prop: 'version',
      label: '版本',
      width: 100,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <span className="font-mono text-sm">{row.version}</span>
      )
    },
    {
      prop: 'accuracy',
      label: '准确率',
      width: 100,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <span>{row.accuracy ? (row.accuracy * 100).toFixed(2) + '%' : '-'}</span>
      )
    },
    {
      prop: 'framework',
      label: '框架',
      width: 120,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <span>{row.framework || '-'}</span>
      )
    },
    {
      prop: 'fileSize',
      label: '文件大小',
      width: 100,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <span>{row.fileSize || '-'}</span>
      )
    },
    {
      prop: 'submitter',
      label: '提交人',
      width: 120,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.submitter}
        </div>
      )
    },
    {
      prop: 'submitTime',
      label: '提交时间',
      width: 150,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.submitTime}
        </div>
      )
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      align: 'center',
      render: (row: ModelReleaseReview) => (
        <MdBadge 
          variant={
            row.status === '待审核' ? 'warning' : 
            row.status === '已通过' ? 'success' : 'danger'
          }
        >
          {row.status}
        </MdBadge>
      )
    },
    {
      prop: 'actions',
      label: '操作',
      width: 180,
      align: 'center'
    }
  ];

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader className="border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索模型名称或提交人..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: '待审核', label: '待审核' }, 
                  { value: '已通过', label: '已通过' }, 
                  { value: '已拒绝', label: '已拒绝' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[180px]"
              />
              <MdButton variant="outline" onClick={() => {
                // TODO: 实现高级筛选功能
                console.log('打开高级筛选');
              }}>
                高级筛选
              </MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <BeTable
            tableData={filteredReviews}
            columns={columns}
            options={{ rowKey: 'id' }}
          />
        </MdCardContent>
      </MdCard>

      <ReviewActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={confirmReviewAction}
        model={selectedModel}
      />

      {/* 工作流进度抽屉 */}
      <MdDrawer
        open={workflowDrawerOpen}
        onClose={() => setWorkflowDrawerOpen(false)}
        title={`工作流进度 - ${selectedModel?.modelName || ''}`}
        width="700px"
      >
        <div className="p-6 space-y-6">
          {/* 模型信息 */}
          {selectedModel && (
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{selectedModel.modelName}</div>
                  <div className="text-sm text-muted-foreground">
                    版本: {selectedModel.version} | 提交人: {selectedModel.submitter}
                  </div>
                </div>
                <MdBadge variant={selectedModel.status === '已通过' ? 'success' : selectedModel.status === '已拒绝' ? 'danger' : 'warning'}>
                  {selectedModel.status}
                </MdBadge>
              </div>
              
              {/* 关联的准入检测结果 */}
              {selectedModel.admissionCheckId && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">准入检测:</span>
                    <MdBadge variant={selectedModel.admissionCheckResult === '通过' ? 'success' : 'danger'}>
                      {selectedModel.admissionCheckResult}
                    </MdBadge>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/categories/model-center/release-governance/admission-check-detail?id=${selectedModel.admissionCheckId}`)}
                    >
                      查看详情
                    </MdButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 工作流历史时间轴 */}
          <div>
            <h3 className="font-semibold mb-4">审批历史</h3>
            <div className="space-y-4">
              {workflowHistory.map((history, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      history.status === '已完成' ? 'bg-green-600' :
                      history.status === '进行中' ? 'bg-blue-600' :
                      'bg-gray-400'
                    }`} />
                    {index < workflowHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{history.taskName}</div>
                      <MdBadge variant={history.status === '已完成' ? 'success' : history.status === '进行中' ? 'primary' : 'secondary'}>
                        {history.status}
                      </MdBadge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      执行人: {history.userName} | 时间: {history.endTime}
                    </div>
                    {history.message && (
                      <div className="text-sm mt-2 p-2 bg-muted rounded">
                        {history.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          {selectedModel && selectedModel.status === '待审核' && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <MdButton
                variant="danger"
                onClick={() => {
                  setWorkflowDrawerOpen(false);
                  setSelectedModel(selectedModel);
                  setActionType('reject');
                  setShowActionModal(true);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                驳回
              </MdButton>
              <MdButton
                onClick={() => {
                  setWorkflowDrawerOpen(false);
                  setSelectedModel(selectedModel);
                  setActionType('approve');
                  setShowActionModal(true);
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                通过
              </MdButton>
            </div>
          )}
        </div>
      </MdDrawer>
    </div>
  );
};

export { ReviewModelReleasePage };