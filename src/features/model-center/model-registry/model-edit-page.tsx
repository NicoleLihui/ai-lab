"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Save, Plus, X, GitBranch } from 'lucide-react';

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface Dependency {
  name: string;
  version: string;
}

const ModelEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: '',
    version: '',
    environment: 'staging' as 'staging' | 'production',
    pythonVersion: '3.8',
    cudaVersion: '',
  });

  const [inputSchema, setInputSchema] = useState<SchemaField[]>([]);
  const [outputSchema, setOutputSchema] = useState<SchemaField[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);

  const [newDependency, setNewDependency] = useState({ name: '', version: '' });
  const [newInputField, setNewInputField] = useState({ name: '', type: '', required: false, description: '', example: '' });
  const [newOutputField, setNewOutputField] = useState({ name: '', type: '', required: false, description: '', example: '' });
  const [showVersionUpgrade, setShowVersionUpgrade] = useState(false);
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    // 模拟加载模型数据
    if (modelId) {
      setFormData({
        name: '污水处理效果预测模型',
        description: '基于历史污水处理数据预测出水水质指标，支持COD、BOD、NH3-N等关键参数预测',
        framework: 'TensorFlow',
        version: 'v1.2.3',
        environment: 'production',
        pythonVersion: '3.8',
        cudaVersion: '11.8',
      });
      setInputSchema([
        { name: 'inflow_ph', type: 'float', required: true, description: '进水pH值', example: '7.2' },
        { name: 'inflow_cod', type: 'float', required: true, description: '进水COD浓度(mg/L)', example: '250.5' },
        { name: 'inflow_bod', type: 'float', required: true, description: '进水BOD浓度(mg/L)', example: '120.3' },
        { name: 'inflow_nh3_n', type: 'float', required: true, description: '进水氨氮浓度(mg/L)', example: '35.8' },
        { name: 'inflow_flow', type: 'float', required: true, description: '进水流量(m³/h)', example: '1500.0' }
      ]);
      setOutputSchema([
        { name: 'outflow_cod', type: 'float', required: true, description: '出水COD浓度(mg/L)', example: '45.2' },
        { name: 'outflow_bod', type: 'float', required: true, description: '出水BOD浓度(mg/L)', example: '12.5' },
        { name: 'removal_rate', type: 'float', required: true, description: '去除率(%)', example: '85.5' }
      ]);
      setDependencies([
        { name: 'tensorflow', version: '==2.8.0' },
        { name: 'numpy', version: '>=1.19.0' }
      ]);
    }
  }, [modelId]);

  const addDependency = () => {
    if (newDependency.name && newDependency.version) {
      setDependencies([...dependencies, { ...newDependency }]);
      setNewDependency({ name: '', version: '' });
    }
  };

  const removeDependency = (index: number) => {
    setDependencies(dependencies.filter((_, i) => i !== index));
  };

  const addInputField = () => {
    if (newInputField.name && newInputField.type) {
      setInputSchema([...inputSchema, { ...newInputField }]);
      setNewInputField({ name: '', type: '', required: false, description: '', example: '' });
    }
  };

  const removeInputField = (index: number) => {
    setInputSchema(inputSchema.filter((_, i) => i !== index));
  };

  const addOutputField = () => {
    if (newOutputField.name && newOutputField.type) {
      setOutputSchema([...outputSchema, { ...newOutputField }]);
      setNewOutputField({ name: '', type: '', required: false, description: '', example: '' });
    }
  };

  const removeOutputField = (index: number) => {
    setOutputSchema(outputSchema.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // 保存编辑
    console.log('保存模型:', { formData, inputSchema, outputSchema, dependencies });
    alert('保存成功！');
    router.push(`/categories/model-center/model-registry/model-detail?id=${modelId}`);
  };

  const handleVersionUpgrade = () => {
    if (!newVersion) {
      alert('请输入新版本号');
      return;
    }
    // 创建新版本
    console.log('创建新版本:', newVersion);
    alert(`版本 ${newVersion} 创建成功！`);
    setShowVersionUpgrade(false);
    setFormData({ ...formData, version: newVersion });
  };

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <MdCardTitle>编辑模型</MdCardTitle>
              <MdCardDescription>
                修改模型信息、Schema定义和依赖配置
              </MdCardDescription>
            </div>
            <MdButton variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </MdButton>
          </div>
        </MdCardHeader>
      </MdCard>

      {/* 基本信息 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>基本信息</MdCardTitle>
        </MdCardHeader>
        <MdCardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">模型名称</label>
              <MdInput
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">当前版本</label>
              <div className="flex items-center gap-2">
                <MdInput
                  value={formData.version}
                  disabled
                  className="flex-1"
                />
                <MdButton variant="outline" onClick={() => setShowVersionUpgrade(true)}>
                  <GitBranch className="mr-2 h-4 w-4" />
                  升级版本
                </MdButton>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">模型描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">框架类型</label>
              <MdSelect
                options={[
                  { value: 'TensorFlow', label: 'TensorFlow' },
                  { value: 'PyTorch', label: 'PyTorch' },
                  { value: 'Transformers', label: 'Transformers' }
                ]}
                value={formData.framework}
                onChange={(value) => setFormData({ ...formData, framework: value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">环境标签</label>
              <MdSelect
                options={[
                  { value: 'staging', label: '预发布环境 (Staging)' },
                  { value: 'production', label: '生产环境 (Production)' }
                ]}
                value={formData.environment}
                onChange={(value) => setFormData({ ...formData, environment: value as 'staging' | 'production' })}
              />
            </div>
          </div>
        </MdCardContent>
      </MdCard>

      {/* Schema编辑 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>Schema定义</MdCardTitle>
        </MdCardHeader>
        <MdCardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">输入Schema</h3>
              <MdButton variant="outline" size="sm" onClick={addInputField}>
                <Plus className="mr-2 h-4 w-4" />
                添加字段
              </MdButton>
            </div>
            <div className="space-y-2">
              {inputSchema.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div>{field.name}</div>
                    <MdBadge variant="outline">{field.type}</MdBadge>
                    <div>{field.required ? '必填' : '可选'}</div>
                    <div className="text-sm text-muted-foreground">{field.description}</div>
                    <div className="text-sm font-mono">{field.example || '-'}</div>
                  </div>
                  <MdButton variant="ghost" size="sm" onClick={() => removeInputField(index)}>
                    <X className="h-4 w-4" />
                  </MdButton>
                </div>
              ))}
            </div>
            <div className="border rounded-lg p-4 mt-4 space-y-2">
              <div className="grid grid-cols-5 gap-2">
                <MdInput
                  placeholder="字段名"
                  value={newInputField.name}
                  onChange={(e) => setNewInputField({ ...newInputField, name: e.target.value })}
                />
                <MdInput
                  placeholder="类型"
                  value={newInputField.type}
                  onChange={(e) => setNewInputField({ ...newInputField, type: e.target.value })}
                />
                <MdSelect
                  options={[
                    { value: 'true', label: '是' },
                    { value: 'false', label: '否' }
                  ]}
                  value={newInputField.required ? 'true' : 'false'}
                  onChange={(value) => setNewInputField({ ...newInputField, required: value === 'true' })}
                />
                <MdInput
                  placeholder="描述"
                  value={newInputField.description}
                  onChange={(e) => setNewInputField({ ...newInputField, description: e.target.value })}
                />
                <MdInput
                  placeholder="示例值"
                  value={newInputField.example}
                  onChange={(e) => setNewInputField({ ...newInputField, example: e.target.value })}
                />
              </div>
              <MdButton variant="outline" size="sm" onClick={addInputField}>
                <Plus className="mr-2 h-4 w-4" />
                添加
              </MdButton>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">输出Schema</h3>
              <MdButton variant="outline" size="sm" onClick={addOutputField}>
                <Plus className="mr-2 h-4 w-4" />
                添加字段
              </MdButton>
            </div>
            <div className="space-y-2">
              {outputSchema.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <div>{field.name}</div>
                    <MdBadge variant="outline">{field.type}</MdBadge>
                    <div>{field.required ? '必填' : '可选'}</div>
                    <div className="text-sm text-muted-foreground">{field.description}</div>
                    <div className="text-sm font-mono">{field.example || '-'}</div>
                  </div>
                  <MdButton variant="ghost" size="sm" onClick={() => removeOutputField(index)}>
                    <X className="h-4 w-4" />
                  </MdButton>
                </div>
              ))}
            </div>
            <div className="border rounded-lg p-4 mt-4 space-y-2">
              <div className="grid grid-cols-5 gap-2">
                <MdInput
                  placeholder="字段名"
                  value={newOutputField.name}
                  onChange={(e) => setNewOutputField({ ...newOutputField, name: e.target.value })}
                />
                <MdInput
                  placeholder="类型"
                  value={newOutputField.type}
                  onChange={(e) => setNewOutputField({ ...newOutputField, type: e.target.value })}
                />
                <MdSelect
                  options={[
                    { value: 'true', label: '是' },
                    { value: 'false', label: '否' }
                  ]}
                  value={newOutputField.required ? 'true' : 'false'}
                  onChange={(value) => setNewOutputField({ ...newOutputField, required: value === 'true' })}
                />
                <MdInput
                  placeholder="描述"
                  value={newOutputField.description}
                  onChange={(e) => setNewOutputField({ ...newOutputField, description: e.target.value })}
                />
                <MdInput
                  placeholder="示例值"
                  value={newOutputField.example}
                  onChange={(e) => setNewOutputField({ ...newOutputField, example: e.target.value })}
                />
              </div>
              <MdButton variant="outline" size="sm" onClick={addOutputField}>
                <Plus className="mr-2 h-4 w-4" />
                添加
              </MdButton>
            </div>
          </div>
        </MdCardContent>
      </MdCard>

      {/* 依赖包编辑 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>依赖包管理</MdCardTitle>
        </MdCardHeader>
        <MdCardContent className="space-y-4">
          <div className="space-y-2">
            {dependencies.map((dep, index) => (
              <div key={index} className="border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{dep.name}</span>
                  <span className="text-sm text-muted-foreground">{dep.version}</span>
                </div>
                <MdButton variant="ghost" size="sm" onClick={() => removeDependency(index)}>
                  <X className="h-4 w-4" />
                </MdButton>
              </div>
            ))}
          </div>
          <div className="border rounded-lg p-4 flex gap-2">
            <MdInput
              placeholder="包名"
              value={newDependency.name}
              onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
              className="flex-1"
            />
            <MdInput
              placeholder="版本"
              value={newDependency.version}
              onChange={(e) => setNewDependency({ ...newDependency, version: e.target.value })}
              className="flex-1"
            />
            <MdButton onClick={addDependency}>
              <Plus className="mr-2 h-4 w-4" />
              添加
            </MdButton>
          </div>
        </MdCardContent>
      </MdCard>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2">
        <MdButton variant="outline" onClick={() => router.back()}>
          取消
        </MdButton>
        <MdButton onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存
        </MdButton>
      </div>

      {/* 版本升级对话框 */}
      {showVersionUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96">
            <h3 className="font-semibold mb-4">创建新版本</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">新版本号</label>
                <MdInput
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="例如: v1.2.4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <MdButton variant="outline" onClick={() => setShowVersionUpgrade(false)}>
                  取消
                </MdButton>
                <MdButton onClick={handleVersionUpgrade}>
                  创建
                </MdButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ModelEditPage };
