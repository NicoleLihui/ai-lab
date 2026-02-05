"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { AdvancedSearch } from '@/components/enterprise-ui/advanced-search';
import { Plus, Eye, Edit, Play, CheckCircle, XCircle, Clock, AlertCircle, Download, BarChart3, CheckSquare, MoreVertical } from 'lucide-react';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';

// 定义准入检测数据接口
interface AdmissionCheck {
  id: string;
  testName: string;
  modelId: string;
  modelName: string;
  modelType: string;
  modelVersion: string;
  testType: '冒烟测试' | '基准测试';
  testStatus: '待执行' | '执行中' | '已完成' | '已失败';
  testResult?: '通过' | '未通过';
  testDuration?: number; // 秒
  passRate?: number; // 通过率
  testCases?: number; // 测试用例数
  passedCases?: number; // 通过用例数
  createBy: string;
  createTime: string;
  updateTime: string;
  description?: string;
}

// 主页面组件
const AdmissionCheckPage: React.FC = () => {
  const router = useRouter();
  const [tests, setTests] = useState<AdmissionCheck[]>([]);
  const [filteredTests, setFilteredTests] = useState<AdmissionCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [showChart, setShowChart] = useState(false);
  
  // 搜索表单数据
  const [formData, setFormData] = useState({
    testName: '',
    modelName: '',
    modelType: '',
    testType: '',
    testStatus: ''
  });

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: '1', label: '待执行' },
    { value: '2', label: '执行中' },
    { value: '3', label: '已完成' },
    { value: '4', label: '已失败' },
  ];

  // 测试类型选项
  const testTypeOptions = [
    { value: 'all', label: '全部' },
    { value: 'smoke', label: '冒烟测试' },
    { value: 'benchmark', label: '基准测试' },
  ];

  // 模型类型选项
  const modelTypeOptions = [
    { value: 'all', label: '全部' },
    { value: '1', label: '机器学习' },
    { value: '2', label: '智能体' },
    { value: '3', label: '数据规则模型' },
  ];

  // 模拟数据
  useEffect(() => {
    const mockData: AdmissionCheck[] = [
      {
        id: '1',
        testName: 'A2O外回流比推理模型-冒烟测试',
        modelId: 'ML001',
        modelName: 'A2O外回流比推理模型',
        modelType: '机器学习',
        modelVersion: 'v3.0',
        testType: '冒烟测试',
        testStatus: '已完成',
        testResult: '通过',
        testDuration: 120,
        passRate: 95.5,
        testCases: 100,
        passedCases: 95,
        createBy: '张三',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 10:32:00',
        description: '基础功能冒烟测试'
      },
      {
        id: '2',
        testName: '用水量预测模型-基准测试',
        modelId: 'ML002',
        modelName: '用水量预测模型',
        modelType: '机器学习',
        modelVersion: 'v2.1.0',
        testType: '基准测试',
        testStatus: '执行中',
        testDuration: 0,
        createBy: '李四',
        createTime: '2024-01-16 14:22:15',
        updateTime: '2024-01-16 14:22:15',
        description: '性能基准测试'
      },
      {
        id: '3',
        testName: '智能客服助手-冒烟测试',
        modelId: 'AG001',
        modelName: '智能客服助手',
        modelType: '智能体',
        modelVersion: 'v2.1.0',
        testType: '冒烟测试',
        testStatus: '已完成',
        testResult: '未通过',
        testDuration: 85,
        passRate: 72.0,
        testCases: 50,
        passedCases: 36,
        createBy: '王五',
        createTime: '2024-01-17 09:15:00',
        updateTime: '2024-01-17 09:16:25',
        description: '基础功能冒烟测试'
      },
      {
        id: '4',
        testName: '数据规则模型-基准测试',
        modelId: 'DR001',
        modelName: '数据规则模型',
        modelType: '数据规则模型',
        modelVersion: 'v1.0.5',
        testType: '基准测试',
        testStatus: '待执行',
        createBy: '赵六',
        createTime: '2024-01-18 11:20:00',
        updateTime: '2024-01-18 11:20:00',
        description: '性能基准测试'
      },
      {
        id: '5',
        testName: 'COD去除率预测模型-冒烟测试',
        modelId: 'ML003',
        modelName: 'COD去除率预测模型',
        modelType: '机器学习',
        modelVersion: 'v2.0.1',
        testType: '冒烟测试',
        testStatus: '已失败',
        testResult: '未通过',
        testDuration: 45,
        passRate: 45.0,
        testCases: 80,
        passedCases: 36,
        createBy: '钱七',
        createTime: '2024-01-19 08:30:00',
        updateTime: '2024-01-19 08:30:45',
        description: '基础功能冒烟测试'
      }
    ];
    setTests(mockData);
    setFilteredTests(mockData);
    setTotal(mockData.length);
  }, []);

  // 加载表格数据
  const loadTableData = useCallback(() => {
    setIsLoading(true);
    // TODO: 调用实际API
    // getAdmissionCheckList({
    //   currentPage,
    //   pageSize,
    //   ...formData
    // }).then((res) => {
    //   if (res.success) {
    //     setTests(res.data.records);
    //     setTotal(res.data.total);
    //   }
    // }).finally(() => {
    //   setIsLoading(false);
    // });
    
    // 模拟API调用
    setTimeout(() => {
      let result = [...tests];
      
      // 按测试名称过滤
      if (formData.testName) {
        result = result.filter(item => 
          item.testName.toLowerCase().includes(formData.testName.toLowerCase())
        );
      }
      
      // 按模型名称过滤
      if (formData.modelName) {
        result = result.filter(item => 
          item.modelName.toLowerCase().includes(formData.modelName.toLowerCase())
        );
      }
      
      // 按模型类型过滤
      if (formData.modelType && formData.modelType !== 'all') {
        const typeMap: Record<string, string> = {
          '1': '机器学习',
          '2': '智能体',
          '3': '数据规则模型'
        };
        result = result.filter(item => 
          item.modelType === typeMap[formData.modelType as string]
        );
      }
      
      // 按测试类型过滤
      if (formData.testType && formData.testType !== 'all') {
        const typeMap: Record<string, string> = {
          'smoke': '冒烟测试',
          'benchmark': '基准测试'
        };
        result = result.filter(item => 
          item.testType === typeMap[formData.testType as string]
        );
      }
      
      // 按状态过滤
      if (formData.testStatus && formData.testStatus !== 'all') {
        const statusMap: Record<string, string> = {
          '1': '待执行',
          '2': '执行中',
          '3': '已完成',
          '4': '已失败'
        };
        result = result.filter(item => 
          item.testStatus === statusMap[formData.testStatus as string]
        );
      }
      
      setFilteredTests(result);
      setTotal(result.length);
      setIsLoading(false);
    }, 300);
  }, [tests, formData]);

  useEffect(() => {
    loadTableData();
  }, [currentPage, pageSize, formData, loadTableData]);

  // 搜索
  const handleFilterSearch = (data: any) => {
    setFormData(data);
    setCurrentPage(1);
  };

  // 重置
  const handleFilterReset = () => {
    setFormData({
      testName: '',
      modelName: '',
      modelType: '',
      testType: '',
      testStatus: ''
    });
    setCurrentPage(1);
  };

  // 新增测试
  const handleCreate = () => {
    router.push('/categories/model-lab/release-governance/admission-check-create');
  };

  // 查看详情
  const handleViewDetail = (row: AdmissionCheck) => {
    router.push(`/categories/model-lab/release-governance/admission-check-detail?id=${row.id}`);
  };

  // 编辑
  const handleEdit = (row: AdmissionCheck) => {
    router.push(`/categories/model-lab/release-governance/admission-check-edit?id=${row.id}`);
  };

  // 执行测试
  const handleRunTest = (row: AdmissionCheck) => {
    // TODO: 调用实际API执行测试
    console.log('执行测试:', row);
    // 更新状态为执行中
    const updatedTests = tests.map(test => {
      if (test.id === row.id) {
        return { ...test, testStatus: '执行中' as const };
      }
      return test;
    });
    setTests(updatedTests);
    loadTableData();
  };

  // 批量执行测试
  const handleBatchRun = () => {
    if (selectedTests.size === 0) {
      alert('请先选择要执行的测试');
      return;
    }
    const selected = filteredTests.filter(t => selectedTests.has(t.id));
    const canRun = selected.filter(t => t.testStatus === '待执行' || t.testStatus === '已失败');
    if (canRun.length === 0) {
      alert('选中的测试中没有可执行的任务');
      return;
    }
    if (confirm(`确定执行选中的 ${canRun.length} 个测试？`)) {
      const updatedTests = tests.map(test => {
        if (selectedTests.has(test.id) && (test.testStatus === '待执行' || test.testStatus === '已失败')) {
          return { ...test, testStatus: '执行中' as const };
        }
        return test;
      });
      setTests(updatedTests);
      setSelectedTests(new Set());
      loadTableData();
    }
  };

  // 下载测试报告
  const handleDownloadReport = (row: AdmissionCheck) => {
    if (row.testStatus !== '已完成') {
      alert('只有已完成的测试才能下载报告');
      return;
    }
    // 模拟生成报告
    const reportData = {
      testName: row.testName,
      modelName: row.modelName,
      testType: row.testType,
      testResult: row.testResult,
      passRate: row.passRate,
      testCases: row.testCases,
      passedCases: row.passedCases,
      testDuration: row.testDuration,
      createTime: row.createTime,
      updateTime: row.updateTime
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test_report_${row.testName}_${row.updateTime.replace(/[: ]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 批量下载报告
  const handleBatchDownload = () => {
    if (selectedTests.size === 0) {
      alert('请先选择要下载的测试');
      return;
    }
    const selected = filteredTests.filter(t => selectedTests.has(t.id) && t.testStatus === '已完成');
    if (selected.length === 0) {
      alert('选中的测试中没有已完成的测试报告');
      return;
    }
    selected.forEach(test => handleDownloadReport(test));
  };

  // 全选/取消全选
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTests(new Set(filteredTests.map(t => t.id)));
    } else {
      setSelectedTests(new Set());
    }
  };

  // 切换单个选择
  const toggleSelectTest = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTests);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTests(newSelected);
  };

  // 获取通过率趋势数据
  const getPassRateTrendData = () => {
    const completedTests = filteredTests.filter(t => t.testStatus === '已完成' && t.passRate !== undefined);
    return completedTests
      .sort((a, b) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime())
      .map((test, index) => ({
        name: `测试${index + 1}`,
        passRate: test.passRate || 0,
        date: test.updateTime
      }));
  };

  const allSelected = filteredTests.length > 0 && filteredTests.every(t => selectedTests.has(t.id));
  const someSelected = selectedTests.size > 0 && selectedTests.size < filteredTests.length;

  // 操作菜单组件
  const ActionMenu: React.FC<{ row: AdmissionCheck; onCommand: (command: string, row: AdmissionCheck) => void }> = ({ row, onCommand }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const menuItems = [
      {
        label: '详情',
        icon: Eye,
        onClick: () => {
          onCommand('detail', row);
          setIsOpen(false);
        },
        show: true,
      },
      {
        label: '编辑',
        icon: Edit,
        onClick: () => {
          onCommand('edit', row);
          setIsOpen(false);
        },
        show: row.testStatus === '待执行',
      },
      {
        label: '执行',
        icon: Play,
        onClick: () => {
          onCommand('run', row);
          setIsOpen(false);
        },
        show: row.testStatus === '待执行' || row.testStatus === '已失败',
      },
      {
        label: '下载报告',
        icon: Download,
        onClick: () => {
          onCommand('download', row);
          setIsOpen(false);
        },
        show: row.testStatus === '已完成',
      },
    ].filter(item => item.show);

    const getMenuPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0, maxHeight: 'none' };
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuItems.length * 36 + 8;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuWidth = 140;
      
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
      
      const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      const top = showAbove ? rect.top - menuHeight - 4 : rect.bottom + 4;
      
      const maxHeight = showAbove 
        ? Math.min(menuHeight, spaceAbove - 8)
        : Math.min(menuHeight, spaceBelow - 8);
      
      return {
        top,
        left,
        maxHeight: maxHeight > 100 ? maxHeight : 100,
      };
    };

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
          aria-label="更多操作"
        >
          <MoreVertical className="h-4 w-4 text-foreground" />
        </button>
        {isOpen &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 py-1 min-w-[140px] overflow-y-auto"
              style={{
                top: getMenuPosition().top,
                left: getMenuPosition().left,
                maxHeight: getMenuPosition().maxHeight,
              }}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>,
            document.body
          )}
      </div>
    );
  };

  // 表格列定义
  const columns = [
    {
      prop: 'select',
      label: (
        <MdCheckbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleSelectAll}
        />
      ),
      align: 'center',
      width: 60,
      render: (row: AdmissionCheck) => (
        <MdCheckbox
          checked={selectedTests.has(row.id)}
          onChange={(checked) => toggleSelectTest(row.id, checked)}
        />
      )
    },
    {
      type: 'index',
      prop: 'index',
      label: '序号',
      align: 'center',
      width: 60
    },
    {
      prop: 'testStatus',
      label: '测试状态',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => {
        const statusConfig = {
          '待执行': { color: '#909399', icon: Clock },
          '执行中': { color: '#1775ff', icon: Play },
          '已完成': { color: '#19be6b', icon: CheckCircle },
          '已失败': { color: '#ff9900', icon: XCircle }
        };
        const config = statusConfig[row.testStatus];
        const Icon = config.icon;
        return (
          <div className="flex items-center justify-center">
            <Icon className="h-4 w-4 mr-1" style={{ color: config.color }} />
            <span style={{ color: config.color }}>{row.testStatus}</span>
          </div>
        );
      }
    },
    {
      prop: 'testResult',
      label: '测试结果',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => {
        if (!row.testResult) return '-';
        const resultConfig = {
          '通过': { color: '#19be6b', bgColor: '#f0f9ff' },
          '未通过': { color: '#ff9900', bgColor: '#fff7ed' }
        };
        const config = resultConfig[row.testResult];
        return (
          <MdBadge 
            variant={row.testResult === '通过' ? 'success' : 'warning'}
          >
            {row.testResult}
          </MdBadge>
        );
      }
    },
    {
      prop: 'testName',
      label: '测试名称',
      align: 'center',
      minWidth: 200
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center',
      minWidth: 150
    },
    {
      prop: 'modelType',
      label: '模型类型',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => (
        <MdBadge variant="secondary">{row.modelType}</MdBadge>
      )
    },
    {
      prop: 'modelVersion',
      label: '模型版本',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'testType',
      label: '测试类型',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => (
        <MdBadge variant="outline">{row.testType}</MdBadge>
      )
    },
    {
      prop: 'passRate',
      label: '通过率',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => {
        if (row.passRate === undefined) return '-';
        return (
          <span className={row.passRate >= 90 ? 'text-green-600' : row.passRate >= 70 ? 'text-yellow-600' : 'text-red-600'}>
            {row.passRate.toFixed(1)}%
          </span>
        );
      }
    },
    {
      prop: 'testCases',
      label: '测试用例',
      align: 'center',
      minWidth: 120,
      render: (row: AdmissionCheck) => {
        if (row.testCases === undefined) return '-';
        return `${row.passedCases || 0}/${row.testCases}`;
      }
    },
    {
      prop: 'testDuration',
      label: '测试时长',
      align: 'center',
      minWidth: 100,
      render: (row: AdmissionCheck) => {
        if (row.testDuration === undefined) return '-';
        return `${row.testDuration}秒`;
      }
    },
    {
      prop: 'createBy',
      label: '创建人',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      minWidth: 160
    },
    {
      type: 'actions',
      label: '操作',
      width: 80,
      align: 'center',
      render: (row: AdmissionCheck) => (
        <ActionMenu row={row} onCommand={(command, r) => {
          switch (command) {
            case 'detail':
              handleViewDetail(r);
              break;
            case 'edit':
              handleEdit(r);
              break;
            case 'run':
              handleRunTest(r);
              break;
            case 'download':
              handleDownloadReport(r);
              break;
          }
        }} />
      )
    }
  ];

  // 搜索表单配置
  const searchFormItems = [
    {
      type: 'input' as const,
      label: '测试名称',
      paramKey: 'testName',
      placeholder: '请输入测试名称',
      modelValue: formData.testName
    },
    {
      type: 'input' as const,
      label: '模型名称',
      paramKey: 'modelName',
      placeholder: '请输入模型名称',
      modelValue: formData.modelName
    },
    {
      type: 'select' as const,
      label: '模型类型',
      paramKey: 'modelType',
      placeholder: '请选择',
      modelValue: formData.modelType,
      selectOptions: modelTypeOptions
    },
    {
      type: 'select' as const,
      label: '测试类型',
      paramKey: 'testType',
      placeholder: '请选择',
      modelValue: formData.testType,
      selectOptions: testTypeOptions
    },
    {
      type: 'select' as const,
      label: '测试状态',
      paramKey: 'testStatus',
      placeholder: '请选择',
      modelValue: formData.testStatus,
      selectOptions: statusOptions
    }
  ];

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <MdCard>
        <MdCardHeader className="flex items-center justify-between">
          <MdCardTitle>测试统计</MdCardTitle>
          <MdButton 
            variant="outline"
            onClick={() => setShowChart(!showChart)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {showChart ? '隐藏图表' : '显示图表'}
          </MdButton>
        </MdCardHeader>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{filteredTests.length}</div>
              <div className="text-xs text-muted-foreground">测试总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredTests.filter(t => t.testStatus === '已完成' && t.testResult === '通过').length}
              </div>
              <div className="text-xs text-muted-foreground">通过数量</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTests.filter(t => t.testStatus === '已完成' && t.testResult === '未通过').length}
              </div>
              <div className="text-xs text-muted-foreground">未通过数量</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTests.filter(t => t.testStatus === '执行中').length}
              </div>
              <div className="text-xs text-muted-foreground">执行中</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {filteredTests.filter(t => t.passRate !== undefined).length > 0
                  ? (filteredTests.filter(t => t.passRate !== undefined).reduce((sum, t) => sum + (t.passRate || 0), 0) / 
                     filteredTests.filter(t => t.passRate !== undefined).length).toFixed(1)
                  : '0'}%
              </div>
              <div className="text-xs text-muted-foreground">平均通过率</div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
      {/* 通过率趋势图 */}
      {showChart && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>通过率趋势</MdCardTitle>
          </MdCardHeader>
          <MdCardContent>
            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm text-muted-foreground">
                  {getPassRateTrendData().length > 0 ? (
                    <div className="space-y-2">
                      {getPassRateTrendData().map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <span className="text-xs">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.passRate >= 90 ? 'bg-green-600' : 
                                  item.passRate >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${item.passRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">{item.passRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    '暂无已完成的测试数据'
                  )}
                </div>
              </div>
            </div>
          </MdCardContent>
        </MdCard>
      )}
      <MdCard>
        <MdCardHeader className="border-b flex items-center justify-between">
          <MdCardTitle>准入检测列表</MdCardTitle>
          <div className="flex gap-2">
            {selectedTests.size > 0 && (
              <>
                <MdButton 
                  variant="outline" 
                  onClick={handleBatchRun}
                >
                  <Play className="mr-2 h-4 w-4" />
                  批量执行 ({selectedTests.size})
                </MdButton>
                <MdButton 
                  variant="outline" 
                  onClick={handleBatchDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  批量下载报告
                </MdButton>
              </>
            )}
            <MdButton 
              variant="primary" 
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              新增测试
            </MdButton>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <div className="p-4 border-b">
            <AdvancedSearch
              formItemList={searchFormItems}
              onSearch={handleFilterSearch}
              onReset={handleFilterReset}
            />
          </div>
          <BeTable
            tableData={filteredTests}
            columns={columns}
            options={{ 
              rowKey: 'id',
              loading: isLoading,
              paginationConfig: {
                currentPage,
                pageSize,
                total
              }
            }}
            onCommand={(command, row) => {
              const test = row as AdmissionCheck;
              switch (command) {
                case 'detail':
                  handleViewDetail(test);
                  break;
                case 'edit':
                  handleEdit(test);
                  break;
                case 'run':
                  handleRunTest(test);
                  break;
                case 'download':
                  handleDownloadReport(test);
                  break;
              }
            }}
          />
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { AdmissionCheckPage };
