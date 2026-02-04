"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Plus, X, Save, Upload } from 'lucide-react';

// 参数字段定义接口
interface ParameterField {
  name: string;
  physicalFieldName: string;
  dataType: string;
  description: string;
}

// 评估指标定义接口
interface EvaluationMetric {
  metricType: string; // MAE, MSE, R², RMSE, Accuracy, Precision_0, Recall_1
  value?: number;
  enabled: boolean;
}

// 模型基础信息
interface ModelBasicInfo {
  name: string;
  type: string;
  version: string;
  status: string;
  description: string;
  owner: string;
  applicableScenario: string[];
}

// 评估指标元数据配置（元数据驱动UI）
const evaluationMetricsMetadata = [
  {
    key: 'MAE',
    label: '平均绝对误差 (MAE)',
    description: 'Mean Absolute Error',
    applicableTypes: ['回归模型', '时间序列'],
    dataType: 'number'
  },
  {
    key: 'MSE',
    label: '均方误差 (MSE)',
    description: 'Mean Squared Error',
    applicableTypes: ['回归模型', '时间序列'],
    dataType: 'number'
  },
  {
    key: 'R²',
    label: '决定系数 (R²)',
    description: 'Coefficient of Determination',
    applicableTypes: ['回归模型', '时间序列'],
    dataType: 'number'
  },
  {
    key: 'RMSE',
    label: '均方根误差 (RMSE)',
    description: 'Root Mean Squared Error',
    applicableTypes: ['回归模型', '时间序列'],
    dataType: 'number'
  },
  {
    key: 'Accuracy',
    label: '准确率 (Accuracy)',
    description: 'Classification Accuracy',
    applicableTypes: ['分类模型', 'CNN模型', 'NLP模型'],
    dataType: 'number'
  },
  {
    key: 'Precision_0',
    label: '精确率 (Precision_0)',
    description: 'Precision for Class 0',
    applicableTypes: ['分类模型', 'CNN模型', 'NLP模型'],
    dataType: 'number'
  },
  {
    key: 'Recall_1',
    label: '召回率 (Recall_1)',
    description: 'Recall for Class 1',
    applicableTypes: ['分类模型', 'CNN模型', 'NLP模型'],
    dataType: 'number'
  }
];

// 数据类型选项
const dataTypeOptions = [
  { value: 'string', label: '字符串 (String)' },
  { value: 'number', label: '数字 (Number)' },
  { value: 'integer', label: '整数 (Integer)' },
  { value: 'float', label: '浮点数 (Float)' },
  { value: 'boolean', label: '布尔值 (Boolean)' },
  { value: 'date', label: '日期 (Date)' },
  { value: 'datetime', label: '日期时间 (DateTime)' },
  { value: 'array', label: '数组 (Array)' },
  { value: 'object', label: '对象 (Object)' }
];

const MachineLearningModelCreateEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('id') !== null;
  const modelId = searchParams.get('id');

  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<ModelBasicInfo>({
    name: '',
    type: '',
    version: '',
    status: '开发中',
    description: '',
    owner: '',
    applicableScenario: []
  });

  const [inputParameters, setInputParameters] = useState<ParameterField[]>([
    { name: '', physicalFieldName: '', dataType: 'string', description: '' }
  ]);

  const [outputParameters, setOutputParameters] = useState<ParameterField[]>([
    { name: '', physicalFieldName: '', dataType: 'string', description: '' }
  ]);

  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetric[]>([]);

  const [newInputParam, setNewInputParam] = useState<ParameterField>({
    name: '',
    physicalFieldName: '',
    dataType: 'string',
    description: ''
  });

  const [newOutputParam, setNewOutputParam] = useState<ParameterField>({
    name: '',
    physicalFieldName: '',
    dataType: 'string',
    description: ''
  });

  // 模型类型选项
  const modelTypeOptions = [
    { value: '分类模型', label: '分类模型' },
    { value: '回归模型', label: '回归模型' },
    { value: '聚类模型', label: '聚类模型' },
    { value: '时间序列', label: '时间序列' },
    { value: 'NLP模型', label: 'NLP模型' },
    { value: 'CNN模型', label: 'CNN模型' },
    { value: '协同过滤', label: '协同过滤' }
  ];

  // 适用场景选项
  const scenarioOptions = [
    { value: '水质分析', label: '水质分析' },
    { value: '水量分析', label: '水量分析' },
    { value: '设备预测', label: '设备预测' },
    { value: '能耗优化', label: '能耗优化' },
    { value: '故障诊断', label: '故障诊断' }
  ];

  // 当模型类型改变时，更新可用的评估指标
  useEffect(() => {
    if (basicInfo.type) {
      const applicableMetrics = evaluationMetricsMetadata
        .filter(meta => meta.applicableTypes.includes(basicInfo.type))
        .map(meta => ({
          metricType: meta.key,
          value: undefined,
          enabled: false
        }));
      
      // 保留已启用的指标
      const existingEnabled = evaluationMetrics.filter(m => m.enabled);
      const newMetrics = applicableMetrics.map(newMetric => {
        const existing = existingEnabled.find(e => e.metricType === newMetric.metricType);
        return existing || newMetric;
      });
      
      setEvaluationMetrics(newMetrics);
    }
  }, [basicInfo.type]);

  // 加载编辑数据
  useEffect(() => {
    if (isEditMode && modelId) {
      // TODO: 从API加载模型数据
      // 这里使用模拟数据
      setBasicInfo({
        name: '示例模型',
        type: '分类模型',
        version: 'v1.0.0',
        status: '开发中',
        description: '这是一个示例模型',
        owner: '张三',
        applicableScenario: ['水质分析']
      });
    }
  }, [isEditMode, modelId]);

  // 添加输入参数
  const addInputParameter = () => {
    if (newInputParam.name && newInputParam.physicalFieldName) {
      setInputParameters([...inputParameters, { ...newInputParam }]);
      setNewInputParam({ name: '', physicalFieldName: '', dataType: 'string', description: '' });
    }
  };

  // 删除输入参数
  const removeInputParameter = (index: number) => {
    setInputParameters(inputParameters.filter((_, i) => i !== index));
  };

  // 添加输出参数
  const addOutputParameter = () => {
    if (newOutputParam.name && newOutputParam.physicalFieldName) {
      setOutputParameters([...outputParameters, { ...newOutputParam }]);
      setNewOutputParam({ name: '', physicalFieldName: '', dataType: 'string', description: '' });
    }
  };

  // 删除输出参数
  const removeOutputParameter = (index: number) => {
    setOutputParameters(outputParameters.filter((_, i) => i !== index));
  };

  // 切换评估指标启用状态
  const toggleEvaluationMetric = (metricType: string) => {
    setEvaluationMetrics(metrics =>
      metrics.map(m =>
        m.metricType === metricType ? { ...m, enabled: !m.enabled } : m
      )
    );
  };

  // 更新评估指标值
  const updateEvaluationMetricValue = (metricType: string, value: number | undefined) => {
    setEvaluationMetrics(metrics =>
      metrics.map(m =>
        m.metricType === metricType ? { ...m, value } : m
      )
    );
  };

  // 获取当前模型类型适用的评估指标元数据
  const getApplicableMetricsMetadata = () => {
    if (!basicInfo.type) return [];
    return evaluationMetricsMetadata.filter(meta =>
      meta.applicableTypes.includes(basicInfo.type)
    );
  };

  // 提交表单
  const handleSubmit = () => {
    // 验证必填字段
    if (!basicInfo.name || !basicInfo.type || !basicInfo.version) {
      alert('请填写必填字段');
      return;
    }

    if (inputParameters.length === 0) {
      alert('请至少添加一个输入参数');
      return;
    }

    if (outputParameters.length === 0) {
      alert('请至少添加一个输出参数');
      return;
    }

    // 准备提交数据
    const submitData = {
      basicInfo,
      inputParameters,
      outputParameters,
      evaluationMetrics: evaluationMetrics.filter(m => m.enabled)
    };

    console.log('提交模型数据:', submitData);
    
    // TODO: 调用API保存数据
    alert(isEditMode ? '模型更新成功！' : '模型创建成功！');
    router.push('/categories/model-lab/model-development/machine-learning-models');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? '编辑模型' : '创建模型'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? '编辑机器学习模型信息' : '创建新的机器学习模型'}
          </p>
        </div>
        <MdButton variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </MdButton>
      </div>

      {/* 步骤指示器 */}
      <MdCard>
        <MdCardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= s ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                  }`}>
                    {s}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {s === 1 && '模型基础信息'}
                    {s === 2 && '模型参数定义'}
                  </span>
                </div>
                {s < 2 && <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted-foreground'}`} />}
              </React.Fragment>
            ))}
          </div>
        </MdCardContent>
      </MdCard>

      {/* 步骤1: 模型基础信息 */}
      {step === 1 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>模型基础信息</MdCardTitle>
            <MdCardDescription>填写模型的基本信息和版本信息</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="请输入模型名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型类型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={modelTypeOptions}
                  value={basicInfo.type}
                  onChange={(value) => setBasicInfo({ ...basicInfo, type: value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型版本 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.version}
                  onChange={(e) => setBasicInfo({ ...basicInfo, version: e.target.value })}
                  placeholder="例如: v1.0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型状态
                </label>
                <MdSelect
                  options={[
                    { value: '开发中', label: '开发中' },
                    { value: '测试中', label: '测试中' },
                    { value: '已发布', label: '已发布' }
                  ]}
                  value={basicInfo.status}
                  onChange={(value) => setBasicInfo({ ...basicInfo, status: value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                模型功能描述
              </label>
              <textarea
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="请输入模型功能描述"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  负责人 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.owner}
                  onChange={(e) => setBasicInfo({ ...basicInfo, owner: e.target.value })}
                  placeholder="请输入负责人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型适用场景
                </label>
                <MdSelect
                  options={scenarioOptions}
                  value={basicInfo.applicableScenario[0] || ''}
                  onChange={(value) => {
                    const scenarios = value ? [value] : [];
                    setBasicInfo({ ...basicInfo, applicableScenario: scenarios });
                  }}
                  placeholder="请选择适用场景"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <MdButton onClick={() => setStep(2)}>
                下一步
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤2: 模型参数定义 */}
      {step === 2 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>模型参数定义</MdCardTitle>
            <MdCardDescription>定义模型的输入参数、输出参数和评估指标</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            {/* 输入参数 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">输入参数</h3>
                <MdButton variant="outline" size="sm" onClick={addInputParameter}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加参数
                </MdButton>
              </div>
              <div className="space-y-2">
                {inputParameters.map((param, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">参数名称</div>
                        <div className="font-medium">{param.name || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">物理字段名</div>
                        <div className="font-medium">{param.physicalFieldName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">数据类型</div>
                        <MdBadge variant="outline">{param.dataType || '-'}</MdBadge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">描述</div>
                        <div className="text-sm">{param.description || '-'}</div>
                      </div>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInputParameter(index)}
                    >
                      <X className="h-4 w-4" />
                    </MdButton>
                  </div>
                ))}
              </div>
              <div className="border rounded-lg p-4 mt-4 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <MdInput
                    placeholder="参数名称"
                    value={newInputParam.name}
                    onChange={(e) => setNewInputParam({ ...newInputParam, name: e.target.value })}
                  />
                  <MdInput
                    placeholder="物理字段名"
                    value={newInputParam.physicalFieldName}
                    onChange={(e) => setNewInputParam({ ...newInputParam, physicalFieldName: e.target.value })}
                  />
                  <MdSelect
                    options={dataTypeOptions}
                    value={newInputParam.dataType}
                    onChange={(value) => setNewInputParam({ ...newInputParam, dataType: value })}
                  />
                  <MdInput
                    placeholder="描述"
                    value={newInputParam.description}
                    onChange={(e) => setNewInputParam({ ...newInputParam, description: e.target.value })}
                  />
                </div>
                <MdButton variant="outline" size="sm" onClick={addInputParameter}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加
                </MdButton>
              </div>
            </div>

            {/* 输出参数 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">输出参数</h3>
                <MdButton variant="outline" size="sm" onClick={addOutputParameter}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加参数
                </MdButton>
              </div>
              <div className="space-y-2">
                {outputParameters.map((param, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">参数名称</div>
                        <div className="font-medium">{param.name || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">物理字段名</div>
                        <div className="font-medium">{param.physicalFieldName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">数据类型</div>
                        <MdBadge variant="outline">{param.dataType || '-'}</MdBadge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">描述</div>
                        <div className="text-sm">{param.description || '-'}</div>
                      </div>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOutputParameter(index)}
                    >
                      <X className="h-4 w-4" />
                    </MdButton>
                  </div>
                ))}
              </div>
              <div className="border rounded-lg p-4 mt-4 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <MdInput
                    placeholder="参数名称"
                    value={newOutputParam.name}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, name: e.target.value })}
                  />
                  <MdInput
                    placeholder="物理字段名"
                    value={newOutputParam.physicalFieldName}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, physicalFieldName: e.target.value })}
                  />
                  <MdSelect
                    options={dataTypeOptions}
                    value={newOutputParam.dataType}
                    onChange={(value) => setNewOutputParam({ ...newOutputParam, dataType: value })}
                  />
                  <MdInput
                    placeholder="描述"
                    value={newOutputParam.description}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, description: e.target.value })}
                  />
                </div>
                <MdButton variant="outline" size="sm" onClick={addOutputParameter}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加
                </MdButton>
              </div>
            </div>

            {/* 评估指标 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">评估指标</h3>
                {!basicInfo.type && (
                  <span className="text-sm text-muted-foreground">请先选择模型类型</span>
                )}
              </div>
              {basicInfo.type && (
                <div className="space-y-3">
                  {getApplicableMetricsMetadata().map((meta) => {
                    const metric = evaluationMetrics.find(m => m.metricType === meta.key);
                    return (
                      <div key={meta.key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={metric?.enabled || false}
                                onChange={() => toggleEvaluationMetric(meta.key)}
                                className="w-4 h-4"
                              />
                              <span className="font-medium">{meta.label}</span>
                              <span className="text-xs text-muted-foreground">({meta.description})</span>
                            </div>
                            {metric?.enabled && (
                              <div className="mt-2">
                                <MdInput
                                  type="number"
                                  placeholder="请输入指标值"
                                  value={metric.value?.toString() || ''}
                                  onChange={(e) => {
                                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                    updateEvaluationMetricValue(meta.key, value);
                                  }}
                                  className="w-48"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(1)}>
                上一步
              </MdButton>
              <MdButton onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? '保存修改' : '创建模型'}
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}
    </div>
  );
};

export default MachineLearningModelCreateEditPage;
