'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash2, 
  Save,
  Copy,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { 
  MdButton, 
  MdInput, 
  MdTable, 
  MdBadge, 
  MdCard,
  MdDrawer
} from '@/components/enterprise-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

interface DictValue {
  id: string;
  valueCode: string;
  valueName: string;
  valueDesc: string;
  sort: number;
  status: '启用' | '禁用';
  remark: string;
  [key: string]: unknown;
}

export function DataDictionaryDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [dictionaryInfo, setDictionaryInfo] = useState<DictionaryItem | null>(null);
  const [dictValues, setDictValues] = useState<DictValue[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showAddValueDrawer, setShowAddValueDrawer] = useState(false);
  const [editingValue, setEditingValue] = useState<DictValue | null>(null);
  const [newValue, setNewValue] = useState({
    valueCode: '',
    valueName: '',
    valueDesc: '',
    sort: 0,
    status: '启用' as '启用' | '禁用',
    remark: ''
  });

  // 模拟加载数据
  useEffect(() => {
    const loadDetailData = async () => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 模拟字典基本信息
        const mockDictInfo: DictionaryItem = {
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
        };

        // 模拟字典值列表
        const mockDictValues: DictValue[] = [
          {
            id: '1',
            valueCode: 'M',
            valueName: '男性',
            valueDesc: '表示男性用户',
            sort: 1,
            status: '启用',
            remark: '常用性别'
          },
          {
            id: '2',
            valueCode: 'F',
            valueName: '女性',
            valueDesc: '表示女性用户',
            sort: 2,
            status: '启用',
            remark: '常用性别'
          },
          {
            id: '3',
            valueCode: 'U',
            valueName: '未知',
            valueDesc: '表示性别未指定',
            sort: 3,
            status: '启用',
            remark: '默认值'
          },
          {
            id: '4',
            valueCode: 'O',
            valueName: '其他',
            valueDesc: '表示其他性别',
            sort: 4,
            status: '禁用',
            remark: '特殊场景使用'
          }
        ];

        setDictionaryInfo(mockDictInfo);
        setDictValues(mockDictValues);
      } catch (error) {
        console.error("加载详情失败:", error);
        toast.error("加载详情失败");
      } finally {
        setLoading(false);
      }
    };

    loadDetailData();
  }, []);

  // 处理返回
  const handleBack = () => {
    router.push('/categories/data-platform/metadata/data-dictionary');
  };

  // 编辑字典
  const handleEditDictionary = () => {
    setShowEditDrawer(true);
  };

  // 保存字典修改
  const handleSaveDictionary = () => {
    toast.success("字典信息修改成功");
    setShowEditDrawer(false);
  };

  // 添加字典值
  const handleAddValue = () => {
    setEditingValue(null);
    setNewValue({
      valueCode: '',
      valueName: '',
      valueDesc: '',
      sort: dictValues.length > 0 ? Math.max(...dictValues.map(v => v.sort)) + 1 : 1,
      status: '启用',
      remark: ''
    });
    setShowAddValueDrawer(true);
  };

  // 编辑字典值
  const handleEditValue = (value: DictValue) => {
    setEditingValue(value);
    setNewValue({
      valueCode: value.valueCode,
      valueName: value.valueName,
      valueDesc: value.valueDesc,
      sort: value.sort,
      status: value.status,
      remark: value.remark
    });
    setShowAddValueDrawer(true);
  };

  // 删除字典值
  const handleDeleteValue = (value: DictValue) => {
    if (confirm(`确定删除字典值 "${value.valueName}"?`)) {
      setDictValues(prev => prev.filter(v => v.id !== value.id));
      toast.success(`字典值 "${value.valueName}" 删除成功`);
    }
  };

  // 保存字典值
  const handleSaveValue = () => {
    if (!newValue.valueCode || !newValue.valueName) {
      toast.error("值编码和值名称不能为空");
      return;
    }

    if (editingValue) {
      // 更新现有值
      setDictValues(prev => 
        prev.map(v => 
          v.id === editingValue.id 
            ? { ...newValue, id: editingValue.id } 
            : v
        )
      );
      toast.success(`字典值 "${newValue.valueName}" 修改成功`);
    } else {
      // 添加新值
      const newDictValue: DictValue = {
        ...newValue,
        id: `${Date.now()}`
      };
      setDictValues(prev => [...prev, newDictValue]);
      toast.success(`字典值 "${newValue.valueName}" 添加成功`);
    }

    setShowAddValueDrawer(false);
    setNewValue({
      valueCode: '',
      valueName: '',
      valueDesc: '',
      sort: 0,
      status: '启用',
      remark: ''
    });
  };

  // 复制字典值
  const handleCopyValue = (value: DictValue) => {
    navigator.clipboard.writeText(`${value.valueCode}: ${value.valueName}`);
    toast.success("已复制到剪贴板");
  };

  // 字典值表格列定义
  const valueColumns = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      key: "valueCode",
      title: "值编码",
      align: "center" as const,
      width: 120,
    },
    {
      key: "valueName",
      title: "值名称",
      align: "center" as const,
      width: 150,
    },
    {
      key: "valueDesc",
      title: "值描述",
      align: "center" as const,
      width: 200,
    },
    {
      key: "sort",
      title: "排序",
      align: "center" as const,
      width: 80,
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
      key: "remark",
      title: "备注",
      align: "center" as const,
      width: 150,
    },
    {
      key: "actions",
      title: "操作",
      width: 180,
      align: "center" as const,
      render: (_: unknown, row: DictValue) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleEditValue(row)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleCopyValue(row)}
            leftIcon={<Copy className="h-3 w-3" />}
          >
            复制
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteValue(row)}
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

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-4">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <MdButton 
            variant="outline" 
            size="sm"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            返回
          </MdButton>
          <h1 className="text-xl font-semibold">
            {dictionaryInfo?.dictName || '数据字典详情'} - {dictionaryInfo?.dictCode}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton 
            variant="outline"
            leftIcon={<Eye className="h-4 w-4" />}
            className="h-9 px-3"
          >
            预览
          </MdButton>
          <MdButton 
            variant="outline"
            leftIcon={<Copy className="h-4 w-4" />}
            className="h-9 px-3"
          >
            复制
          </MdButton>
          <MdButton
            onClick={handleEditDictionary}
            leftIcon={<Edit className="h-4 w-4" />}
            className="h-9 px-3"
          >
            编辑
          </MdButton>
        </div>
      </div>

      {/* 选项卡 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="values">字典值</TabsTrigger>
          <TabsTrigger value="relations">关联关系</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>

        {/* 概览标签页 */}
        <TabsContent value="overview" className="mt-4">
          <div className="space-y-6">
            <MdCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">字典编码</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.dictCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">字典名称</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.dictName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">字典类型</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.dictType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">业务字段</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.bizField}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">业务含义</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.bizMeaning}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">数据类型</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.dataType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">状态</label>
                  <p className="text-sm font-medium">
                    <MdBadge 
                      variant={dictionaryInfo?.status === '启用' ? 'success' : 'danger'}
                    >
                      {dictionaryInfo?.status}
                    </MdBadge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建人</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.creator}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                  <p className="text-sm font-medium">{dictionaryInfo?.createTime}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">描述</label>
                <p className="text-sm font-medium mt-1">{dictionaryInfo?.description}</p>
              </div>
            </MdCard>

            <MdCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">统计信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">字典值总数</p>
                  <p className="text-2xl font-bold">{dictValues.length}</p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">启用数量</p>
                  <p className="text-2xl font-bold">
                    {dictValues.filter(v => v.status === '启用').length}
                  </p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">禁用数量</p>
                  <p className="text-2xl font-bold">
                    {dictValues.filter(v => v.status === '禁用').length}
                  </p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">最近更新</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </MdCard>
          </div>
        </TabsContent>

        {/* 字典值标签页 */}
        <TabsContent value="values" className="mt-4">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-muted/30">
              <h2 className="text-lg font-semibold">字典值列表</h2>
              <MdButton 
                onClick={handleAddValue} 
                leftIcon={<Plus className="h-4 w-4" />}
              >
                添加字典值
              </MdButton>
            </div>
            <div className="p-4">
              <MdTable<DictValue>
                columns={valueColumns}
                data={dictValues}
                loading={loading}
                className="h-full"
              />
            </div>
          </div>
        </TabsContent>

        {/* 关联关系标签页 */}
        <TabsContent value="relations" className="mt-4">
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">关联关系</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">关联的表字段</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>users表 - gender字段</li>
                  <li>profiles表 - gender字段</li>
                  <li>orders表 - customer_gender字段</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">引用位置</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>用户注册流程</li>
                  <li>个人资料编辑</li>
                  <li>报表统计</li>
                </ul>
              </div>
            </div>
          </MdCard>
        </TabsContent>

        {/* 操作日志标签页 */}
        <TabsContent value="logs" className="mt-4">
          <MdCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">操作日志</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border-b">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Edit className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">张三 更新了字典值 &quot;M&quot; 的名称为 &quot;男性&quot;</p>
                  <p className="text-sm text-muted-foreground">2024-01-20 10:30:15</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border-b">
                <div className="bg-success/10 p-2 rounded-full">
                  <Plus className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">李四 添加了字典值 &quot;O&quot; - &quot;其他&quot;</p>
                  <p className="text-sm text-muted-foreground">2024-01-15 14:22:30</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border-b">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Edit className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">王五 修改了字典 &quot;gender_type&quot; 的描述</p>
                  <p className="text-sm text-muted-foreground">2023-12-28 09:15:45</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">张三 创建了字典 &quot;gender_type&quot;</p>
                  <p className="text-sm text-muted-foreground">2023-12-15 14:20:00</p>
                </div>
              </div>
            </div>
          </MdCard>
        </TabsContent>
      </Tabs>

      {/* 编辑字典信息抽屉 */}
      <MdDrawer
        open={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        width="500px"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">编辑字典信息</h2>
            <MdButton 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEditDrawer(false)}
            >
              取消
            </MdButton>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                字典编码
              </label>
              <MdInput
                value={dictionaryInfo?.dictCode || ''}
                readOnly
                className="w-full bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                字典名称
              </label>
              <MdInput
                value={dictionaryInfo?.dictName || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, dictName: e.target.value} : null
                )}
                placeholder="请输入字典名称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                字典类型
              </label>
              <select
                value={dictionaryInfo?.dictType || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, dictType: e.target.value} : null
                )}
                className="w-full h-9 px-3 py-1 border border-input rounded-md bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="枚举">枚举</option>
                <option value="常量">常量</option>
                <option value="范围">范围</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                业务字段
              </label>
              <MdInput
                value={dictionaryInfo?.bizField || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, bizField: e.target.value} : null
                )}
                placeholder="请输入业务字段名"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                业务含义
              </label>
              <MdInput
                value={dictionaryInfo?.bizMeaning || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, bizMeaning: e.target.value} : null
                )}
                placeholder="请输入业务含义"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                数据类型
              </label>
              <MdInput
                value={dictionaryInfo?.dataType || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, dataType: e.target.value} : null
                )}
                placeholder="请输入数据类型"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                状态
              </label>
              <select
                value={dictionaryInfo?.status || '启用'}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, status: e.target.value as '启用' | '禁用'} : null
                )}
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
                value={dictionaryInfo?.description || ''}
                onChange={(e) => setDictionaryInfo(prev => 
                  prev ? {...prev, description: e.target.value} : null
                )}
                placeholder="请输入描述信息"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <MdButton 
              variant="outline" 
              onClick={() => setShowEditDrawer(false)}
            >
              取消
            </MdButton>
            <MdButton 
              onClick={handleSaveDictionary}
              leftIcon={<Save className="h-4 w-4" />}
            >
              保存
            </MdButton>
          </div>
        </div>
      </MdDrawer>

      {/* 添加/编辑字典值抽屉 */}
      <MdDrawer
        open={showAddValueDrawer}
        onClose={() => setShowAddValueDrawer(false)}
        width="500px"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingValue ? '编辑字典值' : '添加字典值'}
            </h2>
            <MdButton 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAddValueDrawer(false)}
            >
              取消
            </MdButton>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                值编码 *
              </label>
              <MdInput
                value={newValue.valueCode}
                onChange={(e) => setNewValue({...newValue, valueCode: e.target.value})}
                placeholder="请输入值编码"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                值名称 *
              </label>
              <MdInput
                value={newValue.valueName}
                onChange={(e) => setNewValue({...newValue, valueName: e.target.value})}
                placeholder="请输入值名称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                值描述
              </label>
              <MdInput
                value={newValue.valueDesc}
                onChange={(e) => setNewValue({...newValue, valueDesc: e.target.value})}
                placeholder="请输入值描述"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                排序
              </label>
              <MdInput
                type="number"
                value={newValue.sort}
                onChange={(e) => setNewValue({...newValue, sort: parseInt(e.target.value) || 0})}
                placeholder="请输入排序值"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                状态
              </label>
              <select
                value={newValue.status}
                onChange={(e) => setNewValue({...newValue, status: e.target.value as '启用' | '禁用'})}
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
                备注
              </label>
              <textarea
                value={newValue.remark}
                onChange={(e) => setNewValue({...newValue, remark: e.target.value})}
                placeholder="请输入备注信息"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <MdButton 
              variant="outline" 
              onClick={() => setShowAddValueDrawer(false)}
            >
              取消
            </MdButton>
            <MdButton 
              onClick={handleSaveValue}
              leftIcon={<Save className="h-4 w-4" />}
            >
              保存
            </MdButton>
          </div>
        </div>
      </MdDrawer>
    </div>
  );
}