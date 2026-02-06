"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect, type SelectOption } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdTable } from '@/components/enterprise-ui/md-table';
import type { Column } from '@/components/enterprise-ui/md-table';
import { ArrowLeft, Save, X, ChevronDown, ChevronRight, Check, Plus, Trash2, Layout, Sparkles, Loader2, Wrench, Monitor, Package, Code, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 数据集接口
interface Dataset {
  id: string;
  name: string;
  type: string;
  description: string;
  createTime: string;
}

// 输入参数接口
interface InputParameter {
  id?: string;
  paramName: string;
  paramDesc: string;
  unit: string;
  dataType: string;
  required: boolean;
}

// 输出参数接口
interface OutputParameter {
  id?: string;
  paramName: string;
  paramDesc: string;
  unit: string;
  dataType: string;
}

// 评价指标接口
interface EvaluationMetric {
  id?: string;
  paramName: string;
  paramDesc: string;
  paramType: string;
}

// 模型基础信息接口
interface ModelBasicInfo {
  name: string;
  category: string; // 分类：回归、分类、排序、时序序列
  owner: string; // 模型所有者：个人、所在组织
  programmingLanguage: string; // 编程语言
  applicableScenarios: string[]; // 适用场景（多选）
  description: string; // 模型描述
  tags: string[]; // 标签（多选）
  relatedDatasets: Dataset[]; // 关联数据集
  inputParameters: InputParameter[]; // 输入参数
  outputParameters: OutputParameter[]; // 输出参数
  evaluationMetrics: EvaluationMetric[]; // 评价指标
}

// 树形节点接口
interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

// 标签接口
interface Tag {
  id: string;
  tagCode: string;
  tagName: string;
  tagTypeId: string;
  tagTypeName: string;
  description: string;
  status: '启用' | '禁用';
}

// 污水处理适用场景树形数据
const applicableScenarioTree: TreeNode[] = [
  {
    value: 'nonSpecific',
    label: '无特定场景',
  },
  {
    value: 'process',
    label: '污水处理工艺',
    children: [
      { value: 'a2o', label: 'A2O工艺' },
      { value: 'oxidation_ditch', label: '氧化沟工艺' },
      { value: 'sbr', label: 'SBR工艺' },
      { value: 'mbr', label: 'MBR膜工艺' }
    ]
  },
  {
    value: 'equipment',
    label: '污水处理设备',
    children: [
      { value: 'blower', label: '曝气风机' },
      { value: 'do_meter', label: 'DO溶解氧仪' },
      { value: 'sludge_pump', label: '污泥回流泵' },
      { value: 'scraper', label: '刮泥机' }
    ]
  },
  {
    value: 'facility',
    label: '污水处理设施',
    children: [
      { value: 'aeration_tank', label: '曝气池' },
      { value: 'sedimentation_tank', label: '沉淀池' },
      { value: 'sludge_thickener', label: '污泥浓缩池' },
      { value: 'disinfection_pool', label: '消毒池' },
      { value: '2', label: '粗格栅' },
      { value: '5', label: '细格栅' },
      { value: '9', label: '精细格栅' },
      { value: '15', label: '污泥浓缩池' },
      { value: '25', label: '生化池' },
      { value: '28', label: '高级氧化池（芬顿）' },
      { value: '37', label: '初沉池' },
      { value: '39', label: '污泥调理池' },
      { value: '44', label: '高级氧化池（臭氧）' },
      { value: '49', label: '滤池' },
      { value: '55', label: '储泥池' },
      { value: '62', label: '混凝沉淀池' },
      { value: '68', label: '进水提升泵房' },
      { value: '77', label: '膜车间' },
      { value: '84', label: '二次提升泵房' },
      { value: '93', label: '出水提升泵房' },
      { value: '104', label: '污泥泵房' },
    ]
  },
  {
    value: 'monitor',
    label: '监测仪表',
    children: [
      { value: 'ph_meter', label: 'PH计' },
      { value: 'cod_analyzer', label: 'COD在线分析仪' },
      { value: 'turbidity_meter', label: '浊度仪' },
      { value: 'ammonia_meter', label: '氨氮分析仪' }
    ]
  },
  {
    value: 'other',
    label: '其他',
  },
];

// 树形多选组件
interface TreeSelectProps {
  treeData: TreeNode[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  treeData,
  selectedValues,
  onChange,
  placeholder = '请选择',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(selectedValues));
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<{ top: number; left: number; minWidth: number } | null>(null);

  // 同步外部传入的选中状态
  useEffect(() => {
    setCheckedKeys(new Set(selectedValues));
  }, [selectedValues]);

  // 计算下拉框位置
  React.useLayoutEffect(() => {
    if (isOpen && triggerRef.current && typeof document !== 'undefined') {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
      });
    } else {
      setDropdownStyle(null);
    }
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 切换节点展开/收起
  const toggleExpand = (value: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  // 切换节点选中状态
  const toggleCheck = (value: string) => {
    const newCheckedKeys = new Set(checkedKeys);
    if (newCheckedKeys.has(value)) {
      newCheckedKeys.delete(value);
    } else {
      newCheckedKeys.add(value);
    }
    setCheckedKeys(newCheckedKeys);
    onChange(Array.from(newCheckedKeys));
  };

  // 获取节点标签
  const getNodeLabel = (nodes: TreeNode[], value: string): string => {
    for (const node of nodes) {
      if (node.value === value) {
        return node.label;
      }
      if (node.children) {
        const found = getNodeLabel(node.children, value);
        if (found) return found;
      }
    }
    return '';
  };

  // 渲染树节点
  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.value);
    const isChecked = checkedKeys.has(node.value);

    return (
      <div key={node.value} className="select-none">
        <div
          className={cn(
            'flex items-center py-1.5 px-2 hover:bg-primary-light cursor-pointer',
            level > 0 && 'pl-6'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.value);
              }}
              className="mr-1 p-0.5 hover:bg-primary/20 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-4 mr-1" />
          )}
          <button
            type="button"
            onClick={() => toggleCheck(node.value)}
            className="flex items-center flex-1 text-left"
          >
            <div className={cn(
              'w-4 h-4 border rounded mr-2 flex items-center justify-center',
              isChecked ? 'bg-primary border-primary' : 'border-border'
            )}>
              {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm">{node.label}</span>
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 获取选中项的显示文本
  const getDisplayText = () => {
    if (checkedKeys.size === 0) {
      return placeholder;
    }
    if (checkedKeys.size === 1) {
      const value = Array.from(checkedKeys)[0];
      return getNodeLabel(treeData, value);
    }
    return `已选择 ${checkedKeys.size} 项`;
  };

  const dropdownContent =
    isOpen &&
    dropdownStyle &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
        style={{
          top: dropdownStyle.top,
          left: dropdownStyle.left,
          minWidth: dropdownStyle.minWidth,
          maxHeight: 400,
        }}
      >
        <div className="max-h-96 overflow-auto py-2">
          {treeData.map(node => renderTreeNode(node))}
        </div>
      </div>,
      document.body
    );

  return (
    <div className={cn('w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between h-10 px-4 text-sm border-2 border-input rounded-md hover:border-primary/50 transition-all"
      >
        <span className={cn(checkedKeys.size === 0 && 'text-muted-foreground')}>
          {getDisplayText()}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {dropdownContent}
      {checkedKeys.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from(checkedKeys).map(value => (
            <MdBadge
              key={value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getNodeLabel(treeData, value)}
              <button
                type="button"
                onClick={() => {
                  const newValues = Array.from(checkedKeys).filter(v => v !== value);
                  onChange(newValues);
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </MdBadge>
          ))}
        </div>
      )}
    </div>
  );
};

const MachineLearningModelCreateEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('id') !== null;
  const modelId = searchParams.get('id');

  const [formData, setFormData] = useState<ModelBasicInfo>({
    name: '',
    category: '',
    owner: '',
    programmingLanguage: '',
    applicableScenarios: [],
    description: '',
    tags: [],
    relatedDatasets: [],
    inputParameters: [],
    outputParameters: [],
    evaluationMetrics: [],
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [availableDatasets, setAvailableDatasets] = useState<Dataset[]>([]);
  const [parameterViewMode, setParameterViewMode] = useState<'visual' | 'ai'>('visual');
  const [aiInputText, setAiInputText] = useState('');
  const [isGeneratingParameters, setIsGeneratingParameters] = useState(false);
  
  // Schema配置相关状态
  const [schemaJson, setSchemaJson] = useState<string>('');
  const [schemaJsonError, setSchemaJsonError] = useState<string>('');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // 参数Schema接口
  interface ParameterSchema {
    name: string;
    label: string;
    type: 'string' | 'number' | 'integer' | 'float' | 'boolean' | 'array' | 'object';
    widget?: 'text' | 'textarea' | 'slider' | 'switch' | 'select' | 'radio';
    default?: any;
    description?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: Array<{ label: string; value: string }>;
    required?: boolean;
    unit?: string;
  }
  
  interface ParameterSchemaConfig {
    title?: string;
    parameters: ParameterSchema[];
  }

  // 分类选项
  const categoryOptions: SelectOption[] = [
    { value: '回归', label: '回归' },
    { value: '分类', label: '分类' },
    { value: '排序', label: '排序' },
    { value: '时序序列', label: '时序序列' },
  ];

  // 模型所有者选项
  const ownerOptions: SelectOption[] = [
    { value: '个人', label: '个人' },
    { value: '所在组织', label: '所在组织' },
  ];

  // 编程语言选项
  const programmingLanguageOptions: SelectOption[] = [
    { value: 'Python', label: 'Python' },
    { value: 'R', label: 'R' },
    { value: 'Java', label: 'Java' },
    { value: 'Scala', label: 'Scala' },
    { value: 'C++', label: 'C++' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: '其他', label: '其他' },
  ];

  // 数据类型选项
  const dataTypeOptions: SelectOption[] = [
    { value: 'string', label: '字符串' },
    { value: 'number', label: '数字' },
    { value: 'integer', label: '整数' },
    { value: 'float', label: '浮点数' },
    { value: 'boolean', label: '布尔值' },
    { value: 'date', label: '日期' },
    { value: 'datetime', label: '日期时间' },
    { value: 'array', label: '数组' },
    { value: 'object', label: '对象' },
  ];

  // 评价指标类型选项
  const evaluationMetricTypeOptions: SelectOption[] = [
    { value: 'accuracy', label: '准确率' },
    { value: 'precision', label: '精确率' },
    { value: 'recall', label: '召回率' },
    { value: 'f1', label: 'F1分数' },
    { value: 'auc', label: 'AUC' },
    { value: 'mae', label: '平均绝对误差(MAE)' },
    { value: 'mse', label: '均方误差(MSE)' },
    { value: 'rmse', label: '均方根误差(RMSE)' },
    { value: 'r2', label: 'R²' },
    { value: '其他', label: '其他' },
  ];

  // 加载标签列表
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: 调用API获取标签列表
      // 模拟数据
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockTags: Tag[] = [
        {
          id: '1',
          tagCode: 'dq_high',
          tagName: '高质量',
          tagTypeId: '1',
          tagTypeName: '数据质量',
          description: '数据质量高的标签',
          status: '启用',
        },
        {
          id: '2',
          tagCode: 'dq_medium',
          tagName: '中等质量',
          tagTypeId: '1',
          tagTypeName: '数据质量',
          description: '数据质量中等的标签',
          status: '启用',
        },
        {
          id: '3',
          tagCode: 'bd_finance',
          tagName: '金融业务',
          tagTypeId: '2',
          tagTypeName: '业务域',
          description: '金融业务相关的标签',
          status: '启用',
        },
        {
          id: '4',
          tagCode: 'bd_retail',
          tagName: '零售业务',
          tagTypeId: '2',
          tagTypeName: '业务域',
          description: '零售业务相关的标签',
          status: '启用',
        },
        {
          id: '5',
          tagCode: 'ds_database',
          tagName: '数据库',
          tagTypeId: '3',
          tagTypeName: '数据源',
          description: '来自数据库的数据源',
          status: '启用',
        },
        {
          id: '6',
          tagCode: 'sl_confidential',
          tagName: '机密',
          tagTypeId: '4',
          tagTypeName: '安全等级',
          description: '机密级别的数据',
          status: '启用',
        },
      ];
      setTags(mockTags.filter(tag => tag.status === '启用'));
    } catch (error) {
      console.error('加载标签失败:', error);
      toast.error('加载标签失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化默认Schema
  useEffect(() => {
    if (!schemaJson) {
      const defaultSchema: ParameterSchemaConfig = {
        title: '模型参数配置',
        parameters: [],
      };
      setSchemaJson(JSON.stringify(defaultSchema, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 加载编辑数据
  useEffect(() => {
    if (isEditMode && modelId) {
      // TODO: 从API加载模型数据
      // 这里使用模拟数据
      setFormData({
        name: '示例模型',
        category: '分类',
        owner: '个人',
        programmingLanguage: 'Python',
        applicableScenarios: ['a2o', 'aeration_tank'],
        description: '这是一个示例模型',
        tags: ['1', '3'],
        relatedDatasets: [
          {
            id: '1',
            name: '污水处理数据集-2024',
            type: '训练集',
            description: '2024年污水处理相关数据',
            createTime: '2024-01-15',
          },
        ],
        inputParameters: [
          {
            id: 'input-1',
            paramName: '温度',
            paramDesc: 'temperature',
            unit: '℃',
            dataType: 'float',
            required: true,
          },
        ],
        outputParameters: [
          {
            id: 'output-1',
            paramName: '预测值',
            paramDesc: 'prediction',
            unit: '',
            dataType: 'float',
          },
        ],
        evaluationMetrics: [
          {
            id: 'metric-1',
            paramName: '准确率',
            paramDesc: '模型准确率',
            paramType: 'accuracy',
          },
        ],
      });
    }
  }, [isEditMode, modelId]);

  // 加载可用数据集列表
  const loadAvailableDatasets = useCallback(async () => {
    try {
      // TODO: 调用API获取数据集列表
      // 模拟数据
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockDatasets: Dataset[] = [
        {
          id: '1',
          name: '污水处理数据集-2024',
          type: '训练集',
          description: '2024年污水处理相关数据',
          createTime: '2024-01-15',
        },
        {
          id: '2',
          name: '水质监测数据集',
          type: '测试集',
          description: '水质监测历史数据',
          createTime: '2024-02-20',
        },
        {
          id: '3',
          name: '设备运行数据集',
          type: '训练集',
          description: '设备运行状态数据',
          createTime: '2024-03-10',
        },
      ];
      setAvailableDatasets(mockDatasets);
    } catch (error) {
      console.error('加载数据集失败:', error);
      toast.error('加载数据集失败');
    }
  }, []);

  // 加载标签
  useEffect(() => {
    loadTags();
    loadAvailableDatasets();
  }, [loadTags, loadAvailableDatasets]);

  // 从Schema JSON更新表单值
  const updateFormValuesFromSchema = useCallback((schema: ParameterSchemaConfig) => {
    const newValues: Record<string, any> = {};
    schema.parameters.forEach(param => {
      if (param.default !== undefined) {
        newValues[param.name] = param.default;
      } else {
        switch (param.type) {
          case 'number':
          case 'integer':
          case 'float':
            newValues[param.name] = param.min || 0;
            break;
          case 'boolean':
            newValues[param.name] = false;
            break;
          default:
            newValues[param.name] = '';
        }
      }
    });
    setFormValues(newValues);
  }, []);

  // 将formData转换为Schema配置
  const convertFormDataToSchema = useCallback((): ParameterSchemaConfig => {
    const inputParams: ParameterSchema[] = formData.inputParameters.map(param => ({
      name: param.paramDesc || param.paramName,
      label: param.paramName,
      type: param.dataType === 'float' ? 'float' : 
            param.dataType === 'integer' ? 'integer' :
            param.dataType === 'number' ? 'number' :
            param.dataType === 'boolean' ? 'boolean' : 'string',
      widget: param.dataType === 'float' || param.dataType === 'number' || param.dataType === 'integer' ? 'slider' : 'text',
      description: param.paramDesc,
      required: param.required,
      unit: param.unit,
    }));

    const outputParams: ParameterSchema[] = formData.outputParameters.map(param => ({
      name: param.paramDesc || param.paramName,
      label: param.paramName,
      type: param.dataType === 'float' ? 'float' : 
            param.dataType === 'integer' ? 'integer' :
            param.dataType === 'number' ? 'number' :
            param.dataType === 'boolean' ? 'boolean' : 'string',
      widget: 'text',
      description: param.paramDesc,
      unit: param.unit,
    }));

    return {
      title: formData.name || '模型参数配置',
      parameters: [...inputParams, ...outputParams],
    };
  }, [formData]);

  // 初始化Schema JSON
  useEffect(() => {
    if (formData.inputParameters.length > 0 || formData.outputParameters.length > 0) {
      const schema = convertFormDataToSchema();
      const schemaStr = JSON.stringify(schema, null, 2);
      if (schemaStr !== schemaJson) {
        setSchemaJson(schemaStr);
        // 同时初始化表单值
        updateFormValuesFromSchema(schema);
      }
    } else if (!schemaJson) {
      // 如果没有参数，设置默认的空Schema
      const defaultSchema: ParameterSchemaConfig = {
        title: formData.name || '模型参数配置',
        parameters: [],
      };
      setSchemaJson(JSON.stringify(defaultSchema, null, 2));
    }
  }, [formData.inputParameters, formData.outputParameters, formData.name, convertFormDataToSchema, updateFormValuesFromSchema, schemaJson]);

  // 从Schema JSON更新formData
  const updateFormDataFromSchema = useCallback((schema: ParameterSchemaConfig) => {
    const inputParams: InputParameter[] = [];
    const outputParams: OutputParameter[] = [];
    
    schema.parameters.forEach((param, index) => {
      // 根据参数名称判断是输入还是输出（这里简化处理，实际可以根据业务逻辑判断）
      const isOutput = param.name.toLowerCase().includes('output') || 
                       param.name.toLowerCase().includes('result') ||
                       param.name.toLowerCase().includes('prediction');
      
      if (isOutput) {
        outputParams.push({
          id: `output-${Date.now()}-${index}`,
          paramName: param.label,
          paramDesc: param.name,
          unit: param.unit || '',
          dataType: param.type === 'float' ? 'float' :
                   param.type === 'integer' ? 'integer' :
                   param.type === 'number' ? 'number' :
                   param.type === 'boolean' ? 'boolean' : 'string',
        });
      } else {
        inputParams.push({
          id: `input-${Date.now()}-${index}`,
          paramName: param.label,
          paramDesc: param.name,
          unit: param.unit || '',
          dataType: param.type === 'float' ? 'float' :
                   param.type === 'integer' ? 'integer' :
                   param.type === 'number' ? 'number' :
                   param.type === 'boolean' ? 'boolean' : 'string',
          required: param.required || false,
        });
      }
    });

    setFormData(prev => ({
      ...prev,
      inputParameters: inputParams,
      outputParameters: outputParams,
    }));
  }, []);

  // 更新Schema JSON
  const handleUpdateSchemaFromJson = useCallback(() => {
    try {
      const parsed = JSON.parse(schemaJson);
      setSchemaJsonError('');
      updateFormDataFromSchema(parsed);
      updateFormValuesFromSchema(parsed);
      toast.success('Schema更新成功');
    } catch (e: any) {
      setSchemaJsonError(e.message);
      toast.error('JSON格式错误');
    }
  }, [schemaJson, updateFormDataFromSchema, updateFormValuesFromSchema]);

  // 渲染表单控件
  const renderWidget = (param: ParameterSchema) => {
    const value = formValues[param.name] ?? param.default;
    const widget = param.widget || (param.type === 'boolean' ? 'switch' : 'text');

    switch (widget) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))}
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
              step={param.step ?? (param.type === 'float' ? 0.1 : 1)}
              value={value ?? param.default ?? param.min ?? 0}
              onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: parseFloat(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-primary min-w-[50px] text-right">
              {value ?? param.default ?? param.min ?? 0}
            </span>
            {param.unit && <span className="text-sm text-muted-foreground">{param.unit}</span>}
          </div>
        );

      case 'switch':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value ?? param.default ?? false}
              onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm text-muted-foreground">
              {value ? '启用' : '禁用'}
            </span>
          </label>
        );

      case 'select':
      case 'radio':
        if (!param.options || param.options.length === 0) {
          return <div className="text-sm text-muted-foreground">请配置选项</div>;
        }
        if (widget === 'radio') {
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
                    onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          );
        }
        return (
          <MdSelect
            options={param.options}
            value={value ?? param.default}
            onChange={(val) => setFormValues(prev => ({ ...prev, [param.name]: val }))}
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
              setFormValues(prev => ({ ...prev, [param.name]: val }));
            }}
            placeholder={param.description}
          />
        );
    }
  };

  // 添加输入参数
  const handleAddInputParameter = () => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: [
        ...prev.inputParameters,
        {
          id: `input-${Date.now()}`,
          paramName: '',
          paramDesc: '',
          unit: '',
          dataType: 'string',
          required: false,
        },
      ],
    }));
  };

  // 删除输入参数
  const handleRemoveInputParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: prev.inputParameters.filter((_, i) => i !== index),
    }));
  };

  // 更新输入参数
  const handleUpdateInputParameter = (index: number, field: keyof InputParameter, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: prev.inputParameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }));
  };

  // 添加输出参数
  const handleAddOutputParameter = () => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: [
        ...prev.outputParameters,
        {
          id: `output-${Date.now()}`,
          paramName: '',
          paramDesc: '',
          unit: '',
          dataType: 'string',
        },
      ],
    }));
  };

  // 删除输出参数
  const handleRemoveOutputParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.filter((_, i) => i !== index),
    }));
  };

  // 更新输出参数
  const handleUpdateOutputParameter = (index: number, field: keyof OutputParameter, value: string) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }));
  };

  // 添加评价指标
  const handleAddEvaluationMetric = () => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: [
        ...prev.evaluationMetrics,
        {
          id: `metric-${Date.now()}`,
          paramName: '',
          paramDesc: '',
          paramType: 'accuracy',
        },
      ],
    }));
  };

  // 删除评价指标
  const handleRemoveEvaluationMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: prev.evaluationMetrics.filter((_, i) => i !== index),
    }));
  };

  // 更新评价指标
  const handleUpdateEvaluationMetric = (index: number, field: keyof EvaluationMetric, value: string) => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: prev.evaluationMetrics.map((metric, i) =>
        i === index ? { ...metric, [field]: value } : metric
      ),
    }));
  };

  // 添加关联数据集
  const handleAddDataset = (dataset: Dataset) => {
    if (formData.relatedDatasets.find((d) => d.id === dataset.id)) {
      toast.warning('该数据集已添加');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      relatedDatasets: [...prev.relatedDatasets, dataset],
    }));
    toast.success('数据集已添加');
  };

  // 移除关联数据集
  const handleRemoveDataset = (datasetId: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedDatasets: prev.relatedDatasets.filter((d) => d.id !== datasetId),
    }));
    toast.success('数据集已移除');
  };

  // AI生成参数配置
  const handleAIGenerateParameters = async () => {
    if (!aiInputText.trim()) {
      toast.error('请输入参数描述');
      return;
    }

    setIsGeneratingParameters(true);
    try {
      // TODO: 调用AI服务生成参数配置
      // 模拟AI生成过程
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 模拟生成的参数配置
      const generatedInputParams: InputParameter[] = [
        {
          id: `input-${Date.now()}-1`,
          paramName: '温度',
          paramDesc: 'temperature',
          unit: '℃',
          dataType: 'float',
          required: true,
        },
        {
          id: `input-${Date.now()}-2`,
          paramName: '压力',
          paramDesc: 'pressure',
          unit: 'Pa',
          dataType: 'float',
          required: true,
        },
      ];

      const generatedOutputParams: OutputParameter[] = [
        {
          id: `output-${Date.now()}-1`,
          paramName: '预测值',
          paramDesc: 'prediction',
          unit: '',
          dataType: 'float',
        },
      ];

      const generatedMetrics: EvaluationMetric[] = [
        {
          id: `metric-${Date.now()}-1`,
          paramName: '准确率',
          paramDesc: '模型准确率',
          paramType: 'accuracy',
        },
        {
          id: `metric-${Date.now()}-2`,
          paramName: 'F1分数',
          paramDesc: 'F1分数',
          paramType: 'f1',
        },
      ];

      setFormData((prev) => ({
        ...prev,
        inputParameters: generatedInputParams,
        outputParameters: generatedOutputParams,
        evaluationMetrics: generatedMetrics,
      }));

      toast.success('参数配置生成成功！');
      setAiInputText('');
    } catch (error) {
      console.error('AI生成参数失败:', error);
      toast.error('AI生成参数失败，请重试');
    } finally {
      setIsGeneratingParameters(false);
    }
  };

  // 提交表单
  const handleSubmit = () => {
    // 验证必填字段
    if (!formData.name) {
      toast.error('请输入模型名称');
      return;
    }
    if (!formData.category) {
      toast.error('请选择分类');
      return;
    }
    if (!formData.owner) {
      toast.error('请选择模型所有者');
      return;
    }
    if (!formData.programmingLanguage) {
      toast.error('请选择编程语言');
      return;
    }

    // 准备提交数据
    const submitData = {
      ...formData,
    };

    console.log('提交模型数据:', submitData);
    
    // TODO: 调用API保存数据
    toast.success(isEditMode ? '模型更新成功！' : '模型创建成功！');
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

      <MdCard>
        <MdCardHeader>
          <MdCardTitle>模型配置</MdCardTitle>
          <MdCardDescription>{isEditMode ? '编辑机器学习模型信息' : '创建新的机器学习模型'}</MdCardDescription>
        </MdCardHeader>
        <MdCardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="datasets">关联数据集</TabsTrigger>
              <TabsTrigger value="parameters">参数设置</TabsTrigger>
            </TabsList>

            {/* Tab 1: 基本信息 */}
            <TabsContent value="basic" className="mt-6 space-y-6">
              {/* 模型名称 */}
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

              {/* 分类 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  分类 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="请选择分类"
                />
              </div>

              {/* 模型所有者 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型所有者 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={ownerOptions}
                  value={formData.owner}
                  onChange={(value) => setFormData({ ...formData, owner: value })}
                  placeholder="请选择模型所有者"
                />
              </div>

              {/* 编程语言 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  编程语言 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={programmingLanguageOptions}
                  value={formData.programmingLanguage}
                  onChange={(value) => setFormData({ ...formData, programmingLanguage: value })}
                  placeholder="请选择编程语言"
                />
              </div>

              {/* 模型适用场景 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型适用场景
                </label>
                <TreeSelect
                  treeData={applicableScenarioTree}
                  selectedValues={formData.applicableScenarios}
                  onChange={(values) => setFormData({ ...formData, applicableScenarios: values })}
                  placeholder="请选择适用场景（可多选）"
                />
              </div>

              {/* 模型描述 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="请输入模型描述"
                  rows={4}
                />
              </div>

              {/* 标签 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  标签
                </label>
                {loading ? (
                  <div className="text-sm text-muted-foreground">加载标签中...</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 p-3 border-2 border-input rounded-md min-h-[60px]">
                      {tags.map(tag => {
                        const isSelected = formData.tags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => {
                              const newTags = isSelected
                                ? formData.tags.filter(t => t !== tag.id)
                                : [...formData.tags, tag.id];
                              setFormData({ ...formData, tags: newTags });
                            }}
                            className={cn(
                              'px-3 py-1.5 rounded-md text-sm transition-colors',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                            )}
                          >
                            {tag.tagName}
                          </button>
                        );
                      })}
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">已选择：</span>
                        {formData.tags.map(tagId => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <MdBadge
                              key={tagId}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag.tagName}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    tags: formData.tags.filter(t => t !== tagId),
                                  });
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </MdBadge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 2: 关联数据集 */}
            <TabsContent value="datasets" className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">已关联数据集</h3>
                  <span className="text-sm text-muted-foreground">
                    已选择 {formData.relatedDatasets.length} 个数据集
                  </span>
                </div>
                {formData.relatedDatasets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    暂无关联数据集，请从下方选择数据集
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.relatedDatasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-medium text-foreground">{dataset.name}</h4>
                              <MdBadge variant="secondary" className="text-xs">{dataset.type}</MdBadge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{dataset.description}</p>
                            <div className="text-xs text-muted-foreground">{dataset.createTime}</div>
                          </div>
                          <MdButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDataset(dataset.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </MdButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-base font-semibold mb-4">可选数据集</h3>
                {availableDatasets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    暂无可用数据集
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableDatasets.map((dataset) => {
                      const isAdded = formData.relatedDatasets.find((d) => d.id === dataset.id);
                      return (
                        <div
                          key={dataset.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-medium text-foreground">{dataset.name}</h4>
                                <MdBadge variant="secondary" className="text-xs">{dataset.type}</MdBadge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{dataset.description}</p>
                              <div className="text-xs text-muted-foreground">{dataset.createTime}</div>
                            </div>
                            {isAdded ? (
                              <MdBadge variant="success" className="ml-2">已添加</MdBadge>
                            ) : (
                              <MdButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddDataset(dataset)}
                                className="ml-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                添加
                              </MdButton>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: 参数设置 */}
            <TabsContent value="parameters" className="mt-6 space-y-8">
              {/* Tab切换 - 切换按钮居右 */}
              <div className="flex items-center justify-between border-b pb-4">
                <div></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setParameterViewMode('visual')}
                    className={cn(
                      'px-4 py-2 flex items-center gap-2 border-b-2 transition-colors',
                      parameterViewMode === 'visual'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    可视化模式
                  </button>
                  <button
                    onClick={() => setParameterViewMode('ai')}
                    className={cn(
                      'px-4 py-2 flex items-center gap-2 border-b-2 transition-colors',
                      parameterViewMode === 'ai'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Layout className="h-4 w-4" />
                    列表模式
                  </button>
                </div>
              </div>

              {/* 可视化模式 - 三栏布局 */}
              {parameterViewMode === 'visual' && (
                <div>
                  <MdCard>
                  <MdCardHeader>
                      <MdCardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI 智能生成参数配置
                      </MdCardTitle>
                      <MdCardDescription>
                        描述你的模型参数需求，AI将自动生成输入参数、输出参数和评价指标配置
                      </MdCardDescription>
                    </MdCardHeader>
                    {/* AI输入区域 */}
                  <MdCard>
                    <MdCardContent className="space-y-4">
                      <div className="space-y-3">
                        <textarea
                          value={aiInputText}
                          onChange={(e) => setAiInputText(e.target.value)}
                          placeholder="例如：我需要创建一个水质预测模型，输入参数包括温度、pH值、溶解氧、浊度等，输出参数为水质等级，评价指标使用准确率和F1分数..."
                          className="w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={5}
                        />
                        <MdButton
                          onClick={handleAIGenerateParameters}
                          disabled={!aiInputText.trim() || isGeneratingParameters}
                          className="w-full"
                        >
                          {isGeneratingParameters ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              生成参数配置
                            </>
                          )}
                        </MdButton>
                      </div>
                    </MdCardContent>
                  </MdCard>
                </MdCard>
                <div className="grid grid-cols-3 gap-4">
                  {/* 左侧：Schema Config */}
                  <MdCard className="p-6 h-[calc(100vh-400px)] flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Schema Config</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <textarea
                        value={schemaJson}
                        onChange={(e) => {
                          setSchemaJson(e.target.value);
                          setSchemaJsonError('');
                        }}
                        className={cn(
                          "w-full font-mono text-xs rounded-md border bg-[#1e1e1e] text-[#d4d4d4] p-3 min-h-[200px] resize-y",
                          schemaJsonError && "border-destructive"
                        )}
                        placeholder='{"title": "模型参数配置", "parameters": [...]}'
                      />
                      {schemaJsonError && (
                        <p className="text-xs text-destructive mt-2">JSON 格式错误: {schemaJsonError}</p>
                      )}
                      <MdButton
                        variant="outline"
                        size="sm"
                        onClick={handleUpdateSchemaFromJson}
                        className="w-full mt-2"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        更新界面
                      </MdButton>
                    </div>
                  </MdCard>

                  {/* 中间：Dynamic UI */}
                  <MdCard className="p-6 h-[calc(100vh-400px)] flex flex-col overflow-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Dynamic UI</h3>
                    </div>
                    <div className="flex-1 overflow-auto space-y-6">
                      {(() => {
                        try {
                          const schema: ParameterSchemaConfig = schemaJson ? JSON.parse(schemaJson) : { parameters: [] };
                          if (schema.parameters.length === 0) {
                            return (
                              <div className="text-center py-8 text-muted-foreground">
                                <p>暂无参数</p>
                                <p className="text-xs mt-2">请在左侧编辑Schema配置</p>
                              </div>
                            );
                          }
                          return schema.parameters.map((param, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">
                                  {param.label}
                                  {param.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <MdBadge variant="outline" className="text-xs">{param.type}</MdBadge>
                                {param.unit && (
                                  <span className="text-xs text-muted-foreground">({param.unit})</span>
                                )}
                              </div>
                              {param.description && (
                                <p className="text-xs text-muted-foreground">{param.description}</p>
                              )}
                              {renderWidget(param)}
                              {param.default !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  默认值: <code className="bg-muted px-1 rounded">{String(param.default)}</code>
                                </p>
                              )}
                            </div>
                          ));
                        } catch (e) {
                          return (
                            <div className="text-center py-8 text-destructive">
                              <p>Schema JSON格式错误</p>
                              <p className="text-xs mt-2">请检查左侧的JSON配置</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </MdCard>

                  {/* 右侧：Payload */}
                  <MdCard className="p-6 h-[calc(100vh-400px)] flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">Payload</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto h-full">
                        {JSON.stringify(formValues, null, 2)}
                      </pre>
                    </div>
                  </MdCard>
                </div>
                </div>
              )}

              {/* 原有的表格模式 */}
              {parameterViewMode === 'ai' && (
                <div className="space-y-8">
                  {/* 输入参数 */}
                  <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">输入参数</h3>
                  <MdButton variant="outline" size="sm" onClick={handleAddInputParameter}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加参数
                  </MdButton>
                </div>
                {formData.inputParameters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    暂无输入参数，请点击添加参数
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">参数名称</th>
                          <th className="px-4 py-2 text-left font-medium">英文名称</th>
                          <th className="px-4 py-2 text-left font-medium">单位</th>
                          <th className="px-4 py-2 text-left font-medium">数据类型</th>
                          <th className="px-4 py-2 text-left font-medium">必填</th>
                          <th className="px-4 py-2 text-left font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.inputParameters.map((param, index) => (
                          <tr key={param.id || index} className="border-t border-border">
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.paramName}
                                onChange={(e) => handleUpdateInputParameter(index, 'paramName', e.target.value)}
                                placeholder="参数名称"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.paramDesc}
                                onChange={(e) => handleUpdateInputParameter(index, 'paramDesc', e.target.value)}
                                placeholder="英文名称"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.unit}
                                onChange={(e) => handleUpdateInputParameter(index, 'unit', e.target.value)}
                                placeholder="单位"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdSelect
                                options={dataTypeOptions}
                                value={param.dataType}
                                onChange={(value) => handleUpdateInputParameter(index, 'dataType', value)}
                                placeholder="数据类型"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={param.required}
                                onChange={(e) => handleUpdateInputParameter(index, 'required', e.target.checked)}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveInputParameter(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </MdButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 输出参数 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">输出参数</h3>
                  <MdButton variant="outline" size="sm" onClick={handleAddOutputParameter}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加参数
                  </MdButton>
                </div>
                {formData.outputParameters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    暂无输出参数，请点击添加参数
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">参数名称</th>
                          <th className="px-4 py-2 text-left font-medium">英文名称</th>
                          <th className="px-4 py-2 text-left font-medium">单位</th>
                          <th className="px-4 py-2 text-left font-medium">数据类型</th>
                          <th className="px-4 py-2 text-left font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.outputParameters.map((param, index) => (
                          <tr key={param.id || index} className="border-t border-border">
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.paramName}
                                onChange={(e) => handleUpdateOutputParameter(index, 'paramName', e.target.value)}
                                placeholder="参数名称"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.paramDesc}
                                onChange={(e) => handleUpdateOutputParameter(index, 'paramDesc', e.target.value)}
                                placeholder="英文名称"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdInput
                                value={param.unit}
                                onChange={(e) => handleUpdateOutputParameter(index, 'unit', e.target.value)}
                                placeholder="单位"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdSelect
                                options={dataTypeOptions}
                                value={param.dataType}
                                onChange={(value) => handleUpdateOutputParameter(index, 'dataType', value)}
                                placeholder="数据类型"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOutputParameter(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </MdButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 评价指标 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">评价指标</h3>
                  <MdButton variant="outline" size="sm" onClick={handleAddEvaluationMetric}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加指标
                  </MdButton>
                </div>
                {formData.evaluationMetrics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    暂无评价指标，请点击添加指标
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">指标名称</th>
                          <th className="px-4 py-2 text-left font-medium">指标描述</th>
                          <th className="px-4 py-2 text-left font-medium">指标类型</th>
                          <th className="px-4 py-2 text-left font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.evaluationMetrics.map((metric, index) => (
                          <tr key={metric.id || index} className="border-t border-border">
                            <td className="px-4 py-2">
                              <MdInput
                                value={metric.paramName}
                                onChange={(e) => handleUpdateEvaluationMetric(index, 'paramName', e.target.value)}
                                placeholder="指标名称"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdInput
                                value={metric.paramDesc}
                                onChange={(e) => handleUpdateEvaluationMetric(index, 'paramDesc', e.target.value)}
                                placeholder="指标描述"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdSelect
                                options={evaluationMetricTypeOptions}
                                value={metric.paramType}
                                onChange={(value) => handleUpdateEvaluationMetric(index, 'paramType', value)}
                                placeholder="指标类型"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <MdButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEvaluationMetric(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </MdButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
              )}
            </TabsContent>
          </Tabs>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
            <MdButton variant="outline" onClick={() => router.back()}>
              取消
            </MdButton>
            <MdButton onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? '保存修改' : '创建模型'}
            </MdButton>
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export default MachineLearningModelCreateEditPage;
