"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Space, Badge, Modal, Form, Select, Input, Spin, message, Steps } from 'antd';
import { PlayCircleOutlined, StopOutlined, InfoCircleOutlined, DeploymentUnitOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';
import BeTable from '@/components/enterprise-ui/table';
import BePager from '@/components/enterprise-ui/pagination';

interface ModelDeployment {
  id: number;
  modelName: string;
  version: string;
  deploymentName: string;
  status: 'running' | 'stopped' | 'failed' | 'pending';
  endpoint: string;
  createdTime: string;
  updatedTime: string;
  resourceSpec: string;
  replicas: number;
  cpuUsage: number;
  memoryUsage: number;
}

const ModelDeployPage: React.FC = () => {
  const [data, setData] = useState<ModelDeployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [selectedDeployment, setSelectedDeployment] = useState<ModelDeployment | null>(null);
  const [isDeployModalVisible, setIsDeployModalVisible] = useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
  const [deployStep, setDeployStep] = useState<number>(0);

  // Mock data for deployments
  const mockData: ModelDeployment[] = [
    {
      id: 1,
      modelName: '水质预测模型',
      version: 'v1.2.0',
      deploymentName: 'water-quality-prod',
      status: 'running',
      endpoint: 'https://api.example.com/models/water-quality',
      createdTime: '2023-06-15 10:30:00',
      updatedTime: '2023-06-15 10:30:00',
      resourceSpec: '4 CPU, 8GB RAM',
      replicas: 3,
      cpuUsage: 45,
      memoryUsage: 60
    },
    {
      id: 2,
      modelName: '用水量预测模型',
      version: 'v2.1.0',
      deploymentName: 'water-consumption-staging',
      status: 'stopped',
      endpoint: 'https://api.example.com/models/water-consumption',
      createdTime: '2023-06-20 14:20:00',
      updatedTime: '2023-06-21 09:15:00',
      resourceSpec: '2 CPU, 4GB RAM',
      replicas: 1,
      cpuUsage: 0,
      memoryUsage: 0
    },
    {
      id: 3,
      modelName: '管网漏损检测模型',
      version: 'v1.0.5',
      deploymentName: 'pipeline-leak-dev',
      status: 'failed',
      endpoint: 'https://api.example.com/models/pipeline-leak',
      createdTime: '2023-07-01 16:45:00',
      updatedTime: '2023-07-01 17:30:00',
      resourceSpec: '2 CPU, 4GB RAM',
      replicas: 1,
      cpuUsage: 0,
      memoryUsage: 0
    },
    {
      id: 4,
      modelName: '水压预测模型',
      version: 'v1.1.2',
      deploymentName: 'water-pressure-prod',
      status: 'running',
      endpoint: 'https://api.example.com/models/water-pressure',
      createdTime: '2023-07-05 11:10:00',
      updatedTime: '2023-07-05 11:10:00',
      resourceSpec: '8 CPU, 16GB RAM',
      replicas: 2,
      cpuUsage: 30,
      memoryUsage: 45
    },
    {
      id: 5,
      modelName: '水质异常检测模型',
      version: 'v1.3.0',
      deploymentName: 'water-quality-anomaly-realtime',
      status: 'pending',
      endpoint: 'https://api.example.com/models/water-quality-anomaly',
      createdTime: '2023-05-20 09:00:00',
      updatedTime: '2023-05-20 09:05:00',
      resourceSpec: '4 CPU, 8GB RAM',
      replicas: 1,
      cpuUsage: 0,
      memoryUsage: 0
    }
  ];

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  const loadData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = mockData.slice(startIndex, startIndex + pageSize);
      
      setData(paginatedData);
      setTotal(mockData.length);
      setLoading(false);
    }, 500);
  };

  const handleStartDeployment = (record: ModelDeployment) => {
    message.success(`正在启动部署: ${record.deploymentName}`);
    // Update the status in the UI
    setData(prev => prev.map(item => 
      item.id === record.id ? { ...item, status: 'running' } : item
    ));
  };

  const handleStopDeployment = (record: ModelDeployment) => {
    Modal.confirm({
      title: '确认停止',
      content: `确定要停止部署 ${record.deploymentName} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`已停止部署: ${record.deploymentName}`);
        setData(prev => prev.map(item => 
          item.id === record.id ? { ...item, status: 'stopped' } : item
        ));
      }
    });
  };

  const handleDeployNewModel = () => {
    setDeployStep(0);
    setIsDeployModalVisible(true);
  };

  const handleViewDetails = (record: ModelDeployment) => {
    setSelectedDeployment(record);
    setIsDetailModalVisible(true);
  };

  const handleDeployModalOk = () => {
    // Simulate deployment process
    setDeployStep(1);
    
    setTimeout(() => {
      setDeployStep(2);
      setTimeout(() => {
        setDeployStep(3);
        setTimeout(() => {
          setIsDeployModalVisible(false);
          setDeployStep(0);
          message.success('模型部署成功！');
          loadData(); // Refresh the data
        }, 1000);
      }, 1500);
    }, 1500);
  };

  const handleDeployModalCancel = () => {
    setIsDeployModalVisible(false);
    setDeployStep(0);
  };

  const getStatusTag = (status: ModelDeployment['status']) => {
    switch (status) {
      case 'running':
        return <Tag color="green">运行中</Tag>;
      case 'stopped':
        return <Tag color="default">已停止</Tag>;
      case 'failed':
        return <Tag color="red">失败</Tag>;
      case 'pending':
        return <Tag color="orange">部署中</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      type: 'index',
      prop: 'id',
      label: '序号',
      align: 'center',
      width: 60
    },
    {
      prop: 'deploymentName',
      label: '部署名称',
      align: 'center'
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      align: 'center',
      format: (record: ModelDeployment) => {
        return getStatusTag(record.status).props.children;
      }
    },
    {
      prop: 'endpoint',
      label: '访问端点',
      align: 'center',
      format: (record: ModelDeployment) => {
        return `<a href="${record.endpoint}" target="_blank" rel="noopener noreferrer">${record.endpoint}</a>`;
      }
    },
    {
      prop: 'resourceSpec',
      label: '资源配置',
      align: 'center'
    },
    {
      prop: 'replicas',
      label: '副本数',
      align: 'center'
    },
    {
      prop: 'updatedTime',
      label: '更新时间',
      align: 'center'
    },
    {
      type: 'actions',
      label: '操作',
      minWidth: 200,
      buttons: (row: ModelDeployment) => {
        return [
          {
            name: '详情',
            command: 'details',
            type: 'link',
          },
          ...(row.status === 'running' 
            ? [{
                name: '停止',
                command: 'stop',
                type: 'link',
                disabled: false
              }] 
            : [{
                name: '启动',
                command: 'start',
                type: 'link',
                disabled: false
              }]
          ),
          {
            name: '删除',
            command: 'delete',
            type: 'link',
            disabled: row.status === 'running'
          }
        ];
      }
    }
  ];

  const onCommand = (command: string, row: ModelDeployment) => {
    switch (command) {
      case 'details':
        handleViewDetails(row);
        break;
      case 'start':
        handleStartDeployment(row);
        break;
      case 'stop':
        handleStopDeployment(row);
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除部署 ${row.deploymentName} 吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            setData(prev => prev.filter(item => item.id !== row.id));
            message.success('删除成功');
          }
        });
        break;
    }
  };

  return (
    <div className="model-deploy" style={{ padding: '24px', height: '100%', backgroundColor: '#f5f5f5' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>模型部署管理</h2>
          <Space>
            <Button type="primary" icon={<DeploymentUnitOutlined />} onClick={handleDeployNewModel}>
              部署新模型
            </Button>
            <Button icon={<HistoryOutlined />}>
              部署历史
            </Button>
          </Space>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Badge status="success" text="运行中" style={{ marginRight: '20px' }} />
            <Badge status="default" text="已停止" style={{ marginRight: '20px' }} />
            <Badge status="error" text="失败" style={{ marginRight: '20px' }} />
            <Badge status="warning" text="部署中" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="data-table-container" style={{ marginBottom: '20px' }}>
          <Spin spinning={loading}>
            <BeTable
              tableData={data}
              columns={columns}
              options={{
                paginationConfig: {
                  currentPage,
                  pageSize,
                  total
                },
                rowKey: 'id'
              }}
              onCommand={onCommand}
            />
          </Spin>
        </div>

        <div style={{ textAlign: 'right' }}>
          <BePager
            currentPage={currentPage}
            pageSize={pageSize}
            total={total}
            list={data}
            callback={(page, size) => {
              setCurrentPage(page);
              if (size) setPageSize(size);
            }}
          />
        </div>
      </Card>

      {/* Deploy Model Modal */}
      <Modal
        title="部署新模型"
        open={isDeployModalVisible}
        onOk={handleDeployModalOk}
        onCancel={handleDeployModalCancel}
        okText={deployStep < 3 ? "下一步" : "完成"}
        cancelText="取消"
        width={700}
      >
        {deployStep === 0 ? (
          <Form layout="vertical">
            <Form.Item label="选择模型">
              <Select placeholder="请选择要部署的模型">
                {mockData.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.modelName} (v{item.version})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="部署名称">
              <Input placeholder="请输入部署名称，如：model-name-prod" />
            </Form.Item>
            
            <Form.Item label="部署环境">
              <Select placeholder="请选择部署环境">
                <Select.Option value="dev">开发环境</Select.Option>
                <Select.Option value="staging">预发布环境</Select.Option>
                <Select.Option value="prod">生产环境</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="资源配置">
              <Select placeholder="请选择资源配置">
                <Select.Option value="small">小型 (2 CPU, 4GB RAM)</Select.Option>
                <Select.Option value="medium">中型 (4 CPU, 8GB RAM)</Select.Option>
                <Select.Option value="large">大型 (8 CPU, 16GB RAM)</Select.Option>
                <Select.Option value="xlarge">超大型 (16 CPU, 32GB RAM)</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="副本数量">
              <Input type="number" min="1" max="10" defaultValue={1} />
            </Form.Item>
            
            <Form.Item label="访问策略">
              <Select placeholder="请选择访问策略">
                <Select.Option value="private">私有 (仅内部访问)</Select.Option>
                <Select.Option value="public">公开 (外部可访问)</Select.Option>
                <Select.Option value="restricted">受限 (需认证访问)</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <Steps current={deployStep} style={{ marginBottom: 20 }} items={[{
              title: '配置',
            }, {
              title: '部署',
            }, {
              title: '完成',
            }]} />
            
            {deployStep === 1 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <InfoCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                <h3>正在部署模型...</h3>
                <p>正在准备部署环境和资源，请稍候</p>
              </div>
            )}
            
            {deployStep === 2 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                <h3>部署成功!</h3>
                <p>模型已成功部署到指定环境</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Deployment Detail Modal */}
      <Modal
        title="部署详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDeployment && (
          <div>
            <h3>基本信息</h3>
            <Form layout="vertical">
              <Form.Item label="部署名称">
                <Input value={selectedDeployment.deploymentName} readOnly />
              </Form.Item>
              
              <Form.Item label="模型名称">
                <Input value={selectedDeployment.modelName} readOnly />
              </Form.Item>
              
              <Form.Item label="版本">
                <Input value={selectedDeployment.version} readOnly />
              </Form.Item>
              
              <Form.Item label="状态">
                {getStatusTag(selectedDeployment.status)}
              </Form.Item>
              
              <Form.Item label="访问端点">
                <Input value={selectedDeployment.endpoint} readOnly />
              </Form.Item>
              
              <Form.Item label="资源配置">
                <Input value={selectedDeployment.resourceSpec} readOnly />
              </Form.Item>
              
              <Form.Item label="副本数量">
                <Input value={selectedDeployment.replicas.toString()} readOnly />
              </Form.Item>
              
              <Form.Item label="创建时间">
                <Input value={selectedDeployment.createdTime} readOnly />
              </Form.Item>
              
              <Form.Item label="更新时间">
                <Input value={selectedDeployment.updatedTime} readOnly />
              </Form.Item>
            </Form>
            
            <h3 style={{ marginTop: '24px' }}>资源使用情况</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <Card>
                <div style={{ marginBottom: '8px' }}>CPU 使用率</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {selectedDeployment.cpuUsage}%
                </div>
              </Card>
              <Card>
                <div style={{ marginBottom: '8px' }}>内存使用率</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {selectedDeployment.memoryUsage}%
                </div>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModelDeployPage;