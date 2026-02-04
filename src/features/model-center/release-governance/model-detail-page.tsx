'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent, MdCardDescription } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Check, X, Eye, User, Calendar, Database, FileText, BarChart3, Package, Tag, ArrowLeft, GitBranch, Activity } from 'lucide-react';

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

// 独立的页面组件
const ModelDetailPageWrapper: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');
  const [model, setModel] = useState<ModelReleaseReview | null>(null);
  const [workflowDrawerOpen, setWorkflowDrawerOpen] = useState(false);
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory[]>([]);

  useEffect(() => {
    if (modelId) {
      // 模拟加载数据
      const mockModel: ModelReleaseReview = {
        id: modelId,
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
      };
      setModel(mockModel);

      // 模拟工作流历史
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
    }
  }, [modelId]);

  const handleApprove = (model: ModelReleaseReview) => {
    // 调用工作流API审批通过
    console.log('审批通过:', model);
    alert('审批通过成功！');
    router.back();
  };

  const handleReject = (model: ModelReleaseReview, reason?: string) => {
    // 调用工作流API审批驳回
    console.log('审批驳回:', model, reason);
    alert('审批驳回成功！');
    router.back();
  };

  if (!model) {
    return <div>加载中...</div>;
  }

  return (
    <ModelDetailPage 
      model={model} 
      onApprove={handleApprove} 
      onReject={handleReject}
      workflowHistory={workflowHistory}
      workflowDrawerOpen={workflowDrawerOpen}
      setWorkflowDrawerOpen={setWorkflowDrawerOpen}
    />
  );
};

// 原始组件（保持向后兼容）
interface ModelDetailPageProps {
  model: ModelReleaseReview;
  onApprove?: (model: ModelReleaseReview) => void;
  onReject?: (model: ModelReleaseReview, reason?: string) => void;
  workflowHistory?: WorkflowHistory[];
  workflowDrawerOpen?: boolean;
  setWorkflowDrawerOpen?: (open: boolean) => void;
}

const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ 
  model, 
  onApprove, 
  onReject,
  workflowHistory = [],
  workflowDrawerOpen = false,
  setWorkflowDrawerOpen
}) => {
  const router = useRouter();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(model);
    }
  };

  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(model, rejectReason);
    }
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{model.modelName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            模型详情 - {model.id}
          </p>
        </div>
        <div className="flex space-x-2">
          <MdButton variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </MdButton>
          {model.workflowId && setWorkflowDrawerOpen && (
            <MdButton variant="outline" onClick={() => setWorkflowDrawerOpen(true)}>
              <GitBranch className="h-4 w-4 mr-2" />
              工作流
            </MdButton>
          )}
          {model.status === '待审核' && (
            <>
              <MdButton 
                onClick={handleApproveClick}
              >
                <Check className="h-4 w-4 mr-2" />
                通过
              </MdButton>
              <MdButton 
                variant="danger" 
                onClick={() => setShowRejectModal(true)}
              >
                <X className="h-4 w-4 mr-2" />
                拒绝
              </MdButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>基本信息</MdCardTitle>
              <MdCardDescription>模型的基本信息和描述</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">模型类型</div>
                  <div className="font-medium">{model.modelType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">版本</div>
                  <div className="font-medium">{model.version}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">框架</div>
                  <div className="font-medium">{model.framework || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">文件大小</div>
                  <div className="font-medium">{model.fileSize || '-'}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">描述</div>
                <div className="font-medium">{model.description}</div>
              </div>
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>评估指标</MdCardTitle>
              <MdCardDescription>模型的性能评估指标</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {model.accuracy ? (model.accuracy * 100).toFixed(2) + '%' : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">准确率</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {model.precision ? (model.precision * 100).toFixed(2) + '%' : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">精确率</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {model.recall ? (model.recall * 100).toFixed(2) + '%' : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">召回率</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {model.f1Score ? (model.f1Score * 100).toFixed(2) + '%' : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">F1分数</div>
                </div>
              </div>
            </MdCardContent>
          </MdCard>
        </div>

        <div className="space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>审核信息</MdCardTitle>
              <MdCardDescription>模型审核相关的信息</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">提交人</div>
                  <div className="font-medium">{model.submitter}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">提交时间</div>
                  <div className="font-medium">{model.submitTime}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">状态</div>
                <div>
                  <MdBadge 
                    variant={
                      model.status === '待审核' ? 'warning' : 
                      model.status === '已通过' ? 'success' : 'danger'
                    }
                  >
                    {model.status}
                  </MdBadge>
                </div>
              </div>
              {model.reason && (
                <div>
                  <div className="text-sm text-muted-foreground">拒绝原因</div>
                  <div className="font-medium text-red-600">{model.reason}</div>
                </div>
              )}
              {model.approver && (
                <div>
                  <div className="text-sm text-muted-foreground">审核人</div>
                  <div className="font-medium">{model.approver}</div>
                </div>
              )}
              {model.approveTime && (
                <div>
                  <div className="text-sm text-muted-foreground">审核时间</div>
                  <div className="font-medium">{model.approveTime}</div>
                </div>
              )}
              {model.admissionCheckId && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">准入检测:</span>
                    <MdBadge variant={model.admissionCheckResult === '通过' ? 'success' : 'danger'}>
                      {model.admissionCheckResult}
                    </MdBadge>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/categories/model-center/release-governance/admission-check-detail?id=${model.admissionCheckId}`)}
                    >
                      查看详情
                    </MdButton>
                  </div>
                </div>
              )}
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>操作</MdCardTitle>
              <MdCardDescription>对模型执行的操作</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-3">
              <MdButton className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                在线试用
              </MdButton>
              <MdButton variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                查看评估报告
              </MdButton>
              <MdButton variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                查看训练数据
              </MdButton>
              <MdButton variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                下载模型
              </MdButton>
            </MdCardContent>
          </MdCard>
        </div>
      </div>

      {/* 拒绝确认抽屉 */}
      <MdDrawer
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="拒绝模型审核"
        width="500px"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              拒绝原因
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              placeholder="请输入拒绝原因..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <MdButton variant="outline" onClick={() => setShowRejectModal(false)}>
              取消
            </MdButton>
            <MdButton 
              variant="danger" 
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim()}
            >
              确认拒绝
            </MdButton>
          </div>
        </div>
      </MdDrawer>

      {/* 工作流进度抽屉 */}
      {model.workflowId && workflowHistory.length > 0 && setWorkflowDrawerOpen && (
        <MdDrawer
          open={workflowDrawerOpen}
          onClose={() => setWorkflowDrawerOpen(false)}
          title={`工作流进度 - ${model.modelName}`}
          width="700px"
        >
          <div className="p-6 space-y-6">
            {/* 关联的准入检测结果 */}
            {model.admissionCheckId && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">准入检测:</span>
                  <MdBadge variant={model.admissionCheckResult === '通过' ? 'success' : 'danger'}>
                    {model.admissionCheckResult}
                  </MdBadge>
                  <MdButton
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/categories/model-center/release-governance/admission-check-detail?id=${model.admissionCheckId}`)}
                  >
                    查看详情
                  </MdButton>
                </div>
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
          </div>
        </MdDrawer>
      )}
    </div>
  );
};

export { ModelDetailPage, ModelDetailPageWrapper };
