'use client';

import { Card, Row, Col, Space, Typography, Divider } from 'antd';
import Link from 'next/link';
import { BarChartOutlined, CloudSyncOutlined, DatabaseOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ModelLabHomePage = () => {
  const modules = [
    {
      key: 'training',
      title: '模型训练',
      description: '训练任务创建、执行和监控',
      icon: <BarChartOutlined style={{ fontSize: '24px' }} />,
      path: '/modules/model-lab/model-train',
      color: '#1890ff'
    },
    {
      key: 'evaluation',
      title: '模型评估',
      description: '离线评估 / 模型回测',
      icon: <CloudSyncOutlined style={{ fontSize: '24px' }} />,
      path: '/modules/model-lab/model-evaluation',
      color: '#52c41a'
    },
    {
      key: 'plaza',
      title: '模型广场',
      description: '预训练模型浏览与在线试用',
      icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
      path: '/modules/model-lab/model-plaza',
      color: '#722ed1'
    },
    {
      key: 'agent-dev',
      title: '智能体开发',
      description: 'Agent 列表与配置',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      path: '/modules/model-lab/agent-dev',
      color: '#fa8c16'
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>模型实验室</Title>
        <Text type="secondary">实验环境 - 提供模型训练、评估、部署等功能</Text>
        
        <Divider style={{ margin: '24px 0' }} />
        
        <Row gutter={[24, 24]}>
          {modules.map((module) => (
            <Col xs={24} sm={12} md={8} lg={6} key={module.key}>
              <Link href={module.path as any} style={{ textDecoration: 'none' }}>
                <Card 
                  hoverable
                  style={{ 
                    height: '160px',
                    borderLeft: `4px solid ${module.color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: `${module.color}20`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      {module.icon}
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, fontSize: '16px' }}>{module.title}</Title>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{module.description}</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        
        <Divider style={{ margin: '32px 0' }} />
        
        <div>
          <Title level={4}>快速入门</Title>
          <Space direction="vertical" size="middle">
            <Text>1. 从左侧导航菜单选择功能模块</Text>
            <Text>2. 或点击上方卡片进入相应功能页面</Text>
            <Text>3. 开始您的模型开发之旅</Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ModelLabHomePage;