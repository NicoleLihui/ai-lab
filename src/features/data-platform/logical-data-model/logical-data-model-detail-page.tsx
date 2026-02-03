'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit,
  Database,
  FileText,
  Table2,
  Building2,
  Tag,
  Shield,
  Clock,
  User,
} from 'lucide-react';
import { MdButton, MdCard, MdTable, MdBadge } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { LogicalDataModel, ModelField } from './types';
import { LogicalDataModelDrawer } from './logical-data-model-drawer';

export function LogicalDataModelDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<LogicalDataModel | null>(null);
  const [fields, setFields] = useState<ModelField[]>([]);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  // 业务域选项
  const businessDomainOptions = [
    { value: '水量', label: '水量' },
    { value: '电量', label: '电量' },
    { value: '污泥', label: '污泥' },
    { value: '药剂', label: '药剂' },
    { value: '水质', label: '水质' },
    { value: '设备', label: '设备' },
    { value: '设施', label: '设施' },
    { value: '工单', label: '工单' },
    { value: '经营', label: '经营' },
  ];

  // 数据来源选项
  const dataSourceOptions = [
    { value: '数采', label: '数采' },
    { value: '基础数据', label: '基础数据' },
    { value: '工单数据', label: '工单数据' },
    { value: '台账数据', label: '台账数据' },
    { value: '填报数据', label: '填报数据' },
  ];

  // 状态选项
  const lifecycleStatusOptions = [
    { value: '已上线', label: '已上线' },
    { value: '测试中', label: '测试中' },
    { value: '设计', label: '设计' },
    { value: '归档', label: '归档' },
    { value: '失效', label: '失效' },
  ];

  // 访问权限选项
  const accessPermissionsOptions = [
    { value: '受权限控制', label: '受权限控制' },
    { value: '公开访问', label: '公开访问' },
  ];

  // 加载数据
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockModel: LogicalDataModel = {
        id: id,
        entity: '水厂维度表',
        entityCode: 'DIM_PLANT',
        fieldCount: 45,
        businessDomain: '设施',
        dataSource: '基础数据',
        businessEntity: '水厂',
        versionInfo: 'v1.0',
        businessDefinition: '整合水厂所有基础信息的大宽表，包含水厂基本信息、设施信息、设备信息等',
        businessRules: '数据来源于基础数据系统，每日更新',
        responsibleDepartment: '数据治理部',
        lifecycleStatus: '已上线',
        accessPermissions: '受权限控制',
        modelType: 'dimension',
        creator: '张三',
        createTime: '2024-01-15 14:20:00',
        updateTime: '2024-01-20 10:30:00',
      };

      const mockFields: ModelField[] = [
        { id: '1', fieldName: '水厂编码', fieldCode: 'plant_code', fieldType: 'STRING' },
        { id: '2', fieldName: '水厂名称', fieldCode: 'plant_name', fieldType: 'STRING' },
        { id: '3', fieldName: '水厂类型', fieldCode: 'plant_type', fieldType: 'STRING' },
        { id: '4', fieldName: '建设日期', fieldCode: 'build_date', fieldType: 'DATE' },
        { id: '5', fieldName: '设计处理能力', fieldCode: 'design_capacity', fieldType: 'DOUBLE' },
        { id: '6', fieldName: '实际处理能力', fieldCode: 'actual_capacity', fieldType: 'DOUBLE' },
        { id: '7', fieldName: '设施数量', fieldCode: 'facility_count', fieldType: 'INTEGER' },
        { id: '8', fieldName: '设备数量', fieldCode: 'equipment_count', fieldType: 'INTEGER' },
      ];

      setModel(mockModel);
      setFields(mockFields);
      setLoading(false);
    }, 800);
  }, [id]);

  // 返回列表
  const handleBackToList = () => {
    router.push('/categories/data-platform/data-catalog/logical-model');
  };

  // 编辑
  const handleEdit = () => {
    setShowEditDrawer(true);
  };

  const handleEditSubmit = () => {
    setShowEditDrawer(false);
    // 重新加载数据
    if (id) {
      // 这里应该重新调用API获取最新数据
      toast.success('逻辑数据模型更新成功');
    }
  };

  // 字段表格列定义
  const fieldColumns: Column<ModelField>[] = [
    {
      key: 'index',
      title: '序号',
      width: 80,
      align: 'center',
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      key: 'fieldName',
      title: '字段中文名称',
      align: 'center',
    },
    {
      key: 'fieldCode',
      title: '字段标识',
      align: 'center',
    },
    {
      key: 'fieldType',
      title: '字段类型',
      align: 'center',
      render: (value: unknown) => {
        const typeMap: Record<string, string> = {
          'STRING': '字符串',
          'INTEGER': '整数',
          'DOUBLE': '浮点数',
          'DATE': '日期',
          'DATETIME': '日期时间',
          'BOOLEAN': '布尔值',
          'TEXT': '文本',
          'DECIMAL': '小数',
        };
        return <MdBadge variant="outline">{typeMap[String(value)] || String(value)}</MdBadge>;
      },
    },
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

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Database className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">未找到逻辑数据模型</h2>
        <p className="mt-2 text-muted-foreground">找不到指定的逻辑数据模型信息</p>
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
          <div className="flex items-center gap-2">
            {model.modelType === 'dimension' ? (
              <Table2 className="h-6 w-6 text-blue-600" />
            ) : (
              <FileText className="h-6 w-6 text-green-600" />
            )}
            <h1 className="text-2xl font-bold">{model.entity}</h1>
            <MdBadge variant={model.modelType === 'dimension' ? 'info' : 'success'}>
              {model.modelType === 'dimension' ? '维度表' : '明细表'}
            </MdBadge>
          </div>
        </div>
        <MdButton 
          onClick={handleEdit}
          leftIcon={<Edit className="h-4 w-4" />}
        >
          编辑
        </MdButton>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">实体编码</p>
              <p className="font-semibold">{model.entityCode}</p>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">字段数量</p>
              <p className="font-semibold">{model.fieldCount}</p>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">版本信息</p>
              <p className="font-semibold">{model.versionInfo}</p>
            </div>
          </div>
        </MdCard>
        <MdCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">状态</p>
              <MdBadge 
                variant={
                  model.lifecycleStatus === '已上线' ? 'success' : 
                  model.lifecycleStatus === '测试中' ? 'warning' : 
                  model.lifecycleStatus === '设计' ? 'info' : 
                  model.lifecycleStatus === '归档' ? 'secondary' : 
                  'danger'
                }
              >
                {model.lifecycleStatus}
              </MdBadge>
            </div>
          </div>
        </MdCard>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本信息 */}
        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">基本信息</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">业务域</p>
                <p className="font-medium">{model.businessDomain}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">数据来源</p>
                <p className="font-medium">{model.dataSource}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">业务实体</p>
              <p className="font-medium">{model.businessEntity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">业务定义</p>
              <p className="font-medium">{model.businessDefinition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">业务规则</p>
              <p className="font-medium">{model.businessRules}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">责任部门</p>
              <p className="font-medium">{model.responsibleDepartment}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">访问权限</p>
              <MdBadge variant={model.accessPermissions === '公开访问' ? 'success' : 'warning'}>
                {model.accessPermissions}
              </MdBadge>
            </div>
          </div>
        </MdCard>

        {/* 元数据信息 */}
        <MdCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">元数据信息</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">创建人</p>
                <p className="font-medium">{model.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium">{model.createTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">更新时间</p>
                <p className="font-medium">{model.updateTime}</p>
              </div>
            </div>
          </div>
        </MdCard>
      </div>

      {/* 字段列表 */}
      <MdCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">字段信息</h3>
          <MdBadge variant="info">共 {fields.length} 个字段</MdBadge>
        </div>
        <MdTable<ModelField>
          columns={fieldColumns}
          data={fields}
          className="w-full"
        />
      </MdCard>

      {/* 编辑抽屉 */}
      {model && (
        <LogicalDataModelDrawer
          open={showEditDrawer}
          onClose={() => setShowEditDrawer(false)}
          onSubmit={handleEditSubmit}
          editingModel={model}
          modelType={model.modelType}
          businessDomainOptions={businessDomainOptions}
          dataSourceOptions={dataSourceOptions}
          lifecycleStatusOptions={lifecycleStatusOptions}
          accessPermissionsOptions={accessPermissionsOptions}
        />
      )}
    </div>
  );
}
