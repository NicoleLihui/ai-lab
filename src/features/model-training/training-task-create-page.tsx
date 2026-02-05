"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Play, Database, Code, Settings, Cpu, HardDrive, Network } from "lucide-react"
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription } from "@/components/enterprise-ui/md-card"
import { MdButton } from "@/components/enterprise-ui/md-button"
import { MdInput } from "@/components/enterprise-ui/md-input"
import { MdSelect, type SelectOption } from "@/components/enterprise-ui/md-select"
import { MdCheckbox } from "@/components/enterprise-ui/md-checkbox"
import { MdBadge } from "@/components/enterprise-ui/md-badge"
import { toast } from "sonner"

// 训练任务表单数据类型
interface TrainingTaskFormData {
  // 基本信息
  taskName: string
  region: string
  trainingImage: string
  trainingMode: "DDP" | "MPI" | "Ray" | "single"
  machineSource: "cvm" | "tione"
  
  // 资源配置
  resourceGroup: string
  cardModel: string
  gpuPerNode: number
  cpuPerNode: number
  memoryPerNode: number
  nodeCount: number
  
  // 数据来源
  gitRepository: string
  gitStoragePath: string
  datasetId: string
  datasetName: string
  
  // 训练参数
  startupCommand: string
  tuningParameters: string
  
  // 其他配置
  description: string
  enableClsLog: boolean
  enableAutoRestart: boolean
  enableHealthCheck: boolean
  enableSsh: boolean
  sshPorts: string[]
  
  // 训练输出
  outputPath: string
}

// Mock数据
const mockRegions: SelectOption[] = [
  { value: "guangzhou", label: "广州" },
  { value: "beijing", label: "北京" },
  { value: "shanghai", label: "上海" },
]

const mockTrainingImages: SelectOption[] = [
  { value: "pytorch-1.0.6.1", label: "内置通用镜像/PyTorch / ver1.0.6.1-vilm0.11.0-torch2.8-py312-cuda12.8-gpu" },
  { value: "tensorflow-2.5", label: "内置通用镜像/TensorFlow / ver2.5.0-py39-cuda11.2-gpu" },
  { value: "paddlepaddle-2.0", label: "内置通用镜像/PaddlePaddle / ver2.0.0-py38-cuda10.2-gpu" },
]

const mockTrainingModes: SelectOption[] = [
  { value: "single", label: "单机训练" },
  { value: "DDP", label: "DDP（分布式数据并行）" },
  { value: "MPI", label: "MPI（消息传递接口）" },
  { value: "Ray", label: "Ray（分布式计算框架）" },
]

const mockMachineSources: SelectOption[] = [
  { value: "cvm", label: "从CVM机器中选择" },
  { value: "tione", label: "从TIONE平台购买" },
]

const mockResourceGroups: SelectOption[] = [
  { value: "rg-001", label: "默认资源组" },
  { value: "rg-002", label: "GPU训练资源组" },
  { value: "rg-003", label: "高性能计算资源组" },
]

const mockCardModels: SelectOption[] = [
  { value: "V100", label: "Tesla V100 (32GB)" },
  { value: "A100", label: "Tesla A100 (80GB)" },
  { value: "T4", label: "Tesla T4 (16GB)" },
]

const mockGitRepositories: SelectOption[] = [
  { value: "git-001", label: "模型代码仓库-主分支" },
  { value: "git-002", label: "模型代码仓库-开发分支" },
]

const mockDatasets: Array<{ id: string; name: string; dataVolume: string; ldmName: string }> = [
  { id: "dataset-001", name: "污水处理厂运行数据集A", dataVolume: "10万条", ldmName: "污水处理厂" },
  { id: "dataset-002", name: "水质监测数据集B", dataVolume: "5万条", ldmName: "水质监测" },
  { id: "dataset-003", name: "设备运行数据集C", dataVolume: "20万条", ldmName: "设备管理" },
]

export function TrainingTaskCreatePage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<TrainingTaskFormData>({
    taskName: "",
    region: "guangzhou",
    trainingImage: "",
    trainingMode: "single",
    machineSource: "tione",
    resourceGroup: "",
    cardModel: "",
    gpuPerNode: 0,
    cpuPerNode: 1,
    memoryPerNode: 1,
    nodeCount: 1,
    gitRepository: "",
    gitStoragePath: "",
    datasetId: "",
    datasetName: "",
    startupCommand: "",
    tuningParameters: "{}",
    description: "",
    enableClsLog: false,
    enableAutoRestart: false,
    enableHealthCheck: false,
    enableSsh: false,
    sshPorts: [],
    outputPath: "",
  })

  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // 验证表单
  const validateForm = (): boolean => {
    if (!formData.taskName.trim()) {
      toast.error("请输入任务名称")
      return false
    }
    if (!formData.trainingImage) {
      toast.error("请选择训练镜像")
      return false
    }
    if (!formData.resourceGroup) {
      toast.error("请选择资源组")
      return false
    }
    if (formData.trainingImage.includes("gpu") && formData.gpuPerNode === 0) {
      toast.error("使用GPU镜像时，GPU数量不能为0")
      return false
    }
    if (!formData.startupCommand.trim()) {
      toast.error("请输入启动命令")
      return false
    }
    return true
  }

  // 保存任务（草稿）
  const handleSave = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // TODO: 调用API保存任务
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("任务保存成功")
      router.back()
    } catch (error) {
      toast.error("任务保存失败")
    } finally {
      setLoading(false)
    }
  }

  // 提交并启动训练
  const handleSubmitAndStart = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // TODO: 调用API提交任务并启动训练
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("训练任务已提交并启动")
      router.push("/categories/model-lab/training/training-tasks")
    } catch (error) {
      toast.error("任务提交失败")
    } finally {
      setLoading(false)
    }
  }

  // 选择数据集
  const handleDatasetSelect = (dataset: typeof mockDatasets[0]) => {
    setFormData((prev) => ({
      ...prev,
      datasetId: dataset.id,
      datasetName: dataset.name,
    }))
    setIsDatasetModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MdButton variant="ghost" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            返回
          </MdButton>
          <h1 className="text-2xl font-bold">创建训练任务</h1>
        </div>
        <div className="flex items-center gap-2">
          <MdButton variant="outline" onClick={() => router.back()}>
            取消
          </MdButton>
          <MdButton variant="outline" onClick={handleSave} loading={loading}>
            保存
          </MdButton>
          <MdButton onClick={handleSubmitAndStart} loading={loading} leftIcon={<Play className="h-4 w-4" />}>
            提交并启动
          </MdButton>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 提示</p>
        <p>状态为运行中的训练任务正在产生费用，不使用时，请及时停止。</p>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>基本信息</MdCardTitle>
            <MdCardDescription>配置训练任务的基本信息</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  任务名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  placeholder="请输入任务名称（最多256个字符，支持英文、中文、数字、下划线、中划线，必须以英文、中文或数字开头）"
                  value={formData.taskName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, taskName: e.target.value }))}
                  maxLength={256}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  地域 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockRegions}
                  value={formData.region}
                  onChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  训练镜像 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockTrainingImages}
                  value={formData.trainingImage}
                  onChange={(value) => setFormData((prev) => ({ ...prev, trainingImage: value }))}
                  placeholder="请选择训练镜像"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  训练模式 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockTrainingModes}
                  value={formData.trainingMode}
                  onChange={(value) => setFormData((prev) => ({ ...prev, trainingMode: value as any }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                机器来源 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={mockMachineSources}
                value={formData.machineSource}
                onChange={(value) => setFormData((prev) => ({ ...prev, machineSource: value as any }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">描述</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请输入任务描述（最多500个字符）"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                maxLength={500}
              />
            </div>
          </MdCardContent>
        </MdCard>

        {/* 资源配置 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>资源配置</MdCardTitle>
            <MdCardDescription>配置训练任务的资源需求</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
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
                  卡型号 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={mockCardModels}
                  value={formData.cardModel}
                  onChange={(value) => setFormData((prev) => ({ ...prev, cardModel: value }))}
                  placeholder="请选择卡型号"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  单节点GPU（卡） <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, gpuPerNode: Math.max(0, prev.gpuPerNode - 0.1) }))}
                  >
                    -
                  </MdButton>
                  <MdInput
                    type="number"
                    value={formData.gpuPerNode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gpuPerNode: parseFloat(e.target.value) || 0 }))}
                    className="flex-1"
                    min={0}
                    step={0.1}
                  />
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, gpuPerNode: prev.gpuPerNode + 0.1 }))}
                  >
                    +
                  </MdButton>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  使用GPU镜像时，GPU数量不能为0。根据卡型号，可输入0.1-1或整数倍
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  单节点CPU（核） <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, cpuPerNode: Math.max(1, prev.cpuPerNode - 1) }))}
                  >
                    -
                  </MdButton>
                  <MdInput
                    type="number"
                    value={formData.cpuPerNode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cpuPerNode: parseInt(e.target.value) || 1 }))}
                    className="flex-1"
                    min={1}
                  />
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, cpuPerNode: prev.cpuPerNode + 1 }))}
                  >
                    +
                  </MdButton>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  单节点内存（G） <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, memoryPerNode: Math.max(1, prev.memoryPerNode - 1) }))}
                  >
                    -
                  </MdButton>
                  <MdInput
                    type="number"
                    value={formData.memoryPerNode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, memoryPerNode: parseFloat(e.target.value) || 1 }))}
                    className="flex-1"
                    min={1}
                    step={1}
                  />
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, memoryPerNode: prev.memoryPerNode + 1 }))}
                  >
                    +
                  </MdButton>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  节点数（个） <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, nodeCount: Math.max(1, prev.nodeCount - 1) }))}
                  >
                    -
                  </MdButton>
                  <MdInput
                    type="number"
                    value={formData.nodeCount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nodeCount: parseInt(e.target.value) || 1 }))}
                    className="flex-1"
                    min={1}
                  />
                  <MdButton
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, nodeCount: prev.nodeCount + 1 }))}
                  >
                    +
                  </MdButton>
                </div>
              </div>
            </div>
          </MdCardContent>
        </MdCard>

        {/* 数据来源 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>数据来源</MdCardTitle>
            <MdCardDescription>配置训练数据的来源（Git代码仓库和数据集）</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <p className="font-medium mb-1">⚠️ 存储路径设置</p>
              <p>请确保所选存储实例（CFS或GooseFSx）与资源组节点之间网络互通。</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Git存储 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={mockGitRepositories}
                value={formData.gitRepository}
                onChange={(value) => setFormData((prev) => ({ ...prev, gitRepository: value }))}
                placeholder="选择Git存储库"
              />
              <p className="text-xs text-muted-foreground mt-1">
                选择Git存储库的代码下载到容器本地，可前往Git存储库模块进行配置
              </p>
            </div>

            {formData.gitRepository && (
              <div>
                <label className="block text-sm font-medium mb-2">存储路径</label>
                <MdInput
                  placeholder="请输入Git存储库中的路径"
                  value={formData.gitStoragePath}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gitStoragePath: e.target.value }))}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                训练数据集 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <MdInput
                  placeholder="请选择数据集"
                  value={formData.datasetName}
                  readOnly
                  className="flex-1"
                  leftIcon={<Database className="h-4 w-4" />}
                />
                <MdButton variant="outline" onClick={() => setIsDatasetModalOpen(true)}>
                  选择数据集
                </MdButton>
              </div>
              {formData.datasetName && (
                <div className="mt-2 text-sm text-muted-foreground">已选择: {formData.datasetName}</div>
              )}
            </div>
          </MdCardContent>
        </MdCard>

        {/* 训练参数 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>任务配置</MdCardTitle>
            <MdCardDescription>配置训练任务的启动命令和调优参数</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                启动命令 <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder="请输入启动命令，例如：python train.py --epochs 10 --batch-size 32"
                value={formData.startupCommand}
                onChange={(e) => setFormData((prev) => ({ ...prev, startupCommand: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                调优参数
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder='请输入调优参数（JSON格式），例如：{"learning_rate": 0.001, "batch_size": 32}'
                value={formData.tuningParameters}
                onChange={(e) => setFormData((prev) => ({ ...prev, tuningParameters: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                <a href="#" className="text-primary hover:underline">查看参数说明</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">训练输出</label>
              <div className="flex gap-2">
                <MdInput
                  placeholder="选择目录"
                  value={formData.outputPath}
                  onChange={(e) => setFormData((prev) => ({ ...prev, outputPath: e.target.value }))}
                  className="flex-1"
                />
                <MdButton variant="outline" onClick={() => setFormData((prev) => ({ ...prev, outputPath: "" }))}>
                  清空
                </MdButton>
              </div>
            </div>
          </MdCardContent>
        </MdCard>

        {/* 其他配置 */}
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>其他配置</MdCardTitle>
            <MdCardDescription>配置日志、重启、健康检查等功能</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MdCheckbox
                checked={formData.enableClsLog}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableClsLog: checked as boolean }))}
              />
              <label className="text-sm font-medium">CLS 日志投递</label>
            </div>
            <div className="flex items-center gap-2">
              <MdCheckbox
                checked={formData.enableAutoRestart}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableAutoRestart: checked as boolean }))}
              />
              <label className="text-sm font-medium">自动重启</label>
            </div>
            <div className="flex items-center gap-2">
              <MdCheckbox
                checked={formData.enableHealthCheck}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableHealthCheck: checked as boolean }))}
              />
              <label className="text-sm font-medium">健康检测</label>
            </div>
            <div className="flex items-center gap-2">
              <MdCheckbox
                checked={formData.enableSsh}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableSsh: checked as boolean }))}
              />
              <label className="text-sm font-medium">SSH连接</label>
            </div>
          </MdCardContent>
        </MdCard>
      </div>

      {/* 数据集选择弹窗 */}
      {isDatasetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsDatasetModalOpen(false)} />
          <div className="relative bg-card rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">选择数据集</h2>
              <MdButton variant="ghost" size="sm" onClick={() => setIsDatasetModalOpen(false)}>
                关闭
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {mockDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleDatasetSelect(dataset)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{dataset.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          业务实体: {dataset.ldmName} | 数据规模: {dataset.dataVolume}
                        </p>
                      </div>
                      {formData.datasetId === dataset.id && (
                        <MdBadge variant="success">已选择</MdBadge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
