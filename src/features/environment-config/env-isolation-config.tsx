"use client";

import React, { useState } from "react";
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription, MdButton, MdInput, MdSelect, MdBadge, MdSwitch } from "@/components/enterprise-ui";
import { Plus, Trash2, Settings, Package, Container } from "lucide-react";
import { toast } from "sonner";

type IsolationType = "conda" | "docker";

interface IsolationConfig {
  id: string;
  name: string;
  type: IsolationType;
  description: string;
  image?: string;
  condaEnv?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export function EnvIsolationConfig() {
  const [configs, setConfigs] = useState<IsolationConfig[]>([
    {
      id: "1",
      name: "Conda 数据科学环境",
      type: "conda",
      description: "基于 Conda 的 Python 数据科学环境",
      condaEnv: "data-science",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Docker TensorFlow 环境",
      type: "docker",
      description: "TensorFlow 2.x 深度学习环境",
      image: "tensorflow/tensorflow:2.13.0-gpu",
      status: "active",
      createdAt: "2024-01-20",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "conda" as IsolationType,
    description: "",
    image: "",
    condaEnv: "",
  });

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("请输入环境名称");
      return;
    }

    if (formData.type === "docker" && !formData.image.trim()) {
      toast.error("请输入 Docker 镜像名称");
      return;
    }

    if (formData.type === "conda" && !formData.condaEnv.trim()) {
      toast.error("请输入 Conda 环境名称");
      return;
    }

    const newConfig: IsolationConfig = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      ...(formData.type === "docker" ? { image: formData.image } : { condaEnv: formData.condaEnv }),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setConfigs([...configs, newConfig]);
    setFormData({ name: "", type: "conda", description: "", image: "", condaEnv: "" });
    setIsCreating(false);
    toast.success("环境隔离配置创建成功");
  };

  const handleDelete = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id));
    toast.success("环境隔离配置已删除");
  };

  const toggleStatus = (id: string) => {
    setConfigs(
      configs.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c))
    );
    toast.success("状态已更新");
  };

  return (
    <div className="space-y-6">
      {/* 功能说明 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>环境隔离管理</MdCardTitle>
          <MdCardDescription>
            使用 Conda 或 Docker 创建独立的环境，实现项目间的依赖隔离，支持环境模板化配置
          </MdCardDescription>
        </MdCardHeader>
      </MdCard>

      {/* 创建新环境 */}
      <MdCard>
        <MdCardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">隔离环境列表</h3>
            <MdButton
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreating(!isCreating)}
            >
              新建隔离环境
            </MdButton>
          </div>

          {isCreating && (
            <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-lg space-y-4 bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                <MdInput
                  label="环境名称"
                  placeholder="例如：Conda 数据科学环境"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <MdSelect
                  label="隔离类型"
                  options={[
                    { value: "conda", label: "Conda 环境" },
                    { value: "docker", label: "Docker 容器" },
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as IsolationType })}
                />
              </div>
              <MdInput
                label="环境描述"
                placeholder="简要描述此隔离环境的用途"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {formData.type === "docker" ? (
                <MdInput
                  label="Docker 镜像"
                  placeholder="例如：tensorflow/tensorflow:2.13.0-gpu"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  helperText="Docker Hub 镜像名称或私有仓库地址"
                />
              ) : (
                <MdInput
                  label="Conda 环境名称"
                  placeholder="例如：data-science"
                  value={formData.condaEnv}
                  onChange={(e) => setFormData({ ...formData, condaEnv: e.target.value })}
                  helperText="Conda 环境的名称，将用于创建或激活环境"
                />
              )}
              <div className="flex gap-2">
                <MdButton variant="primary" leftIcon={<Settings className="h-4 w-4" />} onClick={handleCreate}>
                  保存配置
                </MdButton>
                <MdButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({ name: "", type: "conda", description: "", image: "", condaEnv: "" });
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
                      {config.type === "conda" ? (
                        <Package className="h-5 w-5 text-primary" />
                      ) : (
                        <Container className="h-5 w-5 text-primary" />
                      )}
                      <h4 className="text-base font-semibold text-slate-900">{config.name}</h4>
                      <MdBadge variant={config.type === "conda" ? "info" : "warning"}>
                        {config.type === "conda" ? "Conda" : "Docker"}
                      </MdBadge>
                      <MdBadge variant={config.status === "active" ? "success" : "secondary"}>
                        {config.status === "active" ? "已启用" : "未启用"}
                      </MdBadge>
                    </div>
                    <p className="text-sm text-slate-600">{config.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {config.type === "docker" ? (
                        <span>镜像：{config.image}</span>
                      ) : (
                        <span>环境：{config.condaEnv}</span>
                      )}
                      <span>创建时间：{config.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-500">启用状态</span>
                      <MdSwitch
                        checked={config.status === "active"}
                        onChange={() => toggleStatus(config.id)}
                      />
                    </div>
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
