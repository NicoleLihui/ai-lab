"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Database } from "lucide-react";
import { MdDrawer, MdInput, MdButton, MdTable, type Column } from "@/components/enterprise-ui";
import { cn } from "@/lib/utils";

export interface Dataset {
  id: string;
  name: string;
  dataVolume: string;
  ldmName: string;
  dataType: string;
  orgDimension: string;
  timeRange: string;
}

interface DatasetSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (dataset: Dataset) => void;
  datasets: Dataset[];
}

export function DatasetSelectionModal({ open, onClose, onSelect, datasets }: DatasetSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  // 过滤数据集
  const filteredDatasets = useMemo(() => {
    if (!searchQuery.trim()) return datasets;
    const query = searchQuery.toLowerCase();
    return datasets.filter(
      (dataset) =>
        dataset.name.toLowerCase().includes(query) ||
        dataset.ldmName.toLowerCase().includes(query) ||
        dataset.dataType.toLowerCase().includes(query)
    );
  }, [datasets, searchQuery]);

  // 表格列定义
  const columns: Column<Dataset>[] = useMemo(
    () => [
      {
        title: "数据集名称",
        key: "name",
        width: 200,
        render: (_: unknown, record: Dataset) => (
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{record.name}</span>
            {selectedDataset?.id === record.id && (
              <span className="ml-2 text-primary text-xs">✓ 已选择</span>
            )}
          </div>
        ),
      },
      {
        title: "数据规模",
        key: "dataVolume",
        width: 120,
        align: "center",
      },
      {
        title: "业务实体",
        key: "ldmName",
        width: 150,
      },
      {
        title: "数据分类",
        key: "dataType",
        width: 120,
        align: "center",
      },
      {
        title: "组织维度",
        key: "orgDimension",
        width: 120,
      },
      {
        title: "时间范围",
        key: "timeRange",
        width: 200,
      },
      {
        title: "操作",
        key: "action",
        width: 100,
        align: "center",
        render: (_: unknown, record: Dataset) => (
          <MdButton
            variant={selectedDataset?.id === record.id ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDataset(record);
            }}
          >
            {selectedDataset?.id === record.id ? "已选择" : "选择"}
          </MdButton>
        ),
      },
    ],
    [selectedDataset]
  );

  const handleConfirm = () => {
    if (selectedDataset) {
      onSelect(selectedDataset);
      setSelectedDataset(null);
      setSearchQuery("");
    }
  };

  return (
    <MdDrawer open={open} onClose={onClose} title="选择数据集" width={900}>
      <div className="flex flex-col h-full">
        {/* 搜索区域 */}
        <div className="p-4 border-b border-border">
          <MdInput
            placeholder="搜索数据集名称、业务实体或数据分类"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            clearable
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* 表格区域 */}
        <div className="flex-1 overflow-auto p-4">
          <MdTable columns={columns} data={filteredDatasets} rowKey="id" />
        </div>

        {/* 底部操作 */}
        <div className="border-t border-border p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedDataset ? `已选择: ${selectedDataset.name}` : "请选择数据集"}
          </div>
          <div className="flex gap-2">
            <MdButton variant="outline" onClick={onClose}>
              取消
            </MdButton>
            <MdButton onClick={handleConfirm} disabled={!selectedDataset}>
              确定
            </MdButton>
          </div>
        </div>
      </div>
    </MdDrawer>
  );
}
