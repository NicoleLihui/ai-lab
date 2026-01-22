'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Database, 
  RefreshCw, 
  Link, 
  GitBranch, 
  Eye, 
  FileText, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MdButton, MdCard, MdTable, MdBadge } from '@/components/enterprise-ui';
import { LineageGraphComponent } from '@/features/data-platform/metadata-lineage-graph';

interface MetadataItem {
  id: string;
  tableName: string;
  displayName: string;
  description: string;
  dataSource: string;
  syncStatus: '已同步' | '同步中' | '未同步';
  lastSyncTime: string;
  owner: string;
  creator: string;
  createTime: string;
  updateTime: string;
  lineageStatus: '已解析' | '解析中' | '未解析';
  upstreamCount: number;
  downstreamCount: number;
}

interface FieldInfo {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldLength: string;
  isNullable: boolean;
  defaultValue: string;
  description: string;
  [key: string]: unknown;
}

interface LineageInfo {
  id: string;
  tableName: string;
  displayName: string;
  dataSource: string;
  direction: 'upstream' | 'downstream';
  relationType: string;
  [key: string]: unknown;
}

export function MetadataDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<MetadataItem | null>(null);
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [lineages, setLineages] = useState<LineageInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'lineage' | 'permissions'>('overview');
  const [showLineageGraph, setShowLineageGraph] = useState(false);

  // 模拟加载数据
  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      // 根据ID查找元数据
      const mockMetadata: MetadataItem = {
        id: id || '1',
        tableName: 'customer_info',
        displayName: '客户信息表',
        description: '存储客户基本信息，包括姓名、联系方式、地址等核心信息',
        dataSource: 'MySQL-PROD',
        syncStatus: '已同步',
        lastSyncTime: '2024-01-20 10:30:00',
        owner: '数据分析部',
        creator: '张三',
        createTime: '2023-12-15 14:20:00',
        updateTime: '2024-01-20 10:30:00',
        lineageStatus: '已解析',
        upstreamCount: 3,
        downstreamCount: 5,
      };
      
      // 字段信息模拟数据
      const mockFields: FieldInfo[] = [
        { id: '1', fieldName: 'id', fieldType: 'INT', fieldLength: '11', isNullable: false, defaultValue: '', description: '主键ID' },
        { id: '2', fieldName: 'customer_no', fieldType: 'VARCHAR', fieldLength: '50', isNullable: false, defaultValue: '', description: '客户编号' },
        { id: '3', fieldName: 'name', fieldType: 'VARCHAR', fieldLength: '100', isNullable: false, defaultValue: '', description: '客户姓名' },
        { id: '4', fieldName: 'phone', fieldType: 'VARCHAR', fieldLength: '20', isNullable: true, defaultValue: '', description: '联系电话' },
        { id: '5', fieldName: 'email', fieldType: 'VARCHAR', fieldLength: '100', isNullable: true, defaultValue: '', description: '电子邮箱' },
        { id: '6', fieldName: 'address', fieldType: 'VARCHAR', fieldLength: '500', isNullable: true, defaultValue: '', description: '联系地址' },
        { id: '7', fieldName: 'status', fieldType: 'TINYINT', fieldLength: '1', isNullable: false, defaultValue: '1', description: '客户状态：1-正常，0-注销' },
        { id: '8', fieldName: 'create_time', fieldType: 'DATETIME', fieldLength: '', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: '创建时间' },
        { id: '9', fieldName: 'update_time', fieldType: 'TIMESTAMP', fieldLength: '', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: '更新时间' },
      ];
      
      // 血缘关系模拟数据
      const mockLineages: LineageInfo[] = [
        { id: '1', tableName: 'user_register_log', displayName: '用户注册日志', dataSource: 'MySQL-DEV', direction: 'upstream', relationType: 'JOIN' },
        { id: '2', tableName: 'customer_profile', displayName: '客户档案表', dataSource: 'PostgreSQL-PROD', direction: 'upstream', relationType: 'UNION' },
        { id: '3', tableName: 'customer_behavior', displayName: '客户行为表', dataSource: 'MongoDB-PROD', direction: 'upstream', relationType: 'INSERT' },
        { id: '4', tableName: 'sales_report', displayName: '销售报表', dataSource: 'ClickHouse-PROD', direction: 'downstream', relationType: 'SELECT' },
        { id: '5', tableName: 'customer_analysis', displayName: '客户分析表', dataSource: 'Hive-PROD', direction: 'downstream', relationType: 'SELECT' },
        { id: '6', tableName: 'customer_segmentation', displayName: '客户分群表', dataSource: 'Spark-PROD', direction: 'downstream', relationType: 'INSERT' },
        { id: '7', tableName: 'marketing_target', displayName: '营销目标表', dataSource: 'Oracle-PROD', direction: 'downstream', relationType: 'JOIN' },
        { id: '8', tableName: 'crm_customer_view', displayName: 'CRM客户视图', dataSource: 'Redis-PROD', direction: 'downstream', relationType: 'SELECT' },
      ];
      
      // 血缘图数据
      const upstreamData = mockLineages.filter(l => l.direction === 'upstream');
      const downstreamData = mockLineages.filter(l => l.direction === 'downstream');
      
      // 更新状态
      setMetadata(mockMetadata);
      setFields(mockFields);
      setLineages(mockLineages);
      setLoading(false);
    }, 800);
  }, [id]);

  // 返回列表
  const handleBackToList = () => {
    router.push('/categories/data-platform/metadata/metadata-list');
  };

  // 重新同步
  const handleResync = () => {
    toast.info(`正在重新同步表: ${metadata?.tableName}`);
    setTimeout(() => {
      toast.success(`表 ${metadata?.tableName} 重新同步完成`);
      // 更新状态
      if (metadata) {
        setMetadata({
          ...metadata,
          syncStatus: '已同步',
          lastSyncTime: new Date().toLocaleString()
        });
      }
    }, 1500);
  };

  // 重新解析血缘
  const handleReanalyzeLineage = () => {
    toast.info(`正在重新解析表: ${metadata?.tableName} 的血缘关系`);
    setTimeout(() => {
      toast.success(`表 ${metadata?.tableName} 血缘关系重新解析完成`);
      // 更新状态
      if (metadata) {
        setMetadata({
          ...metadata,
          lineageStatus: '已解析'
        });
      }
    }, 2000);
  };

  // 字段信息表格列
  const fieldColumns = [
    { key: 'index', title: '序号', width: 60, align: 'center' as const, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { key: 'fieldName', title: '字段名', width: 150, align: 'center' as const },
    { key: 'fieldType', title: '类型', width: 100, align: 'center' as const },
    { key: 'fieldLength', title: '长度', width: 80, align: 'center' as const },
    { key: 'isNullable', title: '是否可空', width: 100, align: 'center' as const, render: (value: unknown) => value ? '是' : '否' },
    { key: 'defaultValue', title: '默认值', width: 150, align: 'center' as const },
    { key: 'description', title: '描述', width: 200, align: 'center' as const },
  ];

  // 血缘关系表格列
  const lineageColumns = [
    { key: 'index', title: '序号', width: 60, align: 'center' as const, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { key: 'direction', title: '方向', width: 80, align: 'center' as const, render: (value: unknown) => value === 'upstream' ? '上游' : '下游' },
    { key: 'tableName', title: '表名', width: 150, align: 'center' as const },
    { key: 'displayName', title: '显示名称', width: 150, align: 'center' as const },
    { key: 'dataSource', title: '数据源', width: 150, align: 'center' as const },
    { key: 'relationType', title: '关联类型', width: 100, align: 'center' as const },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">未找到元数据</h2>
        <p className="mt-2 text-muted-foreground">找不到指定的元数据信息</p>
        <MdButton 
          variant="outline" 
          className="mt-4" 
          onClick={handleBackToList}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          返回列表
        </MdButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-6 gap-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MdButton 
            variant="outline" 
            onClick={handleBackToList}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            返回列表
          </MdButton>
          <h1 className="text-2xl font-bold">{metadata.displayName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton 
            variant="outline" 
            onClick={handleResync}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            重新同步
          </MdButton>
          <MdButton 
            variant="outline" 
            onClick={handleReanalyzeLineage}
            leftIcon={<Link className="h-4 w-4" />}
          >
            重新解析血缘
          </MdButton>
        </div>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">表名</p>
              <p className="font-semibold">{metadata.tableName}</p>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Settings className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">同步状态</p>
              <div className="flex items-center gap-2">
                <MdBadge 
                  variant={metadata.syncStatus === '已同步' ? 'success' : metadata.syncStatus === '同步中' ? 'warning' : 'secondary'}
                >
                  {metadata.syncStatus}
                </MdBadge>
                {metadata.syncStatus !== '未同步' && (
                  <span className="text-xs text-muted-foreground">
                    {metadata.lastSyncTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <GitBranch className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">血缘状态</p>
              <div className="flex items-center gap-2">
                <MdBadge 
                  variant={metadata.lineageStatus === '已解析' ? 'success' : metadata.lineageStatus === '解析中' ? 'warning' : 'secondary'}
                >
                  {metadata.lineageStatus}
                </MdBadge>
              </div>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Eye className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">数据源</p>
              <p className="font-semibold">{metadata.dataSource}</p>
            </div>
          </div>
        </MdCard>
      </div>

      {/* 选项卡 */}
      <div className="flex border-b border-border">
        <button
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'overview'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'structure'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('structure')}
        >
          结构信息
        </button>
        <button
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'lineage'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('lineage')}
        >
          血缘关系
        </button>
        <button
          className={`pb-3 px-4 font-medium text-sm ${
            activeTab === 'permissions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('permissions')}
        >
          权限信息
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <MdCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">显示名称</h3>
                  <p>{metadata.displayName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">数据源</h3>
                  <p>{metadata.dataSource}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">描述</h3>
                  <p>{metadata.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">负责人</h3>
                  <p>{metadata.owner}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">创建人</h3>
                  <p>{metadata.creator}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">创建时间</h3>
                  <p>{metadata.createTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">更新时间</h3>
                  <p>{metadata.updateTime}</p>
                </div>
              </div>
            </MdCard>

            {/* 血缘摘要 */}
            <MdCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">血缘关系</h2>
                <MdButton variant="outline" size="sm" leftIcon={<Link className="h-4 w-4" />}>
                  查看完整血缘图
                </MdButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-blue-600 rotate-90" />
                      <h3 className="font-medium">上游数据源 ({metadata.upstreamCount})</h3>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {lineages.filter(l => l.direction === 'upstream').slice(0, 3).map((l, idx) => (
                      <li key={idx}>• {l.tableName} ({l.displayName})</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-green-600 -rotate-90" />
                      <h3 className="font-medium">下游数据源 ({metadata.downstreamCount})</h3>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {lineages.filter(l => l.direction === 'downstream').slice(0, 5).map((l, idx) => (
                      <li key={idx}>• {l.tableName} ({l.displayName})</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <MdButton 
                  variant="outline" 
                  size="sm" 
                  leftIcon={<Link className="h-4 w-4" />}
                  onClick={() => setShowLineageGraph(true)}
                >
                  查看完整血缘图
                </MdButton>
              </div>
            </MdCard>
          </div>
        )}

        {activeTab === 'structure' && (
          <MdCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">表结构</h2>
              <MdButton variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                导出结构
              </MdButton>
            </div>
            <MdTable<FieldInfo>
              columns={fieldColumns}
              data={fields}
              rowKey="id"
              className="h-full"
            />
          </MdCard>
        )}

        {activeTab === 'lineage' && (
          <MdCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">血缘关系</h2>
              <MdButton variant="outline" size="sm" leftIcon={<GitBranch className="h-4 w-4" />}>
                查看血缘图
              </MdButton>
            </div>
            <MdTable<LineageInfo>
              columns={lineageColumns}
              data={lineages}
              rowKey="id"
              className="h-full"
            />
          </MdCard>
        )}

        {activeTab === 'permissions' && (
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">权限信息</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">访问权限</h3>
                <div className="flex flex-wrap gap-2">
                  <MdBadge variant="outline">数据分析部-只读</MdBadge>
                  <MdBadge variant="outline">市场部-只读</MdBadge>
                  <MdBadge variant="outline">管理层-只读</MdBadge>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">修改权限</h3>
                <div className="flex flex-wrap gap-2">
                  <MdBadge variant="outline">数据工程部-读写</MdBadge>
                  <MdBadge variant="outline">管理员-完全控制</MdBadge>
                </div>
              </div>
            </div>
          </MdCard>
        )}
      </div>
      
      {/* 血缘图抽屉 */}
      <LineageGraphComponent
        isOpen={showLineageGraph}
        onClose={() => setShowLineageGraph(false)}
        targetTable={{
          id: metadata?.id || '',
          tableName: metadata?.tableName || '',
          displayName: metadata?.displayName || '',
          dataSource: metadata?.dataSource || '',
        }}
        lineageData={{
          upstream: lineages.filter(l => l.direction === 'upstream').map(l => ({
            id: l.id,
            tableName: l.tableName,
            displayName: l.displayName,
            dataSource: l.dataSource,
            type: 'upstream' as const,
          })),
          downstream: lineages.filter(l => l.direction === 'downstream').map(l => ({
            id: l.id,
            tableName: l.tableName,
            displayName: l.displayName,
            dataSource: l.dataSource,
            type: 'downstream' as const,
          }))
        }}
      />
    </div>
  );
}