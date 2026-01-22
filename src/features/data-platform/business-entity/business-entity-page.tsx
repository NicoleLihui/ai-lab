'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Edit, 
  Trash2, 
  FolderTree,
  BarChart3,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { MdButton, MdInput, MdTable, MdBadge, MdDrawer, MdSelect } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';

// 业务分类数据类型
interface BusinessCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  businessLine: string;
  description: string;
  dataCatalogCount: number;
  status: '启用' | '禁用';
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

// 标准指标数据类型
interface StandardIndicator {
  id: string;
  indicatorCode: string;
  indicatorName: string;
  businessLine: string;
  category: string;
  calculationFormula: string;
  unit: string;
  dataSource: string;
  description: string;
  status: '启用' | '禁用';
  version: string;
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

type TabType = 'category' | 'indicator';

export function BusinessEntityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('category');
  
  // 业务分类相关状态
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryTableData, setCategoryTableData] = useState<BusinessCategory[]>([]);
  const [categoryPagination, setCategoryPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    categoryCode: '',
    categoryName: '',
    businessLine: '',
    description: '',
    status: '启用' as '启用' | '禁用',
  });

  // 标准指标相关状态
  const [indicatorSearchQuery, setIndicatorSearchQuery] = useState("");
  const [indicatorLoading, setIndicatorLoading] = useState(false);
  const [indicatorTableData, setIndicatorTableData] = useState<StandardIndicator[]>([]);
  const [indicatorPagination, setIndicatorPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [showIndicatorDrawer, setShowIndicatorDrawer] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<StandardIndicator | null>(null);
  const [indicatorFormData, setIndicatorFormData] = useState({
    indicatorCode: '',
    indicatorName: '',
    businessLine: '',
    category: '',
    calculationFormula: '',
    unit: '',
    dataSource: '',
    description: '',
    status: '启用' as '启用' | '禁用',
  });

  // 业务线选项
  const businessLineOptions = [
    { value: '电商业务', label: '电商业务' },
    { value: '金融业务', label: '金融业务' },
    { value: '物流业务', label: '物流业务' },
    { value: '营销业务', label: '营销业务' },
    { value: '客服业务', label: '客服业务' },
  ];

  // 加载业务分类数据
  const loadCategoryData = useCallback(
    async (page = categoryPagination.current, size = categoryPagination.pageSize, query = categorySearchQuery) => {
      setCategoryLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockData: BusinessCategory[] = [
          {
            id: '1',
            categoryCode: 'EC_ORDER',
            categoryName: '订单数据',
            businessLine: '电商业务',
            description: '电商订单相关数据目录',
            dataCatalogCount: 25,
            status: '启用',
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            categoryCode: 'EC_PRODUCT',
            categoryName: '商品数据',
            businessLine: '电商业务',
            description: '商品信息相关数据目录',
            dataCatalogCount: 18,
            status: '启用',
            creator: '李四',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            categoryCode: 'FIN_PAYMENT',
            categoryName: '支付数据',
            businessLine: '金融业务',
            description: '支付交易相关数据目录',
            dataCatalogCount: 32,
            status: '启用',
            creator: '王五',
            createTime: '2024-01-05 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
          {
            id: '4',
            categoryCode: 'LOG_SHIPMENT',
            categoryName: '物流数据',
            businessLine: '物流业务',
            description: '物流配送相关数据目录',
            dataCatalogCount: 15,
            status: '启用',
            creator: '赵六',
            createTime: '2023-12-18 16:45:00',
            updateTime: '2024-01-10 14:30:00',
          },
          {
            id: '5',
            categoryCode: 'MKT_CAMPAIGN',
            categoryName: '营销活动数据',
            businessLine: '营销业务',
            description: '营销活动相关数据目录',
            dataCatalogCount: 8,
            status: '禁用',
            creator: '孙七',
            createTime: '2023-12-22 13:20:00',
            updateTime: '2024-01-05 09:15:00',
          },
        ];

        const filteredData = query 
          ? mockData.filter(item => 
              item.categoryCode.toLowerCase().includes(query.toLowerCase()) || 
              item.categoryName.toLowerCase().includes(query.toLowerCase()) ||
              item.businessLine.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
            )
          : mockData;

        const total = filteredData.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setCategoryTableData(paginatedData);
        setCategoryPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: total,
        }));
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setCategoryLoading(false);
      }
    },
    [categoryPagination.current, categoryPagination.pageSize, categorySearchQuery]
  );

  // 加载标准指标数据
  const loadIndicatorData = useCallback(
    async (page = indicatorPagination.current, size = indicatorPagination.pageSize, query = indicatorSearchQuery) => {
      setIndicatorLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockData: StandardIndicator[] = [
          {
            id: '1',
            indicatorCode: 'GMV',
            indicatorName: '总交易额',
            businessLine: '电商业务',
            category: '订单数据',
            calculationFormula: 'SUM(order_amount)',
            unit: '元',
            dataSource: 'order_details',
            description: '平台总交易金额，包含所有订单的金额总和',
            status: '启用',
            version: 'v1.0',
            creator: '张三',
            createTime: '2024-01-15 14:20:00',
            updateTime: '2024-01-20 10:30:00',
          },
          {
            id: '2',
            indicatorCode: 'ORDER_COUNT',
            indicatorName: '订单数量',
            businessLine: '电商业务',
            category: '订单数据',
            calculationFormula: 'COUNT(DISTINCT order_id)',
            unit: '单',
            dataSource: 'order_details',
            description: '平台订单总数，按订单ID去重统计',
            status: '启用',
            version: 'v1.0',
            creator: '李四',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 15:45:00',
          },
          {
            id: '3',
            indicatorCode: 'PAYMENT_SUCCESS_RATE',
            indicatorName: '支付成功率',
            businessLine: '金融业务',
            category: '支付数据',
            calculationFormula: 'SUM(success_count) / SUM(total_count) * 100',
            unit: '%',
            dataSource: 'payment_records',
            description: '支付成功订单数占总订单数的百分比',
            status: '启用',
            version: 'v1.1',
            creator: '王五',
            createTime: '2024-01-05 11:30:00',
            updateTime: '2024-01-15 16:20:00',
          },
          {
            id: '4',
            indicatorCode: 'AVG_DELIVERY_TIME',
            indicatorName: '平均配送时长',
            businessLine: '物流业务',
            category: '物流数据',
            calculationFormula: 'AVG(delivery_time)',
            unit: '小时',
            dataSource: 'shipment_records',
            description: '从订单发货到签收的平均时长',
            status: '启用',
            version: 'v1.0',
            creator: '赵六',
            createTime: '2023-12-18 16:45:00',
            updateTime: '2024-01-10 14:30:00',
          },
          {
            id: '5',
            indicatorCode: 'CUSTOMER_RETENTION',
            indicatorName: '客户留存率',
            businessLine: '营销业务',
            category: '营销活动数据',
            calculationFormula: 'COUNT(DISTINCT retained_users) / COUNT(DISTINCT total_users) * 100',
            unit: '%',
            dataSource: 'user_behavior_log',
            description: '30天内回访用户数占总用户数的百分比',
            status: '启用',
            version: 'v1.2',
            creator: '孙七',
            createTime: '2023-12-22 13:20:00',
            updateTime: '2024-01-05 09:15:00',
          },
        ];

        const filteredData = query 
          ? mockData.filter(item => 
              item.indicatorCode.toLowerCase().includes(query.toLowerCase()) || 
              item.indicatorName.toLowerCase().includes(query.toLowerCase()) ||
              item.businessLine.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
            )
          : mockData;

        const total = filteredData.length;
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, total);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setIndicatorTableData(paginatedData);
        setIndicatorPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: size,
          total: total,
        }));
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setIndicatorLoading(false);
      }
    },
    [indicatorPagination.current, indicatorPagination.pageSize, indicatorSearchQuery]
  );

  useEffect(() => {
    if (activeTab === 'category') {
      loadCategoryData(1);
    } else {
      loadIndicatorData(1);
    }
  }, [activeTab]);

  // 业务分类操作
  const handleCategorySearch = () => {
    loadCategoryData(1);
  };

  const handleCategoryReset = () => {
    setCategorySearchQuery("");
    loadCategoryData(1, categoryPagination.pageSize, "");
  };

  const handleCategoryCreate = () => {
    setEditingCategory(null);
    setCategoryFormData({
      categoryCode: '',
      categoryName: '',
      businessLine: '',
      description: '',
      status: '启用',
    });
    setShowCategoryDrawer(true);
  };

  const handleCategoryEdit = (row: BusinessCategory) => {
    setEditingCategory(row);
    setCategoryFormData({
      categoryCode: row.categoryCode,
      categoryName: row.categoryName,
      businessLine: row.businessLine,
      description: row.description,
      status: row.status,
    });
    setShowCategoryDrawer(true);
  };

  const handleCategoryDelete = (row: BusinessCategory) => {
    if (row.dataCatalogCount > 0) {
      toast.error(`该业务分类下还有 ${row.dataCatalogCount} 个数据目录，无法删除`);
      return;
    }
    if (confirm(`确定删除业务分类 "${row.categoryName}"?`)) {
      toast.success(`业务分类 "${row.categoryName}" 删除成功`);
      loadCategoryData();
    }
  };

  const handleCategorySave = () => {
    if (!categoryFormData.categoryCode || !categoryFormData.categoryName || !categoryFormData.businessLine) {
      toast.error("分类编码、分类名称和业务线不能为空");
      return;
    }

    if (editingCategory) {
      toast.success(`业务分类 "${categoryFormData.categoryName}" 修改成功`);
    } else {
      toast.success(`业务分类 "${categoryFormData.categoryName}" 创建成功`);
    }

    setShowCategoryDrawer(false);
    setCategoryFormData({
      categoryCode: '',
      categoryName: '',
      businessLine: '',
      description: '',
      status: '启用',
    });
    loadCategoryData();
  };

  // 标准指标操作
  const handleIndicatorSearch = () => {
    loadIndicatorData(1);
  };

  const handleIndicatorReset = () => {
    setIndicatorSearchQuery("");
    loadIndicatorData(1, indicatorPagination.pageSize, "");
  };

  const handleIndicatorCreate = () => {
    setEditingIndicator(null);
    setIndicatorFormData({
      indicatorCode: '',
      indicatorName: '',
      businessLine: '',
      category: '',
      calculationFormula: '',
      unit: '',
      dataSource: '',
      description: '',
      status: '启用',
    });
    setShowIndicatorDrawer(true);
  };

  const handleIndicatorEdit = (row: StandardIndicator) => {
    setEditingIndicator(row);
    setIndicatorFormData({
      indicatorCode: row.indicatorCode,
      indicatorName: row.indicatorName,
      businessLine: row.businessLine,
      category: row.category,
      calculationFormula: row.calculationFormula,
      unit: row.unit,
      dataSource: row.dataSource,
      description: row.description,
      status: row.status,
    });
    setShowIndicatorDrawer(true);
  };

  const handleIndicatorDelete = (row: StandardIndicator) => {
    if (confirm(`确定删除标准指标 "${row.indicatorName}"?`)) {
      toast.success(`标准指标 "${row.indicatorName}" 删除成功`);
      loadIndicatorData();
    }
  };

  const handleIndicatorSave = () => {
    if (!indicatorFormData.indicatorCode || !indicatorFormData.indicatorName || 
        !indicatorFormData.businessLine || !indicatorFormData.calculationFormula) {
      toast.error("指标编码、指标名称、业务线和计算公式不能为空");
      return;
    }

    if (editingIndicator) {
      toast.success(`标准指标 "${indicatorFormData.indicatorName}" 修改成功`);
    } else {
      toast.success(`标准指标 "${indicatorFormData.indicatorName}" 创建成功`);
    }

    setShowIndicatorDrawer(false);
    setIndicatorFormData({
      indicatorCode: '',
      indicatorName: '',
      businessLine: '',
      category: '',
      calculationFormula: '',
      unit: '',
      dataSource: '',
      description: '',
      status: '启用',
    });
    loadIndicatorData();
  };

  // 业务分类表格列
  const categoryColumns: Column<BusinessCategory>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) =>
        (categoryPagination.current - 1) * categoryPagination.pageSize + index + 1,
    },
    {
      key: "categoryCode",
      title: "分类编码",
      align: "center",
      width: 150,
    },
    {
      key: "categoryName",
      title: "分类名称",
      align: "center",
      width: 150,
    },
    {
      key: "businessLine",
      title: "业务线",
      align: "center",
      width: 120,
      render: (value: unknown) => (
        <div className="flex items-center justify-center gap-1">
          <Building2 className="h-3 w-3 text-blue-600" />
          <span>{String(value || "")}</span>
        </div>
      ),
    },
    {
      key: "description",
      title: "描述",
      align: "center",
      width: 250,
    },
    {
      key: "dataCatalogCount",
      title: "数据目录数",
      align: "center",
      width: 120,
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
      render: (_: unknown, row: BusinessCategory) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryEdit(row)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryDelete(row)}
            leftIcon={<Trash2 className="h-3 w-3" />}
            disabled={row.dataCatalogCount > 0}
          >
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  // 标准指标表格列
  const indicatorColumns: Column<StandardIndicator>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) =>
        (indicatorPagination.current - 1) * indicatorPagination.pageSize + index + 1,
    },
    {
      key: "indicatorCode",
      title: "指标编码",
      align: "center",
      width: 150,
    },
    {
      key: "indicatorName",
      title: "指标名称",
      align: "center",
      width: 150,
    },
    {
      key: "businessLine",
      title: "业务线",
      align: "center",
      width: 120,
      render: (value: unknown) => (
        <div className="flex items-center justify-center gap-1">
          <Building2 className="h-3 w-3 text-blue-600" />
          <span>{String(value || "")}</span>
        </div>
      ),
    },
    {
      key: "category",
      title: "所属分类",
      align: "center",
      width: 120,
    },
    {
      key: "calculationFormula",
      title: "计算公式",
      align: "center",
      width: 200,
      render: (value: unknown) => (
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="font-mono text-xs">{String(value || "")}</span>
        </div>
      ),
    },
    {
      key: "unit",
      title: "单位",
      align: "center",
      width: 80,
    },
    {
      key: "dataSource",
      title: "数据源",
      align: "center",
      width: 150,
    },
    {
      key: "version",
      title: "版本",
      align: "center",
      width: 80,
      render: (value: unknown) => (
        <MdBadge variant="info">{String(value || "")}</MdBadge>
      ),
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
      key: "actions",
      title: "操作",
      width: 150,
      align: "center",
      render: (_: unknown, row: StandardIndicator) => (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleIndicatorEdit(row)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            编辑
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleIndicatorDelete(row)}
            leftIcon={<Trash2 className="h-3 w-3" />}
          >
            删除
          </MdButton>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: '启用', label: '启用' },
    { value: '禁用', label: '禁用' },
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* Tab 切换 */}
      <div className="flex items-center gap-2 bg-card p-4 rounded-xl border border-border shadow-sm">
        <MdButton
          variant={activeTab === 'category' ? 'default' : 'outline'}
          onClick={() => setActiveTab('category')}
          leftIcon={<FolderTree className="h-4 w-4" />}
          className="h-9 px-4"
        >
          业务分类
        </MdButton>
        <MdButton
          variant={activeTab === 'indicator' ? 'default' : 'outline'}
          onClick={() => setActiveTab('indicator')}
          leftIcon={<BarChart3 className="h-4 w-4" />}
          className="h-9 px-4"
        >
          标准指标
        </MdButton>
      </div>

      {/* 业务分类管理 */}
      {activeTab === 'category' && (
        <>
          {/* 搜索区域 */}
          <div className="flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <MdButton 
                onClick={handleCategoryCreate} 
                leftIcon={<Plus className="h-4 w-4" />} 
                className="h-9 px-3"
              >
                新建业务分类
              </MdButton>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-80">
                <MdInput
                  placeholder="搜索分类编码、名称、业务线或描述"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCategorySearch()}
                  clearable
                  onClear={() => {
                    setCategorySearchQuery("");
                    loadCategoryData(1, categoryPagination.pageSize, "");
                  }}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="h-9"
                />
              </div>
              <MdButton
                onClick={handleCategorySearch}
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9 px-3"
              >
                查询
              </MdButton>
              <MdButton
                variant="outline"
                onClick={handleCategoryReset}
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
                  <FolderTree className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">业务分类总数</p>
                  <p className="font-semibold text-lg">{categoryPagination.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已启用</p>
                  <p className="font-semibold text-lg">
                    {categoryTableData.filter(item => item.status === '启用').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FolderTree className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">数据目录总数</p>
                  <p className="font-semibold text-lg">
                    {categoryTableData.reduce((sum, item) => sum + item.dataCatalogCount, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已禁用</p>
                  <p className="font-semibold text-lg">
                    {categoryTableData.filter(item => item.status === '禁用').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <MdTable<BusinessCategory>
              columns={categoryColumns}
              data={categoryTableData}
              loading={categoryLoading}
              pagination={{
                current: categoryPagination.current,
                pageSize: categoryPagination.pageSize,
                total: categoryPagination.total,
                onChange: (page, size) => loadCategoryData(page, size),
              }}
              className="h-full"
            />
          </div>

          {/* 新建/编辑业务分类抽屉 */}
          <MdDrawer
            open={showCategoryDrawer}
            onClose={() => setShowCategoryDrawer(false)}
            width="500px"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingCategory ? '编辑业务分类' : '新建业务分类'}
                </h2>
                <MdButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCategoryDrawer(false)}
                >
                  取消
                </MdButton>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    分类编码 *
                  </label>
                  <MdInput
                    value={categoryFormData.categoryCode}
                    onChange={(e) => setCategoryFormData({...categoryFormData, categoryCode: e.target.value})}
                    placeholder="请输入分类编码"
                    className="w-full"
                    disabled={!!editingCategory}
                  />
                  {editingCategory && (
                    <p className="text-xs text-muted-foreground mt-1">
                      分类编码创建后不可修改
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    分类名称 *
                  </label>
                  <MdInput
                    value={categoryFormData.categoryName}
                    onChange={(e) => setCategoryFormData({...categoryFormData, categoryName: e.target.value})}
                    placeholder="请输入分类名称"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    业务线 *
                  </label>
                  <MdSelect
                    options={businessLineOptions}
                    value={categoryFormData.businessLine}
                    onChange={(value) => setCategoryFormData({...categoryFormData, businessLine: value as string})}
                    placeholder="请选择业务线"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    状态
                  </label>
                  <MdSelect
                    options={statusOptions}
                    value={categoryFormData.status}
                    onChange={(value) => setCategoryFormData({...categoryFormData, status: value as '启用' | '禁用'})}
                    placeholder="请选择状态"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    描述
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    placeholder="请输入描述信息"
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <MdButton 
                  variant="outline" 
                  onClick={() => setShowCategoryDrawer(false)}
                >
                  取消
                </MdButton>
                <MdButton 
                  onClick={handleCategorySave}
                >
                  保存
                </MdButton>
              </div>
            </div>
          </MdDrawer>
        </>
      )}

      {/* 标准指标管理 */}
      {activeTab === 'indicator' && (
        <>
          {/* 搜索区域 */}
          <div className="flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <MdButton 
                onClick={handleIndicatorCreate} 
                leftIcon={<Plus className="h-4 w-4" />} 
                className="h-9 px-3"
              >
                新建标准指标
              </MdButton>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-80">
                <MdInput
                  placeholder="搜索指标编码、名称、业务线或分类"
                  value={indicatorSearchQuery}
                  onChange={(e) => setIndicatorSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleIndicatorSearch()}
                  clearable
                  onClear={() => {
                    setIndicatorSearchQuery("");
                    loadIndicatorData(1, indicatorPagination.pageSize, "");
                  }}
                  leftIcon={<Search className="h-4 w-4" />}
                  className="h-9"
                />
              </div>
              <MdButton
                onClick={handleIndicatorSearch}
                leftIcon={<Search className="h-4 w-4" />}
                className="h-9 px-3"
              >
                查询
              </MdButton>
              <MdButton
                variant="outline"
                onClick={handleIndicatorReset}
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
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">标准指标总数</p>
                  <p className="font-semibold text-lg">{indicatorPagination.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已启用</p>
                  <p className="font-semibold text-lg">
                    {indicatorTableData.filter(item => item.status === '启用').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">业务线数量</p>
                  <p className="font-semibold text-lg">
                    {new Set(indicatorTableData.map(item => item.businessLine)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">已禁用</p>
                  <p className="font-semibold text-lg">
                    {indicatorTableData.filter(item => item.status === '禁用').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <MdTable<StandardIndicator>
              columns={indicatorColumns}
              data={indicatorTableData}
              loading={indicatorLoading}
              pagination={{
                current: indicatorPagination.current,
                pageSize: indicatorPagination.pageSize,
                total: indicatorPagination.total,
                onChange: (page, size) => loadIndicatorData(page, size),
              }}
              className="h-full"
            />
          </div>

          {/* 新建/编辑标准指标抽屉 */}
          <MdDrawer
            open={showIndicatorDrawer}
            onClose={() => setShowIndicatorDrawer(false)}
            width="600px"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingIndicator ? '编辑标准指标' : '新建标准指标'}
                </h2>
                <MdButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowIndicatorDrawer(false)}
                >
                  取消
                </MdButton>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    指标编码 *
                  </label>
                  <MdInput
                    value={indicatorFormData.indicatorCode}
                    onChange={(e) => setIndicatorFormData({...indicatorFormData, indicatorCode: e.target.value})}
                    placeholder="请输入指标编码"
                    className="w-full"
                    disabled={!!editingIndicator}
                  />
                  {editingIndicator && (
                    <p className="text-xs text-muted-foreground mt-1">
                      指标编码创建后不可修改
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    指标名称 *
                  </label>
                  <MdInput
                    value={indicatorFormData.indicatorName}
                    onChange={(e) => setIndicatorFormData({...indicatorFormData, indicatorName: e.target.value})}
                    placeholder="请输入指标名称"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    业务线 *
                  </label>
                  <MdSelect
                    options={businessLineOptions}
                    value={indicatorFormData.businessLine}
                    onChange={(value) => setIndicatorFormData({...indicatorFormData, businessLine: value as string})}
                    placeholder="请选择业务线"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    所属分类
                  </label>
                  <MdInput
                    value={indicatorFormData.category}
                    onChange={(e) => setIndicatorFormData({...indicatorFormData, category: e.target.value})}
                    placeholder="请输入所属分类"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    计算公式 *
                  </label>
                  <textarea
                    value={indicatorFormData.calculationFormula}
                    onChange={(e) => setIndicatorFormData({...indicatorFormData, calculationFormula: e.target.value})}
                    placeholder="请输入计算公式，如：SUM(order_amount)"
                    rows={2}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      单位
                    </label>
                    <MdInput
                      value={indicatorFormData.unit}
                      onChange={(e) => setIndicatorFormData({...indicatorFormData, unit: e.target.value})}
                      placeholder="如：元、单、%"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      数据源
                    </label>
                    <MdInput
                      value={indicatorFormData.dataSource}
                      onChange={(e) => setIndicatorFormData({...indicatorFormData, dataSource: e.target.value})}
                      placeholder="数据表名"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    状态
                  </label>
                  <MdSelect
                    options={statusOptions}
                    value={indicatorFormData.status}
                    onChange={(value) => setIndicatorFormData({...indicatorFormData, status: value as '启用' | '禁用'})}
                    placeholder="请选择状态"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    描述
                  </label>
                  <textarea
                    value={indicatorFormData.description}
                    onChange={(e) => setIndicatorFormData({...indicatorFormData, description: e.target.value})}
                    placeholder="请输入指标描述信息"
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <MdButton 
                  variant="outline" 
                  onClick={() => setShowIndicatorDrawer(false)}
                >
                  取消
                </MdButton>
                <MdButton 
                  onClick={handleIndicatorSave}
                >
                  保存
                </MdButton>
              </div>
            </div>
          </MdDrawer>
        </>
      )}
    </div>
  );
}
