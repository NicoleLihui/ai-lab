"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Tabs, Table, Descriptions, Tag, Space, Spin, Alert, Statistic, Row, Col, Typography } from 'antd';
import { SearchOutlined, PlayCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import BeTable from '@/components/enterprise-ui/table';
import BePager from '@/components/enterprise-ui/pagination';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface ModelVersion {
  id: number;
  version: string;
  status: string;
  createdTime: string;
  description: string;
}

interface ModelEvaluation {
  id: number;
  metricName: string;
  metricValue: string;
  evalTime: string;
  dataset: string;
}

const ModelDetailPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [modelData, setModelData] = useState<any>(null);
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [evaluations, setEvaluations] = useState<ModelEvaluation[]>([]);
  
  // Mock model data
  const mockModelData = {
    id: 1,
    name: 'NLP文本分类模型',
    type: '机器学习',
    version: 'v1.2.0',
    status: '已发布',
    description: '基于深度学习的文本分类模型，适用于多类别文本分类任务',
    createdTime: '2023-06-15 10:30:00',
    lastModified: '2023-07-20 14:45:00',
    owner: '张三',
    department: 'AI研发组',
    tags: ['自然语言处理', '分类', '深度学习'],
    metrics: {
      accuracy: 0.92,
      precision: 0.89,
      recall: 0.91,
      f1Score: 0.90
    }
  };

  // Mock versions data
  const mockVersions: ModelVersion[] = [
    { id: 1, version: 'v1.2.0', status: '已发布', createdTime: '2023-07-20', description: '优化了分类精度' },
    { id: 2, version: 'v1.1.5', status: '已发布', createdTime: '2023-07-10', description: '修复了部分bug' },
    { id: 3, version: 'v1.1.0', status: '已发布', createdTime: '2023-06-25', description: '初始版本发布' },
    { id: 4, version: 'v1.0.0', status: '已归档', createdTime: '2023-06-15', description: '原型版本' }
  ];

  // Mock evaluations data
  const mockEvaluations: ModelEvaluation[] = [
    { id: 1, metricName: '准确率', metricValue: '92.3%', evalTime: '2023-07-20', dataset: '测试集V3' },
    { id: 2, metricName: '精确率', metricValue: '89.1%', evalTime: '2023-07-20', dataset: '测试集V3' },
    { id: 3, metricName: '召回率', metricValue: '91.5%', evalTime: '2023-07-20', dataset: '测试集V3' },
    { id: 4, metricName: 'F1分数', metricValue: '90.2%', evalTime: '2023-07-20', dataset: '测试集V3' },
    { id: 5, metricName: 'AUC', metricValue: '0.94', evalTime: '2023-06-25', dataset: '测试集V2' }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setModelData(mockModelData);
      setVersions(mockVersions);
      setEvaluations(mockEvaluations);
      setLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleDeploy = () => {
    console.log('部署模型');
  };

  const handleRetrain = () => {
    console.log('重新训练模型');
  };

  const handleEvaluate = () => {
    console.log('评估模型');
  };

  const versionColumns = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === '已发布') color = 'green';
        if (status === '已归档') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">部署</Button>
          <Button type="link" size="small">下载</Button>
        </Space>
      ),
    },
  ];

  const evaluationColumns = [
    {
      title: '指标名称',
      dataIndex: 'metricName',
      key: 'metricName',
    },
    {
      title: '指标值',
      dataIndex: 'metricValue',
      key: 'metricValue',
    },
    {
      title: '评估时间',
      dataIndex: 'evalTime',
      key: 'evalTime',
    },
    {
      title: '数据集',
      dataIndex: 'dataset',
      key: 'dataset',
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="model-detail" style={{ padding: '24px', height: '100%', backgroundColor: '#f5f5f5' }}>
      {/* Model Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2}>{modelData.name}</Title>
            <Text type="secondary">{modelData.description}</Text>
          </div>
          <Space>
            <Button icon={<PlayCircleOutlined />} type="primary" onClick={handleEvaluate}>
              评估
            </Button>
            <Button icon={<SyncOutlined />} onClick={handleRetrain}>
              重新训练
            </Button>
            <Button icon={<CheckCircleOutlined />} type="primary" onClick={handleDeploy}>
              部署
            </Button>
          </Space>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <Descriptions column={4}>
            <Descriptions.Item label="模型类型">{modelData.type}</Descriptions.Item>
            <Descriptions.Item label="当前版本">{modelData.version}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                modelData.status === '已发布' ? 'green' : 
                modelData.status === '测试中' ? 'orange' : 'blue'
              }>
                {modelData.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="所有者">{modelData.owner}</Descriptions.Item>
            <Descriptions.Item label="部门">{modelData.department}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{modelData.createdTime}</Descriptions.Item>
            <Descriptions.Item label="最后修改">{modelData.lastModified}</Descriptions.Item>
          </Descriptions>
          
          <div style={{ marginTop: '16px' }}>
            <Text strong>标签: </Text>
            <Space size={[0, 8]} wrap>
              {modelData.tags.map((tag: string, index: number) => (
                <Tag key={index} color="blue">
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </Card>

      {/* Metrics Summary */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="准确率" 
              value={modelData.metrics.accuracy} 
              precision={3}
              valueStyle={{ color: '#3f8600' }}
              prefix={<span>ACC</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="精确率" 
              value={modelData.metrics.precision} 
              precision={3}
              valueStyle={{ color: '#1890ff' }}
              prefix={<span>PRE</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="召回率" 
              value={modelData.metrics.recall} 
              precision={3}
              valueStyle={{ color: '#722ed1' }}
              prefix={<span>REC</span>}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="F1分数" 
              value={modelData.metrics.f1Score} 
              precision={3}
              valueStyle={{ color: '#52c41a' }}
              prefix={<span>F1</span>}
            />
          </Col>
        </Row>
      </Card>

      {/* Tabs for details */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px' }}>
        <TabPane tab="概览" key="overview">
          <div style={{ padding: '16px 0' }}>
            <Title level={4}>模型详情</Title>
            <p>{modelData.description}</p>
            
            <Title level={4} style={{ marginTop: '24px' }}>算法说明</Title>
            <p>该模型采用先进的深度学习算法，结合卷积神经网络和循环神经网络的优点，能够有效处理各种类型的文本分类任务。</p>
            
            <Title level={4} style={{ marginTop: '24px' }}>使用场景</Title>
            <ul>
              <li>新闻分类</li>
              <li>情感分析</li>
              <li>垃圾邮件识别</li>
              <li>客户反馈分类</li>
            </ul>
          </div>
        </TabPane>
        
        <TabPane tab="版本管理" key="versions">
          <div style={{ padding: '16px 0' }}>
            <Table 
              dataSource={versions} 
              columns={versionColumns} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
            />
          </div>
        </TabPane>
        
        <TabPane tab="评估结果" key="evaluations">
          <div style={{ padding: '16px 0' }}>
            <Table 
              dataSource={evaluations} 
              columns={evaluationColumns} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
            />
          </div>
        </TabPane>
        
        <TabPane tab="部署历史" key="deployments">
          <div style={{ padding: '16px 0' }}>
            <Alert
              message="部署历史"
              description="此模型目前还没有部署记录。"
              type="info"
              showIcon
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ModelDetailPage;