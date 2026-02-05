'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent, MdCardDescription } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { MdTable, type Column } from '@/components/enterprise-ui/md-table';
import { Check, X, Eye, User, Calendar, Database, FileText, BarChart3, Package, ArrowLeft, GitBranch, Activity, Download, Play } from 'lucide-react';
import { toast } from 'sonner';

interface ModelDeployReviewDetail {
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
  // 评估指标
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  evaluationDate?: string;
  fileSize?: string;
  framework?: string;
  // 试用结果
  trialResults?: TrialResult[];
  // 评估报告
  evaluationReport?: EvaluationReport;
  // 训练数据
  trainingData?: TrainingData[];
}

interface TrialResult {
  id: string;
  trialTime: string;
  inputData: string;
  outputData: string;
  status: '成功' | '失败';
  latency?: number;
  errorMessage?: string;
}

interface EvaluationReport {
  id: string;
  reportName: string;
  evaluationDate: string;
  metrics: {
    name: string;
    value: number;
    unit?: string;
  }[];
  reportUrl?: string;
}

interface TrainingData {
  id: string;
  datasetName: string;
  dataType: string;
  recordCount: number;
  fileSize: string;
  uploadTime: string;
  downloadUrl?: string;
}

interface WorkflowHistory {
  taskName: string;
  userName: string;
  endTime: string;
  status: string;
  message: string;
}

// 独立的页面组件
const DeployReviewDetailPageWrapper: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');
  const busId = searchParams.get('busId');
  const [model, setModel] = useState<ModelDeployReviewDetail | null>(null);
  const [workflowDrawerOpen, setWorkflowDrawerOpen] = useState(false);
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const handleApprove = (model: ModelDeployReviewDetail) => {
    // TODO: 调用实际API
    // const params = {
    //   taskId: model.taskId,
    //   pageType: 5,
    //   busType: model.busType,
    //   reason: ''
    // };
    // reviewApproval(params).then(() => {
    //   toast.success('审核通过成功');
    //   router.back();
    // });
    
    console.log('审批通过:', model);
    toast.success('审核通过成功');
    
    // 更新本地状态
    if (model) {
      setModel({
        ...model,
        reviewStatus: '审核通过'
      });
    }
    
    // 延迟返回，让用户看到成功提示
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const handleReject = (model: ModelDeployReviewDetail, reason?: string) => {
    // TODO: 调用实际API
    // const params = {
    //   taskId: model.taskId,
    //   pageType: 5,
    //   busType: model.busType,
    //   dataId: model.busId,
    //   id: model.modelId,
    //   reason: reason || ''
    // };
    // reviewBack(params).then(() => {
    //   toast.success('审核驳回成功');
    //   router.back();
    // });
    
    console.log('审批驳回:', model, reason);
    toast.success('审核驳回成功');
    
    // 更新本地状态
    if (model) {
      setModel({
        ...model,
        reviewStatus: '审核未通过'
      });
    }
    
    // 延迟返回，让用户看到成功提示
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  useEffect(() => {
    if (modelId || busId) {
      // 模拟加载数据
      const mockModel: ModelDeployReviewDetail = {
        id: modelId || busId || '1',
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
        busId: busId || 'bus001',
        busType: 'deploy',
        accuracy: 0.92,
        precision: 0.89,
        recall: 0.91,
        f1Score: 0.90,
        evaluationDate: '2024-01-14',
        fileSize: '125MB',
        framework: 'TensorFlow',
        trialResults: [
          {
            id: '1',
            trialTime: '2024-01-15 10:30:00',
            inputData: 'SV30: 85, SVI: 120, FM: 0.35',
            outputData: '正常',
            status: '成功',
            latency: 120
          },
          {
            id: '2',
            trialTime: '2024-01-15 11:00:00',
            inputData: 'SV30: 95, SVI: 150, FM: 0.42',
            outputData: '膨胀',
            status: '成功',
            latency: 115
          }
        ],
        evaluationReport: {
          id: '1',
          reportName: '模型评估报告_v3.0',
          evaluationDate: '2024-01-14',
          metrics: [
            { name: '准确率', value: 92, unit: '%' },
            { name: '精确率', value: 89, unit: '%' },
            { name: '召回率', value: 91, unit: '%' },
            { name: 'F1分数', value: 90, unit: '%' }
          ],
          reportUrl: '/reports/evaluation-report-1.pdf'
        },
        trainingData: [
          {
            id: '1',
            datasetName: 'A2O训练数据集_v1',
            dataType: 'CSV',
            recordCount: 10000,
            fileSize: '50MB',
            uploadTime: '2024-01-10 09:00:00',
            downloadUrl: '/datasets/training-data-1.csv'
          },
          {
            id: '2',
            datasetName: 'A2O验证数据集_v1',
            dataType: 'CSV',
            recordCount: 2000,
            fileSize: '10MB',
            uploadTime: '2024-01-10 09:00:00',
            downloadUrl: '/datasets/validation-data-1.csv'
          }
        ]
      };
      
      setTimeout(() => {
        setModel(mockModel);
        setLoading(false);
      }, 500);

      // 模拟工作流历史
      setWorkflowHistory([
        {
          taskName: '提交部署申请',
          userName: '张三',
          endTime: '2024-01-15 10:30:00',
          status: '已完成',
          message: '提交模型部署申请'
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
  }, [modelId, busId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">模型不存在</p>
          <MdButton onClick={() => router.back()}>返回</MdButton>
        </div>
      </div>
    );
  }

  return (
    <DeployReviewDetailPage 
      model={model} 
      onApprove={handleApprove}
      onReject={handleReject}
      workflowHistory={workflowHistory}
      workflowDrawerOpen={workflowDrawerOpen}
      setWorkflowDrawerOpen={setWorkflowDrawerOpen}
    />
  );
};

// 主组件
interface DeployReviewDetailPageProps {
  model: ModelDeployReviewDetail;
  onApprove?: (model: ModelDeployReviewDetail) => void;
  onReject?: (model: ModelDeployReviewDetail, reason?: string) => void;
  workflowHistory?: WorkflowHistory[];
  workflowDrawerOpen?: boolean;
  setWorkflowDrawerOpen?: (open: boolean) => void;
}

const DeployReviewDetailPage: React.FC<DeployReviewDetailPageProps> = ({ 
  model,
  onApprove,
  onReject,
  workflowHistory = [],
  workflowDrawerOpen = false,
  setWorkflowDrawerOpen
}) => {
  const router = useRouter();
  const [showTrialDrawer, setShowTrialDrawer] = useState(false);
  const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
  const [showTrainingDataDrawer, setShowTrainingDataDrawer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleTrial = () => {
    setShowTrialDrawer(true);
  };

  const handleViewEvaluationReport = () => {
    if (model.evaluationReport?.reportUrl) {
      // 打开评估报告
      window.open(model.evaluationReport.reportUrl, '_blank');
    } else {
      setShowEvaluationDrawer(true);
    }
  };

  const handleViewTrainingData = () => {
    setShowTrainingDataDrawer(true);
  };

  const handleDownloadModel = () => {
    // TODO: 调用下载API
    toast.success('开始下载模型文件...');
  };

  const handleDownloadTrainingData = (data: TrainingData) => {
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank');
    } else {
      toast.info('下载链接不存在');
    }
  };

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(model);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error('请输入驳回原因');
      return;
    }
    if (onReject) {
      onReject(model, rejectReason);
    }
    setShowRejectModal(false);
    setRejectReason('');
  };

  // 试用结果表格列
  const trialColumns: Column<TrialResult>[] = [
    {
      key: 'trialTime',
      title: '试用时间',
      align: 'center',
    },
    {
      key: 'inputData',
      title: '输入数据',
      align: 'center',
    },
    {
      key: 'outputData',
      title: '输出结果',
      align: 'center',
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: (value: unknown) => {
        const status = String(value);
        return (
          <MdBadge variant={status === '成功' ? 'success' : 'danger'}>
            {status}
          </MdBadge>
        );
      }
    },
    {
      key: 'latency',
      title: '延迟(ms)',
      align: 'center',
      render: (value: unknown) => value ? `${value}ms` : '-'
    }
  ];

  // 训练数据表格列
  const trainingDataColumns: Column<TrainingData>[] = [
    {
      key: 'datasetName',
      title: '数据集名称',
      align: 'center',
    },
    {
      key: 'dataType',
      title: '数据类型',
      align: 'center',
    },
    {
      key: 'recordCount',
      title: '记录数',
      align: 'center',
      render: (value: unknown) => value ? (value as number).toLocaleString() : '-'
    },
    {
      key: 'fileSize',
      title: '文件大小',
      align: 'center',
    },
    {
      key: 'uploadTime',
      title: '上传时间',
      align: 'center',
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      render: (_: unknown, row: TrainingData) => (
        <MdButton
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadTrainingData(row)}
        >
          <Download className="h-4 w-4 mr-1" />
          下载
        </MdButton>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{model.modelName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            模型部署审核详情 - {model.modelId}
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
          {model.reviewStatus === '审核中' && (
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
                驳回
              </MdButton>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>基本信息</MdCardTitle>
              <MdCardDescription>模型的基本信息和描述</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">模型ID</div>
                  <div className="font-medium">{model.modelId}</div>
                </div>
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
                <div>
                  <div className="text-sm text-muted-foreground">应用场景</div>
                  <div className="font-medium">{model.applicableScenario}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">输入参数</div>
                  <div className="font-medium">{model.paramInStr}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">输出参数</div>
                  <div className="font-medium">{model.paramOutStr}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">功能描述</div>
                <div className="font-medium">{model.description}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">使用说明</div>
                <div className="font-medium">{model.instructions}</div>
              </div>
            </MdCardContent>
          </MdCard>

          {/* 评估指标 */}
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>评估指标</MdCardTitle>
              <MdCardDescription>模型的性能评估指标</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {model.accuracy ? (model.accuracy * 100).toFixed(2) + '%' : model.paramEva || '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {model.accuracy ? '准确率' : '评估指标'}
                  </div>
                </div>
                {model.accuracy && (
                  <>
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
                  </>
                )}
              </div>
              {model.evaluationDate && (
                <div className="mt-4 text-sm text-muted-foreground">
                  评估时间: {model.evaluationDate}
                </div>
              )}
            </MdCardContent>
          </MdCard>
        </div>

        <div className="space-y-6">
          {/* 审核信息 */}
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>审核信息</MdCardTitle>
              <MdCardDescription>模型部署审核相关的信息</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">申请人</div>
                  <div className="font-medium">{model.createBy}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">申请时间</div>
                  <div className="font-medium">{model.createTime}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">审核状态</div>
                <div>
                  <MdBadge 
                    variant={
                      model.reviewStatus === '审核中' ? 'warning' : 
                      model.reviewStatus === '审核通过' ? 'success' : 'danger'
                    }
                  >
                    {model.reviewStatus}
                  </MdBadge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">试用次数</div>
                <div className="font-medium">{model.trialTimes}</div>
              </div>
            </MdCardContent>
          </MdCard>

          {/* 操作 */}
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>操作</MdCardTitle>
              <MdCardDescription>对模型执行的操作</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-3">
              <MdButton className="w-full" onClick={handleTrial}>
                <Play className="h-4 w-4 mr-2" />
                查看试用结果
              </MdButton>
              <MdButton variant="outline" className="w-full" onClick={handleViewEvaluationReport}>
                <BarChart3 className="h-4 w-4 mr-2" />
                查看评估报告
              </MdButton>
              <MdButton variant="outline" className="w-full" onClick={handleViewTrainingData}>
                <Database className="h-4 w-4 mr-2" />
                查看训练数据
              </MdButton>
              <MdButton variant="outline" className="w-full" onClick={handleDownloadModel}>
                <Package className="h-4 w-4 mr-2" />
                下载模型
              </MdButton>
            </MdCardContent>
          </MdCard>
        </div>
      </div>

      {/* 试用结果抽屉 */}
      <MdDrawer
        open={showTrialDrawer}
        onClose={() => setShowTrialDrawer(false)}
        title="试用结果"
        width="900px"
      >
        <div className="p-6">
          {model.trialResults && model.trialResults.length > 0 ? (
            <MdTable
              columns={trialColumns}
              data={model.trialResults}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无试用结果
            </div>
          )}
        </div>
      </MdDrawer>

      {/* 评估报告抽屉 */}
      <MdDrawer
        open={showEvaluationDrawer}
        onClose={() => setShowEvaluationDrawer(false)}
        title="评估报告"
        width="800px"
      >
        <div className="p-6">
          {model.evaluationReport ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">报告名称</div>
                <div className="font-medium">{model.evaluationReport.reportName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">评估日期</div>
                <div className="font-medium">{model.evaluationReport.evaluationDate}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">评估指标</div>
                <div className="grid grid-cols-2 gap-4">
                  {model.evaluationReport.metrics.map((metric, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">{metric.name}</div>
                      <div className="text-xl font-bold text-primary mt-1">
                        {metric.value}{metric.unit || ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {model.evaluationReport.reportUrl && (
                <div className="pt-4 border-t">
                  <MdButton
                    onClick={() => window.open(model.evaluationReport!.reportUrl, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    查看完整报告
                  </MdButton>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无评估报告
            </div>
          )}
        </div>
      </MdDrawer>

      {/* 训练数据抽屉 */}
      <MdDrawer
        open={showTrainingDataDrawer}
        onClose={() => setShowTrainingDataDrawer(false)}
        title="训练数据"
        width="900px"
      >
        <div className="p-6">
          {model.trainingData && model.trainingData.length > 0 ? (
            <MdTable
              columns={trainingDataColumns}
              data={model.trainingData}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无训练数据
            </div>
          )}
        </div>
      </MdDrawer>

      {/* 驳回确认抽屉 */}
      <MdDrawer
        open={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        title="驳回模型部署审核"
        width="500px"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              驳回原因
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              rows={6}
              placeholder="请输入驳回原因..."
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {rejectReason.length}/500
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <MdButton variant="outline" onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
            }}>
              取消
            </MdButton>
            <MdButton 
              variant="danger" 
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim()}
            >
              确认驳回
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

export { DeployReviewDetailPage, DeployReviewDetailPageWrapper };
