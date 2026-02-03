'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { MdButton, MdDrawer, MdInput, MdSelect } from '@/components/enterprise-ui';
import type { SelectOption } from '@/components/enterprise-ui';
import { DataClassification } from './types';

interface DataClassificationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingClassification: DataClassification | null;
  businessObjectOptions: SelectOption[];
  dataTypeOptions: SelectOption[];
}

export function DataClassificationDrawer({
  open,
  onClose,
  onSubmit,
  editingClassification,
  businessObjectOptions,
  dataTypeOptions,
}: DataClassificationDrawerProps) {
  const [formData, setFormData] = useState({
    classificationCode: '',
    classificationName: '',
    businessObject: '',
    dataType: '',
    description: '',
    status: '启用' as '启用' | '禁用',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingClassification) {
      setFormData({
        classificationCode: editingClassification.classificationCode || '',
        classificationName: editingClassification.classificationName || '',
        businessObject: editingClassification.businessObject || '',
        dataType: editingClassification.dataType || '',
        description: editingClassification.description || '',
        status: editingClassification.status || '启用',
      });
    } else {
      setFormData({
        classificationCode: '',
        classificationName: '',
        businessObject: '',
        dataType: '',
        description: '',
        status: '启用',
      });
    }
    setErrors({});
  }, [editingClassification, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.classificationCode.trim()) {
      newErrors.classificationCode = '请输入分类编码';
    }

    if (!formData.classificationName.trim()) {
      newErrors.classificationName = '请输入分类名称';
    }

    if (!formData.businessObject) {
      newErrors.businessObject = '请选择业务对象';
    }

    if (!formData.dataType) {
      newErrors.dataType = '请选择数据类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    // 这里应该调用API保存数据
    onSubmit();
  };

  return (
    <MdDrawer
      open={open}
      onClose={onClose}
      title={editingClassification ? '编辑数据分类' : '新增数据分类'}
      width={600}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 分类编码 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              分类编码 <span className="text-destructive">*</span>
            </label>
            <MdInput
              value={formData.classificationCode}
              onChange={(e) => setFormData(prev => ({ ...prev, classificationCode: e.target.value }))}
              placeholder="请输入分类编码"
              error={!!errors.classificationCode}
              disabled={!!editingClassification}
            />
            {errors.classificationCode && (
              <p className="mt-1 text-sm text-destructive">{errors.classificationCode}</p>
            )}
          </div>

          {/* 分类名称 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              分类名称 <span className="text-destructive">*</span>
            </label>
            <MdInput
              value={formData.classificationName}
              onChange={(e) => setFormData(prev => ({ ...prev, classificationName: e.target.value }))}
              placeholder="请输入分类名称"
              error={!!errors.classificationName}
            />
            {errors.classificationName && (
              <p className="mt-1 text-sm text-destructive">{errors.classificationName}</p>
            )}
          </div>

          {/* 业务对象 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              业务对象 <span className="text-destructive">*</span>
            </label>
            <MdSelect
              value={formData.businessObject}
              onChange={(value) => setFormData(prev => ({ ...prev, businessObject: value }))}
              options={businessObjectOptions}
              placeholder="请选择业务对象"
              error={!!errors.businessObject}
            />
            {errors.businessObject && (
              <p className="mt-1 text-sm text-destructive">{errors.businessObject}</p>
            )}
          </div>

          {/* 数据类型 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              数据类型 <span className="text-destructive">*</span>
            </label>
            <MdSelect
              value={formData.dataType}
              onChange={(value) => setFormData(prev => ({ ...prev, dataType: value }))}
              options={dataTypeOptions}
              placeholder="请选择数据类型"
              error={!!errors.dataType}
            />
            {errors.dataType && (
              <p className="mt-1 text-sm text-destructive">{errors.dataType}</p>
            )}
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium mb-2">状态</label>
            <MdSelect
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as '启用' | '禁用' }))}
              options={[
                { value: '启用', label: '启用' },
                { value: '禁用', label: '禁用' },
              ]}
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入描述信息"
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="border-t p-4 flex justify-end gap-2">
          <MdButton variant="outline" onClick={onClose}>
            取消
          </MdButton>
          <MdButton onClick={handleSubmit}>
            {editingClassification ? '更新' : '创建'}
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
}
