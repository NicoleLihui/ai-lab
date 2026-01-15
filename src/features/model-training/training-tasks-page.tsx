"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search, RotateCcw, Play, BarChart2 } from "lucide-react"
import { MdInput, MdButton, MdTable, MdBadge } from "@/components/enterprise-ui"
import { getMockTrainingPage, mockDeployTest, TrainingTask } from "./mock-data"
import { toast } from "sonner"

export function TrainingTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<TrainingTask[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const loadData = useCallback(async (page = pagination.current, size = pagination.pageSize, query = searchQuery) => {
    setLoading(true)
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const res = getMockTrainingPage({
        currentPage: page,
        pageSize: size,
        searchWord: query,
        sort: 1,
      })
      if (res.success) {
        setTableData(res.data.body as TrainingTask[])
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
  }, [pagination.current, pagination.pageSize, searchQuery])

  useEffect(() => {
    loadData(1)
  }, [])

  const handleSearch = () => {
    loadData(1)
  }

  const handleReset = () => {
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

  const handleViewResults = (row: TrainingTask) => {
    toast.info(`查看任务 ${row.taskName} 的训练结果`)
    // 这里可以实现打开弹窗逻辑
  }

  const columns = [
    {
      key: "index",
      title: "序号",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
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
      render: (value: string) => {
        let variant: "success" | "warning" | "danger" | "info" | "secondary" = "secondary"
        if (value === "训练完成") variant = "success"
        if (value === "训练中") variant = "info"
        if (value === "等待中") variant = "warning"
        if (value === "训练失败") variant = "danger"
        return <MdBadge variant={variant}>{value}</MdBadge>
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
      render: (value: number) => (
        <span className={value === 1 ? "text-success font-medium" : "text-muted-foreground"}>
          {value === 1 ? "已部署测试" : "未部署测试"}
        </span>
      ),
    },
    {
      key: "evaluateIndexData",
      title: "评估指标",
      align: "center" as const,
      render: (data: Record<string, string>) => {
        if (!data) return "-"
        return (
          <div className="flex flex-wrap justify-center gap-1">
            {Object.entries(data).map(([key, val]) => (
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
      render: (_: any, row: TrainingTask) => (
        <div className="flex items-center justify-center gap-2">
          <MdButton
            variant="ghost"
            size="sm"
            disabled={row.deployTestStatus === 1}
            onClick={() => handleDeployTest(row)}
            leftIcon={<Play className="h-3 w-3" />}
          >
            部署测试
          </MdButton>
          <MdButton
            variant="ghost"
            size="sm"
            onClick={() => handleViewResults(row)}
            leftIcon={<BarChart2 className="h-3 w-3" />}
          >
            训练结果
          </MdButton>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-4 gap-3">
      <div className="flex items-center justify-end gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 w-80">
          <MdInput
            placeholder="搜索任务名称、模型名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            clearable
            onClear={() => {
              setSearchQuery("")
              loadData(1, pagination.pageSize, "")
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <MdButton onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />}>
          查询
        </MdButton>
        <MdButton variant="outline" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
          重置
        </MdButton>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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
    </div>
  )
}
