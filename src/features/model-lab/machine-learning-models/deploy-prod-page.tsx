"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, Rocket, AlertCircle, CheckCircle, X, ChevronDown, ChevronRight, ChevronLeft, Check, Plus, Trash2, Sparkles, Layout, Loader2, Wrench, Monitor, Package, RefreshCw } from "lucide-react"
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription } from "@/components/enterprise-ui/md-card"
import { MdButton } from "@/components/enterprise-ui/md-button"
import { MdInput } from "@/components/enterprise-ui/md-input"
import { MdSelect, type SelectOption } from "@/components/enterprise-ui/md-select"
import { MdBadge } from "@/components/enterprise-ui/md-badge"
import { MdCheckbox } from "@/components/enterprise-ui/md-checkbox"
import { OrganizationTree, OrgTreeNode } from "@/components/enterprise-ui/organization-tree"
import { toast } from "sonner"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

// 树形节点接口
interface TreeNode {
  value: string
  label: string
  children?: TreeNode[]
}

// 标签接口
interface Tag {
  id: string
  tagCode: string
  tagName: string
  tagTypeId: string
  tagTypeName: string
  description: string
  status: '启用' | '禁用'
}

// 输入参数接口
interface InputParameter {
  id?: string
  paramName: string
  paramDesc: string
  unit: string
  dataType: string
  required: boolean
}

// 输出参数接口
interface OutputParameter {
  id?: string
  paramName: string
  paramDesc: string
  unit: string
  dataType: string
}

// 评价指标接口
interface EvaluationMetric {
  id?: string
  paramName: string
  paramDesc: string
  paramType: string
}

// 生产部署表单数据类型
interface ProductionDeployFormData {
  // 模型信息（从训练任务传入）
  modelId: string
  runId: string
  modelName: string
  version: string
  
  // 模型配置
  category: string // 分类：回归、分类、排序、时序序列
  owner: string // 模型所有者：个人、所在组织
  programmingLanguage: string // 编程语言
  applicableScenarios: string[] // 适用场景（多选）
  description: string // 模型描述
  tags: string[] // 标签（多选）
  
  // 参数配置
  inputParameters: InputParameter[]
  outputParameters: OutputParameter[]
  evaluationMetrics: EvaluationMetric[]
  
  // 数据目录注册
  businessEntityId: string
  topicId: string
  subTopicId: string
  outputParametersForDataDir: Array<{
    name: string
    physicalFieldName: string
    dataType: string
    description: string
  }>
  
  // 调度配置
  applicationScope: string[]
  taskType: "按时间" | "按任务" | "API方式" | "单次触发"
  scheduleType?: "periodic" | "interval"
  cronExpression?: string
  periodType?: 'daily' | 'hourly' | 'weekly' | 'monthly' | 'custom'
  intervalStartTime?: string
  intervalEndTime?: string
  intervalFrequency?: '30min' | '1hour' | '6hour' | 'daily'
  retryEnabled: boolean
  retryCount?: number
  retryInterval?: number
  waitDataReady: boolean
  timeoutAlert: boolean
  timeoutMinutes?: number
  
  // 备注
  remark: string
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
]

// 树形多选组件
interface TreeSelectProps {
  treeData: TreeNode[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  treeData,
  selectedValues,
  onChange,
  placeholder = '请选择',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(selectedValues))
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [dropdownStyle, setDropdownStyle] = React.useState<{ top: number; left: number; minWidth: number } | null>(null)

  // 同步外部传入的选中状态
  useEffect(() => {
    setCheckedKeys(new Set(selectedValues))
  }, [selectedValues])

  // 计算下拉框位置
  React.useLayoutEffect(() => {
    if (isOpen && triggerRef.current && typeof document !== 'undefined') {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
      })
    } else {
      setDropdownStyle(null)
    }
  }, [isOpen])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 切换节点展开/收起
  const toggleExpand = (value: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    })
  }

  // 切换节点选中状态
  const toggleCheck = (value: string) => {
    const newCheckedKeys = new Set(checkedKeys)
    if (newCheckedKeys.has(value)) {
      newCheckedKeys.delete(value)
    } else {
      newCheckedKeys.add(value)
    }
    setCheckedKeys(newCheckedKeys)
    onChange(Array.from(newCheckedKeys))
  }

  // 获取节点标签
  const getNodeLabel = (nodes: TreeNode[], value: string): string => {
    for (const node of nodes) {
      if (node.value === value) {
        return node.label
      }
      if (node.children) {
        const found = getNodeLabel(node.children, value)
        if (found) return found
      }
    }
    return ''
  }

  // 渲染树节点
  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedKeys.has(node.value)
    const isChecked = checkedKeys.has(node.value)

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
                e.stopPropagation()
                toggleExpand(node.value)
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
    )
  }

  // 获取选中项的显示文本
  const getDisplayText = () => {
    if (checkedKeys.size === 0) {
      return placeholder
    }
    if (checkedKeys.size === 1) {
      const value = Array.from(checkedKeys)[0]
      return getNodeLabel(treeData, value)
    }
    return `已选择 ${checkedKeys.size} 项`
  }

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
    )

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
                  const newValues = Array.from(checkedKeys).filter(v => v !== value)
                  onChange(newValues)
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
  )
}

// Mock数据
const mockBusinessEntities: SelectOption[] = [
  { value: "1", label: "污水处理厂" },
  { value: "2", label: "水质监测站" },
  { value: "3", label: "设备管理" },
]

const mockTopics: Record<string, SelectOption[]> = {
  "1": [
    { value: "topic-1", label: "水质分析主题" },
    { value: "topic-2", label: "水量分析主题" },
  ],
  "2": [
    { value: "topic-3", label: "监测数据主题" },
  ],
  "3": [
    { value: "topic-4", label: "设备运行主题" },
  ],
}

// Mock子主题数据（每个业务分析主题下的子主题）
const mockSubTopics: Record<string, SelectOption[]> = {
  "topic-1": [
    { value: "subtopic-1-1", label: "COD分析" },
    { value: "subtopic-1-2", label: "BOD分析" },
    { value: "subtopic-1-3", label: "氨氮分析" },
  ],
  "topic-2": [
    { value: "subtopic-2-1", label: "日处理量" },
    { value: "subtopic-2-2", label: "月处理量" },
  ],
  "topic-3": [
    { value: "subtopic-3-1", label: "实时监测" },
    { value: "subtopic-3-2", label: "历史数据" },
  ],
  "topic-4": [
    { value: "subtopic-4-1", label: "运行状态" },
    { value: "subtopic-4-2", label: "故障记录" },
  ],
}


// Mock组织树数据
const mockOrgTreeData: OrgTreeNode[] = [
  {
    id: "org1",
    name: "集团",
    children: [
      {
        id: "org2",
        name: "大区-华东",
        children: [
          {
            id: "org4",
            name: "区域-上海",
            children: [
              {
                id: "org5",
                name: "水厂-浦东水厂",
              },
            ],
          },
        ],
      },
      {
        id: "org3",
        name: "大区-华南",
      },
    ],
  },
]

export function DeployProductionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modelId = searchParams.get("id")
  const runId = searchParams.get("runId")
  const version = searchParams.get("version")

  const [formData, setFormData] = useState<ProductionDeployFormData>({
    modelId: modelId || "",
    runId: runId || "",
    modelName: "",
    version: version || "",
    category: "",
    owner: "",
    programmingLanguage: "",
    applicableScenarios: [],
    description: "",
    tags: [],
    inputParameters: [],
    outputParameters: [],
    evaluationMetrics: [],
    businessEntityId: "",
    topicId: "",
    subTopicId: "",
    outputParametersForDataDir: [],
    applicationScope: [],
    taskType: "按时间",
    scheduleType: "periodic",
    retryEnabled: false,
    waitDataReady: false,
    timeoutAlert: false,
    timeoutMinutes: 30,
    remark: "",
  })

  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  // 动态添加的子主题（用于存储用户新创建的子主题）
  const [dynamicSubTopics, setDynamicSubTopics] = useState<Record<string, SelectOption[]>>({})

  // 子主题选择组件
  interface SubTopicSelectProps {
    topicId: string
    value: string
    onChange: (value: string) => void
    onAddNew: (name: string) => void
    disabled?: boolean
  }

  const SubTopicSelect: React.FC<SubTopicSelectProps> = ({
    topicId,
    value,
    onChange,
    onAddNew,
    disabled = false,
  }) => {
    const [inputValue, setInputValue] = useState('')
    const [isCreatingNew, setIsCreatingNew] = useState(false)

    // 获取当前主题下的所有子主题（包括动态添加的）
    const getAvailableSubTopics = (): SelectOption[] => {
      const baseSubTopics = mockSubTopics[topicId] || []
      const dynamicSubTopicsForTopic = dynamicSubTopics[topicId] || []
      return [...baseSubTopics, ...dynamicSubTopicsForTopic]
    }

    const availableSubTopics = getAvailableSubTopics()

    const handleSelectChange = (selectedValue: string) => {
      if (selectedValue === '__create_new__') {
        setIsCreatingNew(true)
        setInputValue('')
      } else {
        setIsCreatingNew(false)
        onChange(selectedValue)
      }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault()
        // 检查是否已存在
        const exists = availableSubTopics.some(
          (subTopic) => subTopic.label.toLowerCase() === inputValue.trim().toLowerCase()
        )
        if (exists) {
          toast.error('该子主题已存在')
          return
        }
        onAddNew(inputValue.trim())
        setIsCreatingNew(false)
        setInputValue('')
      } else if (e.key === 'Escape') {
        setIsCreatingNew(false)
        setInputValue('')
      }
    }

    if (isCreatingNew) {
      return (
        <div className="space-y-2">
          <MdInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="输入新子主题名称，按Enter确认"
            autoFocus
            disabled={disabled}
          />
          <div className="flex gap-2">
            <MdButton
              variant="outline"
              size="sm"
              onClick={() => {
                if (inputValue.trim()) {
                  const exists = availableSubTopics.some(
                    (subTopic) => subTopic.label.toLowerCase() === inputValue.trim().toLowerCase()
                  )
                  if (exists) {
                    toast.error('该子主题已存在')
                    return
                  }
                  onAddNew(inputValue.trim())
                }
                setIsCreatingNew(false)
                setInputValue('')
              }}
            >
              确认
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreatingNew(false)
                setInputValue('')
              }}
            >
              取消
            </MdButton>
          </div>
        </div>
      )
    }

    const options: SelectOption[] = [
      ...availableSubTopics,
      { value: '__create_new__', label: '+ 创建新子主题' },
    ]

    return (
      <MdSelect
        options={options}
        value={value}
        onChange={handleSelectChange}
        placeholder="请选择或创建子主题"
        disabled={disabled}
      />
    )
  }
  const [parameterViewMode, setParameterViewMode] = useState<'visual' | 'ai'>('visual')
  const [aiInputText, setAiInputText] = useState('')
  const [isGeneratingParameters, setIsGeneratingParameters] = useState(false)
  
  // Schema配置相关状态
  const [schemaJson, setSchemaJson] = useState<string>('')
  const [schemaJsonError, setSchemaJsonError] = useState<string>('')
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  
  // 参数Schema接口
  interface ParameterSchema {
    name: string
    label: string
    type: 'string' | 'number' | 'integer' | 'float' | 'boolean' | 'array' | 'object'
    widget?: 'text' | 'textarea' | 'slider' | 'switch' | 'select' | 'radio'
    default?: any
    description?: string
    min?: number
    max?: number
    step?: number
    options?: Array<{ label: string; value: string }>
    required?: boolean
    unit?: string
  }
  
  interface ParameterSchemaConfig {
    title?: string
    parameters: ParameterSchema[]
  }

  // 分类选项
  const categoryOptions: SelectOption[] = [
    { value: '回归', label: '回归' },
    { value: '分类', label: '分类' },
    { value: '排序', label: '排序' },
    { value: '时序序列', label: '时序序列' },
  ]

  // 模型所有者选项
  const ownerOptions: SelectOption[] = [
    { value: '个人', label: '个人' },
    { value: '所在组织', label: '所在组织' },
  ]

  // 编程语言选项
  const programmingLanguageOptions: SelectOption[] = [
    { value: 'Python', label: 'Python' },
    { value: 'R', label: 'R' },
    { value: 'Java', label: 'Java' },
    { value: 'Scala', label: 'Scala' },
    { value: 'C++', label: 'C++' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: '其他', label: '其他' },
  ]

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
  ]

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
  ]

  // 加载标签列表
  const loadTags = useCallback(async () => {
    try {
      setLoading(true)
      // TODO: 调用API获取标签列表
      // 模拟数据
      await new Promise((resolve) => setTimeout(resolve, 300))
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
      ]
      setTags(mockTags.filter(tag => tag.status === '启用'))
    } catch (error) {
      console.error('加载标签失败:', error)
      toast.error('加载标签失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 加载模型信息（包含所有必填项的测试数据）
  useEffect(() => {
    if (modelId) {
      // TODO: 从API加载模型信息
      // 这里使用测试数据，包含所有必填项
      setFormData((prev) => ({
        ...prev,
        modelName: `水质预测模型-${modelId}`,
        category: '回归',
        owner: '所在组织',
        programmingLanguage: 'Python',
        applicableScenarios: ['facility', 'aeration_tank'],
        description: '用于预测污水处理厂水质指标的机器学习模型',
        tags: ['1', '3'],
        // 参数配置
        inputParameters: [
          {
            id: 'input-1',
            paramName: '温度',
            paramDesc: 'temperature',
            unit: '℃',
            dataType: 'float',
            required: true,
          },
          {
            id: 'input-2',
            paramName: 'pH值',
            paramDesc: 'ph_value',
            unit: '',
            dataType: 'float',
            required: true,
          },
          {
            id: 'input-3',
            paramName: '溶解氧',
            paramDesc: 'dissolved_oxygen',
            unit: 'mg/L',
            dataType: 'float',
            required: false,
          },
        ],
        outputParameters: [
          {
            id: 'output-1',
            paramName: 'COD预测值',
            paramDesc: 'cod_prediction',
            unit: 'mg/L',
            dataType: 'float',
          },
          {
            id: 'output-2',
            paramName: 'BOD预测值',
            paramDesc: 'bod_prediction',
            unit: 'mg/L',
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
          {
            id: 'metric-2',
            paramName: 'R²',
            paramDesc: '决定系数',
            paramType: 'r2',
          },
        ],
        // 数据目录注册
        businessEntityId: '1',
        topicId: 'topic-1',
        subTopicId: 'subtopic-1-1',
        outputParametersForDataDir: [
          {
            name: 'COD预测值',
            physicalFieldName: 'cod_prediction',
            dataType: 'number',
            description: '化学需氧量预测值',
          },
          {
            name: 'BOD预测值',
            physicalFieldName: 'bod_prediction',
            dataType: 'number',
            description: '生化需氧量预测值',
          },
        ],
        // 调度配置
        applicationScope: ['org5'],
        taskType: '按时间',
        scheduleType: 'periodic',
        periodType: 'daily',
        cronExpression: '0 9 * * *',
        retryEnabled: true,
        retryCount: 3,
        retryInterval: 5,
        waitDataReady: true,
        timeoutAlert: true,
        timeoutMinutes: 30,
        remark: '模型部署备注信息',
      }))
    }
  }, [modelId])

  // 加载标签
  useEffect(() => {
    loadTags()
  }, [loadTags])

  // 验证表单
  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      if (!formData.modelName.trim()) {
        toast.error("请输入模型名称")
        return false
      }
      if (!formData.category) {
        toast.error("请选择分类")
        return false
      }
      if (!formData.owner) {
        toast.error("请选择模型所有者")
        return false
      }
      if (!formData.programmingLanguage) {
        toast.error("请选择编程语言")
        return false
      }
    }
    if (stepNum === 2) {
      // 参数配置步骤验证（可选，允许为空）
      // 如果需要必填验证，可以在这里添加
    }
    if (stepNum === 3) {
      if (!formData.businessEntityId) {
        toast.error("请选择业务实体")
        return false
      }
      if (!formData.topicId) {
        toast.error("请选择业务分析主题")
        return false
      }
      if (formData.outputParametersForDataDir.length === 0) {
        toast.error("请至少添加一个输出参数")
        return false
      }
    }
    if (stepNum === 4) {
      if (formData.applicationScope.length === 0) {
        toast.error("请选择应用范围")
        return false
      }
      if (formData.taskType === '按时间') {
        if (formData.scheduleType === 'periodic' && formData.periodType === 'custom' && !formData.cronExpression?.trim()) {
          toast.error("请输入Cron表达式")
          return false
        }
        if (formData.scheduleType === 'interval') {
          if (!formData.intervalStartTime) {
            toast.error("请选择开始时间")
            return false
          }
          if (!formData.intervalEndTime) {
            toast.error("请选择结束时间")
            return false
          }
          if (!formData.intervalFrequency) {
            toast.error("请选择频率")
            return false
          }
        }
      }
      if (formData.retryEnabled) {
        if (!formData.retryCount || formData.retryCount <= 0) {
          toast.error("请输入有效的重试次数")
          return false
        }
        if (!formData.retryInterval || formData.retryInterval <= 0) {
          toast.error("请输入有效的重试间隔")
          return false
        }
      }
    }
    return true
  }

  // 提交部署申请（进入审核流程）
  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    try {
      // TODO: 调用API提交部署申请，触发审核工作流
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("部署申请已提交，等待审核")
      router.push("/categories/model-lab/model-development/machine-learning-models")
    } catch (error) {
      toast.error("提交部署申请失败")
    } finally {
      setLoading(false)
    }
  }

  // 添加输入参数
  const handleAddInputParameter = () => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: [
        ...prev.inputParameters,
        {
          id: `input-${Date.now()}`,
          paramName: "",
          paramDesc: "",
          unit: "",
          dataType: "string",
          required: false,
        },
      ],
    }))
  }

  // 删除输入参数
  const handleRemoveInputParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: prev.inputParameters.filter((_, i) => i !== index),
    }))
  }

  // 更新输入参数
  const handleUpdateInputParameter = (index: number, field: keyof InputParameter, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      inputParameters: prev.inputParameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }))
  }

  // 添加输出参数（参数配置）
  const handleAddOutputParameter = () => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: [
        ...prev.outputParameters,
        {
          id: `output-${Date.now()}`,
          paramName: "",
          paramDesc: "",
          unit: "",
          dataType: "string",
        },
      ],
    }))
  }

  // 删除输出参数（参数配置）
  const handleRemoveOutputParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.filter((_, i) => i !== index),
    }))
  }

  // 更新输出参数（参数配置）
  const handleUpdateOutputParameter = (index: number, field: keyof OutputParameter, value: string) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }))
  }

  // 添加评价指标
  const handleAddEvaluationMetric = () => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: [
        ...prev.evaluationMetrics,
        {
          id: `metric-${Date.now()}`,
          paramName: "",
          paramDesc: "",
          paramType: "accuracy",
        },
      ],
    }))
  }

  // 删除评价指标
  const handleRemoveEvaluationMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: prev.evaluationMetrics.filter((_, i) => i !== index),
    }))
  }

  // 更新评价指标
  const handleUpdateEvaluationMetric = (index: number, field: keyof EvaluationMetric, value: string) => {
    setFormData((prev) => ({
      ...prev,
      evaluationMetrics: prev.evaluationMetrics.map((metric, i) =>
        i === index ? { ...metric, [field]: value } : metric
      ),
    }))
  }

  // 从Schema JSON更新表单值
  const updateFormValuesFromSchema = useCallback((schema: ParameterSchemaConfig) => {
    const newValues: Record<string, any> = {}
    schema.parameters.forEach(param => {
      if (param.default !== undefined) {
        newValues[param.name] = param.default
      } else {
        switch (param.type) {
          case 'number':
          case 'integer':
          case 'float':
            newValues[param.name] = param.min || 0
            break
          case 'boolean':
            newValues[param.name] = false
            break
          default:
            newValues[param.name] = ''
        }
      }
    })
    setFormValues(newValues)
  }, [])

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
    }))

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
    }))

    return {
      title: formData.modelName || '模型参数配置',
      parameters: [...inputParams, ...outputParams],
    }
  }, [formData])

  // 从Schema JSON更新formData
  const updateFormDataFromSchema = useCallback((schema: ParameterSchemaConfig) => {
    const inputParams: InputParameter[] = []
    const outputParams: OutputParameter[] = []
    
    schema.parameters.forEach((param, index) => {
      // 根据参数名称判断是输入还是输出（这里简化处理，实际可以根据业务逻辑判断）
      const isOutput = param.name.toLowerCase().includes('output') || 
                       param.name.toLowerCase().includes('result') ||
                       param.name.toLowerCase().includes('prediction')
      
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
        })
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
        })
      }
    })

    setFormData(prev => ({
      ...prev,
      inputParameters: inputParams,
      outputParameters: outputParams,
    }))
  }, [])

  // 初始化Schema JSON
  useEffect(() => {
    if (formData.inputParameters.length > 0 || formData.outputParameters.length > 0) {
      const schema = convertFormDataToSchema()
      const schemaStr = JSON.stringify(schema, null, 2)
      if (schemaStr !== schemaJson) {
        setSchemaJson(schemaStr)
        // 同时初始化表单值
        updateFormValuesFromSchema(schema)
      }
    } else if (!schemaJson) {
      // 如果没有参数，设置默认的空Schema
      const defaultSchema: ParameterSchemaConfig = {
        title: formData.modelName || '模型参数配置',
        parameters: [],
      }
      setSchemaJson(JSON.stringify(defaultSchema, null, 2))
    }
  }, [formData.inputParameters, formData.outputParameters, formData.modelName, convertFormDataToSchema, updateFormValuesFromSchema, schemaJson])

  // 当进入步骤3时，自动将步骤2的输出参数带入数据目录
  useEffect(() => {
    if (step === 3 && formData.outputParameters.length > 0 && formData.outputParametersForDataDir.length === 0) {
      // 将步骤2的输出参数转换为步骤3需要的格式
      const convertedParams = formData.outputParameters.map(param => {
        // 数据类型映射：将步骤2的数据类型转换为步骤3的数据类型
        let dataType = 'string'
        if (param.dataType === 'number' || param.dataType === 'integer' || param.dataType === 'float') {
          dataType = 'number'
        } else if (param.dataType === 'boolean') {
          dataType = 'boolean'
        } else if (param.dataType === 'date' || param.dataType === 'datetime') {
          dataType = 'date'
        } else {
          dataType = 'string'
        }

        return {
          name: param.paramName,
          physicalFieldName: param.paramDesc || param.paramName,
          dataType: dataType,
          description: param.paramDesc || param.paramName,
        }
      })

      setFormData((prev) => ({
        ...prev,
        outputParametersForDataDir: convertedParams,
      }))
    }
  }, [step, formData.outputParameters.length, formData.outputParametersForDataDir.length])

  // 更新Schema JSON
  const handleUpdateSchemaFromJson = useCallback(() => {
    try {
      const parsed = JSON.parse(schemaJson)
      setSchemaJsonError('')
      updateFormDataFromSchema(parsed)
      updateFormValuesFromSchema(parsed)
      toast.success('Schema更新成功')
    } catch (e: any) {
      setSchemaJsonError(e.message)
      toast.error('JSON格式错误')
    }
  }, [schemaJson, updateFormDataFromSchema, updateFormValuesFromSchema])

  // 渲染表单控件
  const renderWidget = (param: ParameterSchema) => {
    const value = formValues[param.name] ?? param.default
    const widget = param.widget || (param.type === 'boolean' ? 'switch' : 'text')

    switch (widget) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px] resize-y"
            placeholder={param.description}
          />
        )

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
        )

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
        )

      case 'select':
      case 'radio':
        if (!param.options || param.options.length === 0) {
          return <div className="text-sm text-muted-foreground">请配置选项</div>
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
          )
        }
        return (
          <MdSelect
            options={param.options}
            value={value ?? param.default}
            onChange={(val) => setFormValues(prev => ({ ...prev, [param.name]: val }))}
            placeholder="请选择"
          />
        )

      case 'text':
      default:
        return (
          <MdInput
            type={param.type === 'number' || param.type === 'integer' || param.type === 'float' ? 'number' : 'text'}
            value={value ?? ''}
            onChange={(e) => {
              const val = param.type === 'number' || param.type === 'integer' || param.type === 'float'
                ? parseFloat(e.target.value) || 0
                : e.target.value
              setFormValues(prev => ({ ...prev, [param.name]: val }))
            }}
            placeholder={param.description}
          />
        )
    }
  }

  // AI生成参数配置
  const handleAIGenerateParameters = async () => {
    if (!aiInputText.trim()) {
      toast.error('请输入参数描述')
      return
    }

    setIsGeneratingParameters(true)
    try {
      // TODO: 调用AI服务生成参数配置
      // 模拟AI生成过程
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
      ]

      const generatedOutputParams: OutputParameter[] = [
        {
          id: `output-${Date.now()}-1`,
          paramName: '预测值',
          paramDesc: 'prediction',
          unit: '',
          dataType: 'float',
        },
      ]

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
      ]

      setFormData((prev) => ({
        ...prev,
        inputParameters: generatedInputParams,
        outputParameters: generatedOutputParams,
        evaluationMetrics: generatedMetrics,
      }))

      toast.success('参数配置生成成功！')
      setAiInputText('')
    } catch (error) {
      console.error('AI生成参数失败:', error)
      toast.error('AI生成参数失败，请重试')
    } finally {
      setIsGeneratingParameters(false)
    }
  }

  // 添加输出参数（数据目录）
  const handleAddOutputParameterForDataDir = () => {
    setFormData((prev) => ({
      ...prev,
      outputParametersForDataDir: [
        ...prev.outputParametersForDataDir,
        {
          name: "",
          physicalFieldName: "",
          dataType: "string",
          description: "",
        },
      ],
    }))
  }

  // 删除输出参数（数据目录）
  const handleRemoveOutputParameterForDataDir = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputParametersForDataDir: prev.outputParametersForDataDir.filter((_, i) => i !== index),
    }))
  }

  // 更新输出参数（数据目录）
  const handleUpdateOutputParameterForDataDir = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      outputParametersForDataDir: prev.outputParametersForDataDir.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }))
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MdButton variant="ghost" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            返回
          </MdButton>
          <h1 className="text-2xl font-bold">部署到生产环境</h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton variant="outline" onClick={() => router.back()}>
            取消
          </MdButton>
          {step > 1 && (
            <MdButton 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              上一步
            </MdButton>
          )}
          {step < 4 ? (
            <MdButton onClick={() => {
              if (validateStep(step)) {
                setStep(step + 1)
              }
            }}>
              下一步
            </MdButton>
          ) : (
            <MdButton onClick={handleSubmit} loading={loading} leftIcon={<Rocket className="h-4 w-4" />}>
              提交审核
            </MdButton>
          )}
        </div>
      </div>

      {/* 审核流程提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-900 mb-2">生产环境部署审核流程</p>
            <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
              <li>提交部署申请后，将进入审核工作流</li>
              <li>审核通过后，模型将自动部署到生产环境</li>
              <li>部署成功后，模型将发布到模型中心并进入模型库</li>
              <li>您可以在模型上线模块查看审核进度</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step > s
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "模型配置" : s === 2 ? "参数配置" : s === 3 ? "数据目录" : "调度信息"}
              </span>
            </div>
            {s < 4 && <div className={`w-16 h-0.5 ${step > s ? "bg-success" : "bg-muted"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* 步骤1: 模型配置 */}
      {step === 1 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>模型配置</MdCardTitle>
            <MdCardDescription>配置模型的基本信息</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={formData.modelName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, modelName: e.target.value }))}
                  placeholder="请输入模型名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  版本号
                </label>
                <MdInput value={formData.version} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  分类 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  placeholder="请选择分类"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型所有者 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={ownerOptions}
                  value={formData.owner}
                  onChange={(value) => setFormData((prev) => ({ ...prev, owner: value }))}
                  placeholder="请选择模型所有者"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                编程语言 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={programmingLanguageOptions}
                value={formData.programmingLanguage}
                onChange={(value) => setFormData((prev) => ({ ...prev, programmingLanguage: value }))}
                placeholder="请选择编程语言"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                模型适用场景
              </label>
              <TreeSelect
                treeData={applicableScenarioTree}
                selectedValues={formData.applicableScenarios}
                onChange={(values) => setFormData((prev) => ({ ...prev, applicableScenarios: values }))}
                placeholder="请选择适用场景（可多选）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                模型描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入模型描述"
                rows={4}
              />
            </div>

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
                      const isSelected = formData.tags.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const newTags = isSelected
                              ? formData.tags.filter(t => t !== tag.id)
                              : [...formData.tags, tag.id]
                            setFormData((prev) => ({ ...prev, tags: newTags }))
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
                      )
                    })}
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">已选择：</span>
                      {formData.tags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId)
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
                                })
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </MdBadge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤2: 参数配置 */}
      {step === 2 && (
        <div className="space-y-6">
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
                        setSchemaJson(e.target.value)
                        setSchemaJsonError('')
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
                        const schema: ParameterSchemaConfig = schemaJson ? JSON.parse(schemaJson) : { parameters: [] }
                        if (schema.parameters.length === 0) {
                          return (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>暂无参数</p>
                              <p className="text-xs mt-2">请在左侧编辑Schema配置</p>
                            </div>
                          )
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
                        ))
                      } catch (e) {
                        return (
                          <div className="text-center py-8 text-destructive">
                            <p>Schema JSON格式错误</p>
                            <p className="text-xs mt-2">请检查左侧的JSON配置</p>
                          </div>
                        )
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

          {/* 列表模式 */}
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
        </div>
      )}

      {/* 步骤3: 数据目录注册 */}
      {step === 3 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>数据目录注册</MdCardTitle>
            <MdCardDescription>配置模型的输出参数和数据目录映射</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  业务实体 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockBusinessEntities}
                  value={formData.businessEntityId}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      businessEntityId: value,
                      topicId: "",
                      subTopicId: "",
                    }))
                  }}
                  placeholder="请选择业务实体"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  业务分析主题 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockTopics[formData.businessEntityId] || []}
                  value={formData.topicId}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      topicId: value,
                      subTopicId: "",
                    }))
                  }}
                  placeholder="请选择业务分析主题"
                  disabled={!formData.businessEntityId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  子主题
                </label>
                <SubTopicSelect
                  topicId={formData.topicId}
                  value={formData.subTopicId}
                  onChange={(value) => setFormData((prev) => ({ ...prev, subTopicId: value }))}
                  onAddNew={(newSubTopicName) => {
                    if (!formData.topicId) {
                      toast.error("请先选择业务分析主题")
                      return
                    }
                    // 生成新的子主题ID
                    const newSubTopicId = `subtopic-${formData.topicId}-${Date.now()}`
                    const newSubTopic: SelectOption = {
                      value: newSubTopicId,
                      label: newSubTopicName,
                    }
                    
                    // 添加到动态子主题列表
                    setDynamicSubTopics((prev) => ({
                      ...prev,
                      [formData.topicId]: [...(prev[formData.topicId] || []), newSubTopic],
                    }))
                    
                    // 设置为当前选中的值
                    setFormData((prev) => ({
                      ...prev,
                      subTopicId: newSubTopicId,
                    }))
                    
                    toast.success(`子主题"${newSubTopicName}"已添加`)
                  }}
                  disabled={!formData.topicId}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  输出参数 <span className="text-red-500">*</span>
                </label>
                <MdButton variant="outline" size="sm" onClick={handleAddOutputParameterForDataDir}>
                  添加参数
                </MdButton>
              </div>
              <div className="space-y-3">
                {formData.outputParametersForDataDir.map((param, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-start p-3 border border-border rounded-lg">
                    <MdInput
                      placeholder="参数名称"
                      value={param.name}
                      onChange={(e) => handleUpdateOutputParameterForDataDir(index, "name", e.target.value)}
                    />
                    <MdInput
                      placeholder="物理字段名"
                      value={param.physicalFieldName}
                      onChange={(e) => handleUpdateOutputParameterForDataDir(index, "physicalFieldName", e.target.value)}
                    />
                    <MdSelect
                      options={[
                        { value: "string", label: "字符串" },
                        { value: "number", label: "数字" },
                        { value: "boolean", label: "布尔值" },
                        { value: "date", label: "日期" },
                      ]}
                      value={param.dataType}
                      onChange={(value) => handleUpdateOutputParameterForDataDir(index, "dataType", value)}
                    />
                    <div className="flex gap-2">
                      <MdInput
                        placeholder="描述"
                        value={param.description}
                        onChange={(e) => handleUpdateOutputParameterForDataDir(index, "description", e.target.value)}
                        className="flex-1"
                      />
                      <MdButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOutputParameterForDataDir(index)}
                      >
                        删除
                      </MdButton>
                    </div>
                  </div>
                ))}
                {formData.outputParametersForDataDir.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无输出参数，请点击{' '}
                    <span className="font-medium text-primary">添加参数</span>
                    添加
                  </div>
                )}
              </div>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤4: 调度信息 */}
      {step === 4 && (
        <div className="space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>运行调度管理</MdCardTitle>
              <MdCardDescription>配置模型的运行调度策略</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-6">
              {/* 选择应用范围 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  选择应用范围 <span className="text-red-500">*</span>
                </label>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="text-sm text-muted-foreground mb-3">从组织树中选择调度的应用范围（可多选）</div>
                  <OrganizationTree
                    data={mockOrgTreeData}
                    selectedIds={formData.applicationScope}
                    onSelectionChange={(selectedIds: string[]) => {
                      setFormData((prev) => ({
                        ...prev,
                        applicationScope: selectedIds,
                      }))
                    }}
                    defaultExpanded={true}
                  />
                  {formData.applicationScope.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-muted-foreground mb-1">已选择 {formData.applicationScope.length} 个组织</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 任务类型 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  任务类型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={[
                    { value: '按时间', label: '按时间' },
                    { value: '按任务', label: '按任务' },
                    { value: 'API方式', label: 'API方式' },
                    { value: '单次触发', label: '单次触发' }
                  ]}
                  value={formData.taskType}
                  onChange={(value) => setFormData({ ...formData, taskType: value as any })}
                />
              </div>

              {/* 按时间时的运行机制配置 */}
              {formData.taskType === '按时间' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">运行机制</label>
                    <MdSelect
                      options={[
                        { value: 'periodic', label: '周期性' },
                        { value: 'interval', label: '区间运行' }
                      ]}
                      value={formData.scheduleType}
                      onChange={(value) => setFormData({ ...formData, scheduleType: value as any })}
                    />
                  </div>

                  {formData.scheduleType === 'periodic' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">周期类型</label>
                        <MdSelect
                          options={[
                            { value: 'daily', label: '每天' },
                            { value: 'hourly', label: '每小时' },
                            { value: 'weekly', label: '每周' },
                            { value: 'monthly', label: '每月' },
                            { value: 'custom', label: '自定义Cron' }
                          ]}
                          value={formData.periodType}
                          onChange={(value) => setFormData({ ...formData, periodType: value as any })}
                        />
                      </div>
                      {formData.periodType === 'custom' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Cron表达式</label>
                          <MdInput
                            value={formData.cronExpression || ''}
                            onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                            placeholder="例如: 0 9 * * *"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {formData.scheduleType === 'interval' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">开始时间</label>
                        <MdInput
                          type="datetime-local"
                          value={formData.intervalStartTime || ''}
                          onChange={(e) => setFormData({ ...formData, intervalStartTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">结束时间</label>
                        <MdInput
                          type="datetime-local"
                          value={formData.intervalEndTime || ''}
                          onChange={(e) => setFormData({ ...formData, intervalEndTime: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">频率</label>
                        <MdSelect
                          options={[
                            { value: '30min', label: '每30分钟' },
                            { value: '1hour', label: '每小时' },
                            { value: '6hour', label: '每6小时' },
                            { value: 'daily', label: '每天' }
                          ]}
                          value={formData.intervalFrequency}
                          onChange={(value) => setFormData({ ...formData, intervalFrequency: value as any })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 失败重试策略 */}
              <div>
                <div className="flex items-center mb-2">
                  <MdCheckbox
                    checked={formData.retryEnabled}
                    onChange={(checked) => setFormData({ ...formData, retryEnabled: checked })}
                  />
                  <span className="ml-2">支持失败重试</span>
                </div>
                {formData.retryEnabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">重试次数</label>
                      <MdInput
                        type="number"
                        value={formData.retryCount?.toString() || ''}
                        onChange={(e) => setFormData({ ...formData, retryCount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">重试间隔（分钟）</label>
                      <MdInput
                        type="number"
                        value={formData.retryInterval?.toString() || ''}
                        onChange={(e) => setFormData({ ...formData, retryInterval: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 高级选项 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <MdCheckbox
                    checked={formData.waitDataReady}
                    onChange={(checked) => setFormData({ ...formData, waitDataReady: checked })}
                  />
                  <span className="ml-2">任务调度上游依赖检查（是否等待数据源（DW_PUMP_SENSOR）就绪后再执行）</span>
                </div>
                <div className="flex items-center">
                  <MdCheckbox
                    checked={formData.timeoutAlert}
                    onChange={(checked) => setFormData({ ...formData, timeoutAlert: checked })}
                  />
                  <span className="ml-2">执行超时告警（运行超过 {formData.timeoutMinutes || 30} 分钟发送告警给负责人）</span>
                </div>
                {formData.timeoutAlert && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium mb-2">超时时间（分钟）</label>
                    <MdInput
                      type="number"
                      value={formData.timeoutMinutes?.toString() || '30'}
                      onChange={(e) => setFormData({ ...formData, timeoutMinutes: parseInt(e.target.value) || 30 })}
                      className="w-48"
                    />
                  </div>
                )}
              </div>
            </MdCardContent>
          </MdCard>

          {/* 备注 */}
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>备注</MdCardTitle>
              <MdCardDescription>填写部署相关的备注信息</MdCardDescription>
            </MdCardHeader>
            <MdCardContent>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入备注信息..."
                value={formData.remark}
                onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
                rows={5}
              />
            </MdCardContent>
          </MdCard>
        </div>
      )}
    </div>
  )
}
