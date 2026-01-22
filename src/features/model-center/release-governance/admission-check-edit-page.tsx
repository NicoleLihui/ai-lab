"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardHeader, MdCardTitle, MdCardContent } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { ArrowLeft, Save } from 'lucide-react';

interface TestFormData {
  testName: string;
  modelId: string;
  modelName: string;
  modelType: string;
  modelVersion: string;
  testType: '冒烟测试' | '基准测试' | '';
  description: string;
  testConfig?: {
    timeout?: number;
    retryCount?: number;
    testCases?: string[];
  };
}

const AdmissionCheckEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestFormData>({
    testName: '',
    modelId: '',
    modelName: '',
    modelType: '',
    modelVersion: '',
    testType: '',
    description: '',
    testConfig: {
      timeout: 300,
      retryCount: 3,
      testCases: []
    }
  });

  // 模型类型选项
  const modelTypeOptions = [
    { value: '1', label: '机器学习' },
    { value: '2', label: '智能体' },
    { value: '3', label: '数据规则模型' },
  ];

  // 测试类型选项
  const testTypeOptions = [
    { value: 'smoke', label: '冒烟测试' },
    { value: 'benchmark', label: '基准测试' },
  ];

  // 模拟模型列表（实际应该从API获取）
  const modelOptions = [
    { value: 'ML001', label: 'A2O外回流比推理模型 (v3.0)' },
    { value: 'ML002', label: '客户流失预测模型 (v1.2.0)' },
    { value: 'AG001', label: '智能客服助手 (v2.1.0)' },
    { value: 'DR001', label: '数据规则模型 (v1.0.5)' },
  ];

  useEffect(() => {
    if (!testId) {
      router.back();
      return;
    }

    // TODO: 调用实际API获取详情
    // getAdmissionCheckDetail(testId).then((res) => {
    //   if (res.success) {
    //     const data = res.data;
    //     setFormData({
    //       testName: data.testName,
    //       modelId: data.modelId,
    //       modelName: data.modelName,
    //       modelType: data.modelType,
    //       modelVersion: data.modelVersion,
    //       testType: data.testType === '冒烟测试' ? 'smoke' : 'benchmark',
    //       description: data.description || '',
    //       testConfig: data.testConfig || { timeout: 300, retryCount: 3, testCases: [] }
    //     });
    //   }
    // }).finally(() => {
    //   setIsLoading(false);
    // });

    // 模拟数据加载
    setTimeout(() => {
      setFormData({
        testName: 'A2O外回流比推理模型-冒烟测试',
        modelId: 'ML001',
        modelName: 'A2O外回流比推理模型',
        modelType: '机器学习',
        modelVersion: 'v3.0',
        testType: 'smoke',
        description: '基础功能冒烟测试，验证模型的基本输入输出功能',
        testConfig: {
          timeout: 300,
          retryCount: 3,
          testCases: []
        }
      });
      setIsLoading(false);
    }, 500);
  }, [testId, router]);

  const handleInputChange = (field: keyof TestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModelSelect = (value: string) => {
    // 解析模型信息
    const selectedModel = modelOptions.find(m => m.value === value);
    if (selectedModel) {
      const parts = selectedModel.label.split(' (');
      setFormData(prev => ({
        ...prev,
        modelId: value,
        modelName: parts[0],
        modelVersion: parts[1]?.replace(')', '') || ''
      }));
    }
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.testName.trim()) {
      alert('请输入测试名称');
      return;
    }
    if (!formData.modelId) {
      alert('请选择模型');
      return;
    }
    if (!formData.testType) {
      alert('请选择测试类型');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 调用实际API
      // await updateAdmissionCheck(testId, {
      //   ...formData,
      //   testType: formData.testType === 'smoke' ? '冒烟测试' : '基准测试'
      // });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('更新测试:', formData);
      alert('更新成功');
      router.push('/categories/model-center/release-governance/admission-check');
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader className="border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdButton
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleCancel}
            >
              返回
            </MdButton>
            <MdCardTitle>编辑准入检测</MdCardTitle>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-6">
          <div className="space-y-6 max-w-3xl">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                基本信息
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <MdInput
                  label="测试名称"
                  placeholder="请输入测试名称"
                  value={formData.testName}
                  onChange={(e) => handleInputChange('testName', e.target.value)}
                  required
                />
                
                <MdSelect
                  label="测试类型"
                  options={testTypeOptions}
                  value={formData.testType}
                  onChange={(value) => handleInputChange('testType', value)}
                  placeholder="请选择测试类型"
                  required
                />
              </div>

              <MdSelect
                label="选择模型"
                options={modelOptions}
                value={formData.modelId}
                onChange={handleModelSelect}
                placeholder="请选择要测试的模型"
                required
              />

              {formData.modelId && (
                <div className="grid grid-cols-2 gap-4">
                  <MdInput
                    label="模型名称"
                    value={formData.modelName}
                    disabled
                  />
                  <MdInput
                    label="模型版本"
                    value={formData.modelVersion}
                    disabled
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  测试描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="请输入测试描述（可选）"
                />
              </div>
            </div>

            {/* 测试配置 */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground border-b pb-2">
                测试配置
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <MdInput
                  label="超时时间（秒）"
                  type="number"
                  value={formData.testConfig?.timeout?.toString() || '300'}
                  onChange={(e) => {
                    const timeout = parseInt(e.target.value) || 300;
                    setFormData(prev => ({
                      ...prev,
                      testConfig: { ...prev.testConfig!, timeout }
                    }));
                  }}
                />
                
                <MdInput
                  label="重试次数"
                  type="number"
                  value={formData.testConfig?.retryCount?.toString() || '3'}
                  onChange={(e) => {
                    const retryCount = parseInt(e.target.value) || 3;
                    setFormData(prev => ({
                      ...prev,
                      testConfig: { ...prev.testConfig!, retryCount }
                    }));
                  }}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <MdButton variant="outline" onClick={handleCancel}>
                取消
              </MdButton>
              <MdButton
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存中...' : '保存修改'}
              </MdButton>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { AdmissionCheckEditPage };
