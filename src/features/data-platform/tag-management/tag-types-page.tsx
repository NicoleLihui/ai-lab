'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Edit, 
  Trash2, 
  Tag,
  Filter,
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdDrawer, MdSelect } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';

interface TagType {
  id: string;
  typeCode: string;
  typeName: string;
  description: string;
  status: '启用' | '禁用';
  tagCount: number;
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

export function TagTypesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<TagType[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<TagType | null>(null);
  const [formData, setFormData] = useState({
    typeCode: '',
    typeName: '',
    description: '',
    status: '启用' as '启用' | '禁用',
  });

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery) => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 模拟数据
        const mockData: TagType[] = [
          {
            id: '1',
            typeCode: 'data_quality',
            typeName: '数据质量',
            description: '用于标记数据质量相关的标签类型',
            status: '启用',
            tagCount: 15,
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            typeCode: 'business_domain',
            typeName: '业务域',
            description: '用于标记业务领域相关的标签类型',
            status: '启用',
            tagCount: 28,
            creator: '李四',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            typeCode: 'data_source',
            typeName: '数据源',
            description: '用于标记数据来源相关的标签类型',
            status: '启用',
            tagCount: 12,
            creator: '王五',
            createTime: '2024-01-05 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
          {
            id: '4',
            typeCode: 'security_level',
            typeName: '安全等级',
            description: '用于标记数据安全等级相关的标签类型',
            status: '启用',
            tagCount: 8,
            creator: '赵六',
            createTime: '2023-12-18 16:45:00',
            updateTime: '2024-01-10 14:30:00',
          },
          {
            id: '5',
            typeCode: 'data_category',
            typeName: '数据分类',
            description: '用于标记数据分类相关的标签类型',
            status: '禁用',
            tagCount: 0,
            creator: '孙七',
            createTime: '2023-12-22 13:20:00',
            updateTime: '2024-01-05 09:15:00',
          },
        ];

        const filteredData = query 
          ? mockData.filter(item => 
              item.typeCode.toLowerCase().includes(query.toLowerCase()) || 
              item.typeName.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
            )
          : mockData;

        const total = filteredData.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setTableData(paginatedData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: total,
        }));
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, searchQuery]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSearch = () => {
    loadData(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    loadData(1, pagination.pageSize, "");
  };

  // 新建标签类型
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      typeCode: '',
      typeName: '',
      description: '',
      status: '启用',
    });
    setShowCreateDrawer(true);
  };

  // 编辑标签类型
  const handleEdit = (row: TagType) => {
    setEditingItem(row);
    setFormData({
      typeCode: row.typeCode,
      typeName: row.typeName,
      description: row.description,
      status: row.status,
    });
    setShowCreateDrawer(true);
  };

  // 删除标签类型
  const handleDelete = (row: TagType) => {
    if (row.tagCount > 0) {
      toast.error(`该标签类型下还有 ${row.tagCount} 个标签，无法删除`);
      return;
    }
    if (confirm(`确定删除标签类型 "${row.typeName}"?`)) {
      toast.success(`标签类型 "${row.typeName}" 删除成功`);
      loadData(); // 刷新数据
    }
  };

  // 保存标签类型
  const handleSave = () => {
    if (!formData.typeCode || !formData.typeName) {
      toast.error("类型编码和类型名称不能为空");
      return;
    }

    if (editingItem) {
      toast.success(`标签类型 "${formData.typeName}" 修改成功`);
    } else {
      toast.success(`标签类型 "${formData.typeName}" 创建成功`);
    }

    setShowCreateDrawer(false);
    setFormData({
      typeCode: '',
      typeName: '',
      description: '',
      status: '启用',
    });
    loadData(); // 刷新数据
  };

  // 定义表格列
  const columns: Column<TagType>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "typeCode",
      title: "类型编码",
      align: "center",
      width: 150,
    },
    {
      key: "typeName",
      title: "类型名称",
      align: "center",
      width: 150,
    },
    {
      key: "description",
      title: "描述",
      align: "center",
      width: 250,
    },
    {
      key: "tagCount",
      title: "标签数量",
      align: "center",
      width: 100,
      render: (value: unknown) => {
        const count = Number(value ?? 0);
        return <span className="font-medium">{count}</span>;
      },
    },
    {
      key: "status",
      title: "状态",
      align: "center",
      width: 80,
      render: (value: unknown) => {
        const status = String(value ?? "");
        let variant: 'secondary' | 'success' | 'warning' | 'primary' | 'danger' | 'info' | 'outline' = "secondary";
        if (status === "启用") variant = "success";
        if (status === "禁用") variant = "danger";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "creator",
      title: "创建人",
      align: "center",
      width: 100,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center",
      width: 150,
    },
    {
      key: "updateTime",
      title: "更新时间",
      align: "center",
      width: 150,
    },
    {
      key: "actions",
      title: "操作",
      width: 150,
      align: "center",
      render: (_: unknown, row: TagType) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            leftIcon={<Trash2 className="h-3 w-3" />}
            disabled={row.tagCount > 0}
          >
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  // 状态选项
  const statusOptions = [
    { value: '启用', label: '启用' },
    { value: '禁用', label: '禁用' },
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 统计信息：页面最上方 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">标签类型总数</p>
              <p className="font-semibold text-lg">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Filter className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已启用</p>
              <p className="font-semibold text-lg">
                {tableData.filter(item => item.status === '启用').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">标签总数</p>
              <p className="font-semibold text-lg">
                {tableData.reduce((sum, item) => sum + item.tagCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Filter className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已禁用</p>
              <p className="font-semibold text-lg">
                {tableData.filter(item => item.status === '禁用').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 查询区域 */}
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索类型编码、名称或描述"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            clearable
            onClear={() => {
              setSearchQuery("");
              loadData(1, pagination.pageSize, "");
            }}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9"
          />
        </div>
        <MdButton
          onClick={handleSearch}
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9 px-3"
        >
          查询
        </MdButton>
        <MdButton
          variant="outline"
          onClick={handleReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
          className="h-9 px-3"
        >
          重置
        </MdButton>
      </div>

      {/* 批量操作 */}
      <div className="flex items-center gap-2">
        <MdButton 
          onClick={handleCreate} 
          leftIcon={<Plus className="h-4 w-4" />} 
          className="h-9 px-3"
        >
          新建标签类型
        </MdButton>
      </div>

      {/* 数据表格 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable<TagType>
          columns={columns}
          data={tableData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => loadData(page, size),
          }}
          className="h-full"
        />
      </div>

      {/* 新建/编辑标签类型抽屉 */}
      <MdDrawer
        open={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        width="500px"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingItem ? '编辑标签类型' : '新建标签类型'}
            </h2>
            <MdButton 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateDrawer(false)}
            >
              取消
            </MdButton>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                类型编码 *
              </label>
              <MdInput
                value={formData.typeCode}
                onChange={(e) => setFormData({...formData, typeCode: e.target.value})}
                placeholder="请输入类型编码"
                className="w-full"
                disabled={!!editingItem}
              />
              {editingItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  类型编码创建后不可修改
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                类型名称 *
              </label>
              <MdInput
                value={formData.typeName}
                onChange={(e) => setFormData({...formData, typeName: e.target.value})}
                placeholder="请输入类型名称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                状态
              </label>
              <MdSelect
                options={statusOptions}
                value={formData.status}
                onChange={(value) => setFormData({...formData, status: value as '启用' | '禁用'})}
                placeholder="请选择状态"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="请输入描述信息"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <MdButton 
              variant="outline" 
              onClick={() => setShowCreateDrawer(false)}
            >
              取消
            </MdButton>
            <MdButton 
              onClick={handleSave}
            >
              保存
            </MdButton>
          </div>
        </div>
      </MdDrawer>
    </div>
  );
}
