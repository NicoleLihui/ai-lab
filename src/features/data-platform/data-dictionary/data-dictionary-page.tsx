'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Edit, 
  Trash2, 
  FileText, 
  Database, 
  BookOpen,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdDrawer } from '@/components/enterprise-ui';
import { AdvancedSearch, type FormItem } from '@/components/enterprise-ui/advanced-search';

interface DictionaryItem {
  id: string;
  dictCode: string;
  dictName: string;
  dictType: string;
  bizField: string;
  bizMeaning: string;
  dataType: string;
  status: '启用' | '禁用';
  description: string;
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

export function DataDictionaryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<DictionaryItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<DictionaryItem | null>(null);
  const [formData, setFormData] = useState({
    dictCode: '',
    dictName: '',
    dictType: '',
    bizField: '',
    bizMeaning: '',
    dataType: '',
    status: '启用' as '启用' | '禁用',
    description: ''
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
        const mockData: DictionaryItem[] = [
          {
            id: '1',
            dictCode: 'gender_type',
            dictName: '性别类型',
            dictType: '枚举',
            bizField: 'gender',
            bizMeaning: '用户性别',
            dataType: 'VARCHAR(1)',
            status: '启用',
            description: '表示用户的性别，M-男，F-女',
            creator: '张三',
            createTime: '2023-12-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            dictCode: 'status_code',
            dictName: '状态码',
            dictType: '常量',
            bizField: 'status',
            bizMeaning: '数据状态',
            dataType: 'INT',
            status: '启用',
            description: '表示数据的状态，1-激活，0-停用',
            creator: '李四',
            createTime: '2023-11-10 09:15:00',
            updateTime: '2024-01-15 15:45:00',
          },
          {
            id: '3',
            dictCode: 'user_level',
            dictName: '用户等级',
            dictType: '枚举',
            bizField: 'level',
            bizMeaning: '用户级别',
            dataType: 'VARCHAR(2)',
            status: '启用',
            description: '表示用户等级，VIP0-VIP5',
            creator: '王五',
            createTime: '2023-10-05 11:30:00',
            updateTime: '2023-12-20 16:20:00',
          },
          {
            id: '4',
            dictCode: 'order_status',
            dictName: '订单状态',
            dictType: '枚举',
            bizField: 'order_status',
            bizMeaning: '订单处理状态',
            dataType: 'VARCHAR(2)',
            status: '启用',
            description: '表示订单当前状态，0-待付款，1-已付款，2-已发货，3-已完成',
            creator: '赵六',
            createTime: '2023-09-18 16:45:00',
            updateTime: '2024-01-10 14:30:00',
          },
          {
            id: '5',
            dictCode: 'pay_method',
            dictName: '支付方式',
            dictType: '枚举',
            bizField: 'pay_method',
            bizMeaning: '支付渠道',
            dataType: 'VARCHAR(10)',
            status: '启用',
            description: '表示支付方式，ALIPAY-支付宝，WECHAT-微信支付，CARD-银行卡',
            creator: '孙七',
            createTime: '2023-08-22 13:20:00',
            updateTime: '2023-11-30 09:15:00',
          },
        ];

        const filteredData = query 
          ? mockData.filter(item => 
              item.dictCode.toLowerCase().includes(query.toLowerCase()) || 
              item.dictName.toLowerCase().includes(query.toLowerCase()) ||
              item.bizField.toLowerCase().includes(query.toLowerCase())
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

  // 新建字典
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      dictCode: '',
      dictName: '',
      dictType: '',
      bizField: '',
      bizMeaning: '',
      dataType: '',
      status: '启用',
      description: ''
    });
    setShowCreateDrawer(true);
  };

  // 编辑字典
  const handleEdit = (row: DictionaryItem) => {
    setEditingItem(row);
    setFormData({
      dictCode: row.dictCode,
      dictName: row.dictName,
      dictType: row.dictType,
      bizField: row.bizField,
      bizMeaning: row.bizMeaning,
      dataType: row.dataType,
      status: row.status,
      description: row.description
    });
    setShowCreateDrawer(true);
  };

  // 删除字典
  const handleDelete = (row: DictionaryItem) => {
    if (confirm(`确定删除字典 "${row.dictName}"?`)) {
      toast.success(`字典 "${row.dictName}" 删除成功`);
      loadData(); // 刷新数据
    }
  };

  // 保存字典
  const handleSave = () => {
    if (!formData.dictCode || !formData.dictName) {
      toast.error("字典编码和字典名称不能为空");
      return;
    }

    if (editingItem) {
      toast.success(`字典 "${formData.dictName}" 修改成功`);
    } else {
      toast.success(`字典 "${formData.dictName}" 创建成功`);
    }

    setShowCreateDrawer(false);
    setFormData({
      dictCode: '',
      dictName: '',
      dictType: '',
      bizField: '',
      bizMeaning: '',
      dataType: '',
      status: '启用',
      description: ''
    });
    loadData(); // 刷新数据
  };

  // 定义表格列
  const columns = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: unknown, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "dictCode",
      title: "字典编码",
      align: "center" as const,
      width: 150,
    },
    {
      key: "dictName",
      title: "字典名称",
      align: "center" as const,
      width: 150,
    },
    {
      key: "dictType",
      title: "字典类型",
      align: "center" as const,
      width: 100,
      render: (value: unknown) => {
        const type = String(value ?? "");
        let variant: 'secondary' | 'success' | 'warning' | 'primary' | 'danger' | 'info' | 'outline' = "secondary";
        if (type === "枚举") variant = "success";
        if (type === "常量") variant = "info";
        return <MdBadge variant={variant}>{type}</MdBadge>;
      },
    },
    {
      key: "bizField",
      title: "业务字段",
      align: "center" as const,
      width: 150,
    },
    {
      key: "bizMeaning",
      title: "业务含义",
      align: "center" as const,
      width: 200,
    },
    {
      key: "dataType",
      title: "数据类型",
      align: "center" as const,
      width: 120,
    },
    {
      key: "status",
      title: "状态",
      align: "center" as const,
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
      key: "description",
      title: "描述",
      align: "center" as const,
      width: 200,
    },
    {
      key: "creator",
      title: "创建人",
      align: "center" as const,
      width: 100,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center" as const,
      width: 150,
    },
    {
      key: "updateTime",
      title: "更新时间",
      align: "center" as const,
      width: 150,
    },
    {
      key: "actions",
      title: "操作",
      width: 150,
      align: "center" as const,
      render: (_: unknown, row: DictionaryItem) => (
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

  // 字典类型选项
  const dictTypeOptions = [
    { value: '枚举', label: '枚举' },
    { value: '常量', label: '常量' },
    { value: '范围', label: '范围' },
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
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">总字典数</p>
              <p className="font-semibold text-lg">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Database className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已启用</p>
              <p className="font-semibold text-lg">1,102</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">枚举类型</p>
              <p className="font-semibold text-lg">876</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">待处理</p>
              <p className="font-semibold text-lg">146</p>
            </div>
          </div>
        </div>
      </div>

      {/* 查询区域 */}
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索字典编码、名称或业务字段"
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

      {/* 批量操作：列表上方、查询项下方 */}
      <div className="flex items-center gap-2">
        <MdButton 
          onClick={handleCreate} 
          leftIcon={<Plus className="h-4 w-4" />} 
          className="h-9 px-3"
        >
          新建字典
        </MdButton>
        <MdButton 
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          className="h-9 px-3"
        >
          导出
        </MdButton>
        <MdButton 
          variant="outline"
          leftIcon={<Upload className="h-4 w-4" />}
          className="h-9 px-3"
        >
          导入
        </MdButton>
      </div>

      {/* 数据表格 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable<DictionaryItem>
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

      {/* 新建/编辑字典抽屉 */}
      <MdDrawer
        open={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        width="500px"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingItem ? '编辑字典' : '新建字典'}
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
                字典编码 *
              </label>
              <MdInput
                value={formData.dictCode}
                onChange={(e) => setFormData({...formData, dictCode: e.target.value})}
                placeholder="请输入字典编码"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                字典名称 *
              </label>
              <MdInput
                value={formData.dictName}
                onChange={(e) => setFormData({...formData, dictName: e.target.value})}
                placeholder="请输入字典名称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                字典类型
              </label>
              <select
                value={formData.dictType}
                onChange={(e) => setFormData({...formData, dictType: e.target.value})}
                className="w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">请选择字典类型</option>
                {dictTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                业务字段
              </label>
              <MdInput
                value={formData.bizField}
                onChange={(e) => setFormData({...formData, bizField: e.target.value})}
                placeholder="请输入业务字段名"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                业务含义
              </label>
              <MdInput
                value={formData.bizMeaning}
                onChange={(e) => setFormData({...formData, bizMeaning: e.target.value})}
                placeholder="请输入业务含义"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                数据类型
              </label>
              <MdInput
                value={formData.dataType}
                onChange={(e) => setFormData({...formData, dataType: e.target.value})}
                placeholder="请输入数据类型"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as '启用' | '禁用'})}
                className="w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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