"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Edit, Play, CheckCircle, XCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface AdmissionCheckDetail {
  id: string;
  testName: string;
  modelId: string;
  modelName: string;
  modelType: string;
  modelVersion: string;
  testType: '冒烟测试' | '基准测试';
  testStatus: '待执行' | '执行中' | '已完成' | '已失败';
  testResult?: '通过' | '未通过';
  testDuration?: number;
  passRate?: number;
  testCases?: number;
  passedCases?: number;
  failedCases?: number;
  createBy: string;
  createTime: string;
  updateTime: string;
  description?: string;
  testConfig?: {
    timeout?: number;
    retryCount?: number;
  };
  testLogs?: string[];
  errorMessage?: string;
}

const AdmissionCheckDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  
  const [testDetail, setTestDetail] = useState<AdmissionCheckDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!testId) {
      router.back();
      return;
    }

    // TODO: 调用实际API获取详情
    // getAdmissionCheckDetail(testId).then((res) => {
    //   if (res.success) {
    //     setTestDetail(res.data);
    //   }
    // }).finally(() => {
    //   setIsLoading(false);
    // });

    // 模拟数据
    setTimeout(() => {
      const mockData: AdmissionCheckDetail = {
        id: testId,
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
        failedCases: 5,
        createBy: '张三',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-15 10:32:00',
        description: '基础功能冒烟测试，验证模型的基本输入输出功能',
        testConfig: {
          timeout: 300,
          retryCount: 3
        },
        testLogs: [
          '[2024-01-15 10:30:15] 开始执行测试...',
          '[2024-01-15 10:30:20] 加载模型成功',
          '[2024-01-15 10:30:25] 开始执行测试用例...',
          '[2024-01-15 10:31:50] 测试用例执行完成',
          '[2024-01-15 10:32:00] 测试通过，通过率: 95.5%'
        ]
      };
      setTestDetail(mockData);
      setIsLoading(false);
    }, 500);
  }, [testId, router]);

  const handleEdit = () => {
    if (testDetail && testDetail.testStatus === '待执行') {
      router.push(`/categories/model-center/release-governance/admission-check-edit?id=${testDetail.id}`);
    }
  };

  const handleRunTest = () => {
    // TODO: 调用实际API执行测试
    console.log('执行测试:', testDetail);
    alert('测试执行中...');
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!testDetail) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">测试记录不存在</div>
      </div>
    );
  }

  const statusConfig = {
    '待执行': { color: '#909399', icon: Clock, bgColor: 'bg-gray-50' },
    '执行中': { color: '#1775ff', icon: Play, bgColor: 'bg-blue-50' },
    '已完成': { color: '#19be6b', icon: CheckCircle, bgColor: 'bg-green-50' },
    '已失败': { color: '#ff9900', icon: XCircle, bgColor: 'bg-orange-50' }
  };

  const statusInfo = statusConfig[testDetail.testStatus];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader className="border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdButton
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleBack}
            >
              返回
            </MdButton>
            <MdCardTitle>测试详情</MdCardTitle>
          </div>
          <div className="flex items-center gap-3">
            {testDetail.testStatus === '待执行' && (
              <>
                <MdButton
                  variant="outline"
                  leftIcon={<Edit className="h-4 w-4" />}
                  onClick={handleEdit}
                >
                  编辑
                </MdButton>
                <MdButton
                  variant="primary"
                  leftIcon={<Play className="h-4 w-4" />}
                  onClick={handleRunTest}
                >
                  执行测试
                </MdButton>
              </>
            )}
          </div>
        </MdCardHeader>
        <MdCardContent className="p-6">
          <div className="space-y-6">
            {/* 状态卡片 */}
            <div className={`p-4 rounded-lg ${statusInfo.bgColor} border border-border`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className="h-6 w-6" style={{ color: statusInfo.color }} />
                  <div>
                    <div className="text-sm font-medium text-foreground">测试状态</div>
                    <div className="text-lg font-bold" style={{ color: statusInfo.color }}>
                      {testDetail.testStatus}
                    </div>
                  </div>
                </div>
                {testDetail.testResult && (
                  <MdBadge 
                    variant={testDetail.testResult === '通过' ? 'success' : 'warning'}
                    className="text-base px-4 py-2"
                  >
                    {testDetail.testResult}
                  </MdBadge>
                )}
              </div>
            </div>

            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                基本信息
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">测试名称</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.testName}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">测试类型</label>
                  <div className="mt-1">
                    <MdBadge variant="outline">{testDetail.testType}</MdBadge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">模型名称</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.modelName}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">模型类型</label>
                  <div className="mt-1">
                    <MdBadge variant="secondary">{testDetail.modelType}</MdBadge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">模型版本</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.modelVersion}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">模型ID</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.modelId}
                  </div>
                </div>
                
                {testDetail.description && (
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">测试描述</label>
                    <div className="mt-1 text-sm text-foreground">
                      {testDetail.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 测试结果 */}
            {(testDetail.testStatus === '已完成' || testDetail.testStatus === '已失败') && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground border-b pb-2">
                  测试结果
                </h3>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">通过率</div>
                    <div className={`text-2xl font-bold mt-1 ${
                      testDetail.passRate && testDetail.passRate >= 90 
                        ? 'text-green-600' 
                        : testDetail.passRate && testDetail.passRate >= 70 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {testDetail.passRate?.toFixed(1) || 0}%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">测试用例总数</div>
                    <div className="text-2xl font-bold mt-1 text-foreground">
                      {testDetail.testCases || 0}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">通过用例</div>
                    <div className="text-2xl font-bold mt-1 text-green-600">
                      {testDetail.passedCases || 0}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">失败用例</div>
                    <div className="text-2xl font-bold mt-1 text-red-600">
                      {testDetail.failedCases || 0}
                    </div>
                  </div>
                </div>
                
                {testDetail.testDuration && (
                  <div>
                    <label className="text-sm text-muted-foreground">测试时长</label>
                    <div className="mt-1 text-sm font-medium text-foreground">
                      {testDetail.testDuration} 秒
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 测试配置 */}
            {testDetail.testConfig && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground border-b pb-2">
                  测试配置
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">超时时间</label>
                    <div className="mt-1 text-sm font-medium text-foreground">
                      {testDetail.testConfig.timeout} 秒
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground">重试次数</label>
                    <div className="mt-1 text-sm font-medium text-foreground">
                      {testDetail.testConfig.retryCount} 次
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 测试日志 */}
            {testDetail.testLogs && testDetail.testLogs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground border-b pb-2">
                  测试日志
                </h3>
                
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {testDetail.testLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 错误信息 */}
            {testDetail.errorMessage && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  错误信息
                </h3>
                
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                  {testDetail.errorMessage}
                </div>
              </div>
            )}

            {/* 其他信息 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                其他信息
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">创建人</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.createBy}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">创建时间</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.createTime}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">更新时间</label>
                  <div className="mt-1 text-sm font-medium text-foreground">
                    {testDetail.updateTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { AdmissionCheckDetailPage };
