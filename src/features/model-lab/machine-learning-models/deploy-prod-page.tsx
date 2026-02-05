"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, Rocket, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription } from "@/components/enterprise-ui/md-card"
import { MdButton } from "@/components/enterprise-ui/md-button"
import { MdInput } from "@/components/enterprise-ui/md-input"
import { MdSelect, type SelectOption } from "@/components/enterprise-ui/md-select"
import { MdCheckbox } from "@/components/enterprise-ui/md-checkbox"
import { MdBadge } from "@/components/enterprise-ui/md-badge"
import { OrganizationTree, OrgTreeNode } from "@/components/enterprise-ui/organization-tree"
import { toast } from "sonner"

// 生产部署表单数据类型
interface ProductionDeployFormData {
  // 模型信息（从训练任务传入）
  modelId: string
  runId: string
  modelName: string
  version: string
  
  // 部署配置
  deployName: string
  environment: "production"
  resourceGroup: string
  instanceType: string
  instanceCount: number
  autoScaling: boolean
  minInstances?: number
  maxInstances?: number
  
  // 数据目录注册
  businessEntityId: string
  topicId: string
  outputParameters: Array<{
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
  
  // 访问配置
  enableApi: boolean
  apiAuthType: "none" | "key" | "token"
  apiKey?: string
  
  // 审核信息
  deployReason: string
  expectedImpact: string
  rollbackPlan: string
}

// Mock数据
const mockResourceGroups: SelectOption[] = [
  { value: "rg-prod-001", label: "生产环境资源组-A" },
  { value: "rg-prod-002", label: "生产环境资源组-B" },
]

const mockInstanceTypes: SelectOption[] = [
  { value: "small", label: "小型 (2 CPU, 4GB RAM)" },
  { value: "medium", label: "中型 (4 CPU, 8GB RAM)" },
  { value: "large", label: "大型 (8 CPU, 16GB RAM)" },
  { value: "xlarge", label: "超大型 (16 CPU, 32GB RAM)" },
]

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
    deployName: "",
    environment: "production",
    resourceGroup: "",
    instanceType: "",
    instanceCount: 1,
    autoScaling: false,
    businessEntityId: "",
    topicId: "",
    outputParameters: [],
    applicationScope: [],
    taskType: "API方式",
    enableApi: true,
    apiAuthType: "key",
    deployReason: "",
    expectedImpact: "",
    rollbackPlan: "",
  })

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  // 加载模型信息
  useEffect(() => {
    if (modelId) {
      // TODO: 从API加载模型信息
      setFormData((prev) => ({
        ...prev,
        modelName: `模型-${modelId}`,
        deployName: `部署-${modelId}-${new Date().toLocaleDateString()}`,
      }))
    }
  }, [modelId])

  // 验证表单
  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      if (!formData.deployName.trim()) {
        toast.error("请输入部署名称")
        return false
      }
      if (!formData.resourceGroup) {
        toast.error("请选择资源组")
        return false
      }
      if (!formData.instanceType) {
        toast.error("请选择实例规格")
        return false
      }
    }
    if (stepNum === 2) {
      if (!formData.businessEntityId) {
        toast.error("请选择业务实体")
        return false
      }
      if (!formData.topicId) {
        toast.error("请选择业务分析主题")
        return false
      }
      if (formData.outputParameters.length === 0) {
        toast.error("请至少添加一个输出参数")
        return false
      }
    }
    if (stepNum === 3) {
      if (formData.applicationScope.length === 0) {
        toast.error("请选择应用范围")
        return false
      }
      if (!formData.deployReason.trim()) {
        toast.error("请输入部署原因")
        return false
      }
      if (!formData.expectedImpact.trim()) {
        toast.error("请输入预期影响")
        return false
      }
      if (!formData.rollbackPlan.trim()) {
        toast.error("请输入回滚方案")
        return false
      }
    }
    return true
  }

  // 提交部署申请（进入审核流程）
  const handleSubmit = async () => {
    if (!validateStep(3)) return

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

  // 添加输出参数
  const handleAddOutputParameter = () => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: [
        ...prev.outputParameters,
        {
          name: "",
          physicalFieldName: "",
          dataType: "string",
          description: "",
        },
      ],
    }))
  }

  // 删除输出参数
  const handleRemoveOutputParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.filter((_, i) => i !== index),
    }))
  }

  // 更新输出参数
  const handleUpdateOutputParameter = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      outputParameters: prev.outputParameters.map((param, i) =>
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
          {step < 3 ? (
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
        {[1, 2, 3].map((s) => (
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
                {s === 1 ? "部署配置" : s === 2 ? "数据目录" : "审核信息"}
              </span>
            </div>
            {s < 3 && <div className={`w-16 h-0.5 ${step > s ? "bg-success" : "bg-muted"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* 步骤1: 部署配置 */}
      {step === 1 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>部署配置</MdCardTitle>
            <MdCardDescription>配置生产环境的部署参数</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型名称
                </label>
                <MdInput value={formData.modelName} readOnly className="bg-muted" />
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
                  部署名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  placeholder="请输入部署名称"
                  value={formData.deployName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deployName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  环境
                </label>
                <MdInput value="生产环境" readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  资源组 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockResourceGroups}
                  value={formData.resourceGroup}
                  onChange={(value) => setFormData((prev) => ({ ...prev, resourceGroup: value }))}
                  placeholder="请选择资源组"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  实例规格 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockInstanceTypes}
                  value={formData.instanceType}
                  onChange={(value) => setFormData((prev) => ({ ...prev, instanceType: value }))}
                  placeholder="请选择实例规格"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  实例数量 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  type="number"
                  value={formData.instanceCount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instanceCount: parseInt(e.target.value) || 1 }))}
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <MdCheckbox
                  checked={formData.autoScaling}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, autoScaling: checked }))}
                />
                <label className="text-sm font-medium">启用自动扩缩容</label>
              </div>
            </div>

            {formData.autoScaling && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">最小实例数</label>
                  <MdInput
                    type="number"
                    value={formData.minInstances || 1}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minInstances: parseInt(e.target.value) || 1 }))}
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">最大实例数</label>
                  <MdInput
                    type="number"
                    value={formData.maxInstances || 10}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxInstances: parseInt(e.target.value) || 10 }))}
                    min={1}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MdCheckbox
                checked={formData.enableApi}
                onChange={(checked) => setFormData((prev) => ({ ...prev, enableApi: checked }))}
              />
              <label className="text-sm font-medium">启用API访问</label>
            </div>

            {formData.enableApi && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">认证方式</label>
                  <MdSelect
                    options={[
                      { value: "none", label: "无认证" },
                      { value: "key", label: "API Key" },
                      { value: "token", label: "Token" },
                    ]}
                    value={formData.apiAuthType}
                    onChange={(value) => setFormData((prev) => ({ ...prev, apiAuthType: value as any }))}
                  />
                </div>
                {formData.apiAuthType !== "none" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">API密钥</label>
                    <MdInput
                      type="password"
                      placeholder="请输入API密钥"
                      value={formData.apiKey || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )}
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤2: 数据目录注册 */}
      {step === 2 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>数据目录注册</MdCardTitle>
            <MdCardDescription>配置模型的输出参数和数据目录映射</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  onChange={(value) => setFormData((prev) => ({ ...prev, topicId: value }))}
                  placeholder="请选择业务分析主题"
                  disabled={!formData.businessEntityId}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  输出参数 <span className="text-red-500">*</span>
                </label>
                <MdButton variant="outline" size="sm" onClick={handleAddOutputParameter}>
                  添加参数
                </MdButton>
              </div>
              <div className="space-y-3">
                {formData.outputParameters.map((param, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-start p-3 border border-border rounded-lg">
                    <MdInput
                      placeholder="参数名称"
                      value={param.name}
                      onChange={(e) => handleUpdateOutputParameter(index, "name", e.target.value)}
                    />
                    <MdInput
                      placeholder="物理字段名"
                      value={param.physicalFieldName}
                      onChange={(e) => handleUpdateOutputParameter(index, "physicalFieldName", e.target.value)}
                    />
                    <MdSelect
                      options={[
                        { value: "string", label: "字符串" },
                        { value: "number", label: "数字" },
                        { value: "boolean", label: "布尔值" },
                        { value: "date", label: "日期" },
                      ]}
                      value={param.dataType}
                      onChange={(value) => handleUpdateOutputParameter(index, "dataType", value)}
                    />
                    <div className="flex gap-2">
                      <MdInput
                        placeholder="描述"
                        value={param.description}
                        onChange={(e) => handleUpdateOutputParameter(index, "description", e.target.value)}
                        className="flex-1"
                      />
                      <MdButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOutputParameter(index)}
                      >
                        删除
                      </MdButton>
                    </div>
                  </div>
                ))}
                {formData.outputParameters.length === 0 && (
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

      {/* 步骤3: 审核信息 */}
      {step === 3 && (
        <div className="space-y-6">
          <MdCard>
            <MdCardHeader>
              <MdCardTitle>调度配置</MdCardTitle>
              <MdCardDescription>配置模型的运行调度方式</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  应用范围 <span className="text-red-500">*</span>
                </label>
                <div className="border border-border rounded-lg p-4 min-h-[200px]">
                  <OrganizationTree
                    data={mockOrgTreeData}
                    selectedIds={formData.applicationScope}
                    onSelectionChange={(selectedIds: string[]) => {
                      setFormData((prev) => ({
                        ...prev,
                        applicationScope: selectedIds,
                      }))
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  任务类型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={[
                    { value: "按时间", label: "按时间" },
                    { value: "按任务", label: "按任务" },
                    { value: "API方式", label: "API方式" },
                    { value: "单次触发", label: "单次触发" },
                  ]}
                  value={formData.taskType}
                  onChange={(value) => setFormData((prev) => ({ ...prev, taskType: value as any }))}
                />
              </div>

              {formData.taskType === "按时间" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Cron表达式</label>
                  <MdInput
                    placeholder="例如: 0 0 * * * (每天0点执行)"
                    value={formData.cronExpression || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cronExpression: e.target.value }))}
                  />
                </div>
              )}
            </MdCardContent>
          </MdCard>

          <MdCard>
            <MdCardHeader>
              <MdCardTitle>审核信息</MdCardTitle>
              <MdCardDescription>填写部署申请的相关信息，用于审核工作流</MdCardDescription>
            </MdCardHeader>
            <MdCardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  部署原因 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请说明为什么要部署此模型到生产环境"
                  value={formData.deployReason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deployReason: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  预期影响 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请说明此模型部署后预期带来的业务影响"
                  value={formData.expectedImpact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedImpact: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  回滚方案 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请说明如果部署出现问题，如何进行回滚"
                  value={formData.rollbackPlan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rollbackPlan: e.target.value }))}
                />
              </div>
            </MdCardContent>
          </MdCard>
        </div>
      )}
    </div>
  )
}
