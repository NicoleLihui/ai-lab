'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, RotateCcw } from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdCard, MdSelect } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { ClassificationAuditLog } from './types';

export function ClassificationAuditLogPanel() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<ClassificationAuditLog[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    operation: '',
    operator: '',
  });

  // 操作类型选项
  const operationOptions = [
    { value: '创建', label: '创建' },
    { value: '更新', label: '更新' },
    { value: '删除', label: '删除' },
    { value: '启用', label: '启用' },
    { value: '禁用', label: '禁用' },
    { value: '字段关联', label: '字段关联' },
    { value: '字段取消关联', label: '字段取消关联' },
  ];

  // 加载数据
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: ClassificationAuditLog[] = [
        {
          id: '1',
          classificationId: '1',
          classificationName: '基础信息',
          operation: '创建',
          operator: '张三',
          operationTime: '2024-01-15 14:20:00',
          description: '创建数据分类：基础信息',
        },
        {
          id: '2',
          classificationId: '1',
          classificationName: '基础信息',
          operation: '字段关联',
          operator: '李四',
          operationTime: '2024-01-16 09:15:00',
          description: '关联字段：水厂编码、水厂名称等25个字段',
        },
        {
          id: '3',
          classificationId: '2',
          classificationName: '化验工单',
          operation: '创建',
          operator: '王五',
          operationTime: '2024-01-16 10:30:00',
          description: '创建数据分类：化验工单',
        },
        {
          id: '4',
          classificationId: '1',
          classificationName: '基础信息',
          operation: '更新',
          operator: '张三',
          operationTime: '2024-01-20 10:30:00',
          description: '更新分类描述',
          beforeData: { description: '旧描述' },
          afterData: { description: '新描述' },
        },
      ];

      let filteredData = mockData;

      if (filters.operation) {
        filteredData = filteredData.filter(item => item.operation === filters.operation);
      }

      if (filters.operator) {
        filteredData = filteredData.filter(item => 
          item.operator.toLowerCase().includes(filters.operator.toLowerCase())
        );
      }

      setTableData(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
      setLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadData();
  };

  const handleReset = () => {
    setFilters({
      operation: '',
      operator: '',
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns: Column<ClassificationAuditLog>[] = [
    {
      key: 'index',
      title: '序号',
      width: 80,
      align: 'center',
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: 'classificationName',
      title: '分类名称',
      align: 'center',
      width: 150,
    },
    {
      key: 'operation',
      title: '操作类型',
      align: 'center',
      width: 120,
      render: (value: unknown) => {
        const operation = String(value);
        const variantMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'secondary'> = {
          '创建': 'success',
          '更新': 'info',
          '删除': 'danger',
          '启用': 'success',
          '禁用': 'warning',
          '字段关联': 'info',
          '字段取消关联': 'secondary',
        };
        return (
          <MdBadge variant={variantMap[operation] || 'secondary'}>
            {operation}
          </MdBadge>
        );
      },
    },
    {
      key: 'operator',
      title: '操作人',
      align: 'center',
      width: 120,
    },
    {
      key: 'operationTime',
      title: '操作时间',
      align: 'center',
      width: 180,
    },
    {
      key: 'description',
      title: '操作描述',
      align: 'left',
      ellipsis: true,
    },
  ];

  return (
    <MdCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          审计日志
        </h3>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <MdSelect
          placeholder="操作类型"
          value={filters.operation}
          onChange={(value) => setFilters(prev => ({ ...prev, operation: value }))}
          options={operationOptions}
          className="w-[150px]"
        />
        <MdInput
          placeholder="搜索操作人"
          value={filters.operator}
          onChange={(e) => setFilters(prev => ({ ...prev, operator: e.target.value }))}
          className="w-[200px]"
          leftIcon={<Search className="h-4 w-4" />}
        />
        <MdButton
          variant="outline"
          onClick={handleSearch}
          leftIcon={<Search className="h-4 w-4" />}
        >
          搜索
        </MdButton>
        <MdButton
          variant="outline"
          onClick={handleReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          重置
        </MdButton>
      </div>

      {/* 表格 */}
      <MdTable<ClassificationAuditLog>
        columns={columns}
        data={tableData}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) =>
            setPagination((prev) => ({ ...prev, current: page, pageSize })),
        }}
        rowKey="id"
      />
    </MdCard>
  );
}
