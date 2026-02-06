'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Play, X } from 'lucide-react';
import { MdDrawer, MdButton, MdInput, MdSelect, MdTable, MdCheckbox } from '@/components/enterprise-ui';
import type { Column } from '@/components/enterprise-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ModelTrialParam {
  id: string;
  chineseName: string;
  englishName: string;
  unit?: string;
  selected: boolean;
  dataset?: string;
  businessEntity?: string;
  field?: string;
  defaultValue?: string;
}

export interface ModelTrialInfo {
  id: number;
  name: string;
  type: string;
  owner: string;
  language: string;
  useCase: string;
  createTime: string;
  updateTime: string;
  description: string;
  version: string;
  params: ModelTrialParam[];
}

interface ModelTrialDrawerProps {
  open: boolean;
  onClose: () => void;
  model: ModelTrialInfo | null;
}

export const ModelTrialDrawer: React.FC<ModelTrialDrawerProps> = ({
  open,
  onClose,
  model,
}) => {
  const [params, setParams] = useState<ModelTrialParam[]>([]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'output' | 'evaluation'>('output');
  const [outputResults, setOutputResults] = useState<any[]>([]);
  const [evaluationMetrics, setEvaluationMetrics] = useState<Record<string, string>>({});

  // Mock数据：数据集选项
  const datasetOptions = [
    { value: 'dataset_001', label: '水质监测数据集' },
    { value: 'dataset_002', label: '污水处理数据集' },
    { value: 'dataset_003', label: '历史数据数据集' },
  ];

  // Mock数据：业务实体选项
  const businessEntityOptions = [
    { value: 'entity_001', label: '进水水质' },
    { value: 'entity_002', label: '出水水质' },
    { value: 'entity_003', label: '工艺参数' },
  ];

  // Mock数据：字段选项（根据业务实体动态变化）
  const getFieldOptions = (businessEntity?: string) => {
    if (!businessEntity) return [];
    return [
      { value: 'date', label: 'Date' },
      { value: 'cod', label: 'COD' },
      { value: 'nh3', label: 'NH3-N' },
      { value: 'flow', label: 'Flow' },
      { value: 'do', label: 'DO' },
      { value: 'airflow', label: 'Airflow' },
    ];
  };

  useEffect(() => {
    if (model && open) {
      setParams(model.params || []);
      setLogs('');
      setOutputResults([]);
      setEvaluationMetrics({});
      setActiveTab('output');
    }
  }, [model, open]);

  const handleParamSelect = (id: string, selected: boolean) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, selected } : p));
  };

  const handleParamChange = (id: string, field: keyof ModelTrialParam, value: any) => {
    setParams(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleRun = async () => {
    const selectedParams = params.filter(p => p.selected);
    if (selectedParams.length === 0) {
      toast.warning('请至少选择一个参数');
      return;
    }

    // 检查必填字段
    const missingFields = selectedParams.filter(p => !p.field);
    if (missingFields.length > 0) {
      toast.warning('请为所有选中的参数选择字段');
      return;
    }

    setRunning(true);
    setLogs('');
    setOutputResults([]);
    setEvaluationMetrics({});

    // 模拟运行过程
    const logMessages = [
      '正在初始化模型...',
      '正在加载数据...',
      '正在预处理数据...',
      '正在执行模型推理...',
      '正在计算评估指标...',
      '运行完成！',
    ];

    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLogs(prev => prev + (prev ? '\n' : '') + `[${new Date().toLocaleTimeString()}] ${logMessages[i]}`);
    }

    // 模拟输出结果
    const mockOutputResults = [
      { id: 1, time: '2026-02-06 10:00:00', predicted: 0.45, actual: 0.43, error: 0.02 },
      { id: 2, time: '2026-02-06 11:00:00', predicted: 0.48, actual: 0.47, error: 0.01 },
      { id: 3, time: '2026-02-06 12:00:00', predicted: 0.46, actual: 0.45, error: 0.01 },
    ];

    const mockEvaluationMetrics = {
      'RMSE': '0.12',
      'MAE': '0.06',
      'R²': '0.89',
      '准确率': '92.5%',
    };

    setOutputResults(mockOutputResults);
    setEvaluationMetrics(mockEvaluationMetrics);
    setRunning(false);
    toast.success('模型运行完成！');
  };

  const paramColumns: Column<Record<string, unknown>>[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const param = row as unknown as ModelTrialParam;
        return (
          <MdCheckbox
            checked={param.selected}
            onChange={(checked) => handleParamSelect(param.id, checked)}
          />
        );
      },
    },
    {
      key: 'chineseName',
      title: '中文名称',
      width: 150,
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'englishName',
      title: '英文名称',
      width: 150,
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'unit',
      title: '单位',
      width: 100,
      align: 'center' as const,
      render: (value: unknown) => String(value || '-'),
    },
    {
      key: 'dataset',
      title: '选择数据集',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const param = row as unknown as ModelTrialParam;
        return (
          <MdSelect
            options={datasetOptions}
            value={param.dataset}
            onChange={(value) => handleParamChange(param.id, 'dataset', value)}
            placeholder="请选择"
            size="sm"
            className="w-full"
          />
        );
      },
    },
    {
      key: 'businessEntity',
      title: '选择业务实体-分类',
      width: 180,
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const param = row as unknown as ModelTrialParam;
        return (
          <MdSelect
            options={businessEntityOptions}
            value={param.businessEntity}
            onChange={(value) => handleParamChange(param.id, 'businessEntity', value)}
            placeholder="请选择"
            size="sm"
            className="w-full"
          />
        );
      },
    },
    {
      key: 'field',
      title: '选择字段',
      width: 150,
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const param = row as unknown as ModelTrialParam;
        const fieldOptions = getFieldOptions(param.businessEntity);
        return (
          <MdSelect
            options={fieldOptions}
            value={param.field}
            onChange={(value) => handleParamChange(param.id, 'field', value)}
            placeholder="请选择"
            size="sm"
            className="w-full"
          />
        );
      },
    },
    {
      key: 'defaultValue',
      title: '默认值',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, row: Record<string, unknown>) => {
        const param = row as unknown as ModelTrialParam;
        return (
          <MdInput
            value={param.defaultValue || ''}
            onChange={(e) => handleParamChange(param.id, 'defaultValue', e.target.value)}
            placeholder="默认值"
            size="sm"
            className="w-full"
          />
        );
      },
    },
  ];

  const outputColumns: Column<Record<string, unknown>>[] = [
    {
      key: 'time',
      title: '时间',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'predicted',
      title: '预测值',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'actual',
      title: '实际值',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'error',
      title: '误差',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
  ];

  const evaluationColumns: Column<Record<string, unknown>>[] = [
    {
      key: 'metric',
      title: '指标',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
    {
      key: 'value',
      title: '值',
      align: 'center' as const,
      render: (value: unknown) => String(value || ''),
    },
  ];

  const evaluationData = useMemo(() => {
    return Object.entries(evaluationMetrics).map(([metric, value]) => ({
      metric,
      value,
    }));
  }, [evaluationMetrics]);

  if (!model) return null;

  return (
    <MdDrawer open={open} onClose={onClose} title="模型试用" width="90%" className="max-w-[1600px]">
      <div className="flex h-full">
        {/* 左侧：模型信息 */}
        <div className="w-80 border-r border-border p-6 overflow-y-auto shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">模型信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">模型名称</span>
                  <span className="text-foreground text-right flex-1 ml-4">{model.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">模型类型</span>
                  <span className="text-foreground">{model.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">模型所有者</span>
                  <span className="text-foreground">{model.owner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">编程语言</span>
                  <span className="text-foreground">{model.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">模型使用场景</span>
                  <span className="text-foreground">{model.useCase}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span className="text-foreground">{model.createTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">最近更新时间</span>
                  <span className="text-foreground">{model.updateTime}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">模型描述</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {model.description}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：参数设置与运行 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 参数设置 */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-4">参数设置</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <MdTable
                    columns={paramColumns}
                    data={params as any}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 运行按钮 */}
              <div className="flex justify-end">
                <MdButton
                  onClick={handleRun}
                  disabled={running}
                  loading={running}
                  leftIcon={<Play className="h-4 w-4" />}
                >
                  运行
                </MdButton>
              </div>

              {/* 日志输出 */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">运行日志</h4>
                <textarea
                  readOnly
                  value={logs || '暂无'}
                  className="w-full h-32 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground font-mono resize-none"
                  placeholder="暂无"
                />
              </div>

              {/* 结果展示 */}
              <div>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'output' | 'evaluation')}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="output">输出结果</TabsTrigger>
                    <TabsTrigger value="evaluation">评估指标</TabsTrigger>
                  </TabsList>
                  <TabsContent value="output">
                    {outputResults.length > 0 ? (
                      <div className="border border-border rounded-lg overflow-hidden">
                        <MdTable
                          columns={outputColumns}
                          data={outputResults as any}
                        />
                      </div>
                    ) : (
                      <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
                        暂无输出结果
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="evaluation">
                    {evaluationData.length > 0 ? (
                      <div className="border border-border rounded-lg overflow-hidden">
                        <MdTable
                          columns={evaluationColumns}
                          data={evaluationData as any}
                        />
                      </div>
                    ) : (
                      <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
                        暂无评估指标
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="border-t border-border px-6 py-4 flex justify-end">
            <MdButton variant="outline" onClick={onClose}>
              取消
            </MdButton>
          </div>
        </div>
      </div>
    </MdDrawer>
  );
};
