"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';
import { MdDrawer } from '@/components/enterprise-ui/md-drawer';
import { Search, Plus, Eye, Archive, Filter, Download, GitCompare, Trash2 } from 'lucide-react';

interface ModelInfo {
  [key: string]: unknown;
  id: string;
  name: string;
  version: string;
  environment: 'staging' | 'production';
  framework: string;
  signature: string;
  dependencies: string[];
  createdTime: string;
  updatedTime: string;
  creator: string;
  status: 'draft' | 'registered' | 'archived';
}

const ModelRegistryPage: React.FC = () => {
  const router = useRouter();
  
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: '1',
      name: '污水处理效果预测模型',
      version: 'v1.2.3',
      environment: 'production',
      framework: 'TensorFlow',
      signature: 'input: tensor[batch, 15], output: tensor[batch, 1]',
      dependencies: ['tensorflow==2.8.0', 'numpy>=1.19.0', 'pandas>=1.3.0'],
      createdTime: '2024-01-15 10:30:00',
      updatedTime: '2024-01-20 14:22:15',
      creator: '张三',
      status: 'registered'
    },
    {
      id: '2',
      name: '水质监测预警模型',
      version: 'v2.1.0',
      environment: 'staging',
      framework: 'PyTorch',
      signature: 'input: features[12], output: probability[1]',
      dependencies: ['torch==1.12.0', 'scikit-learn>=1.0.0', 'scipy>=1.7.0'],
      createdTime: '2024-01-18 09:15:00',
      updatedTime: '2024-01-19 16:45:22',
      creator: '李四',
      status: 'registered'
    },
    {
      id: '3',
      name: '污水流量预测模型',
      version: 'v1.0.5',
      environment: 'staging',
      framework: 'Transformers',
      signature: 'input: time_series[sequence], output: flow_rate[float]',
      dependencies: ['transformers==4.21.0', 'tokenizers>=0.12.0', 'statsmodels>=0.13.0'],
      createdTime: '2024-01-20 11:20:00',
      updatedTime: '2024-01-21 10:10:05',
      creator: '王五',
      status: 'registered'
    },
    {
      id: '4',
      name: '污泥处理优化模型',
      version: 'v3.0.1',
      environment: 'production',
      framework: 'OpenCV',
      signature: 'input: sludge_params[dict], output: optimal_config[dict]',
      dependencies: ['opencv-python==4.8.0', 'pillow>=9.0.0', 'scikit-optimize>=0.9.0'],
      createdTime: '2024-01-10 08:00:00',
      updatedTime: '2024-01-22 15:30:00',
      creator: '赵六',
      status: 'archived'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [compareModels, setCompareModels] = useState<ModelInfo[]>([]);

  // 只显示已部署到生产环境的模型
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.version.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    // 只显示生产环境的模型
    const matchesEnvironment = model.environment === 'production';
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  // 批量操作
  const handleBatchArchive = () => {
    if (selectedModels.size === 0) {
      alert('请先选择要归档的模型');
      return;
    }
    if (confirm(`确定归档选中的 ${selectedModels.size} 个模型？`)) {
      setModels(models.map(model => 
        selectedModels.has(model.id) 
          ? { ...model, status: 'archived' as const }
          : model
      ));
      setSelectedModels(new Set());
    }
  };

  const handleBatchExport = () => {
    if (selectedModels.size === 0) {
      alert('请先选择要导出的模型');
      return;
    }
    const selectedData = models.filter(m => selectedModels.has(m.id));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `models_export_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 版本对比
  const handleCompareVersions = () => {
    if (selectedModels.size !== 2) {
      alert('请选择两个模型进行版本对比');
      return;
    }
    const selected = Array.from(selectedModels).map(id => 
      models.find(m => m.id === id)
    ).filter(Boolean) as ModelInfo[];
    setCompareModels(selected);
    setCompareDrawerOpen(true);
  };

  // 全选/取消全选
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedModels(new Set(filteredModels.map(m => m.id)));
    } else {
      setSelectedModels(new Set());
    }
  };

  // 切换单个选择
  const toggleSelectModel = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedModels);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedModels(newSelected);
  };

  const allSelected = filteredModels.length > 0 && filteredModels.every(m => selectedModels.has(m.id));
  const someSelected = selectedModels.size > 0 && selectedModels.size < filteredModels.length;

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production').length}
              </div>
              <div className="text-xs text-muted-foreground">已部署模型总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production' && m.status === 'registered').length}
              </div>
              <div className="text-xs text-muted-foreground">运行中</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production' && m.status === 'archived').length}
              </div>
              <div className="text-xs text-muted-foreground">已归档</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.environment === 'production').reduce((acc, model) => acc + model.dependencies.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">依赖包总数</div>
            </div>
          </div>
        </MdCardContent>
      </MdCard>
      <MdCard>
        <MdCardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <MdInput
                  placeholder="搜索模型名称或版本..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <MdSelect 
                options={[
                  { value: 'all', label: '全部状态' }, 
                  { value: 'registered', label: '运行中' }, 
                  { value: 'archived', label: '已归档' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[150px]"
              />
              <MdButton variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                高级筛选
              </MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              {selectedModels.size > 0 && (
                <>
                  <MdButton 
                    variant="outline" 
                    onClick={handleCompareVersions}
                    disabled={selectedModels.size !== 2}
                  >
                    <GitCompare className="mr-2 h-4 w-4" />
                    版本对比
                  </MdButton>
                  <MdButton variant="outline" onClick={handleBatchExport}>
                    <Download className="mr-2 h-4 w-4" />
                    批量导出
                  </MdButton>
                  <MdButton variant="outline" onClick={handleBatchArchive}>
                    <Archive className="mr-2 h-4 w-4" />
                    批量归档
                  </MdButton>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              已选择 {selectedModels.size} 项
            </div>
          </div>
          <MdTable<ModelInfo>
            data={filteredModels}
            columns={[
              {
                key: 'select',
                title: (
                  <MdCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleSelectAll}
                  />
                ),
                render: (value, row) => (
                  <MdCheckbox
                    checked={selectedModels.has(row.id)}
                    onChange={(checked) => toggleSelectModel(row.id, checked)}
                  />
                )
              },
              {
                key: 'name',
                title: '模型名称',
                render: (value, row) => (
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.signature}</div>
                  </div>
                )
              },
              {
                key: 'version',
                title: '版本',
                render: (value, row) => (
                  <span className="font-mono text-sm">{row.version}</span>
                )
              },
              {
                key: 'framework',
                title: '框架',
                render: (value, row) => row.framework
              },
              {
                key: 'dependencies',
                title: '依赖数量',
                render: (value, row) => (
                  <span className="text-sm">{row.dependencies.length} 个</span>
                )
              },
              {
                key: 'creator',
                title: '创建者',
                render: (value, row) => row.creator
              },
              {
                key: 'createdTime',
                title: '创建时间',
                render: (value, row) => row.createdTime
              },
              {
                key: 'actions',
                title: '操作',
                render: (value, row) => (
                  <div className="flex gap-2">
                    <MdButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        router.push(`/categories/model-center/model-registry/model-detail?id=${row.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </MdButton>
                    <MdButton 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm('确定归档此模型？')) {
                          setModels(models.map(m => 
                            m.id === row.id ? { ...m, status: 'archived' as const } : m
                          ));
                        }
                      }}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      归档
                    </MdButton>
                  </div>
                )
              }
            ]}
          />
        </MdCardContent>
      </MdCard>

      {/* 版本对比抽屉 */}
      <MdDrawer
        open={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        title="版本对比"
        width="800px"
      >
        <div className="p-6 space-y-4">
          {compareModels.length === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{compareModels[0].name}</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">版本:</span> {compareModels[0].version}</div>
                    <div><span className="text-muted-foreground">环境:</span> {compareModels[0].environment === 'production' ? '生产' : '预发布'}</div>
                    <div><span className="text-muted-foreground">框架:</span> {compareModels[0].framework}</div>
                    <div><span className="text-muted-foreground">依赖:</span> {compareModels[0].dependencies.length} 个</div>
                    <div><span className="text-muted-foreground">创建时间:</span> {compareModels[0].createdTime}</div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{compareModels[1].name}</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">版本:</span> {compareModels[1].version}</div>
                    <div><span className="text-muted-foreground">环境:</span> {compareModels[1].environment === 'production' ? '生产' : '预发布'}</div>
                    <div><span className="text-muted-foreground">框架:</span> {compareModels[1].framework}</div>
                    <div><span className="text-muted-foreground">依赖:</span> {compareModels[1].dependencies.length} 个</div>
                    <div><span className="text-muted-foreground">创建时间:</span> {compareModels[1].createdTime}</div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">依赖对比</h4>
                <div className="space-y-2">
                  {compareModels[0].dependencies.map((dep, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{dep}</span>
                      <span className={compareModels[1].dependencies.includes(dep) ? 'text-green-600' : 'text-red-600'}>
                        {compareModels[1].dependencies.includes(dep) ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MdDrawer>
    </div>
  );
};

export { ModelRegistryPage };
