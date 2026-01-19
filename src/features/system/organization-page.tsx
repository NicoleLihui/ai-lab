"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search, RotateCcw } from "lucide-react"
import { MdInput, MdButton, MdTable, MdSelect, MdSwitch, MdBadge } from "@/components/enterprise-ui"
import type { Column } from "@/components/enterprise-ui"
import { toast } from "sonner"

interface Organization {
  orgId: string
  name: string
  orgType?: number
  orgLevel?: number
  depth?: number
  deptType?: number
  source?: number
  createdBy?: string
  updatedAt?: string
  iotStatus: number
  children?: Organization[]
}

export function OrganizationManagementPage() {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    orgId: "",
    orgType: "",
    orgLevel: "",
    orgStatus: "",
  })
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<Organization[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: 替换为实际 API 调用
      // const res = await getOrgTree({ ...searchQuery })
      await new Promise((resolve) => setTimeout(resolve, 500))
      // 模拟数据
      const mockData: Organization[] = []
      setTableData(mockData)
      setPagination((prev) => ({ ...prev, total: mockData.length }))
    } catch (error) {
      console.error("加载数据失败:", error)
      toast.error("加载数据失败")
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadData()
  }

  const handleReset = () => {
    setSearchQuery({
      name: "",
      orgId: "",
      orgType: "",
      orgLevel: "",
      orgStatus: "",
    })
    setPagination((prev) => ({ ...prev, current: 1 }))
    loadData()
  }

  const handleStatusChange = async (row: Organization, newStatus: number) => {
    try {
      // TODO: 替换为实际 API 调用
      // await updateIotStatusById({ orgId: row.orgId, iotStatus: newStatus })
      row.iotStatus = newStatus
      toast.success("操作成功")
      loadData()
    } catch (error) {
      row.iotStatus = row.iotStatus === 1 ? 0 : 1
      toast.error("操作失败")
    }
  }

  const columns: Column<Organization>[] = [
    {
      key: "name",
      title: "组织名称",
      align: "center",
      width: 200,
    },
    {
      key: "orgId",
      title: "组织编码",
      align: "center",
    },
    {
      key: "orgType",
      title: "组织类型",
      align: "center",
      render: (value: unknown) => {
        const type = Number(value)
        if (type === 1) return <MdBadge variant="info">公司</MdBadge>
        if (type === 2) return <MdBadge variant="success">部门</MdBadge>
        return "-"
      },
    },
    {
      key: "depth",
      title: "组织层级",
      align: "center",
      width: 120,
    },
    {
      key: "source",
      title: "来源",
      align: "center",
      width: 180,
    },
    {
      key: "createdBy",
      title: "创建人",
      align: "center",
      width: 180,
    },
    {
      key: "updatedAt",
      title: "更新时间",
      align: "center",
      width: 150,
    },
    {
      key: "iotStatus",
      title: "组织状态",
      align: "center",
      width: 150,
      render: (_: unknown, row: Organization) => {
        return (
          <MdSwitch
            checked={row.iotStatus === 1}
            onCheckedChange={(checked) => handleStatusChange(row, checked ? 1 : 0)}
          />
        )
      },
    },
  ]

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-4 gap-3">
      <div className="flex items-center justify-end gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <MdInput
            placeholder="组织名称"
            value={searchQuery.name}
            onChange={(e) => setSearchQuery((prev) => ({ ...prev, name: e.target.value }))}
            className="w-48 h-9"
            leftIcon={<Search className="h-4 w-4" />}
          />
          <MdInput
            placeholder="组织编码"
            value={searchQuery.orgId}
            onChange={(e) => setSearchQuery((prev) => ({ ...prev, orgId: e.target.value }))}
            className="w-48 h-9"
          />
          <MdSelect
            placeholder="组织类型"
            value={searchQuery.orgType}
            onChange={(value) => setSearchQuery((prev) => ({ ...prev, orgType: value as string }))}
            className="w-48 h-9"
            options={[
              { label: "公司", value: "1" },
              { label: "部门", value: "2" },
            ]}
          />
          <MdSelect
            placeholder="组织状态"
            value={searchQuery.orgStatus}
            onChange={(value) => setSearchQuery((prev) => ({ ...prev, orgStatus: value as string }))}
            className="w-48 h-9"
            options={[
              { label: "启用", value: "1" },
              { label: "禁用", value: "0" },
            ]}
          />
        </div>
        <MdButton onClick={handleSearch} leftIcon={<Search className="h-4 w-4" />} className="h-9 px-3">
          查询
        </MdButton>
        <MdButton variant="outline" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />} className="h-9 px-3">
          重置
        </MdButton>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <MdTable
          columns={columns}
          data={tableData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, size) => setPagination((prev) => ({ ...prev, current: page, pageSize: size })),
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}
