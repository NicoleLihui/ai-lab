"use client";

import React, { useState } from "react";
import { MdCard, MdCardContent, MdCardHeader, MdCardTitle, MdCardDescription, MdButton, MdInput, MdSelect, MdBadge, MdSwitch } from "@/components/enterprise-ui";
import { Plus, Trash2, HardDrive, Cpu, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type ResourceType = "gpu" | "storage";

interface ResourceMount {
  id: string;
  name: string;
  type: ResourceType;
  gpuCount?: number;
  gpuType?: string;
  storagePath?: string;
  storageSize?: string;
  mountPoint?: string;
  status: "mounted" | "unmounted";
  createdAt: string;
}

export function ResourceMountConfig() {
  const [mounts, setMounts] = useState<ResourceMount[]>([
    {
      id: "1",
      name: "GPU 资源挂载",
      type: "gpu",
      gpuCount: 2,
      gpuType: "NVIDIA A100",
      status: "mounted",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "分布式存储挂载",
      type: "storage",
      storagePath: "/data/shared",
      storageSize: "10TB",
      mountPoint: "/mnt/shared",
      status: "mounted",
      createdAt: "2024-01-20",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "gpu" as ResourceType,
    gpuCount: 1,
    gpuType: "NVIDIA A100",
    storagePath: "",
    storageSize: "",
    mountPoint: "",
  });

  const gpuTypes = [
    { value: "NVIDIA A100", label: "NVIDIA A100" },
    { value: "NVIDIA V100", label: "NVIDIA V100" },
    { value: "NVIDIA RTX 4090", label: "NVIDIA RTX 4090" },
    { value: "NVIDIA RTX 3090", label: "NVIDIA RTX 3090" },
  ];

  const storageSizes = [
    { value: "1TB", label: "1TB" },
    { value: "5TB", label: "5TB" },
    { value: "10TB", label: "10TB" },
    { value: "20TB", label: "20TB" },
    { value: "50TB", label: "50TB" },
  ];

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("请输入资源名称");
      return;
    }

    if (formData.type === "storage") {
      if (!formData.storagePath.trim() || !formData.mountPoint.trim()) {
        toast.error("请填写存储路径和挂载点");
        return;
      }
    }

    const newMount: ResourceMount = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      ...(formData.type === "gpu"
        ? { gpuCount: formData.gpuCount, gpuType: formData.gpuType }
        : {
            storagePath: formData.storagePath,
            storageSize: formData.storageSize,
            mountPoint: formData.mountPoint,
          }),
      status: "unmounted",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMounts([...mounts, newMount]);
    setFormData({
      name: "",
      type: "gpu",
      gpuCount: 1,
      gpuType: "NVIDIA A100",
      storagePath: "",
      storageSize: "",
      mountPoint: "",
    });
    setIsCreating(false);
    toast.success("资源挂载配置创建成功");
  };

  const handleDelete = (id: string) => {
    setMounts(mounts.filter((m) => m.id !== id));
    toast.success("资源挂载配置已删除");
  };

  const toggleMount = (id: string) => {
    setMounts(
      mounts.map((m) =>
        m.id === id ? { ...m, status: m.status === "mounted" ? "unmounted" : "mounted" } : m
      )
    );
    const mount = mounts.find((m) => m.id === id);
    toast.success(mount?.status === "mounted" ? "资源已卸载" : "资源已挂载");
  };

  return (
    <div className="space-y-6">
      {/* 功能说明 */}
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>资源动态挂载</MdCardTitle>
          <MdCardDescription>
            按需挂载 GPU 计算资源和分布式存储，支持动态分配和释放，提升资源利用率
          </MdCardDescription>
        </MdCardHeader>
      </MdCard>

      {/* 创建新挂载 */}
      <MdCard>
        <MdCardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">资源挂载列表</h3>
            <MdButton
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreating(!isCreating)}
            >
              新建挂载
            </MdButton>
          </div>

          {isCreating && (
            <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-lg space-y-4 bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                <MdInput
                  label="资源名称"
                  placeholder="例如：GPU 训练资源"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <MdSelect
                  label="资源类型"
                  options={[
                    { value: "gpu", label: "GPU 计算资源" },
                    { value: "storage", label: "分布式存储" },
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as ResourceType })}
                />
              </div>

              {formData.type === "gpu" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <MdInput
                      label="GPU 数量"
                      type="number"
                      value={formData.gpuCount.toString()}
                      onChange={(e) => setFormData({ ...formData, gpuCount: parseInt(e.target.value) || 1 })}
                    />
                    <MdSelect
                      label="GPU 类型"
                      options={gpuTypes}
                      value={formData.gpuType}
                      onChange={(value) => setFormData({ ...formData, gpuType: value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <MdInput
                    label="存储路径"
                    placeholder="例如：/data/shared"
                    value={formData.storagePath}
                    onChange={(e) => setFormData({ ...formData, storagePath: e.target.value })}
                    helperText="分布式存储的源路径"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <MdInput
                      label="挂载点"
                      placeholder="例如：/mnt/shared"
                      value={formData.mountPoint}
                      onChange={(e) => setFormData({ ...formData, mountPoint: e.target.value })}
                      helperText="本地挂载点路径"
                    />
                    <MdSelect
                      label="存储大小"
                      options={storageSizes}
                      value={formData.storageSize}
                      onChange={(value) => setFormData({ ...formData, storageSize: value })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <MdButton variant="primary" leftIcon={<LinkIcon className="h-4 w-4" />} onClick={handleCreate}>
                  保存配置
                </MdButton>
                <MdButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({
                      name: "",
                      type: "gpu",
                      gpuCount: 1,
                      gpuType: "NVIDIA A100",
                      storagePath: "",
                      storageSize: "",
                      mountPoint: "",
                    });
                  }}
                >
                  取消
                </MdButton>
              </div>
            </div>
          )}

          {/* 挂载列表 */}
          <div className="mt-6 space-y-4">
            {mounts.map((mount) => (
              <MdCard key={mount.id} variant="outlined" className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {mount.type === "gpu" ? (
                        <Cpu className="h-5 w-5 text-primary" />
                      ) : (
                        <HardDrive className="h-5 w-5 text-primary" />
                      )}
                      <h4 className="text-base font-semibold text-slate-900">{mount.name}</h4>
                      <MdBadge variant={mount.type === "gpu" ? "warning" : "info"}>
                        {mount.type === "gpu" ? "GPU" : "存储"}
                      </MdBadge>
                      <MdBadge variant={mount.status === "mounted" ? "success" : "secondary"}>
                        {mount.status === "mounted" ? "已挂载" : "未挂载"}
                      </MdBadge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {mount.type === "gpu" ? (
                        <>
                          <span>GPU 数量：{mount.gpuCount}</span>
                          <span>GPU 类型：{mount.gpuType}</span>
                        </>
                      ) : (
                        <>
                          <span>存储路径：{mount.storagePath}</span>
                          <span>挂载点：{mount.mountPoint}</span>
                          <span>大小：{mount.storageSize}</span>
                        </>
                      )}
                      <span>创建时间：{mount.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-500">挂载状态</span>
                      <MdSwitch checked={mount.status === "mounted"} onChange={() => toggleMount(mount.id)} />
                    </div>
                    <MdButton
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(mount.id)}
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
