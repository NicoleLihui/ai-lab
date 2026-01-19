"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Search, RotateCcw, Play, BarChart2, X } from "lucide-react"
import { MdInput, MdButton, MdTable, MdBadge } from "@/components/enterprise-ui"
import type { Column } from "@/components/enterprise-ui"
import { getMockTrainingPage, getMockTrainingResult, mockDeployTest, TrainingResult, TrainingTask } from "./mock-data"
import { toast } from "sonner"

export function ModelTrainingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TrainingTask[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })
  const [resultOpen, setResultOpen] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"evaluation" | "output">("evaluation")
  const [selectedTask, setSelectedTask] = useState<TrainingTask | null>(null)
  const [resultData, setResultData] = useState<TrainingResult | null>(null)

  const { current: currentPage, pageSize } = pagination

  const loadData = useCallback(async (page = currentPage, size = pageSize, query = searchQuery) => {
    setLoading(true)
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const res = getMockTrainingPage({
        currentPage: page,
        pageSize: size,
        searchWord: query,
        sort: 1,
        pageType: 1,
      })
      if (res.success) {
        // 处理评估指标数据
        const processedData = (res.data.body as TrainingTask[]).map((item) => {
          if (item.evaluateIndex) {
            try {
              const jsonEvaluateIndex = JSON.parse(item.evaluateIndex)
              const resultMap = jsonEvaluateIndex.reduce((acc: Record<string, string>, item: { name: string; value: string }) => {
                acc[item.name] = item.value
                return acc
              }, {})
              item.evaluateIndexData = resultMap
            } catch (e) {
              console.error("解析评估指标失败:", e)
            }
          }
          return item
        })
        setTableData(processedData)
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

  const handleDeployTest = async (row: TrainingTask) => {
    try {
      const res = mockDeployTest({
        modelId: row.modelId,
        runId: row.runId,
        modelKey: row.modelKey,
        modelName: row.modelName,
        version: row.version,
      })
      if (res.success) {
        toast.success(res.message)
        loadData()
      }
    } catch (error) {
      toast.error("部署测试失败")
    }
  }

  const handleViewResults = async (row: TrainingTask) => {
    setSelectedTask(row)
    setResultOpen(true)
    setActiveTab("evaluation")
    setResultLoading(true)
    setImageLoading(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      const res = getMockTrainingResult({ runId: row.runId })
      if (res.success) {
        setResultData(res.data)
      } else {
        toast.error("获取训练结果失败")
      }
    } catch (error) {
      console.error("加载训练结果失败:", error)
      toast.error("加载训练结果失败")
    } finally {
      setResultLoading(false)
    }
  }

  useEffect(() => {
    if (!resultData) return
    if (resultData.runDataVO.picList.length === 0) {
      setImageLoading(false)
      return
    }
    setImageLoading(true)
    const timer = setTimeout(() => setImageLoading(false), 500)
    return () => clearTimeout(timer)
  }, [resultData])

  const closeResultDrawer = () => {
    setResultOpen(false)
    setResultData(null)
    setSelectedTask(null)
    setActiveTab("evaluation")
  }

  const evaluationColumns = [
    { key: "name", title: "指标", align: "center" as const },
    { key: "desc", title: "描述", align: "center" as const },
    { key: "value", title: "值", align: "center" as const },
  ]

  const evaluationRows = useMemo(() => {
    if (resultData?.runDataVO.evaIndexList?.length) return resultData.runDataVO.evaIndexList
    if (selectedTask?.evaluateIndex) {
      try {
        return JSON.parse(selectedTask.evaluateIndex).map((item: { name: string; value: string }) => ({
          name: item.name,
          desc: "评估指标",
          value: item.value,
        }))
      } catch {
        return []
      }
    }
    return []
  }, [resultData, selectedTask])

  const outputColumns = useMemo(() => {
    const titleMap = resultData?.runDataVO.csvReturnVO.titleMap ?? {}
    return Object.entries(titleMap)
      .map(([prop, label]) => ({ key: prop, title: label, align: "center" as const }))
      .sort((a, b) => {
        const numA = Number(String(a.key).replace("column", ""))
        const numB = Number(String(b.key).replace("column", ""))
        return numA - numB
      })
  }, [resultData])

  const outputRows = resultData?.runDataVO.csvReturnVO.dataList ?? []

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
      key: "taskName",
      title: "任务名称",
      align: "center" as const,
    },
    {
      key: "modelName",
      title: "模型名称",
      align: "center" as const,
    },
    {
      key: "version",
      title: "版本",
      width: 100,
      align: "center" as const,
    },
    {
      key: "modelType",
      title: "类型",
      width: 120,
      align: "center" as const,
    },
    {
      key: "developLanguage",
      title: "编程语言",
      width: 100,
      align: "center" as const,
    },
    {
      key: "statusName",
      title: "状态",
      width: 120,
      align: "center" as const,
      render: (value: unknown) => {
        const status = String(value ?? "")
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary"
        if (status === "训练完成") variant = "success"
        if (status === "训练中") variant = "info"
        if (status === "等待中") variant = "warning"
        if (status === "训练失败") variant = "danger"
        return <MdBadge variant={variant}>{status}</MdBadge>
      },
    },
    {
      key: "trainTime",
      title: "运行时长(s)",
      width: 120,
      align: "center" as const,
    },
    {
      key: "deployTestStatus",
      title: "是否部署测试",
      width: 130,
      align: "center" as const,
      render: (value: unknown) => {
        const flag = Number(value) === 1
        return (
          <span className={flag ? "text-success font-medium" : "text-muted-foreground"}>
            {flag ? "已部署测试" : "未部署测试"}
          </span>
        )
      },
    },
    {
      key: "evaluateIndexData",
      title: "评估指标",
      align: "center" as const,
      render: (data: unknown) => {
        if (!data || typeof data !== "object") return "-"
        return (
          <div className="flex flex-wrap justify-center gap-1">
            {Object.entries(data as Record<string, string>).map(([key, val]) => (
              <span key={key} className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
                {key}: {val}
              </span>
            ))}
          </div>
        )
      },
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
      width: 200,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const task = row as TrainingTask
        return (
          <div className="flex items-center justify-center gap-2">
            <MdButton
              variant="ghost"
              size="sm"
              disabled={task.deployTestStatus === 1}
              onClick={() => handleDeployTest(task)}
              leftIcon={<Play className="h-3 w-3" />}
            >
              部署测试
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleViewResults(task)}
              leftIcon={<BarChart2 className="h-3 w-3" />}
            >
              训练结果
            </MdButton>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 操作栏 */}
      <div className="operation-bar flex items-center justify-end gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="search-area flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索任务名称、模型名称"
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
      <div className="content-main flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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

      {/* 训练结果弹窗 */}
      {resultOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={closeResultDrawer} />
          <div className="relative ml-auto h-full w-[80%] bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">训练结果</div>
              <MdButton variant="text" size="sm" onClick={closeResultDrawer} leftIcon={<X className="h-4 w-4" />}>
                关闭
              </MdButton>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex h-full">
                <div className="w-80 border-r border-border p-4 overflow-y-auto">
                  <div className="text-base font-semibold text-foreground mb-4">
                    模型版本（{selectedTask?.version ?? "-"}）
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">任务名称</span>
                      <span className="text-foreground">{selectedTask?.taskName ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">模型名称</span>
                      <span className="text-foreground">{selectedTask?.modelName ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">模型类型</span>
                      <span className="text-foreground">{selectedTask?.modelType ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">开发语言</span>
                      <span className="text-foreground">{selectedTask?.developLanguage ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">训练状态</span>
                      <span className="text-foreground">{selectedTask?.statusName ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">运行时长(s)</span>
                      <span className="text-foreground">{selectedTask?.trainTime ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">创建时间</span>
                      <span className="text-foreground">{selectedTask?.createTime ?? "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <div className="text-base font-semibold text-foreground">参数设置</div>
                      <textarea
                        readOnly
                        value={resultData?.inputJson ?? ""}
                        placeholder="参数"
                        className="mt-3 w-full min-h-[120px] rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-md text-sm ${
                            activeTab === "evaluation"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                          onClick={() => setActiveTab("evaluation")}
                        >
                          评估指标
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-md text-sm ${
                            activeTab === "output" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                          }`}
                          onClick={() => setActiveTab("output")}
                        >
                          输出结果
                        </button>
                      </div>

                      {activeTab === "evaluation" && (
                        <div className="border border-border rounded-md p-3">
                          <MdTable
                            columns={evaluationColumns}
                            data={evaluationRows as any}
                            loading={resultLoading}
                          />
                        </div>
                      )}

                      {activeTab === "output" && (
                        <div className="border border-border rounded-md p-3 space-y-3">
                          {outputRows.length === 0 && resultLoading ? (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">加载中...</div>
                          ) : (
                            <MdTable
                              columns={outputColumns as any}
                              data={outputRows as any}
                              loading={resultLoading}
                            />
                          )}
                          {!imageLoading && resultData?.runDataVO.picList.length ? (
                            <div className="grid grid-cols-2 gap-3">
                              {resultData.runDataVO.picList.map((item, index) => (
                                <Image
                                  key={index}
                                  src={item}
                                  alt="训练结果图片"
                                  width={560}
                                  height={320}
                                  className="w-full rounded-md border"
                                />
                              ))}
                            </div>
                          ) : null}
                          {imageLoading && (
                            <div className="h-24 flex items-center justify-center text-muted-foreground">加载中...</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end">
              <MdButton variant="text" onClick={closeResultDrawer}>
                取消
              </MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
