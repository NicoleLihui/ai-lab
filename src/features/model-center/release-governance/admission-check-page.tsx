"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import BeTable from '@/components/enterprise-ui/table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { AdvancedSearch } from '@/components/enterprise-ui/advanced-search';
import { Plus, Eye, Edit, Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

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
        testName: '客户流失预测模型-基准测试',
        modelId: 'ML002',
        modelName: '客户流失预测模型',
        modelType: '机器学习',
        modelVersion: 'v1.2.0',
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
        testName: '推荐系统模型-冒烟测试',
        modelId: 'ML003',
        modelName: '推荐系统模型',
        modelType: '机器学习',
        modelVersion: 'v2.5.0',
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
    router.push('/categories/model-center/release-governance/admission-check-create');
  };

  // 查看详情
  const handleViewDetail = (row: AdmissionCheck) => {
    router.push(`/categories/model-center/release-governance/admission-check-detail?id=${row.id}`);
  };

  // 编辑
  const handleEdit = (row: AdmissionCheck) => {
    router.push(`/categories/model-center/release-governance/admission-check-edit?id=${row.id}`);
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

  // 表格列定义
  const columns = [
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
      minWidth: 200,
      align: 'center',
      buttons: (row: AdmissionCheck) => {
        const btns = [];
        
        // 详情 - 所有状态都显示
        btns.push({
          name: '详情',
          type: 'primary',
          command: 'detail'
        });
        
        // 编辑 - 待执行状态显示
        if (row.testStatus === '待执行') {
          btns.push({
            name: '编辑',
            type: 'primary',
            command: 'edit'
          });
        }
        
        // 执行 - 待执行或已失败状态显示
        if (row.testStatus === '待执行' || row.testStatus === '已失败') {
          btns.push({
            name: '执行',
            type: 'success',
            command: 'run'
          });
        }
        
        return btns;
      }
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
      <MdCard>
        <MdCardHeader className="border-b flex items-center justify-between">
          <MdCardTitle>准入检测列表</MdCardTitle>
          <MdButton 
            variant="primary" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleCreate}
          >
            新增测试
          </MdButton>
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
              }
            }}
          />
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { AdmissionCheckPage };
