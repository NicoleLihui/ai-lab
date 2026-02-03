"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Search, RotateCcw, Play, Settings, X, Package, Clock, Code } from "lucide-react"
import { MdInput, MdButton, MdTable, MdBadge, MdSelect } from "@/components/enterprise-ui"
import type { Column } from "@/components/enterprise-ui"
import { getMockTrainableModels, mockStartTraining, TrainableModel, ModelParameter } from "./mock-data"
import { toast } from "sonner"

export function ModelTrainingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TrainableModel[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })
  
  // 训练配置抽屉相关状态
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<TrainableModel | null>(null)
  const [trainingParams, setTrainingParams] = useState<Record<string, any>>({})
  const [taskName, setTaskName] = useState("")
  
  const { current: currentPage, pageSize } = pagination

  const loadData = useCallback(async (page = currentPage, size = pageSize, query = searchQuery) => {
    setLoading(true)
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const res = getMockTrainableModels({
        currentPage: page,
        pageSize: size,
        searchWord: query,
      })
      if (res.success) {
        setTableData(res.data.body as TrainableModel[])
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: size,
          total: res.data.total,
        }))
      }
    } catch (error) {
      console.error("加载数据失败:", error)
      toast.error("加载数据失败")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchQuery])

  useEffect(() => {
    loadData(1)
  }, [])

  const handleSearch = () => {
    loadData(1, pagination.pageSize, searchQuery)
  }

  const handleReset = () => {
    setSearchQuery("")
    loadData(1, pagination.pageSize, "")
  }

  const handleSearchClear = () => {
    setSearchQuery("")
    loadData(1, pagination.pageSize, "")
  }
  
  const handleStartTraining = async (model: TrainableModel) => {
    setSelectedModel(model)
    setConfigDrawerOpen(true)
    
    // 初始化训练参数
    const initialParams: Record<string, any> = {}
    if (model.parameters) {
      model.parameters.forEach(param => {
        initialParams[param.name] = param.defaultValue
      })
    }
    setTrainingParams(initialParams)
    
    // 设置默认任务名称
    setTaskName(`${model.modelName}_训练任务_${new Date().toLocaleDateString().replace(/\//g, '-')}`)
  }
  
  const handleConfirmTraining = async () => {
    if (!selectedModel) {
      toast.error("没有选择模型")
      return
    }
    
    if (!taskName.trim()) {
      toast.error("请输入任务名称")
      return
    }
    
    try {
      const res = await mockStartTraining({
        modelId: selectedModel.modelId,
        modelName: selectedModel.modelName,
        version: selectedModel.version,
        taskName,
        trainingParams
      })
      
      if (res.success) {
        toast.success(res.message)
        setConfigDrawerOpen(false)
        // 这里可以重定向到训练任务管理页面或者刷新数据
      } else {
        toast.error(res.message || "启动训练失败")
      }
    } catch (error) {
      toast.error("启动训练失败")
    }
  }
  
  const handleParamChange = (paramName: string, value: any) => {
    setTrainingParams(prev => ({
      ...prev,
      [paramName]: value
    }))
  }
  
  const closeConfigDrawer = () => {
    setConfigDrawerOpen(false)
    setSelectedModel(null)
  }
  
  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: Record<string, unknown>, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      key: "modelName",
      title: "模型名称",
      align: "center" as const,
    },
    {
      key: "modelType",
      title: "模型类型",
      width: 120,
      align: "center" as const,
    },
    {
      key: "version",
      title: "版本",
      width: 100,
      align: "center" as const,
    },
    {
      key: "developLanguage",
      title: "开发语言",
      width: 100,
      align: "center" as const,
    },
    {
      key: "status",
      title: "状态",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => {
        const status = String(value ?? "")
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary"
        if (status === "已发布") variant = "success"
        if (status === "草稿") variant = "warning"
        if (status === "已下线") variant = "danger"
        return <MdBadge variant={variant}>{status}</MdBadge>
      },
    },
    {
      key: "applicableScenario",
      title: "适用场景",
      align: "center" as const,
    },
    {
      key: "description",
      title: "描述",
      align: "center" as const,
    },
    {
      key: "createTime",
      title: "创建时间",
      width: 180,
      align: "center" as const,
    },
    {
      key: "actions",
      title: "操作",
      width: 150,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const model = row as unknown as TrainableModel
        return (
          <div className="flex items-center justify-center gap-2">
            <MdButton
              variant="outline"
              size="sm"
              onClick={() => handleStartTraining(model)}
              leftIcon={<Play className="h-3 w-3" />}
            >
              开始训练
            </MdButton>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 操作栏 */}
      <div className="operation-bar flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="search-area flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索模型名称、描述或适用场景"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            clearable
            onClear={handleSearchClear}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9"
          />
        </div>
        <MdButton
          onClick={handleSearch}
          leftIcon={<Search className="h-4 w-4" />}
          className="h-9 px-3"
        >
          查询
        </MdButton>
        <MdButton
          variant="outline"
          onClick={handleReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
          className="h-9 px-3"
        >
          重置
        </MdButton>
      </div>

      {/* 表格 */}
      <div className="content-main flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable
          columns={columns}
          data={tableData as any}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => loadData(page, size),
          }}
          className="h-full"
        />
      </div>

      {/* 训练配置抽屉 */}
      {configDrawerOpen && selectedModel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={closeConfigDrawer} />
          <div className="relative ml-auto h-full w-[50%] max-w-2xl bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <div className="text-lg font-semibold text-foreground">训练配置</div>
              </div>
              <MdButton variant="text" size="sm" onClick={closeConfigDrawer} leftIcon={<X className="h-4 w-4" />}>关闭</MdButton>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">模型信息</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">模型名称:</span>
                    <span className="text-sm font-medium">{selectedModel.modelName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">开发语言:</span>
                    <span className="text-sm font-medium">{selectedModel.developLanguage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">版本:</span>
                    <span className="text-sm font-medium">{selectedModel.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">模型类型:</span>
                    <span className="text-sm font-medium">{selectedModel.modelType}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">任务配置</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">任务名称</label>
                    <MdInput
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="请输入训练任务名称"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">训练参数</h3>
                <div className="space-y-4">
                  {selectedModel.parameters && selectedModel.parameters.length > 0 ? (
                    selectedModel.parameters.map((param, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-foreground">
                            {param.displayName} {param.required && <span className="text-red-500">*</span>}
                          </label>
                          <span className="text-xs text-muted-foreground">{param.description}</span>
                        </div>
                        {param.type === 'number' ? (
                          <MdInput
                            type="number"
                            value={trainingParams[param.name] ?? param.defaultValue}
                            onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
                            className="h-9"
                          />
                        ) : param.type === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!trainingParams[param.name] || !!param.defaultValue}
                              onChange={(e) => handleParamChange(param.name, e.target.checked)}
                              className="rounded border-border"
                            />
                            <span className="text-sm text-foreground">启用</span>
                          </div>
                        ) : param.type === 'select' ? (
                          <MdSelect
                            value={trainingParams[param.name] ?? param.defaultValue}
                            onChange={(value) => handleParamChange(param.name, value)}
                            options={(param.options || []).map(opt => ({ label: opt, value: opt }))}
                            className="h-9"
                          />
                        ) : (
                          <MdInput
                            value={trainingParams[param.name] ?? param.defaultValue}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="h-9"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      该模型无需额外配置参数
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <MdButton variant="outline" onClick={closeConfigDrawer}>取消</MdButton>
              <MdButton onClick={handleConfirmTraining} leftIcon={<Play className="h-4 w-4" />}>启动训练</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}