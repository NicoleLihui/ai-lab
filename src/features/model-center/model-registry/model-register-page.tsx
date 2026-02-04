"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Upload, X, Plus, Save } from 'lucide-react';

interface Dependency {
  name: string;
  version: string;
}

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

const ModelRegisterPage: React.FC = () => {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: '',
    version: '',
    environment: 'staging' as 'staging' | 'production',
    pythonVersion: '3.8',
    cudaVersion: '',
    modelFile: null as File | null,
  });

  const [inputSchema, setInputSchema] = useState<SchemaField[]>([
    { name: 'input', type: 'tensor', required: true, description: '输入数据', example: 'tensor[batch, 100]' }
  ]);
  const [outputSchema, setOutputSchema] = useState<SchemaField[]>([
    { name: 'output', type: 'tensor', required: true, description: '输出数据', example: 'tensor[batch, 1]' }
  ]);
  const [dependencies, setDependencies] = useState<Dependency[]>([
    { name: 'numpy', version: '>=1.19.0' }
  ]);

  const [newDependency, setNewDependency] = useState({ name: '', version: '' });
  const [newInputField, setNewInputField] = useState({ name: '', type: '', required: false, description: '', example: '' });
  const [newOutputField, setNewOutputField] = useState({ name: '', type: '', required: false, description: '', example: '' });

  const frameworkOptions = [
    { value: 'TensorFlow', label: 'TensorFlow' },
    { value: 'PyTorch', label: 'PyTorch' },
    { value: 'Transformers', label: 'Transformers' },
    { value: 'OpenCV', label: 'OpenCV' },
    { value: 'Scikit-learn', label: 'Scikit-learn' },
    { value: 'XGBoost', label: 'XGBoost' },
    { value: '其他', label: '其他' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, modelFile: file });
    }
  };

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

  const handleSubmit = () => {
    // 验证必填字段
    if (!formData.name || !formData.version || !formData.framework) {
      alert('请填写必填字段');
      return;
    }
    if (!formData.modelFile) {
      alert('请上传模型文件');
      return;
    }
    
    // 这里应该调用API提交数据
    console.log('提交模型注册:', {
      ...formData,
      inputSchema,
      outputSchema,
      dependencies
    });
    
    alert('模型注册成功！');
    router.push('/categories/model-center/model-registry/model-registry');
  };

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <MdCardTitle>注册新模型</MdCardTitle>
              <MdCardDescription>
                填写模型基本信息、Schema定义和依赖配置
              </MdCardDescription>
            </div>
            <MdButton variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </MdButton>
          </div>
        </MdCardHeader>
      </MdCard>

      {/* 步骤指示器 */}
      <MdCard>
        <MdCardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= s ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                  }`}>
                    {s}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {s === 1 && '基本信息'}
                    {s === 2 && 'Schema定义'}
                    {s === 3 && '依赖配置'}
                    {s === 4 && '预览提交'}
                  </span>
                </div>
                {s < 4 && <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted-foreground'}`} />}
              </React.Fragment>
            ))}
          </div>
        </MdCardContent>
      </MdCard>

      {/* 步骤1: 基本信息 */}
      {step === 1 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>基本信息</MdCardTitle>
            <MdCardDescription>填写模型的基本信息和版本信息</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入模型名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  版本号 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="例如: v1.0.0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                模型描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="请输入模型描述"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  框架类型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={frameworkOptions}
                  value={formData.framework}
                  onChange={(value) => setFormData({ ...formData, framework: value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  环境标签
                </label>
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
            <div>
              <label className="block text-sm font-medium mb-2">
                模型文件上传 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {formData.modelFile ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">{formData.modelFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(formData.modelFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <MdButton
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, modelFile: null })}
                    >
                      <X className="mr-2 h-4 w-4" />
                      移除
                    </MdButton>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <div className="text-sm text-muted-foreground mb-2">
                      支持 .pkl, .h5, .onnx, .pb 等格式
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pkl,.h5,.onnx,.pb,.pt,.pth,.joblib"
                        onChange={handleFileUpload}
                      />
                      <MdButton variant="outline" type="button">
                        <Upload className="mr-2 h-4 w-4" />
                        选择文件
                      </MdButton>
                    </label>
                  </div>
                )}
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

      {/* 步骤2: Schema定义 */}
      {step === 2 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>Schema定义</MdCardTitle>
            <MdCardDescription>定义模型的输入输出Schema</MdCardDescription>
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
                      <div>
                        <div className="text-xs text-muted-foreground">字段名</div>
                        <div className="font-medium">{field.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">类型</div>
                        <MdBadge variant="outline">{field.type}</MdBadge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">必填</div>
                        <div>{field.required ? '是' : '否'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">描述</div>
                        <div className="text-sm">{field.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">示例</div>
                        <div className="text-sm font-mono">{field.example || '-'}</div>
                      </div>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInputField(index)}
                    >
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
                      <div>
                        <div className="text-xs text-muted-foreground">字段名</div>
                        <div className="font-medium">{field.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">类型</div>
                        <MdBadge variant="outline">{field.type}</MdBadge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">必填</div>
                        <div>{field.required ? '是' : '否'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">描述</div>
                        <div className="text-sm">{field.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">示例</div>
                        <div className="text-sm font-mono">{field.example || '-'}</div>
                      </div>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOutputField(index)}
                    >
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

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(1)}>
                上一步
              </MdButton>
              <MdButton onClick={() => setStep(3)}>
                下一步
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤3: 依赖配置 */}
      {step === 3 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>依赖配置</MdCardTitle>
            <MdCardDescription>配置模型运行所需的依赖包和环境</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Python依赖包</h3>
              <div className="space-y-2">
                {dependencies.map((dep, index) => (
                  <div key={index} className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{dep.name}</span>
                      <span className="text-sm text-muted-foreground">{dep.version}</span>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDependency(index)}
                    >
                      <X className="h-4 w-4" />
                    </MdButton>
                  </div>
                ))}
              </div>
              <div className="border rounded-lg p-4 mt-4 flex gap-2">
                <MdInput
                  placeholder="包名，如: tensorflow"
                  value={newDependency.name}
                  onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                  className="flex-1"
                />
                <MdInput
                  placeholder="版本，如: ==2.8.0 或 >=1.19.0"
                  value={newDependency.version}
                  onChange={(e) => setNewDependency({ ...newDependency, version: e.target.value })}
                  className="flex-1"
                />
                <MdButton onClick={addDependency}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加
                </MdButton>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">环境配置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Python版本</label>
                  <MdSelect
                    options={[
                      { value: '3.8', label: 'Python 3.8' },
                      { value: '3.9', label: 'Python 3.9' },
                      { value: '3.10', label: 'Python 3.10' },
                      { value: '3.11', label: 'Python 3.11' }
                    ]}
                    value={formData.pythonVersion}
                    onChange={(value) => setFormData({ ...formData, pythonVersion: value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CUDA版本（可选）</label>
                  <MdSelect
                    options={[
                      { value: '', label: '不使用GPU' },
                      { value: '11.8', label: 'CUDA 11.8' },
                      { value: '12.1', label: 'CUDA 12.1' }
                    ]}
                    value={formData.cudaVersion}
                    onChange={(value) => setFormData({ ...formData, cudaVersion: value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(2)}>
                上一步
              </MdButton>
              <MdButton onClick={() => setStep(4)}>
                下一步
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤4: 预览提交 */}
      {step === 4 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>预览并提交</MdCardTitle>
            <MdCardDescription>确认信息无误后提交注册</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">基本信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">模型名称:</span> {formData.name}
                </div>
                <div>
                  <span className="text-muted-foreground">版本:</span> {formData.version}
                </div>
                <div>
                  <span className="text-muted-foreground">框架:</span> {formData.framework}
                </div>
                <div>
                  <span className="text-muted-foreground">环境:</span> {formData.environment === 'production' ? '生产' : '预发布'}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">描述:</span> {formData.description || '-'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Schema定义</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">输入Schema ({inputSchema.length}个字段)</div>
                  <div className="space-y-1 text-xs">
                    {inputSchema.map((field, idx) => (
                      <div key={idx} className="text-muted-foreground">
                        {field.name}: {field.type} {field.required && '*'}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">输出Schema ({outputSchema.length}个字段)</div>
                  <div className="space-y-1 text-xs">
                    {outputSchema.map((field, idx) => (
                      <div key={idx} className="text-muted-foreground">
                        {field.name}: {field.type} {field.required && '*'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">依赖配置</h3>
              <div className="text-sm space-y-1">
                <div><span className="text-muted-foreground">Python版本:</span> {formData.pythonVersion}</div>
                {formData.cudaVersion && (
                  <div><span className="text-muted-foreground">CUDA版本:</span> {formData.cudaVersion}</div>
                )}
                <div><span className="text-muted-foreground">依赖包:</span> {dependencies.length} 个</div>
                <div className="ml-4 space-y-1">
                  {dependencies.map((dep, idx) => (
                    <div key={idx} className="text-muted-foreground">
                      {dep.name} {dep.version}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(3)}>
                上一步
              </MdButton>
              <MdButton onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                提交注册
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}
    </div>
  );
};

export { ModelRegisterPage };
