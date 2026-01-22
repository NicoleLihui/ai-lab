'use client';
import { MetadataListPage } from '../metadata-list';
import { DataDictionaryPage } from '../data-dictionary';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import Link from 'next/link';
import { ArrowRight, Database, BookOpen, GitBranch } from 'lucide-react';

export function MetadataManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">元数据管理</h1>
        <p className="text-muted-foreground mt-2">
          统一管理企业数据资产，提供数据发现、血缘追踪和字典映射等功能
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 数据列表卡片 */}
        <Link href="/categories/data-platform/metadata/metadata-list">
          <MdCard className="hover:shadow-lg transition-shadow cursor-pointer">
            <MdCardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <MdCardTitle className="text-lg">数据列表</MdCardTitle>
                  <MdCardDescription className="text-xs">
                    自动采集表结构，管理数据资产
                  </MdCardDescription>
                </div>
              </div>
            </MdCardHeader>
            <MdCardContent>
              <p className="text-sm text-muted-foreground mb-4">
                展示所有数据表信息，支持自动同步和血缘解析
              </p>
              <MdButton variant="outline" size="sm" className="w-full">
                进入管理
                <ArrowRight className="ml-2 h-4 w-4" />
              </MdButton>
            </MdCardContent>
          </MdCard>
        </Link>

        {/* 数据字典卡片 */}
        <Link href="/categories/data-platform/metadata/data-dictionary">
          <MdCard className="hover:shadow-lg transition-shadow cursor-pointer">
            <MdCardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <MdCardTitle className="text-lg">数据字典</MdCardTitle>
                  <MdCardDescription className="text-xs">
                    映射技术字段与业务含义
                  </MdCardDescription>
                </div>
              </div>
            </MdCardHeader>
            <MdCardContent>
              <p className="text-sm text-muted-foreground mb-4">
                定义数据字段的业务含义，建立技术字段与业务术语的映射关系
              </p>
              <MdButton variant="outline" size="sm" className="w-full">
                进入管理
                <ArrowRight className="ml-2 h-4 w-4" />
              </MdButton>
            </MdCardContent>
          </MdCard>
        </Link>

        {/* 血缘解析卡片 */}
        <Link href="/categories/data-platform/metadata/metadata-list?tab=lineage">
          <MdCard className="hover:shadow-lg transition-shadow cursor-pointer">
            <MdCardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <GitBranch className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <MdCardTitle className="text-lg">血缘解析</MdCardTitle>
                  <MdCardDescription className="text-xs">
                    追踪数据流向与依赖关系
                  </MdCardDescription>
                </div>
              </div>
            </MdCardHeader>
            <MdCardContent>
              <p className="text-sm text-muted-foreground mb-4">
                可视化展示数据表之间的上下游关系和依赖链路
              </p>
              <MdButton variant="outline" size="sm" className="w-full">
                进入管理
                <ArrowRight className="ml-2 h-4 w-4" />
              </MdButton>
            </MdCardContent>
          </MdCard>
        </Link>
      </div>
    </div>
  );
}