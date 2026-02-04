"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { Plus, X, Code, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// 参数 Schema 定义接口
export interface ParameterSchema {
  name: string;
  label: string;
  type: 'string' | 'number' | 'integer' | 'float' | 'boolean';
  widget?: 'text' | 'textarea' | 'slider' | 'switch' | 'radio' | 'select';
  default?: any;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
}

export interface ParameterSchemaConfig {
  title?: string;
  parameters: ParameterSchema[];
}

export interface VisualParameterEditorProps {
  /** 初始 Schema 配置 */
  initialSchema?: ParameterSchemaConfig;
  /** 参数值变化回调 */
  onChange?: (values: Record<string, any>) => void;
  /** Schema 变化回调 */
  onSchemaChange?: (schema: ParameterSchemaConfig) => void;
  /** 是否显示 Schema 编辑器 */
  showSchemaEditor?: boolean;
  /** 是否显示预览面板 */
  showPreview?: boolean;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
}

export function VisualParameterEditor({
  initialSchema,
  onChange,
  onSchemaChange,
  showSchemaEditor = true,
  showPreview = true,
  title = '可视化参数编辑',
  description = '通过可视化界面编辑模型参数，降低非技术人员操作成本'
}: VisualParameterEditorProps) {
  const [schema, setSchema] = useState<ParameterSchemaConfig>(
    initialSchema || {
      title: 'Model Parameters',
      parameters: []
    }
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [schemaJson, setSchemaJson] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

  // 初始化 Schema JSON
  useEffect(() => {
    setSchemaJson(JSON.stringify(schema, null, 2));
  }, []);

  // 初始化表单值
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    schema.parameters.forEach(param => {
      if (param.default !== undefined) {
        initialValues[param.name] = param.default;
      } else {
        // 根据类型设置默认值
        switch (param.type) {
          case 'number':
          case 'integer':
          case 'float':
            initialValues[param.name] = 0;
            break;
          case 'boolean':
            initialValues[param.name] = false;
            break;
          default:
            initialValues[param.name] = '';
        }
      }
    });
    setFormValues(initialValues);
    onChange?.(initialValues);
  }, [schema, onChange]);

  // 更新表单值
  const updateValue = useCallback((key: string, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [key]: value };
      onChange?.(newValues);
      return newValues;
    });
  }, [onChange]);

  // 从 JSON 更新 Schema
  const updateSchemaFromJson = useCallback(() => {
    try {
      const parsed = JSON.parse(schemaJson);
      setSchema(parsed);
      setJsonError('');
      onSchemaChange?.(parsed);
      
      // 重新初始化表单值
      const initialValues: Record<string, any> = {};
      parsed.parameters?.forEach((param: ParameterSchema) => {
        if (param.default !== undefined) {
          initialValues[param.name] = param.default;
        }
      });
      setFormValues(initialValues);
      onChange?.(initialValues);
    } catch (e: any) {
      setJsonError(e.message);
    }
  }, [schemaJson, onChange, onSchemaChange]);

  // 添加新参数
  const addParameter = useCallback(() => {
    // 确保参数名称唯一
    let paramIndex = schema.parameters.length + 1;
    let paramName = `param_${paramIndex}`;
    while (schema.parameters.some(p => p.name === paramName)) {
      paramIndex++;
      paramName = `param_${paramIndex}`;
    }

    const newParam: ParameterSchema = {
      name: paramName,
      label: `参数 ${paramIndex}`,
      type: 'string',
      widget: 'text',
      default: '',
      description: '',
      required: false
    };
    const newSchema = {
      ...schema,
      parameters: [...schema.parameters, newParam]
    };
    setSchema(newSchema);
    setSchemaJson(JSON.stringify(newSchema, null, 2));
    onSchemaChange?.(newSchema);
    
    // 初始化新参数的值
    setFormValues(prev => {
      const newValues = { ...prev, [paramName]: '' };
      onChange?.(newValues);
      return newValues;
    });
  }, [schema, onSchemaChange, onChange]);

  // 删除参数
  const removeParameter = useCallback((index: number) => {
    const newSchema = {
      ...schema,
      parameters: schema.parameters.filter((_, i) => i !== index)
    };
    setSchema(newSchema);
    setSchemaJson(JSON.stringify(newSchema, null, 2));
    onSchemaChange?.(newSchema);
    
    // 从表单值中移除
    const paramName = schema.parameters[index]?.name;
    if (paramName) {
      const newValues = { ...formValues };
      delete newValues[paramName];
      setFormValues(newValues);
      onChange?.(newValues);
    }
  }, [schema, formValues, onChange, onSchemaChange]);

  // 更新参数配置
  const updateParameter = useCallback((index: number, updates: Partial<ParameterSchema>) => {
    const newParameters = [...schema.parameters];
    newParameters[index] = { ...newParameters[index], ...updates };
    const newSchema = { ...schema, parameters: newParameters };
    setSchema(newSchema);
    setSchemaJson(JSON.stringify(newSchema, null, 2));
    onSchemaChange?.(newSchema);
  }, [schema, onSchemaChange]);

  // 渲染表单控件
  const renderWidget = (param: ParameterSchema) => {
    const value = formValues[param.name] ?? param.default;
    const widget = param.widget || getDefaultWidget(param.type);

    switch (widget) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => updateValue(param.name, e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
            placeholder={param.description}
          />
        );

      case 'slider':
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={param.min ?? 0}
              max={param.max ?? 100}
              step={param.step ?? 1}
              value={value ?? param.default ?? param.min ?? 0}
              onChange={(e) => updateValue(param.name, parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-primary min-w-[50px] text-right">
              {value ?? param.default ?? param.min ?? 0}
            </span>
          </div>
        );

      case 'switch':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value ?? param.default ?? false}
              onChange={(e) => updateValue(param.name, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm text-muted-foreground">
              {value ? '启用' : '禁用'}
            </span>
          </label>
        );

      case 'radio':
        if (!param.options || param.options.length === 0) {
          return <div className="text-sm text-muted-foreground">请配置选项</div>;
        }
        return (
          <div className="flex gap-2 flex-wrap">
            {param.options.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center cursor-pointer px-3 py-1.5 rounded-full border transition-all text-sm",
                  value === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted"
                )}
              >
                <input
                  type="radio"
                  name={param.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => updateValue(param.name, e.target.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case 'select':
        if (!param.options || param.options.length === 0) {
          return <div className="text-sm text-muted-foreground">请配置选项</div>;
        }
        return (
          <MdSelect
            options={param.options}
            value={value ?? param.default}
            onChange={(val) => updateValue(param.name, val)}
            placeholder="请选择"
          />
        );

      case 'text':
      default:
        return (
          <MdInput
            type={param.type === 'number' || param.type === 'integer' || param.type === 'float' ? 'number' : 'text'}
            value={value ?? ''}
            onChange={(e) => {
              const val = param.type === 'number' || param.type === 'integer' || param.type === 'float'
                ? parseFloat(e.target.value) || 0
                : e.target.value;
              updateValue(param.name, val);
            }}
            placeholder={param.description}
          />
        );
    }
  };

  const getDefaultWidget = (type: string): ParameterSchema['widget'] => {
    switch (type) {
      case 'boolean':
        return 'switch';
      case 'number':
      case 'integer':
      case 'float':
        return 'text';
      default:
        return 'text';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <MdButton variant="outline" size="sm" onClick={addParameter}>
          <Plus className="mr-2 h-4 w-4" />
          添加参数
        </MdButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Schema 编辑器 */}
        {showSchemaEditor && (
          <MdCard>
            <MdCardHeader>
              <MdCardTitle className="text-base flex items-center gap-2">
                <Code className="h-4 w-4" />
                Schema 配置
              </MdCardTitle>
              <MdCardDescription>编辑参数 Schema JSON</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-2">
              <textarea
                value={schemaJson}
                onChange={(e) => {
                  setSchemaJson(e.target.value);
                  setJsonError('');
                }}
                className={cn(
                  "w-full font-mono text-xs rounded-md border bg-[#1e1e1e] text-[#d4d4d4] p-3 min-h-[300px] resize-y",
                  jsonError && "border-destructive"
                )}
                placeholder='{"title": "Model Parameters", "parameters": [...]}'
              />
              {jsonError && (
                <p className="text-xs text-destructive">JSON 格式错误: {jsonError}</p>
              )}
              <MdButton variant="outline" size="sm" onClick={updateSchemaFromJson} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                更新界面
              </MdButton>
            </MdCardContent>
          </MdCard>
        )}

        {/* 动态表单 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              参数面板
            </MdCardTitle>
            <MdCardDescription>可视化编辑参数值</MdCardDescription>
          </MdCardHeader>
          <MdCardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {schema.parameters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无参数</p>
                  <p className="text-xs mt-2">点击"添加参数"或编辑 Schema 来添加参数</p>
                </div>
              ) : (
                schema.parameters.map((param, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2 bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold">
                            {param.label}
                            {param.required && <span className="text-destructive ml-1">*</span>}
                          </label>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                            {param.type}
                          </span>
                        </div>
                        {param.description && (
                          <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
                        )}
                      </div>
                      <MdButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParameter(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </MdButton>
                    </div>
                    {renderWidget(param)}
                  </div>
                ))
              )}
            </div>
          </MdCardContent>
        </MdCard>

        {/* 预览面板 */}
        {showPreview && (
          <MdCard>
            <MdCardHeader>
              <MdCardTitle className="text-base">参数预览</MdCardTitle>
              <MdCardDescription>实时预览参数 JSON</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-[600px] font-mono">
                {JSON.stringify(formValues, null, 2)}
              </pre>
            </MdCardContent>
          </MdCard>
        )}
      </div>
    </div>
  );
}
