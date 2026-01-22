"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';
import { Plus, Trash2, Save, X, PackagePlus, Tag, Type, Hash } from 'lucide-react';

interface ModelInputOutput {
  name: string;
  type: string;
  shape: string;
  description: string;
  required: boolean;
}

interface ModelDependency {
  id: string;
  name: string;
  version: string;
  versionConstraint: string;
}

interface ModelFormState {
  name: string;
  description: string;
  framework: string;
  version: string;
  stage: string;
  tags: string[];
  currentTag: string;
  inputs: ModelInputOutput[];
  outputs: ModelInputOutput[];
  dependencies: ModelDependency[];
  currentDependency: {
    name: string;
    version: string;
    versionConstraint: string;
  };
}

const ModelEditPage: React.FC = () => {
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id') || '1';
  // 根据模型ID加载不同的模型数据
  const initialModelData = {
    '1': {
      name: '推荐算法模型',
      description: '基于协同过滤和深度学习的个性化推荐模型，适用于电商商品推荐场景',
      framework: 'tensorflow',
      version: 'v1.2.4',
      stage: 'staging',
      tags: ['推荐系统', '深度学习', '协同过滤']
    },
    '2': {
      name: '风控评分模型',
      description: '基于机器学习的风险评估模型，用于信用风险评分',
      framework: 'pytorch',
      version: 'v2.1.1',
      stage: 'production',
      tags: ['风控', '风险评估', '机器学习']
    },
    '3': {
      name: 'NLP文本分类',
      description: '自然语言处理模型，用于文本分类和情感分析',
      framework: 'transformers',
      version: 'v1.0.6',
      stage: 'staging',
      tags: ['NLP', '文本分类', '情感分析']
    }
  };
  
  const currentModel = initialModelData[modelId as keyof typeof initialModelData] || initialModelData['1'];
  
  const [formState, setFormState] = useState<ModelFormState>({
    name: currentModel.name,
    description: currentModel.description,
    framework: currentModel.framework,
    version: currentModel.version,
    stage: currentModel.stage,
    tags: currentModel.tags,
    currentTag: '',
    inputs: [
      {
        name: 'user_features',
        type: 'tensor',
        shape: '[batch_size, user_feature_dim]',
        description: '用户特征向量',
        required: true
      },
      {
        name: 'item_features',
        type: 'tensor',
        shape: '[batch_size, item_feature_dim]',
        description: '物品特征向量',
        required: true
      }
    ],
    outputs: [
      {
        name: 'recommendation_scores',
        type: 'tensor',
        shape: '[batch_size, num_items]',
        description: '推荐分数，表示每个物品的推荐度',
        required: true
      }
    ],
    dependencies: [
      { id: '1', name: 'tensorflow', version: '2.8.0', versionConstraint: '==' },
      { id: '2', name: 'numpy', version: '1.21.0', versionConstraint: '>=' },
      { id: '3', name: 'pandas', version: '1.4.0', versionConstraint: '==' }
    ],
    currentDependency: {
      name: '',
      version: '',
      versionConstraint: '=='
    }
  });

  const handleInputChange = (field: keyof ModelFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (formState.currentTag.trim() && !formState.tags.includes(formState.currentTag.trim())) {
      setFormState(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addInput = () => {
    setFormState(prev => ({
      ...prev,
      inputs: [
        ...prev.inputs,
        {
          name: '',
          type: 'tensor',
          shape: '',
          description: '',
          required: true
        }
      ]
    }));
  };

  const updateInput = (index: number, field: keyof ModelInputOutput, value: string | boolean) => {
    setFormState(prev => {
      const newInputs = [...prev.inputs];
      newInputs[index] = { ...newInputs[index], [field]: value };
      return { ...prev, inputs: newInputs };
    });
  };

  const removeInput = (index: number) => {
    setFormState(prev => {
      const newInputs = [...prev.inputs];
      newInputs.splice(index, 1);
      return { ...prev, inputs: newInputs };
    });
  };

  const addOutput = () => {
    setFormState(prev => ({
      ...prev,
      outputs: [
        ...prev.outputs,
        {
          name: '',
          type: 'tensor',
          shape: '',
          description: '',
          required: true
        }
      ]
    }));
  };

  const updateOutput = (index: number, field: keyof ModelInputOutput, value: string | boolean) => {
    setFormState(prev => {
      const newOutputs = [...prev.outputs];
      newOutputs[index] = { ...newOutputs[index], [field]: value };
      return { ...prev, outputs: newOutputs };
    });
  };

  const removeOutput = (index: number) => {
    setFormState(prev => {
      const newOutputs = [...prev.outputs];
      newOutputs.splice(index, 1);
      return { ...prev, outputs: newOutputs };
    });
  };

  const addDependency = () => {
    if (formState.currentDependency.name && formState.currentDependency.version) {
      setFormState(prev => ({
        ...prev,
        dependencies: [
          ...prev.dependencies,
          {
            id: Date.now().toString(),
            name: prev.currentDependency.name,
            version: prev.currentDependency.version,
            versionConstraint: prev.currentDependency.versionConstraint
          }
        ],
        currentDependency: {
          name: '',
          version: '',
          versionConstraint: '=='
        }
      }));
    }
  };

  const removeDependency = (id: string) => {
    setFormState(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(dep => dep.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交表单:', formState);
    // 这里可以添加实际的提交逻辑
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">编辑模型</h1>
        <div className="flex gap-2">
          <MdButton 
            variant="outline"
            onClick={() => {
              window.location.href = '/categories/model-center/model-registry/model-registry';
            }}
          >
            <X className="h-4 w-4 mr-2" />
            取消
          </MdButton>
          <MdButton onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            保存更改
          </MdButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>基本信息</MdCardTitle>
            <MdCardDescription>模型的基础信息和元数据</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">模型名称 *</label>
                <MdInput
                  value={formState.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入模型名称"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">框架 *</label>
                <MdSelect
                  options={[
                    { value: 'tensorflow', label: 'TensorFlow' },
                    { value: 'pytorch', label: 'PyTorch' },
                    { value: 'sklearn', label: 'Scikit-learn' },
                    { value: 'xgboost', label: 'XGBoost' },
                    { value: 'transformers', label: 'Transformers' },
                    { value: 'custom', label: '自定义' }
                  ]}
                  value={formState.framework}
                  onChange={(value) => handleInputChange('framework', value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">版本 *</label>
                <MdInput
                  value={formState.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="例如: v1.2.4"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">阶段 *</label>
                <MdSelect
                  options={[
                    { value: 'staging', label: '预发布' },
                    { value: 'production', label: '生产' },
                    { value: 'archived', label: '已归档' }
                  ]}
                  value={formState.stage}
                  onChange={(value) => handleInputChange('stage', value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">描述</label>
              <textarea
                value={formState.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                placeholder="请输入模型描述"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">标签</label>
              <div className="flex gap-2">
                <MdInput
                  value={formState.currentTag}
                  onChange={(e) => handleInputChange('currentTag', e.target.value)}
                  placeholder="输入标签后按回车添加"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <MdButton type="button" variant="outline" onClick={addTag}>
                  <Tag className="h-4 w-4 mr-2" />
                  添加
                </MdButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formState.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </MdCardContent>
        </MdCard>

        <MdCard>
          <MdCardHeader>
            <MdCardTitle>模型签名</MdCardTitle>
            <MdCardDescription>定义模型输入输出的数据格式和类型</MdCardDescription>
          </MdCardHeader>
          <MdCardContent>
            <div className="space-y-8">
              {/* 输入定义 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">输入 (Inputs)</h3>
                  <MdButton type="button" variant="outline" onClick={addInput}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加输入
                  </MdButton>
                </div>
                <div className="space-y-4">
                  {formState.inputs.map((input, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">输入 #{index + 1}</h4>
                        <MdButton 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeInput(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </MdButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block flex items-center">
                            <Type className="h-3 w-3 mr-1" />
                            名称 *
                          </label>
                          <MdInput
                            value={input.name}
                            onChange={(e) => updateInput(index, 'name', e.target.value)}
                            placeholder="例如: user_features"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block">类型</label>
                          <MdSelect
                            options={[
                              { value: 'tensor', label: 'Tensor' },
                              { value: 'array', label: 'Array' },
                              { value: 'string', label: 'String' },
                              { value: 'number', label: 'Number' },
                              { value: 'boolean', label: 'Boolean' }
                            ]}
                            value={input.type}
                            onChange={(value) => updateInput(index, 'type', value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block flex items-center">
                            <Hash className="h-3 w-3 mr-1" />
                            形状
                          </label>
                          <MdInput
                            value={input.shape}
                            onChange={(e) => updateInput(index, 'shape', e.target.value)}
                            placeholder="例如: [batch_size, dim]"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex items-center">
                            <MdCheckbox
                              checked={input.required}
                              onChange={(checked) => updateInput(index, 'required', checked)}
                            />
                            <span className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              必填
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">描述</label>
                        <MdInput
                          value={input.description}
                          onChange={(e) => updateInput(index, 'description', e.target.value)}
                          placeholder="输入字段描述"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 输出定义 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">输出 (Outputs)</h3>
                  <MdButton type="button" variant="outline" onClick={addOutput}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加输出
                  </MdButton>
                </div>
                <div className="space-y-4">
                  {formState.outputs.map((output, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">输出 #{index + 1}</h4>
                        <MdButton 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeOutput(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </MdButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block flex items-center">
                            <Type className="h-3 w-3 mr-1" />
                            名称 *
                          </label>
                          <MdInput
                            value={output.name}
                            onChange={(e) => updateOutput(index, 'name', e.target.value)}
                            placeholder="例如: recommendation_scores"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block">类型</label>
                          <MdSelect
                            options={[
                              { value: 'tensor', label: 'Tensor' },
                              { value: 'array', label: 'Array' },
                              { value: 'string', label: 'String' },
                              { value: 'number', label: 'Number' },
                              { value: 'boolean', label: 'Boolean' }
                            ]}
                            value={output.type}
                            onChange={(value) => updateOutput(index, 'type', value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-1 block flex items-center">
                            <Hash className="h-3 w-3 mr-1" />
                            形状
                          </label>
                          <MdInput
                            value={output.shape}
                            onChange={(e) => updateOutput(index, 'shape', e.target.value)}
                            placeholder="例如: [batch_size, num_items]"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex items-center">
                            <MdCheckbox
                              checked={output.required}
                              onChange={(checked) => updateOutput(index, 'required', checked)}
                            />
                            <span className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              必填
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">描述</label>
                        <MdInput
                          value={output.description}
                          onChange={(e) => updateOutput(index, 'description', e.target.value)}
                          placeholder="输入字段描述"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MdCardContent>
        </MdCard>

        <MdCard>
          <MdCardHeader>
            <MdCardTitle>依赖包管理</MdCardTitle>
            <MdCardDescription>模型运行所需的依赖包及其版本</MdCardDescription>
          </MdCardHeader>
          <MdCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">包名</label>
                  <MdInput
                    value={formState.currentDependency.name}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      currentDependency: { ...prev.currentDependency, name: e.target.value }
                    }))}
                    placeholder="例如: tensorflow"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">版本</label>
                  <MdInput
                    value={formState.currentDependency.version}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      currentDependency: { ...prev.currentDependency, version: e.target.value }
                    }))}
                    placeholder="例如: 2.8.0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">版本约束</label>
                  <MdSelect
                    options={[
                      { value: '==', label: '等于 (==)' },
                      { value: '>=', label: '大于等于 (>=' },
                      { value: '<=', label: '小于等于 (<=' },
                      { value: '>', label: '大于 (>' },
                      { value: '<', label: '小于 (<' },
                      { value: '~=', label: '兼容 (~=' },
                      { value: '!=', label: '不等于 (!=' }
                    ]}
                    value={formState.currentDependency.versionConstraint}
                    onChange={(value) => setFormState(prev => ({
                      ...prev,
                      currentDependency: { ...prev.currentDependency, versionConstraint: value }
                    }))}
                  />
                </div>
              </div>
              <div>
                <MdButton 
                  type="button" 
                  variant="outline" 
                  onClick={addDependency}
                  disabled={!formState.currentDependency.name || !formState.currentDependency.version}
                >
                  <PackagePlus className="h-4 w-4 mr-2" />
                  添加依赖
                </MdButton>
              </div>

              <div className="border rounded-lg divide-y">
                {formState.dependencies.map((dep, index) => (
                  <div key={dep.id} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                    <div>
                      <h4 className="font-medium">{dep.name}</h4>
                    </div>
                    <div>
                      <span className="font-mono text-sm">{dep.versionConstraint}{dep.version}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dep.versionConstraint === '==' ? '精确匹配' :
                       dep.versionConstraint === '>=' ? '最小版本' :
                       dep.versionConstraint === '<=' ? '最大版本' : '其他约束'}
                    </div>
                    <div className="flex justify-end">
                      <MdButton 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeDependency(dep.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </MdButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MdCardContent>
        </MdCard>
      </form>
    </div>
  );
};

export { ModelEditPage };