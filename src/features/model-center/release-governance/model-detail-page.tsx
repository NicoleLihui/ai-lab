'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent, MdCardDescription } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Check, X, Eye, User, Calendar, Database, FileText, BarChart3, Package, Tag } from 'lucide-react';

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
}

interface ModelDetailPageProps {
  model: ModelReleaseReview;
  onApprove: (model: ModelReleaseReview) => void;
  onReject: (model: ModelReleaseReview, reason?: string) => void;
}

const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ model, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    onApprove(model);
  };

  const handleRejectConfirm = () => {
    onReject(model, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{model.modelName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              模型详情 - {model.id}
            </p>
          </div>
          <div className="flex space-x-2">
            <MdButton 
              variant="success" 
              onClick={handleApprove}
              disabled={model.status !== '待审核'}
            >
              <Check className="h-4 w-4 mr-2" />
              通过
            </MdButton>
            <MdButton 
              variant="danger" 
              onClick={() => setShowRejectModal(true)}
              disabled={model.status !== '待审核'}
            >
              <X className="h-4 w-4 mr-2" />
              拒绝
            </MdButton>
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
              <MdButton variant="outline" className="w-full">
                <Tag className="h-4 w-4 mr-2" />
                查看标签
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
    </div>
  </div>
  );
};

export { ModelDetailPage };