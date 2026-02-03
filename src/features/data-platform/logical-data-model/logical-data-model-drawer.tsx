'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, X } from 'lucide-react';
import { MdButton, MdInput, MdSelect, MdDrawer, MdTable } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LogicalDataModel, ModelField, ModelType } from './types';

interface LogicalDataModelDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingModel: LogicalDataModel | null;
  modelType: ModelType;
  businessDomainOptions: Array<{ value: string; label: string }>;
  dataSourceOptions: Array<{ value: string; label: string }>;
  lifecycleStatusOptions: Array<{ value: string; label: string }>;
  accessPermissionsOptions: Array<{ value: string; label: string }>;
}

export function LogicalDataModelDrawer({
  open,
  onClose,
  onSubmit,
  editingModel,
  modelType,
  businessDomainOptions,
  dataSourceOptions,
  lifecycleStatusOptions,
  accessPermissionsOptions,
}: LogicalDataModelDrawerProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'fields'>('basic');
  
  // 基本信息表单数据
  const [formData, setFormData] = useState({
    entity: '',
    entityCode: '',
    businessDomain: '',
    dataSource: '',
    businessEntity: '',
    versionInfo: '',
    businessDefinition: '',
    businessRules: '',
    responsibleDepartment: '',
    lifecycleStatus: '',
    accessPermissions: '',
  });

  // 字段列表
  const [fields, setFields] = useState<ModelField[]>([]);

  // 字段类型选项
  const fieldTypeOptions = [
    { value: 'STRING', label: '字符串' },
    { value: 'INTEGER', label: '整数' },
    { value: 'DOUBLE', label: '浮点数' },
    { value: 'DATE', label: '日期' },
    { value: 'DATETIME', label: '日期时间' },
    { value: 'BOOLEAN', label: '布尔值' },
    { value: 'TEXT', label: '文本' },
    { value: 'DECIMAL', label: '小数' },
  ];

  // 初始化表单数据
  useEffect(() => {
    if (editingModel) {
      setFormData({
        entity: editingModel.entity || '',
        entityCode: editingModel.entityCode || '',
        businessDomain: editingModel.businessDomain || '',
        dataSource: editingModel.dataSource || '',
        businessEntity: editingModel.businessEntity || '',
        versionInfo: editingModel.versionInfo || '',
        businessDefinition: editingModel.businessDefinition || '',
        businessRules: editingModel.businessRules || '',
        responsibleDepartment: editingModel.responsibleDepartment || '',
        lifecycleStatus: editingModel.lifecycleStatus || '',
        accessPermissions: editingModel.accessPermissions || '',
      });
      
      // 模拟加载字段数据
      // 实际应该从API获取
      setFields([
        { id: '1', fieldName: '字段1', fieldCode: 'field1', fieldType: 'STRING' },
        { id: '2', fieldName: '字段2', fieldCode: 'field2', fieldType: 'INTEGER' },
      ]);
    } else {
      setFormData({
        entity: '',
        entityCode: '',
        businessDomain: '',
        dataSource: '',
        businessEntity: '',
        versionInfo: '',
        businessDefinition: '',
        businessRules: '',
        responsibleDepartment: '',
        lifecycleStatus: '',
        accessPermissions: '',
      });
      setFields([]);
    }
  }, [editingModel, open]);

  // 添加字段
  const handleAddField = () => {
    const newField: ModelField = {
      id: `field_${Date.now()}`,
      fieldName: '',
      fieldCode: '',
      fieldType: 'STRING',
    };
    setFields([...fields, newField]);
  };

  // 删除字段
  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  // 更新字段
  const handleFieldChange = (id: string, key: keyof ModelField, value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  // 验证表单
  const validateForm = (): boolean => {
    if (!formData.entity) {
      toast.error('请输入实体/表名');
      return false;
    }
    if (!formData.entityCode) {
      toast.error('请输入实体编码');
      return false;
    }
    if (!formData.businessDomain) {
      toast.error('请选择业务域');
      return false;
    }
    if (!formData.dataSource) {
      toast.error('请选择数据来源');
      return false;
    }
    if (!formData.businessEntity) {
      toast.error('请输入业务实体');
      return false;
    }
    if (!formData.versionInfo) {
      toast.error('请输入版本信息');
      return false;
    }
    if (!formData.businessDefinition) {
      toast.error('请输入业务定义');
      return false;
    }
    if (!formData.businessRules) {
      toast.error('请输入业务规则');
      return false;
    }
    if (!formData.responsibleDepartment) {
      toast.error('请输入责任部门');
      return false;
    }
    if (!formData.lifecycleStatus) {
      toast.error('请选择状态');
      return false;
    }
    if (!formData.accessPermissions) {
      toast.error('请选择访问权限');
      return false;
    }

    // 验证字段
    for (const field of fields) {
      if (!field.fieldName) {
        toast.error('请填写所有字段的中文名称');
        return false;
      }
      if (!field.fieldCode) {
        toast.error('请填写所有字段的字段标识');
        return false;
      }
      if (!field.fieldType) {
        toast.error('请选择所有字段的字段类型');
        return false;
      }
    }

    // 验证字段标识唯一性
    const fieldCodes = fields.map(f => f.fieldCode).filter(code => code);
    if (new Set(fieldCodes).size !== fieldCodes.length) {
      toast.error('字段标识不能重复');
      return false;
    }

    return true;
  };

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // 这里应该调用API保存数据
    // 模拟API调用
    toast.success(editingModel ? '逻辑数据模型更新成功' : '逻辑数据模型创建成功');
    onSubmit();
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
      render: (_: unknown, row: ModelField) => (
        <MdInput
          value={row.fieldName}
          onChange={(e) => handleFieldChange(row.id, 'fieldName', e.target.value)}
          placeholder="请输入字段中文名称"
          className="w-full"
        />
      ),
    },
    {
      key: 'fieldCode',
      title: '字段标识',
      align: 'center',
      render: (_: unknown, row: ModelField) => (
        <MdInput
          value={row.fieldCode}
          onChange={(e) => handleFieldChange(row.id, 'fieldCode', e.target.value)}
          placeholder="请输入字段标识"
          className="w-full"
        />
      ),
    },
    {
      key: 'fieldType',
      title: '字段类型',
      align: 'center',
      width: 150,
      render: (_: unknown, row: ModelField) => (
        <MdSelect
          value={row.fieldType}
          onChange={(value) => handleFieldChange(row.id, 'fieldType', value)}
          options={fieldTypeOptions}
          placeholder="请选择字段类型"
          className="w-full"
        />
      ),
    },
    {
      key: 'actions',
      title: '操作',
      width: 100,
      align: 'center',
      render: (_: unknown, row: ModelField) => (
        <MdButton
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteField(row.id)}
          leftIcon={<Trash2 className="h-3 w-3" />}
        >
          删除
        </MdButton>
      ),
    },
  ];

  return (
    <MdDrawer
      open={open}
      onClose={onClose}
      width="800px"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {editingModel ? '编辑逻辑数据模型' : `新建${modelType === 'dimension' ? '维度表' : '明细表'}`}
          </h2>
          <MdButton 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            leftIcon={<X className="h-4 w-4" />}
          >
            关闭
          </MdButton>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'fields')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="fields">
              字段信息 ({fields.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="flex-1 overflow-y-auto mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  实体/表名 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.entity}
                  onChange={(e) => setFormData({...formData, entity: e.target.value})}
                  placeholder="请输入实体/表名"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  实体编码 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.entityCode}
                  onChange={(e) => setFormData({...formData, entityCode: e.target.value})}
                  placeholder="请输入实体编码"
                  className="w-full"
                  disabled={!!editingModel}
                />
                {editingModel && (
                  <p className="text-xs text-muted-foreground mt-1">
                    实体编码创建后不可修改
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    业务域 <span className="text-red-500">*</span>
                  </label>
                  <MdSelect
                    value={formData.businessDomain}
                    onChange={(value) => setFormData({...formData, businessDomain: value})}
                    options={businessDomainOptions}
                    placeholder="请选择业务域"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    数据来源 <span className="text-red-500">*</span>
                  </label>
                  <MdSelect
                    value={formData.dataSource}
                    onChange={(value) => setFormData({...formData, dataSource: value})}
                    options={dataSourceOptions}
                    placeholder="请选择数据来源"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  业务实体 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.businessEntity}
                  onChange={(e) => setFormData({...formData, businessEntity: e.target.value})}
                  placeholder="请输入业务实体"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  版本信息 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.versionInfo}
                  onChange={(e) => setFormData({...formData, versionInfo: e.target.value})}
                  placeholder="请输入版本信息，如：v1.0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  业务定义 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.businessDefinition}
                  onChange={(e) => setFormData({...formData, businessDefinition: e.target.value})}
                  placeholder="请输入业务定义"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  业务规则 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.businessRules}
                  onChange={(e) => setFormData({...formData, businessRules: e.target.value})}
                  placeholder="请输入业务规则"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  责任部门 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.responsibleDepartment}
                  onChange={(e) => setFormData({...formData, responsibleDepartment: e.target.value})}
                  placeholder="请输入责任部门"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    状态 <span className="text-red-500">*</span>
                  </label>
                  <MdSelect
                    value={formData.lifecycleStatus}
                    onChange={(value) => setFormData({...formData, lifecycleStatus: value})}
                    options={lifecycleStatusOptions}
                    placeholder="请选择状态"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    访问权限 <span className="text-red-500">*</span>
                  </label>
                  <MdSelect
                    value={formData.accessPermissions}
                    onChange={(value) => setFormData({...formData, accessPermissions: value})}
                    options={accessPermissionsOptions}
                    placeholder="请选择访问权限"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="flex-1 flex flex-col mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                当前字段数量: {fields.length}
              </div>
              <MdButton
                onClick={handleAddField}
                leftIcon={<Plus className="h-4 w-4" />}
                size="sm"
              >
                添加字段
              </MdButton>
            </div>
            <div className="flex-1 overflow-auto">
              <MdTable<ModelField>
                columns={fieldColumns}
                data={fields}
                className="w-full"
              />
              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {`暂无字段，请点击"添加字段"按钮添加`}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <MdButton 
            variant="outline" 
            onClick={onClose}
          >
            取消
          </MdButton>
          <MdButton 
            onClick={handleSubmit}
          >
            保存
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
}
