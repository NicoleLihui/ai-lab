'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Edit, FileText, Tag, CheckCircle, XCircle } from 'lucide-react';
import type { DataClassification } from './types';

export function DataClassificationDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [detail, setDetail] = useState<DataClassification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    // TODO: 调用实际 API 获取详情
    setTimeout(() => {
      const mockData: DataClassification = {
        id,
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
      };
      setDetail(mockData);
      setIsLoading(false);
    }, 400);
  }, [id, router]);

  const handleBack = () => {
    router.push('/categories/data-platform/data-catalog/classification');
  };

  const handleEdit = () => {
    router.push('/categories/data-platform/data-catalog/classification');
  };

  const handleFieldClassification = () => {
    router.push('/categories/data-platform/data-catalog/classification');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">分类记录不存在</div>
      </div>
    );
  }

  const isEnabled = detail.status === '启用';
  const StatusIcon = isEnabled ? CheckCircle : XCircle;

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader className="border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdButton
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleBack}
            >
              返回
            </MdButton>
            <MdCardTitle>数据分类详情</MdCardTitle>
          </div>
          <div className="flex items-center gap-2">
            <MdButton
              variant="outline"
              leftIcon={<Tag className="h-4 w-4" />}
              onClick={handleFieldClassification}
            >
              字段分类
            </MdButton>
            <MdButton
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={handleEdit}
            >
              编辑
            </MdButton>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-6">
          <div className="space-y-6">
            {/* 状态卡片 */}
            <div
              className={`p-4 rounded-lg border border-border ${
                isEnabled ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon
                  className="h-6 w-6"
                  style={{ color: isEnabled ? '#19be6b' : '#909399' }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">状态</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: isEnabled ? '#19be6b' : '#909399' }}
                  >
                    {detail.status}
                  </div>
                </div>
                <MdBadge
                  variant={isEnabled ? 'success' : 'secondary'}
                  className="ml-auto text-base px-4 py-2"
                >
                  {detail.status}
                </MdBadge>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                基本信息
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">分类编码</label>
                  <div className="mt-1 text-sm font-medium text-foreground font-mono">
                    {detail.classificationCode}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">分类名称</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {detail.classificationName}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">业务对象</label>
                  <div className="mt-1">
                    <MdBadge variant="info">{detail.businessObject}</MdBadge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">数据类型</label>
                  <div className="mt-1">
                    <MdBadge variant="outline">{detail.dataType}</MdBadge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">关联字段数</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {detail.fieldCount ?? 0}
                  </div>
                </div>
                {detail.description && (
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">描述</label>
                    <div className="mt-1 text-sm text-foreground">{detail.description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 其他信息 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                其他信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">创建人</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {detail.creator}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">创建时间</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {detail.createTime}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">更新时间</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {detail.updateTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
}
