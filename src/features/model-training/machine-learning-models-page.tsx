"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search, RotateCcw, Plus, Eye, Edit, Trash2, X } from "lucide-react"
import { MdInput, MdButton, MdTable, MdBadge, MdSelect } from "@/components/enterprise-ui"
import type { Column } from "@/components/enterprise-ui"
import { toast } from "sonner"

interface MachineLearningModel {
  id: number
  name: string
  type: string
  version: string
  status: string
  createdTime: string
  accuracy: number
  description: string
}

// Mock data for machine learning models
const mockData: MachineLearningModel[] = [
    {
      id: 1,
      name: '客户流失预测模型',
      type: '分类模型',
      version: 'v1.2.0',
      status: '已发布',
      createdTime: '2023-06-15',
      accuracy: 0.92,
      description: '基于历史客户数据预测客户流失概率'
    },
    {
      id: 2,
      name: '销售预测模型',
      type: '回归模型',
      version: 'v2.1.0',
      status: '已发布',
      createdTime: '2023-06-20',
      accuracy: 0.87,
      description: '预测未来销售额'
    },
    {
      id: 3,
      name: '信用评分模型',
      type: '分类模型',
      version: 'v1.0.5',
      status: '测试中',
      createdTime: '2023-07-01',
      accuracy: 0.94,
      description: '评估客户信用风险等级'
    },
    {
      id: 4,
      name: '需求预测模型',
      type: '时间序列',
      version: 'v1.1.2',
      status: '开发中',
      createdTime: '2023-07-05',
      accuracy: 0.89,
      description: '预测产品需求量'
    },
    {
      id: 5,
      name: '欺诈检测模型',
      type: '分类模型',
      version: 'v1.3.0',
      status: '已发布',
      createdTime: '2023-05-20',
      accuracy: 0.96,
      description: '实时检测交易欺诈行为'
    },
    {
      id: 6,
      name: '推荐系统模型',
      type: '协同过滤',
      version: 'v2.0.1',
      status: '测试中',
      createdTime: '2023-06-30',
      accuracy: 0.85,
      description: '个性化商品推荐'
    },
    {
      id: 7,
      name: '情感分析模型',
      type: 'NLP模型',
      version: 'v1.0.8',
      status: '已发布',
      createdTime: '2023-07-10',
      accuracy: 0.91,
      description: '分析文本情感倾向'
    },
    {
      id: 8,
      name: '图像识别模型',
      type: 'CNN模型',
      version: 'v1.5.0',
      status: '已发布',
      createdTime: '2023-06-25',
      accuracy: 0.95,
      description: '识别图像中的物体'
    }
  ]

export const MachineLearningModelsPage: React.FC = () => {
  const [data, setData] = useState<MachineLearningModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [editingRecord, setEditingRecord] = useState<MachineLearningModel | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<Partial<MachineLearningModel>>({})

  const { current: currentPage, pageSize } = pagination

  const loadData = useCallback(async (page = currentPage, size = pageSize, query = searchTerm) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      let filteredData = [...mockData]

      if (query) {
        filteredData = filteredData.filter(
          item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        )
      }

      const startIndex = (page - 1) * size
      const paginatedData = filteredData.slice(startIndex, startIndex + size)

      setData(paginatedData)
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: filteredData.length,
      }))
    } catch (error) {
      console.error("加载数据失败:", error)
      toast.error("加载数据失败")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTerm])

  useEffect(() => {
    loadData(1)
  }, [loadData])

  const handleSearch = () => {
    loadData(1)
  }

  const handleReset = () => {
    setSearchTerm("")
    loadData(1, pagination.pageSize, "")
  }

  const handleEdit = (record: MachineLearningModel) => {
    setEditingRecord(record)
    setFormData(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这个模型吗？")) {
      setData(prev => prev.filter(item => item.id !== id))
      toast.success("删除成功")
      loadData()
    }
  }

  const handleView = (record: MachineLearningModel) => {
    toast.info(`查看模型: ${record.name}`)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingRecord(null)
    setFormData({})
  }

  const handleModalOk = () => {
    setIsModalVisible(false)
    setEditingRecord(null)
    setFormData({})
    toast.success("模型信息已更新")
    loadData()
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
      key: "name",
      title: "模型名称",
      align: "center" as const,
    },
    {
      key: "type",
      title: "模型类型",
      align: "center" as const,
    },
    {
      key: "version",
      title: "版本",
      align: "center" as const,
    },
    {
      key: "status",
      title: "状态",
      align: "center" as const,
      render: (value: unknown) => {
        const status = String(value ?? "")
        let variant: "success" | "warning" | "info" | "secondary" = "secondary"
        if (status === "已发布") variant = "success"
        if (status === "测试中") variant = "warning"
        if (status === "开发中") variant = "info"
        return <MdBadge variant={variant}>{status}</MdBadge>
      },
    },
    {
      key: "accuracy",
      title: "准确率",
      align: "center" as const,
      render: (value: unknown) => {
        const accuracy = Number(value ?? 0)
        return <span>{(accuracy * 100).toFixed(2)}%</span>
      },
    },
    {
      key: "createdTime",
      title: "创建时间",
      align: "center" as const,
    },
    {
      key: "description",
      title: "描述",
      align: "center" as const,
    },
    {
      key: "actions",
      title: "操作",
      width: 200,
      align: "center" as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const record = row as unknown as MachineLearningModel
        return (
          <div className="flex items-center justify-center gap-2">
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleView(record)}
              leftIcon={<Eye className="h-3 w-3" />}
            >
              查看
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(record)}
              leftIcon={<Edit className="h-3 w-3" />}
            >
              编辑
            </MdButton>
            <MdButton
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(record.id)}
              disabled={record.status !== "开发中"}
              leftIcon={<Trash2 className="h-3 w-3" />}
            >
              删除
            </MdButton>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      <div className="flex items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <MdButton
          onClick={() => toast.info("创建新模型")}
          leftIcon={<Plus className="h-4 w-4" />}
          className="h-9 px-3"
        >
          创建模型
        </MdButton>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索模型名称或描述"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              clearable
              onClear={() => {
                setSearchTerm("")
                loadData(1, pagination.pageSize, "")
              }}
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
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable
          columns={columns}
          data={data as any}
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

      {/* Edit Model Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={handleModalCancel} />
          <div className="relative bg-card rounded-xl border border-border shadow-xl w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="text-lg font-semibold text-foreground">编辑模型</div>
              <MdButton
                variant="text"
                size="sm"
                onClick={handleModalCancel}
                leftIcon={<X className="h-4 w-4" />}
              >
                关闭
              </MdButton>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">模型名称</label>
                <MdInput
                  value={formData.name ?? ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">模型类型</label>
                <MdSelect
                  value={formData.type ?? ""}
                  onChange={(value) => setFormData({ ...formData, type: value })}
                  options={[
                    { label: "分类模型", value: "分类模型" },
                    { label: "回归模型", value: "回归模型" },
                    { label: "聚类模型", value: "聚类模型" },
                    { label: "时间序列", value: "时间序列" },
                    { label: "NLP模型", value: "NLP模型" },
                    { label: "CNN模型", value: "CNN模型" },
                    { label: "协同过滤", value: "协同过滤" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">版本</label>
                <MdInput
                  value={formData.version ?? ""}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">状态</label>
                <MdSelect
                  value={formData.status ?? ""}
                  onChange={(value) => setFormData({ ...formData, status: value })}
                  options={[
                    { label: "开发中", value: "开发中" },
                    { label: "测试中", value: "测试中" },
                    { label: "已发布", value: "已发布" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">准确率</label>
                <MdInput
                  value={formData.accuracy ? `${(formData.accuracy * 100).toFixed(2)}%` : ""}
                  readOnly
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">描述</label>
                <textarea
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
              <MdButton variant="outline" onClick={handleModalCancel}>
                取消
              </MdButton>
              <MdButton onClick={handleModalOk}>确定</MdButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MachineLearningModelsPage;