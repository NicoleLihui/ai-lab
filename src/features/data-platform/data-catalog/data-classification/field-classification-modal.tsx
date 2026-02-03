'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Check, Database } from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdSelect, MdCheckbox, MdDrawer } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { DataClassification } from './types';
import { LogicalDataModel, ModelField } from '../../logical-data-model/types';

interface FieldClassificationModalProps {
  open: boolean;
  onClose: () => void;
  classification: DataClassification;
  onSuccess: () => void;
}

export function FieldClassificationModal({
  open,
  onClose,
  classification,
  onSuccess,
}: FieldClassificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [logicalModels, setLogicalModels] = useState<LogicalDataModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [fields, setFields] = useState<ModelField[]>([]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // 加载逻辑数据模型列表
  useEffect(() => {
    if (open) {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        const mockModels: LogicalDataModel[] = [
          {
            id: '1',
            entity: '水厂维度表',
            entityCode: 'DIM_PLANT',
            fieldCount: 45,
            businessDomain: '设施',
            dataSource: '基础数据',
            businessEntity: '水厂',
            versionInfo: 'v1.0',
            businessDefinition: '整合水厂所有基础信息',
            businessRules: '数据来源于基础数据系统',
            responsibleDepartment: '数据治理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'dimension',
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            entity: '设备运行明细表',
            entityCode: 'FACT_EQUIPMENT',
            fieldCount: 32,
            businessDomain: '设备',
            dataSource: '数采',
            businessEntity: '设备',
            versionInfo: 'v1.0',
            businessDefinition: '设备运行数据明细',
            businessRules: '实时采集',
            responsibleDepartment: '设备管理部',
            lifecycleStatus: '已上线',
            accessPermissions: '受权限控制',
            modelType: 'detail',
            creator: '李四',
            createTime: '2024-01-16 09:15:00',
            updateTime: '2024-01-18 16:45:00',
          },
        ];
        setLogicalModels(mockModels);
        setLoading(false);
      }, 300);
    }
  }, [open]);

  // 加载字段列表
  useEffect(() => {
    if (selectedModelId) {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
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
        setFields(mockFields);
        setLoading(false);
      }, 300);
    } else {
      setFields([]);
      setSelectedFields(new Set());
    }
  }, [selectedModelId]);

  // 过滤字段
  const filteredFields = fields.filter(field =>
    field.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.fieldCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 切换字段选择
  const toggleField = (fieldId: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  // 全选/取消全选
  const toggleAll = () => {
    if (selectedFields.size === filteredFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(filteredFields.map(f => f.id)));
    }
  };

  // 提交
  const handleSubmit = () => {
    if (selectedFields.size === 0) {
      alert('请至少选择一个字段');
      return;
    }

    // 模拟API调用
    setTimeout(() => {
      onSuccess();
    }, 300);
  };

  const columns: Column<ModelField>[] = [
    {
      key: 'checkbox',
      title: (
        <MdCheckbox
          checked={filteredFields.length > 0 && selectedFields.size === filteredFields.length}
          indeterminate={selectedFields.size > 0 && selectedFields.size < filteredFields.length}
          onChange={() => toggleAll()}
        />
      ),
      width: 60,
      align: 'center',
      render: (_: unknown, record: ModelField) => (
        <MdCheckbox
          checked={selectedFields.has(record.id)}
          onChange={() => toggleField(record.id)}
        />
      ),
    },
    {
      key: 'fieldName',
      title: '字段名称',
      align: 'center',
    },
    {
      key: 'fieldCode',
      title: '字段编码',
      align: 'center',
    },
    {
      key: 'fieldType',
      title: '字段类型',
      align: 'center',
      render: (value: unknown) => (
        <MdBadge variant="outline">{String(value)}</MdBadge>
      ),
    },
  ];

  return (
    <MdDrawer
      open={open}
      onClose={onClose}
      title={`字段分类 - ${classification.classificationName}`}
      width={900}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* 选择逻辑数据模型 */}
        <div>
          <label className="block text-sm font-medium mb-2">选择逻辑数据模型</label>
          <MdSelect
            value={selectedModelId}
            onChange={setSelectedModelId}
            options={logicalModels.map(model => ({
              value: model.id,
              label: `${model.entity} (${model.entityCode})`,
            }))}
            placeholder="请选择逻辑数据模型"
          />
        </div>

        {/* 字段搜索 */}
        {selectedModelId && (
          <div>
            <MdInput
              placeholder="搜索字段名称或编码"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        )}

        {/* 字段列表 */}
        {selectedModelId && (
          <div className="border rounded-lg">
            <MdTable<ModelField>
              columns={columns}
              data={filteredFields}
              loading={loading}
              rowKey="id"
            />
          </div>
        )}

        {/* 提示信息 */}
        {!selectedModelId && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mb-4" />
            <p>请先选择逻辑数据模型</p>
          </div>
        )}

        {/* 选中数量提示 */}
        {selectedModelId && (
          <div className="text-sm text-muted-foreground">
            已选择 {selectedFields.size} 个字段
          </div>
        )}
        </div>

        {/* 底部操作按钮 */}
        <div className="border-t p-4 flex justify-end gap-2">
          <MdButton variant="outline" onClick={onClose}>
            取消
          </MdButton>
          <MdButton onClick={handleSubmit} disabled={selectedFields.size === 0}>
            确定 ({selectedFields.size})
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
}
