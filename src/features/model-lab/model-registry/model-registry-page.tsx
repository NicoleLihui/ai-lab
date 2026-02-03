"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdTable } from '@/components/enterprise-ui/md-table';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { Search, Plus, Eye, Edit, Archive, Filter } from 'lucide-react';

interface ModelInfo {
  [key: string]: unknown;
  id: string;
  name: string;
  version: string;
  status: 'staging' | 'production' | 'archived';
  framework: string;
  signature: string;
  dependencies: string[];
  createdTime: string;
  updatedTime: string;
  creator: string;
}

const ModelRegistryPage: React.FC = () => {
  const router = useRouter();
  
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: '1',
      name: '推荐算法模型',
      version: 'v1.2.3',
      status: 'production',
      framework: 'TensorFlow',
      signature: 'input: tensor[batch, 100], output: tensor[batch, 1]',
      dependencies: ['tensorflow==2.8.0', 'numpy>=1.19.0'],
      createdTime: '2024-01-15 10:30:00',
      updatedTime: '2024-01-20 14:22:15',
      creator: '张三'
    },
    {
      id: '2',
      name: '风控评分模型',
      version: 'v2.1.0',
      status: 'staging',
      framework: 'PyTorch',
      signature: 'input: features[20], output: probability[1]',
      dependencies: ['torch==1.12.0', 'scikit-learn>=1.0.0'],
      createdTime: '2024-01-18 09:15:00',
      updatedTime: '2024-01-19 16:45:22',
      creator: '李四'
    },
    {
      id: '3',
      name: 'NLP文本分类',
      version: 'v1.0.5',
      status: 'staging',
      framework: 'Transformers',
      signature: 'input: text[string], output: labels[list]',
      dependencies: ['transformers==4.21.0', 'tokenizers>=0.12.0'],
      createdTime: '2024-01-20 11:20:00',
      updatedTime: '2024-01-21 10:10:05',
      creator: '王五'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.version.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <MdCard>
        <MdCardHeader>
          <MdCardTitle>模型库概览</MdCardTitle>
          <MdCardDescription>
            展示模型库的整体情况和关键指标
          </MdCardDescription>
        </MdCardHeader>
        <MdCardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{models.length}</div>
              <div className="text-xs text-muted-foreground">模型总数</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.status === 'production').length}
              </div>
              <div className="text-xs text-muted-foreground">生产环境</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.filter(m => m.status === 'staging').length}
              </div>
              <div className="text-xs text-muted-foreground">预发布环境</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">
                {models.reduce((acc, model) => acc + model.dependencies.length, 0)}
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
                options={[{ value: 'all', label: '全部状态' }, { value: 'staging', label: '预发布' }, { value: 'production', label: '生产' }, { value: 'archived', label: '已归档' }]}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-[180px]"
              />
              <MdButton variant="outline">高级筛选</MdButton>
            </div>
          </div>
        </MdCardHeader>
        <MdCardContent className="p-0">
          <div className="flex justify-start p-2">
            <MdButton>
              <Plus className="mr-2 h-4 w-4" />
              注册新模型
            </MdButton>
          </div>
          <MdTable<ModelInfo>
            data={filteredModels}
            columns={[{
              key: 'name',
              title: '模型名称',
              render: (value, row) => row.name
            }, {
              key: 'version',
              title: '版本',
              render: (value, row) => row.version
            }, {
              key: 'framework',
              title: '框架',
              render: (value, row) => row.framework
            }, {
              key: 'status',
              title: '状态',
              render: (value, row) => (
                <MdBadge 
                  variant={row.status === 'production' ? 'primary' : 
                          row.status === 'staging' ? 'secondary' : 'danger'}
                >
                  {row.status === 'production' ? '生产' : 
                   row.status === 'staging' ? '预发布' : '已归档'}
                </MdBadge>
              )
            }, {
              key: 'creator',
              title: '创建者',
              render: (value, row) => row.creator
            }, {
              key: 'createdTime',
              title: '创建时间',
              render: (value, row) => row.createdTime
            }, {
              key: 'actions',
              title: '操作',
              render: (value, row) => (
                <div className="flex gap-2">
                  <MdButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // 构建带查询参数的 URL，使用与模型广场类似的路径
                      window.location.href = `/categories/model-center/model-registry/model-detail?id=${row.id}`;
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    查看
                  </MdButton>
                  <MdButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // 构建带查询参数的 URL，使用与模型广场类似的路径
                      window.location.href = `/categories/model-center/model-registry/model-edit?id=${row.id}`;
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </MdButton>
                  <MdButton variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Archive className="h-4 w-4 mr-1" />
                    归档
                  </MdButton>
                </div>
              )
            }]}
          />
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export { ModelRegistryPage };