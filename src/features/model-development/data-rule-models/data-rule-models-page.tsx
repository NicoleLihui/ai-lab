"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, RotateCcw, Plus, Edit, Play, Send, Trash2, Settings, MoreVertical } from "lucide-react";
import { MdInput, MdButton, MdTable, MdBadge } from "@/components/enterprise-ui";
import type { Column } from "@/components/enterprise-ui";
import { getMockDataRuleModelList, deleteMockDataRuleModel, type DataRuleModelItem } from "./mock-data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DataRuleModelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<DataRuleModelItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { current: currentPage, pageSize } = pagination;

  // 加载数据
  const loadData = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery) => {
      setLoading(true);
      try {
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = getMockDataRuleModelList({
          currentPage: page,
          pageSize: size,
          searchWord: query,
        });
        if (res.success) {
          setTableData(res.data.body);
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize: size,
            total: res.data.total,
          }));
        } else {
          toast.error(res.msg || "加载数据失败");
        }
      } catch (error) {
        console.error("加载数据失败:", error);
        toast.error("加载数据失败");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, searchQuery]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const handleSearch = () => {
    loadData(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    loadData(1, pagination.pageSize, "");
  };

  // 新建模型
  const handleAdd = () => {
    toast.info("新建模型功能待开发");
    // TODO: 打开新建模型弹窗
  };

  // 编辑模型
  const handleEdit = (row: DataRuleModelItem) => {
    if (row.releaseStatus === "已发布") {
      toast.warning("已发布的模型不能编辑");
      return;
    }
    toast.info(`编辑模型: ${row.modelName}`);
    // TODO: 打开编辑模型弹窗
  };

  // 版本管理
  const handleVersion = (row: DataRuleModelItem) => {
    toast.info(`版本管理: ${row.modelName}`);
    // TODO: 打开版本管理弹窗
  };

  // 试用
  const handleTrial = (row: DataRuleModelItem) => {
    toast.info(`试用模型: ${row.modelName}`);
    // TODO: 打开试用弹窗
  };

  // 发布
  const handleRelease = (row: DataRuleModelItem) => {
    if (row.releaseStatus === "已发布") {
      toast.warning("模型已发布");
      return;
    }
    toast.info(`发布模型: ${row.modelName}`);
    // TODO: 打开发布弹窗
  };

  // 删除
  const handleDelete = (row: DataRuleModelItem) => {
    if (row.releaseStatus === "已发布") {
      toast.warning("已发布的模型不能删除");
      return;
    }
    if (confirm("确定删除当前模型?")) {
      const res = deleteMockDataRuleModel(row.id);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.message);
      }
    }
  };

  // 点击模型名称跳转详情
  const handleModelNameClick = (row: DataRuleModelItem) => {
    // TODO: 跳转到详情页
    toast.info(`查看详情: ${row.modelName}`);
    // router.push(`/categories/model-lab/model-development/data-rule-models/detail?modelId=${row.id}&versionState=1`);
  };

  // 操作菜单组件
  const ActionMenu: React.FC<{ row: DataRuleModelItem }> = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    const menuItems = [
      {
        label: "编辑",
        icon: Edit,
        onClick: () => handleEdit(row),
        show: row.releaseStatus === "未发布",
      },
      {
        label: "试用",
        icon: Play,
        onClick: () => handleTrial(row),
        show: true,
      },
      {
        label: "发布",
        icon: Send,
        onClick: () => handleRelease(row),
        show: row.releaseStatus === "未发布",
      },
      {
        label: "版本管理",
        icon: Settings,
        onClick: () => handleVersion(row),
        show: true,
      },
      {
        label: "删除",
        icon: Trash2,
        onClick: () => handleDelete(row),
        show: row.releaseStatus === "未发布",
      },
    ].filter((item) => item.show);

    const getMenuPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0, maxHeight: 'none' };
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuItems.length * 36 + 8;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuWidth = 140;
      
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
      
      const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      const top = showAbove ? rect.top - menuHeight - 4 : rect.bottom + 4;
      
      const maxHeight = showAbove 
        ? Math.min(menuHeight, spaceAbove - 8)
        : Math.min(menuHeight, spaceBelow - 8);
      
      return {
        top,
        left,
        maxHeight: maxHeight > 100 ? maxHeight : 100,
      };
    };

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
          aria-label="更多操作"
        >
          <MoreVertical className="h-4 w-4 text-foreground" />
        </button>
        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 py-1 min-w-[140px] overflow-y-auto"
              style={{
                top: getMenuPosition().top,
                left: getMenuPosition().left,
                maxHeight: getMenuPosition().maxHeight,
              }}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary-light transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>,
            document.body
          )}
      </div>
    );
  };

  // 定义表格列
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
      key: "modelId",
      title: "模型ID",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "modelName",
      title: "模型名称",
      align: "center" as const,
      minWidth: 120,
      render: (value: unknown, row: Record<string, unknown>) => {
        const item = row as DataRuleModelItem;
        return (
          <span
            className="text-primary-600 cursor-pointer hover:underline"
            onClick={() => handleModelNameClick(item)}
          >
            {String(value || "")}
          </span>
        );
      },
    },
    {
      key: "version",
      title: "版本",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "notes",
      title: "模型描述",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "paramInStr",
      title: "输入参数",
      align: "center" as const,
      minWidth: 160,
    },
    {
      key: "formula",
      title: "公式",
      align: "center" as const,
      minWidth: 200,
    },
    {
      key: "paramOutStr",
      title: "输出参数",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "applicableScenario",
      title: "应用场景",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "releaseStatus",
      title: "发布状态",
      align: "center" as const,
      minWidth: 120,
      render: (value: unknown) => {
        const status = String(value ?? "");
        const variant = status === "已发布" ? "success" : "secondary";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "deploymentStatus",
      title: "部署状态",
      align: "center" as const,
      minWidth: 120,
      render: (value: unknown) => {
        const status = String(value ?? "");
        const variant = status === "已部署" ? "success" : "secondary";
        return <MdBadge variant={variant}>{status}</MdBadge>;
      },
    },
    {
      key: "owner",
      title: "创建组织",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "creator",
      title: "创建人",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "createTime",
      title: "创建时间",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "updateTime",
      title: "最近更新时间",
      align: "center" as const,
      minWidth: 120,
    },
    {
      key: "actions",
      title: "操作",
      width: 80,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const item = row as DataRuleModelItem;
        return <ActionMenu row={item} />;
      },
    },
  ];

  return (
    <div className="flex flex-col h-full border-0 outline-0 shadow-none m-0 p-0 gap-3">
      {/* 搜索区域 */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
        <MdButton onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />} className="h-9 px-3">
          新建模型
        </MdButton>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-80">
            <MdInput
              placeholder="搜索模型名称、模型ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              clearable
              onClear={() => {
                setSearchQuery("");
                loadData(1, pagination.pageSize, "");
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

      {/* 数据表格 */}
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
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
  );
}
