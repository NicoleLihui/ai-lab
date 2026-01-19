"use client";

import React, { useState } from "react";
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription, MdButton, MdInput, MdSelect, MdBadge } from "@/components/enterprise-ui";
import { Plus, Trash2, Play, Save, Code } from "lucide-react";
import { toast } from "sonner";

interface NotebookConfig {
  id: string;
  name: string;
  pythonVersion: string;
  description: string;
  packages: string[];
  status: "active" | "inactive";
  createdAt: string;
}

export function NotebookEnvConfig() {
  const [configs, setConfigs] = useState<NotebookConfig[]>([
    {
      id: "1",
      name: "Python 3.10 基础环境",
      pythonVersion: "3.10",
      description: "包含常用的数据科学库",
      packages: ["numpy", "pandas", "matplotlib", "scikit-learn"],
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Python 3.11 深度学习",
      pythonVersion: "3.11",
      description: "深度学习开发环境",
      packages: ["torch", "tensorflow", "transformers"],
      status: "active",
      createdAt: "2024-01-20",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pythonVersion: "3.10",
    description: "",
    packages: "",
  });

  const pythonVersions = [
    { value: "3.8", label: "Python 3.8" },
    { value: "3.9", label: "Python 3.9" },
    { value: "3.10", label: "Python 3.10" },
    { value: "3.11", label: "Python 3.11" },
    { value: "3.12", label: "Python 3.12" },
  ];

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("请输入环境名称");
      return;
    }

    const packages = formData.packages
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newConfig: NotebookConfig = {
      id: Date.now().toString(),
      name: formData.name,
      pythonVersion: formData.pythonVersion,
      description: formData.description,
      packages,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setConfigs([...configs, newConfig]);
    setFormData({ name: "", pythonVersion: "3.10", description: "", packages: "" });
    setIsCreating(false);
    toast.success("环境配置创建成功");
  };

  const handleDelete = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id));
    toast.success("环境配置已删除");
  };

  const handleStart = (config: NotebookConfig) => {
    toast.success(`正在启动 ${config.name} 环境...`);
    // 这里可以添加实际的启动逻辑
  };

  return (
    <div className="space-y-6">
      {/* 功能说明 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>Notebook 开发环境</MdCardTitle>
          <MdCardDescription>
            配置 Python 开发环境，支持预置常用依赖包，快速启动 Notebook 开发环境
          </MdCardDescription>
        </MdCardHeader>
      </MdCard>

      {/* 创建新环境 */}
      <MdCard>
        <MdCardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">环境配置列表</h3>
            <MdButton
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreating(!isCreating)}
            >
              新建环境
            </MdButton>
          </div>

          {isCreating && (
            <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-lg space-y-4 bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                <MdInput
                  label="环境名称"
                  placeholder="例如：Python 3.10 数据科学"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <MdSelect
                  label="Python 版本"
                  options={pythonVersions}
                  value={formData.pythonVersion}
                  onChange={(value) => setFormData({ ...formData, pythonVersion: value })}
                />
              </div>
              <MdInput
                label="环境描述"
                placeholder="简要描述此环境的用途"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <MdInput
                label="依赖包（逗号分隔）"
                placeholder="例如：numpy,pandas,matplotlib,scikit-learn"
                value={formData.packages}
                onChange={(e) => setFormData({ ...formData, packages: e.target.value })}
                helperText="多个包名请用逗号分隔"
              />
              <div className="flex gap-2">
                <MdButton variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleCreate}>
                  保存配置
                </MdButton>
                <MdButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({ name: "", pythonVersion: "3.10", description: "", packages: "" });
                  }}
                >
                  取消
                </MdButton>
              </div>
            </div>
          )}

          {/* 环境列表 */}
          <div className="mt-6 space-y-4">
            {configs.map((config) => (
              <MdCard key={config.id} variant="outlined" className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-primary" />
                      <h4 className="text-base font-semibold text-slate-900">{config.name}</h4>
                      <MdBadge variant={config.status === "active" ? "success" : "secondary"}>
                        {config.status === "active" ? "已启用" : "未启用"}
                      </MdBadge>
                    </div>
                    <p className="text-sm text-slate-600">{config.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Python {config.pythonVersion}</span>
                      <span>创建时间：{config.createdAt}</span>
                    </div>
                    {config.packages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {config.packages.map((pkg, idx) => (
                          <MdBadge key={idx} variant="outline" className="text-xs">
                            {pkg}
                          </MdBadge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <MdButton
                      variant="primary"
                      size="sm"
                      leftIcon={<Play className="h-4 w-4" />}
                      onClick={() => handleStart(config)}
                    >
                      启动
                    </MdButton>
                    <MdButton
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(config.id)}
                    >
                      删除
                    </MdButton>
                  </div>
                </div>
              </MdCard>
            ))}
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
}
