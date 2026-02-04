"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { MdCheckbox } from '@/components/enterprise-ui/md-checkbox';
import { ArrowLeft, Plus, X, Save, Check } from 'lucide-react';

// 模型基础信息
interface ModelBasicInfo {
  name: string;
  type: string;
  version: string;
  status: string;
  description: string;
  owner: string;
  applicableScenario: string[];
}

// 业务实体
interface BusinessEntity {
  id: string;
  name: string;
  code: string;
}

// 业务分析主题
interface BusinessAnalysisTopic {
  id: string;
  name: string;
  code: string;
  businessEntityId: string;
  fields: TopicField[];
}

// 主题字段
interface TopicField {
  id: string;
  name: string;
  physicalFieldName: string;
  dataType: string;
  description: string;
}

// 输出参数
interface OutputParameter {
  id?: string;
  name: string;
  physicalFieldName: string;
  dataType: string;
  description: string;
  source: 'existing' | 'new'; // 来源：已有字段或新增字段
  topicFieldId?: string; // 如果来自已有字段，记录字段ID
}

// 调度配置
interface ScheduleConfig {
  applicationScope: string[]; // 应用范围（组织ID列表）
  taskType: '按时间' | '按任务' | 'API方式' | '单次触发';
  // 按时间配置
  scheduleType?: 'periodic' | 'interval'; // 周期性或区间运行
  cronExpression?: string; // Cron表达式
  periodType?: 'daily' | 'hourly' | 'weekly' | 'monthly' | 'custom'; // 周期类型
  intervalStartTime?: string; // 区间开始时间
  intervalEndTime?: string; // 区间结束时间
  intervalFrequency?: '30min' | '1hour' | '6hour' | 'daily'; // 区间频率
  // 失败重试策略
  retryEnabled: boolean;
  retryCount?: number;
  retryInterval?: number; // 重试间隔（分钟）
  // 高级选项
  waitDataReady: boolean; // 等待数据源就绪
  timeoutAlert: boolean; // 执行超时告警
  timeoutMinutes?: number; // 超时时间（分钟）
}

const ModelDeployPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelId = searchParams.get('id');

  const [step, setStep] = useState(1);
  
  // 步骤1: 模型基础信息
  const [basicInfo, setBasicInfo] = useState<ModelBasicInfo>({
    name: '',
    type: '',
    version: '',
    status: '开发中',
    description: '',
    owner: '',
    applicableScenario: []
  });

  // 步骤2: 数据目录注册
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState<string>('');
  const [availableTopics, setAvailableTopics] = useState<BusinessAnalysisTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicFields, setTopicFields] = useState<TopicField[]>([]);
  const [outputParameters, setOutputParameters] = useState<OutputParameter[]>([]);
  const [newOutputParam, setNewOutputParam] = useState<OutputParameter>({
    name: '',
    physicalFieldName: '',
    dataType: 'string',
    description: '',
    source: 'new'
  });

  // 步骤3: 运行调度管理
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    applicationScope: [],
    taskType: '按时间',
    scheduleType: 'periodic',
    retryEnabled: false,
    waitDataReady: false,
    timeoutAlert: false,
    timeoutMinutes: 30
  });

  // 模拟业务实体数据
  const businessEntities: BusinessEntity[] = [
    { id: '1', name: '污水处理厂', code: 'WWTP' },
    { id: '2', name: '水质监测站', code: 'WQM' },
    { id: '3', name: '设备管理', code: 'EQUIP' }
  ];

  // 模拟业务分析主题数据
  const mockTopics: BusinessAnalysisTopic[] = [
    {
      id: '1',
      name: '水质分析主题',
      code: 'WATER_QUALITY',
      businessEntityId: '1',
      fields: [
        { id: 'f1', name: 'COD浓度', physicalFieldName: 'cod_value', dataType: 'number', description: '化学需氧量' },
        { id: 'f2', name: '氨氮浓度', physicalFieldName: 'nh3_value', dataType: 'number', description: '氨氮含量' }
      ]
    },
    {
      id: '2',
      name: '水量分析主题',
      code: 'WATER_FLOW',
      businessEntityId: '1',
      fields: [
        { id: 'f3', name: '进水量', physicalFieldName: 'inflow', dataType: 'number', description: '进水流量' },
        { id: 'f4', name: '出水量', physicalFieldName: 'outflow', dataType: 'number', description: '出水流量' }
      ]
    }
  ];

  // 组织树选项（模拟）
  const orgOptions = [
    { value: 'org1', label: '集团' },
    { value: 'org2', label: '大区-华东' },
    { value: 'org3', label: '大区-华南' },
    { value: 'org4', label: '区域-上海' },
    { value: 'org5', label: '水厂-浦东水厂' }
  ];

  // 加载模型数据
  useEffect(() => {
    if (modelId) {
      // TODO: 从API加载模型数据
      setBasicInfo({
        name: '示例模型',
        type: '分类模型',
        version: 'v1.0.0',
        status: '开发中',
        description: '这是一个示例模型',
        owner: '张三',
        applicableScenario: ['水质分析']
      });
    }
  }, [modelId]);

  // 当选择业务实体时，过滤业务分析主题
  useEffect(() => {
    if (selectedBusinessEntity) {
      const topics = mockTopics.filter(t => t.businessEntityId === selectedBusinessEntity);
      setAvailableTopics(topics);
      setSelectedTopic('');
      setTopicFields([]);
    } else {
      setAvailableTopics([]);
      setSelectedTopic('');
      setTopicFields([]);
    }
  }, [selectedBusinessEntity]);

  // 当选择业务分析主题时，加载字段
  useEffect(() => {
    if (selectedTopic) {
      const topic = availableTopics.find(t => t.id === selectedTopic);
      if (topic) {
        setTopicFields(topic.fields);
      }
    } else {
      setTopicFields([]);
    }
  }, [selectedTopic, availableTopics]);

  // 从已有字段添加输出参数
  const addOutputParamFromField = (field: TopicField) => {
    const param: OutputParameter = {
      name: field.name,
      physicalFieldName: field.physicalFieldName,
      dataType: field.dataType,
      description: field.description,
      source: 'existing',
      topicFieldId: field.id
    };
    setOutputParameters([...outputParameters, param]);
  };

  // 添加新输出参数
  const addNewOutputParam = () => {
    if (newOutputParam.name && newOutputParam.physicalFieldName) {
      setOutputParameters([...outputParameters, { ...newOutputParam }]);
      setNewOutputParam({
        name: '',
        physicalFieldName: '',
        dataType: 'string',
        description: '',
        source: 'new'
      });
    }
  };

  // 删除输出参数
  const removeOutputParameter = (index: number) => {
    setOutputParameters(outputParameters.filter((_, i) => i !== index));
  };

  // 提交部署
  const handleSubmit = () => {
    // 验证
    if (step === 1) {
      if (!basicInfo.name || !basicInfo.type || !basicInfo.version || !basicInfo.owner) {
        alert('请填写必填字段');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedBusinessEntity || !selectedTopic || outputParameters.length === 0) {
        alert('请完成数据目录注册');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!scheduleConfig.applicationScope.length) {
        alert('请选择应用范围');
        return;
      }
      if (scheduleConfig.taskType === '按时间' && !scheduleConfig.cronExpression && scheduleConfig.scheduleType === 'periodic') {
        alert('请配置调度时间');
        return;
      }

      // 提交部署
      const deployData = {
        modelId,
        basicInfo,
        dataCatalog: {
          businessEntityId: selectedBusinessEntity,
          topicId: selectedTopic,
          outputParameters
        },
        scheduleConfig
      };

      console.log('提交部署数据:', deployData);
      
      // TODO: 调用部署API，进入审核工作流
      alert('部署申请已提交，等待审核');
      router.push('/categories/model-lab/model-development/machine-learning-models');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">模型部署</h1>
          <p className="text-sm text-muted-foreground">
            完成三步配置后即可提交部署审核
          </p>
        </div>
        <MdButton variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </MdButton>
      </div>

      {/* 步骤指示器 */}
      <MdCard>
        <MdCardContent className="pt-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= s ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                  }`}>
                    {step > s ? <Check className="h-4 w-4" /> : s}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {s === 1 && '编辑模型基础信息'}
                    {s === 2 && '数据目录注册'}
                    {s === 3 && '运行调度管理'}
                  </span>
                </div>
                {s < 3 && <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted-foreground'}`} />}
              </React.Fragment>
            ))}
          </div>
        </MdCardContent>
      </MdCard>

      {/* 步骤1: 编辑模型基础信息 */}
      {step === 1 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>编辑模型基础信息</MdCardTitle>
            <MdCardDescription>填写模型的基本信息</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型名称 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="请输入模型名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型类型 <span className="text-red-500">*</span>
                </label>
                <MdSelect
                  options={[
                    { value: '分类模型', label: '分类模型' },
                    { value: '回归模型', label: '回归模型' },
                    { value: '时间序列', label: '时间序列' }
                  ]}
                  value={basicInfo.type}
                  onChange={(value) => setBasicInfo({ ...basicInfo, type: value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型版本 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.version}
                  onChange={(e) => setBasicInfo({ ...basicInfo, version: e.target.value })}
                  placeholder="例如: v1.0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型状态
                </label>
                <MdSelect
                  options={[
                    { value: '开发中', label: '开发中' },
                    { value: '测试中', label: '测试中' },
                    { value: '已发布', label: '已发布' }
                  ]}
                  value={basicInfo.status}
                  onChange={(value) => setBasicInfo({ ...basicInfo, status: value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                模型功能描述
              </label>
              <textarea
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="请输入模型功能描述"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  负责人 <span className="text-red-500">*</span>
                </label>
                <MdInput
                  value={basicInfo.owner}
                  onChange={(e) => setBasicInfo({ ...basicInfo, owner: e.target.value })}
                  placeholder="请输入负责人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  模型适用场景
                </label>
                <MdSelect
                  options={[
                    { value: '水质分析', label: '水质分析' },
                    { value: '水量分析', label: '水量分析' },
                    { value: '设备预测', label: '设备预测' }
                  ]}
                  value={basicInfo.applicableScenario[0] || ''}
                  onChange={(value) => {
                    const scenarios = value ? [value] : [];
                    setBasicInfo({ ...basicInfo, applicableScenario: scenarios });
                  }}
                  placeholder="请选择适用场景"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <MdButton onClick={handleSubmit}>
                下一步
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤2: 数据目录注册 */}
      {step === 2 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>数据目录注册</MdCardTitle>
            <MdCardDescription>配置数据资产映射和输出参数</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            {/* 第一部分: 数据资产映射 */}
            <div>
              <h3 className="font-semibold mb-4">第一部分：数据资产映射</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    选择业务实体 <span className="text-red-500">*</span>
                  </label>
                  <MdSelect
                    options={businessEntities.map(e => ({ value: e.id, label: e.name }))}
                    value={selectedBusinessEntity}
                    onChange={setSelectedBusinessEntity}
                    placeholder="请选择业务实体"
                  />
                </div>

                {selectedBusinessEntity && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      业务分析主题 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <MdSelect
                        options={availableTopics.map(t => ({ value: t.id, label: t.name }))}
                        value={selectedTopic}
                        onChange={setSelectedTopic}
                        placeholder="请选择业务分析主题"
                        className="flex-1"
                      />
                      <MdButton variant="outline" onClick={() => {
                        // TODO: 打开新建业务分析主题的弹窗
                        alert('新建业务分析主题功能待实现');
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        新建主题
                      </MdButton>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 第二部分: 输出参数明细编辑 */}
            <div>
              <h3 className="font-semibold mb-4">第二部分：输出参数明细编辑</h3>
              
              {/* 从已有字段选择 */}
              {selectedTopic && topicFields.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">从业务分析主题选择字段：</div>
                  <div className="grid grid-cols-2 gap-2">
                    {topicFields.map(field => (
                      <div key={field.id} className="border rounded p-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{field.name}</div>
                          <div className="text-xs text-muted-foreground">{field.physicalFieldName} ({field.dataType})</div>
                        </div>
                        <MdButton
                          variant="outline"
                          size="sm"
                          onClick={() => addOutputParamFromField(field)}
                          disabled={outputParameters.some(p => p.topicFieldId === field.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </MdButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 输出参数列表 */}
              <div className="space-y-2 mb-4">
                {outputParameters.map((param, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">参数名称</div>
                        <div className="font-medium">{param.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">物理字段名</div>
                        <div className="font-medium">{param.physicalFieldName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">数据类型</div>
                        <MdBadge variant="outline">{param.dataType}</MdBadge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">来源</div>
                        <MdBadge variant={param.source === 'existing' ? 'primary' : 'secondary'}>
                          {param.source === 'existing' ? '已有字段' : '新增字段'}
                        </MdBadge>
                      </div>
                    </div>
                    <MdButton
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOutputParameter(index)}
                    >
                      <X className="h-4 w-4" />
                    </MdButton>
                  </div>
                ))}
              </div>

              {/* 新增字段 */}
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">新增字段（新增的字段会被保存在当前业务分析主题下）</div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <MdInput
                    placeholder="参数名称"
                    value={newOutputParam.name}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, name: e.target.value })}
                  />
                  <MdInput
                    placeholder="物理字段名"
                    value={newOutputParam.physicalFieldName}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, physicalFieldName: e.target.value })}
                  />
                  <MdSelect
                    options={[
                      { value: 'string', label: '字符串' },
                      { value: 'number', label: '数字' },
                      { value: 'integer', label: '整数' },
                      { value: 'float', label: '浮点数' }
                    ]}
                    value={newOutputParam.dataType}
                    onChange={(value) => setNewOutputParam({ ...newOutputParam, dataType: value })}
                  />
                  <MdInput
                    placeholder="描述"
                    value={newOutputParam.description}
                    onChange={(e) => setNewOutputParam({ ...newOutputParam, description: e.target.value })}
                  />
                </div>
                <MdButton variant="outline" size="sm" onClick={addNewOutputParam}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加字段
                </MdButton>
              </div>
            </div>

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(1)}>
                上一步
              </MdButton>
              <MdButton onClick={handleSubmit}>
                下一步
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}

      {/* 步骤3: 运行调度管理 */}
      {step === 3 && (
        <MdCard>
          <MdCardHeader>
            <MdCardTitle>运行调度管理</MdCardTitle>
            <MdCardDescription>配置模型的运行调度策略</MdCardDescription>
          </MdCardHeader>
          <MdCardContent className="space-y-6">
            {/* 选择应用范围 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                选择应用范围 <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">从组织树中选择调度的应用范围（可多选）</div>
                <div className="space-y-2">
                  {orgOptions.map(org => (
                    <div key={org.value} className="flex items-center">
                      <MdCheckbox
                        checked={scheduleConfig.applicationScope.includes(org.value)}
                        onChange={(checked) => {
                          if (checked) {
                            setScheduleConfig({
                              ...scheduleConfig,
                              applicationScope: [...scheduleConfig.applicationScope, org.value]
                            });
                          } else {
                            setScheduleConfig({
                              ...scheduleConfig,
                              applicationScope: scheduleConfig.applicationScope.filter(id => id !== org.value)
                            });
                          }
                        }}
                      />
                      <span className="ml-2">{org.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 任务类型 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                任务类型 <span className="text-red-500">*</span>
              </label>
              <MdSelect
                options={[
                  { value: '按时间', label: '按时间' },
                  { value: '按任务', label: '按任务' },
                  { value: 'API方式', label: 'API方式' },
                  { value: '单次触发', label: '单次触发' }
                ]}
                value={scheduleConfig.taskType}
                onChange={(value) => setScheduleConfig({ ...scheduleConfig, taskType: value as any })}
              />
            </div>

            {/* 按时间时的运行机制配置 */}
            {scheduleConfig.taskType === '按时间' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">运行机制</label>
                  <MdSelect
                    options={[
                      { value: 'periodic', label: '周期性' },
                      { value: 'interval', label: '区间运行' }
                    ]}
                    value={scheduleConfig.scheduleType}
                    onChange={(value) => setScheduleConfig({ ...scheduleConfig, scheduleType: value as any })}
                  />
                </div>

                {scheduleConfig.scheduleType === 'periodic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">周期类型</label>
                      <MdSelect
                        options={[
                          { value: 'daily', label: '每天' },
                          { value: 'hourly', label: '每小时' },
                          { value: 'weekly', label: '每周' },
                          { value: 'monthly', label: '每月' },
                          { value: 'custom', label: '自定义Cron' }
                        ]}
                        value={scheduleConfig.periodType}
                        onChange={(value) => setScheduleConfig({ ...scheduleConfig, periodType: value as any })}
                      />
                    </div>
                    {scheduleConfig.periodType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Cron表达式</label>
                        <MdInput
                          value={scheduleConfig.cronExpression || ''}
                          onChange={(e) => setScheduleConfig({ ...scheduleConfig, cronExpression: e.target.value })}
                          placeholder="例如: 0 9 * * *"
                        />
                      </div>
                    )}
                  </div>
                )}

                {scheduleConfig.scheduleType === 'interval' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">开始时间</label>
                      <MdInput
                        type="datetime-local"
                        value={scheduleConfig.intervalStartTime || ''}
                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, intervalStartTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">结束时间</label>
                      <MdInput
                        type="datetime-local"
                        value={scheduleConfig.intervalEndTime || ''}
                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, intervalEndTime: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">频率</label>
                      <MdSelect
                        options={[
                          { value: '30min', label: '每30分钟' },
                          { value: '1hour', label: '每小时' },
                          { value: '6hour', label: '每6小时' },
                          { value: 'daily', label: '每天' }
                        ]}
                        value={scheduleConfig.intervalFrequency}
                        onChange={(value) => setScheduleConfig({ ...scheduleConfig, intervalFrequency: value as any })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 失败重试策略 */}
            <div>
              <div className="flex items-center mb-2">
                <MdCheckbox
                  checked={scheduleConfig.retryEnabled}
                  onChange={(checked) => setScheduleConfig({ ...scheduleConfig, retryEnabled: checked })}
                />
                <span className="ml-2">支持失败重试</span>
              </div>
              {scheduleConfig.retryEnabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">重试次数</label>
                    <MdInput
                      type="number"
                      value={scheduleConfig.retryCount?.toString() || ''}
                      onChange={(e) => setScheduleConfig({ ...scheduleConfig, retryCount: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">重试间隔（分钟）</label>
                    <MdInput
                      type="number"
                      value={scheduleConfig.retryInterval?.toString() || ''}
                      onChange={(e) => setScheduleConfig({ ...scheduleConfig, retryInterval: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 高级选项 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <MdCheckbox
                  checked={scheduleConfig.waitDataReady}
                  onChange={(checked) => setScheduleConfig({ ...scheduleConfig, waitDataReady: checked })}
                />
                <span className="ml-2">任务调度上游依赖检查（是否等待数据源（DW_PUMP_SENSOR）就绪后再执行）</span>
              </div>
              <div className="flex items-center">
                <MdCheckbox
                  checked={scheduleConfig.timeoutAlert}
                  onChange={(checked) => setScheduleConfig({ ...scheduleConfig, timeoutAlert: checked })}
                />
                <span className="ml-2">执行超时告警（运行超过 {scheduleConfig.timeoutMinutes || 30} 分钟发送告警给负责人）</span>
              </div>
              {scheduleConfig.timeoutAlert && (
                <div className="ml-6">
                  <label className="block text-sm font-medium mb-2">超时时间（分钟）</label>
                  <MdInput
                    type="number"
                    value={scheduleConfig.timeoutMinutes?.toString() || '30'}
                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, timeoutMinutes: parseInt(e.target.value) || 30 })}
                    className="w-48"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <MdButton variant="outline" onClick={() => setStep(2)}>
                上一步
              </MdButton>
              <MdButton onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                提交部署审核
              </MdButton>
            </div>
          </MdCardContent>
        </MdCard>
      )}
    </div>
  );
};

export default ModelDeployPage;
