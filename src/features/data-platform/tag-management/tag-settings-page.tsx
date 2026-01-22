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
  status: '启用' | '禁用';
}

interface Tag {
  id: string;
  tagCode: string;
  tagName: string;
  tagTypeId: string;
  tagTypeCode: string;
  tagTypeName: string;
  description: string;
  status: '启用' | '禁用';
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

export function TagSettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagType, setSelectedTagType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<Tag[]>([]);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    tagCode: '',
    tagName: '',
    tagTypeId: '',
    description: '',
    status: '启用' as '启用' | '禁用',
  });

  const { current: currentPage, pageSize } = pagination;

  // 加载标签类型数据
  const loadTagTypes = useCallback(async () => {
    try {
      // 模拟数据
      const mockTagTypes: TagType[] = [
        {
          id: '1',
          typeCode: 'data_quality',
          typeName: '数据质量',
          status: '启用',
        },
        {
          id: '2',
          typeCode: 'business_domain',
          typeName: '业务域',
          status: '启用',
        },
        {
          id: '3',
          typeCode: 'data_source',
          typeName: '数据源',
          status: '启用',
        },
        {
          id: '4',
          typeCode: 'security_level',
          typeName: '安全等级',
          status: '启用',
        },
      ];
      setTagTypes(mockTagTypes);
    } catch (error) {
      console.error("加载标签类型失败:", error);
    }
  }, []);

  // 加载标签数据
  const loadData = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery, tagTypeId = selectedTagType) => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 模拟数据
        const mockData: Tag[] = [
          {
            id: '1',
            tagCode: 'dq_high',
            tagName: '高质量',
            tagTypeId: '1',
            tagTypeCode: 'data_quality',
            tagTypeName: '数据质量',
            description: '数据质量高的标签',
            status: '启用',
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            tagCode: 'dq_medium',
            tagName: '中等质量',
            tagTypeId: '1',
            tagTypeCode: 'data_quality',
            tagTypeName: '数据质量',
            description: '数据质量中等的标签',
            status: '启用',
            creator: '张三',
            createTime: '2024-01-16 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            tagCode: 'bd_finance',
            tagName: '金融业务',
            tagTypeId: '2',
            tagTypeCode: 'business_domain',
            tagTypeName: '业务域',
            description: '金融业务相关的标签',
            status: '启用',
            creator: '李四',
            createTime: '2024-01-10 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
          {
            id: '4',
            tagCode: 'bd_retail',
            tagName: '零售业务',
            tagTypeId: '2',
            tagTypeCode: 'business_domain',
            tagTypeName: '业务域',
            description: '零售业务相关的标签',
            status: '启用',
            creator: '李四',
            createTime: '2024-01-11 16:45:00',
            updateTime: '2024-01-12 14:30:00',
          },
          {
            id: '5',
            tagCode: 'ds_database',
            tagName: '数据库',
            tagTypeId: '3',
            tagTypeCode: 'data_source',
            tagTypeName: '数据源',
            description: '来自数据库的数据源',
            status: '启用',
            creator: '王五',
            createTime: '2024-01-05 13:20:00',
            updateTime: '2024-01-08 09:15:00',
          },
          {
            id: '6',
            tagCode: 'sl_confidential',
            tagName: '机密',
            tagTypeId: '4',
            tagTypeCode: 'security_level',
            tagTypeName: '安全等级',
            description: '机密级别的数据',
            status: '启用',
            creator: '赵六',
            createTime: '2023-12-18 10:30:00',
            updateTime: '2024-01-05 11:20:00',
          },
        ];

        let filteredData = mockData;

        // 按标签类型筛选
        if (tagTypeId) {
          filteredData = filteredData.filter(item => item.tagTypeId === tagTypeId);
        }

        // 按搜索关键词筛选
        if (query) {
          filteredData = filteredData.filter(item => 
            item.tagCode.toLowerCase().includes(query.toLowerCase()) || 
            item.tagName.toLowerCase().includes(query.toLowerCase()) ||
            item.tagTypeName.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          );
        }

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
    [currentPage, pageSize, searchQuery, selectedTagType]
  );

  useEffect(() => {
    loadTagTypes();
  }, [loadTagTypes]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSearch = () => {
    loadData(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTagType("");
    loadData(1, pagination.pageSize, "", "");
  };

  // 新建标签
  const handleCreate = () => {
    if (tagTypes.length === 0) {
      toast.error("请先创建标签类型");
      return;
    }
    setEditingItem(null);
    setFormData({
      tagCode: '',
      tagName: '',
      tagTypeId: '',
      description: '',
      status: '启用',
    });
    setShowCreateDrawer(true);
  };

  // 编辑标签
  const handleEdit = (row: Tag) => {
    setEditingItem(row);
    setFormData({
      tagCode: row.tagCode,
      tagName: row.tagName,
      tagTypeId: row.tagTypeId,
      description: row.description,
      status: row.status,
    });
    setShowCreateDrawer(true);
  };

  // 删除标签
  const handleDelete = (row: Tag) => {
    if (confirm(`确定删除标签 "${row.tagName}"?`)) {
      toast.success(`标签 "${row.tagName}" 删除成功`);
      loadData(); // 刷新数据
    }
  };

  // 保存标签
  const handleSave = () => {
    if (!formData.tagCode || !formData.tagName) {
      toast.error("标签编码和标签名称不能为空");
      return;
    }
    if (!formData.tagTypeId) {
      toast.error("请选择标签类型");
      return;
    }

    if (editingItem) {
      toast.success(`标签 "${formData.tagName}" 修改成功`);
    } else {
      toast.success(`标签 "${formData.tagName}" 创建成功`);
    }

    setShowCreateDrawer(false);
    setFormData({
      tagCode: '',
      tagName: '',
      tagTypeId: '',
      description: '',
      status: '启用',
    });
    loadData(); // 刷新数据
  };

  // 定义表格列
  const columns: Column<Tag>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "tagCode",
      title: "标签编码",
      align: "center",
      width: 150,
    },
    {
      key: "tagName",
      title: "标签名称",
      align: "center",
      width: 150,
    },
    {
      key: "tagTypeName",
      title: "标签类型",
      align: "center",
      width: 120,
      render: (value: unknown) => {
        const typeName = String(value ?? "");
        return <MdBadge variant="info">{typeName}</MdBadge>;
      },
    },
    {
      key: "description",
      title: "描述",
      align: "center",
      width: 250,
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
      render: (_: unknown, row: Tag) => (
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

  // 标签类型选项（只显示启用的）
  const tagTypeOptions = tagTypes
    .filter(type => type.status === '启用')
    .map(type => ({
      value: type.id,
      label: type.typeName,
    }));

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索区域 */}
      <div className="flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <MdButton 
            onClick={handleCreate} 
            leftIcon={<Plus className="h-4 w-4" />} 
            className="h-9 px-3"
          >
            新建标签
          </MdButton>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MdSelect
              options={[
                { value: '', label: '全部类型' },
                ...tagTypeOptions,
              ]}
              value={selectedTagType}
              onChange={(value) => {
                setSelectedTagType(value);
                loadData(1, pagination.pageSize, searchQuery, value);
              }}
              placeholder="选择标签类型"
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索标签编码、名称或描述"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              clearable
              onClear={() => {
                setSearchQuery("");
                loadData(1, pagination.pageSize, "", selectedTagType);
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
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">标签总数</p>
              <p className="font-semibold text-lg">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
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
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">标签类型数</p>
              <p className="font-semibold text-lg">{tagTypes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
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

      {/* 数据表格 */}
      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable<Tag>
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

      {/* 新建/编辑标签抽屉 */}
      <MdDrawer
        open={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        width="500px"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingItem ? '编辑标签' : '新建标签'}
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
                标签类型 *
              </label>
              <MdSelect
                options={tagTypeOptions}
                value={formData.tagTypeId}
                onChange={(value) => setFormData({...formData, tagTypeId: value})}
                placeholder="请选择标签类型"
                className="w-full"
                disabled={!!editingItem}
              />
              {editingItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  标签类型创建后不可修改
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                标签编码 *
              </label>
              <MdInput
                value={formData.tagCode}
                onChange={(e) => setFormData({...formData, tagCode: e.target.value})}
                placeholder="请输入标签编码"
                className="w-full"
                disabled={!!editingItem}
              />
              {editingItem && (
                <p className="text-xs text-muted-foreground mt-1">
                  标签编码创建后不可修改
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                标签名称 *
              </label>
              <MdInput
                value={formData.tagName}
                onChange={(e) => setFormData({...formData, tagName: e.target.value})}
                placeholder="请输入标签名称"
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
