'use client';

import React from 'react';
import { BarChart3, FileText, Tag, TrendingUp, Database } from 'lucide-react';
import { MdCard, MdBadge } from '@/components/enterprise-ui';
import { ClassificationStatistics } from './types';

interface ClassificationStatisticsPanelProps {
  statistics: ClassificationStatistics | null;
}

export function ClassificationStatisticsPanel({ statistics }: ClassificationStatisticsPanelProps) {
  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总分类数</p>
              <p className="text-2xl font-bold">{statistics.totalCount}</p>
            </div>
          </div>
        </MdCard>

        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">启用数量</p>
              <p className="text-2xl font-bold text-green-600">{statistics.enabledCount}</p>
            </div>
          </div>
        </MdCard>

        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">禁用数量</p>
              <p className="text-2xl font-bold text-gray-600">{statistics.disabledCount}</p>
            </div>
          </div>
        </MdCard>

        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">关联字段数</p>
              <p className="text-2xl font-bold text-purple-600">{statistics.fieldCount}</p>
            </div>
          </div>
        </MdCard>

        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">业务对象数</p>
              <p className="text-2xl font-bold text-orange-600">{statistics.businessObjectCount}</p>
            </div>
          </div>
        </MdCard>
      </div>

      {/* 按数据类型统计 */}
      <MdCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          按数据类型统计
        </h3>
        <div className="space-y-3">
          {Object.entries(statistics.byDataType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdBadge variant="outline">{type}</MdBadge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / statistics.totalCount) * 100}%` }}
                  />
                </div>
                <span className="font-medium w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </MdCard>

      {/* 按业务对象统计 */}
      <MdCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          按业务对象统计
        </h3>
        <div className="space-y-3">
          {Object.entries(statistics.byBusinessObject).map(([object, count]) => (
            <div key={object} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdBadge variant="info">{object}</MdBadge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(count / statistics.totalCount) * 100}%` }}
                  />
                </div>
                <span className="font-medium w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </MdCard>
    </div>
  );
}
