"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import { MdButton, MdCard, MdBadge, MdInput, AdvancedSearch, FormItem, type SelectOption } from "@/components/enterprise-ui";
import BePager from "@/components/enterprise-ui/pagination";
import { CardInfo } from "@/components/enterprise-ui/card-info";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockModelList, mockOrgTreeData, mockTags, modelTypeOptions, type ModelInfo, type OrgTreeNode, type TagInfo } from "./mock-data";
import { useRouter } from "next/navigation";

export function ModelPlazaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<ModelInfo[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 分类选择
  const [classification, setClassification] = useState<'business' | 'organization'>('organization');
  const [currentTagId, setCurrentTagId] = useState<number | null>(null);
  const [currentTreeId, setCurrentTreeId] = useState<number | string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<(number | string)[]>([]);

  // 搜索表单数据
  const [formData, setFormData] = useState({
    name: "",
    modelType: "",
    applicableScenario: "",
  });

  // 模型类型选项
  const modelTypeSelectOptions: SelectOption[] = useMemo(() => 
    modelTypeOptions.map(item => ({ value: item.value, label: item.label })),
    []
  );

  // 加载数据
  const loadData = useCallback(async (
    page = pagination.current,
    size = pagination.pageSize,
    filters = formData,
    orgId: number | string | null = currentTreeId,
    tagId: number | null = currentTagId
  ) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 获取所有数据
      let filteredData = mockModelList.filter((item) => {
        // 只显示已发布的模型
        if (item.releaseStatus !== 2) return false;

        // 搜索过滤
        if (filters.name && !item.modelName?.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }
        if (filters.modelType && item.modelType !== filters.modelType) {
          return false;
        }
        if (filters.applicableScenario && !item.applicableScenarioStr?.includes(filters.applicableScenario)) {
          return false;
        }

        // 组织过滤
        if (classification === 'organization' && orgId !== null) {
          // 简化处理：根据组织名称匹配
          const orgNames = ['技术部', '研发部', '数据部', '运营部', '维护部', '算法部'];
          const orgIndex = orgNames.findIndex(name => {
            const node = findNodeInTree(mockOrgTreeData, orgId);
            return node?.name === name;
          });
          if (orgIndex >= 0 && item.orgName !== orgNames[orgIndex]) {
            return false;
          }
        }

        // 标签过滤
        if (classification === 'business' && tagId !== null) {
          const tag = mockTags.find(t => t.id === tagId);
          if (tag && !item.tags?.some(t => t.includes(tag.tagName))) {
            return false;
          }
        }

        return true;
      });

      const total = filteredData.length;
      const startIndex = (page - 1) * size;
      const endIndex = Math.min(startIndex + size, total);
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setDataList(paginatedData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: total,
      }));
    } catch (error) {
      console.error("加载数据失败:", error);
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, formData, currentTreeId, currentTagId, classification]);

  // 在树中查找节点
  const findNodeInTree = (tree: OrgTreeNode[], id: number | string): OrgTreeNode | null => {
    for (const node of tree) {
      if (node.orgId === id) return node;
      if (node.children) {
        const found = findNodeInTree(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    loadData();
  }, [classification, currentTreeId, currentTagId]);

  // 切换分类
  const handleClass = (type: 'business' | 'organization') => {
    setClassification(type);
    if (type === 'organization') {
      setCurrentTagId(null);
    } else {
      setCurrentTreeId(null);
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, formData, type === 'organization' ? currentTreeId : null, type === 'business' ? currentTagId : null);
  };

  // 点击组织树节点
  const handleNodeClick = (node: OrgTreeNode) => {
    const newTreeId = node.name === '默认部门' ? null : node.orgId;
    setCurrentTreeId(newTreeId);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, formData, newTreeId, null);
  };

  // 点击标签
  const handleTagClick = (tag: TagInfo) => {
    const newTagId = currentTagId === tag.id ? null : tag.id;
    setCurrentTagId(newTagId);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, formData, null, newTagId);
  };

  // 搜索
  const handleFilterSearch = (data: Record<string, any>) => {
    const newFormData = {
      name: data.name || "",
      modelType: data.modelType || "",
      applicableScenario: data.applicableScenario || "",
    };
    setFormData(newFormData);
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadData(1, pagination.pageSize, newFormData, currentTreeId, currentTagId);
  };

  // 重置
  const handleFilterReset = () => {
    const newFormData = {
      name: "",
      modelType: "",
      applicableScenario: "",
    };
    setFormData(newFormData);
    setCurrentTreeId(null);
    setCurrentTagId(null);
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 20 }));
    loadData(1, 20, newFormData, null, null);
  };

  // 清空某个搜索项
  const handleClear = (primaryKey: string) => {
    setFormData((prev) => ({
      ...prev,
      [primaryKey]: "",
    }));
  };

  // 分页变化
  const handlePageChange = (page: number, size: number) => {
    loadData(page, size, formData, currentTreeId, currentTagId);
  };

  // 点击卡片
  const handleCardClick = (item: ModelInfo) => {
    router.push(`/categories/model-lab/model-plaza/model-detail?modelId=${item.id}&square=广场`);
  };

  // 渲染组织树
  const renderOrgTree = (nodes: OrgTreeNode[], level = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => (
          <div key={node.orgId}>
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted transition-colors",
                currentTreeId === node.orgId && "bg-primary/10 text-primary"
              )}
              onClick={() => handleNodeClick(node)}
            >
              {node.children && node.children.length > 0 ? (
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform cursor-pointer",
                    expandedKeys.includes(node.orgId) && "rotate-90"
                  )}
                  onClick={(e) => toggleExpand(node.orgId, e)}
                />
              ) : (
                <div className="w-4" />
              )}
              <span className="text-sm">{node.name}</span>
            </div>
            {node.children && node.children.length > 0 && expandedKeys.includes(node.orgId) && (
              <div className="ml-4 mt-1">
                {renderOrgTree(node.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 切换树节点展开
  const toggleExpand = (nodeId: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // 搜索表单配置
  const formItemList: FormItem[] = [
    {
      type: "input",
      label: "模型名称",
      paramKey: "name",
      placeholder: "请输入",
      modelValue: formData.name,
    },
    {
      type: "select",
      label: "模型类型",
      paramKey: "modelType",
      placeholder: "请选择",
      modelValue: formData.modelType,
      selectOptions: modelTypeSelectOptions,
    },
    {
      type: "input",
      label: "适用场景",
      paramKey: "applicableScenario",
      placeholder: "请输入",
      modelValue: formData.applicableScenario,
    },
  ];

  return (
    <div className="flex h-full rounded-xl border border-border shadow-sm m-0 p-4 gap-0 bg-white">
      {/* 左侧内容 */}
      <div className="w-[310px] pr-6 h-full overflow-y-auto border-r border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">全部模型</h3>
          <div className="flex items-center gap-1">
            <MdButton
              variant={classification === 'organization' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleClass('organization')}
              className="h-7 px-2 text-xs"
            >
              按组织
            </MdButton>
            <span className="text-muted-foreground">|</span>
            <MdButton
              variant={classification === 'business' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleClass('business')}
              className="h-7 px-2 text-xs"
            >
              按标签
            </MdButton>
          </div>
        </div>

        {classification === 'organization' ? (
          <div className="catalog-tree">
            {renderOrgTree(mockOrgTreeData)}
          </div>
        ) : (
          <div className="tag-target-body flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <div
                key={tag.id}
                className={cn(
                  "px-3 py-1.5 rounded cursor-pointer text-sm transition-colors",
                  currentTagId === tag.id
                    ? "bg-orange-500 text-white"
                    : "bg-blue-100 text-foreground hover:bg-blue-200"
                )}
                onClick={() => handleTagClick(tag)}
              >
                {tag.tagName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 pl-6 h-full overflow-hidden flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">模型列表</h3>
          
          {/* 搜索区域 */}
          <div className="bg-white rounded-xl border border-border shadow-sm mb-4">
            <AdvancedSearch
              formItemList={formItemList}
              onSearch={handleFilterSearch}
              onReset={handleFilterReset}
              onClear={handleClear}
            />
          </div>
        </div>

        {/* 模型卡片列表 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : dataList.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-muted-foreground">暂无数据</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 pb-4">
              {dataList.map((item) => (
                <CardInfo
                  key={item.id}
                  data={item}
                  onClick={() => handleCardClick(item)}
                  className="w-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* 分页 */}
        {!loading && dataList.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              共 {pagination.total} 条数据
            </div>
            <BePager
              currentPage={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              list={dataList}
              pageSizes={[10, 20, 30, 50]}
              callback={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
