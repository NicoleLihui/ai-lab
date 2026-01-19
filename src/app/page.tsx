'use client';

import { Card, Row, Col, Space, Typography, Divider } from 'antd';
import Link from 'next/link';
import { BarChartOutlined, CloudSyncOutlined, DatabaseOutlined, TeamOutlined, ApiOutlined, ControlOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HomePage = () => {
  const categories = [
    {
      key: 'model-lab',
      title: '模型实验室',
      description: '实验环境 - 提供模型训练、评估、部署等功能',
      icon: <BarChartOutlined style={{ fontSize: '24px' }} />,
      color: '#1890ff',
      modules: [
        { name: '模型训练', path: '/categories/model-lab/training/training-tasks', desc: '训练任务创建、执行和监控' },
        { name: '模型评估', path: '/categories/model-lab/benefit-evaluation/benefit-evaluation', desc: '离线评估 / 模型回测' },
        { name: '模型广场', path: '/categories/model-lab/model-plaza/model-plaza', desc: '预训练模型浏览与在线试用' },
        { name: '模型开发', path: '/categories/model-lab/model-development/machine-learning-models', desc: '机器学习模型、智能体模型、数据规则模型' },
      ]
    },
    {
      key: 'model-center',
      title: '模型中心',
      description: '生产环境 - 提供模型库、上线、调度和监控功能',
      icon: <DashboardOutlined style={{ fontSize: '24px' }} />,
      color: '#52c41a',
      modules: [
        { name: '模型库', path: '/categories/model-center/model-registry/registry', desc: '模型库注册与签名' },
        { name: '模型上线', path: '/categories/model-center/release-governance/model-release-review', desc: '发布审批流与准入检测' },
        { name: '模型调度', path: '/categories/model-center/scheduling/cron-schedule', desc: '定时 / 触发 / API 调度' },
        { name: '模型监控', path: '/categories/model-center/monitoring/usage-stats', desc: '性能、漂移、用量与告警' },
      ]
    },
    {
      key: 'data-platform',
      title: '数据中台',
      description: '数据管理与治理平台',
      icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
      color: '#722ed1',
      modules: [
        { name: '元数据管理', path: '/categories/data-platform/metadata/metadata-list', desc: '元数据、血缘、字典' },
        { name: '标签管理', path: '/categories/data-platform/tag-management/tag-types', desc: '标签类型管理、标签设置' },
        { name: '数据资源目录', path: '/categories/data-platform/data-catalog/business-entity', desc: '实体、逻辑模型、目录搭建' },
        { name: '质量管理', path: '/categories/data-platform/data-quality/sensitive-data', desc: '规则定义与门禁阻断' },
      ]
    },
    {
      key: 'system',
      title: '系统管理',
      description: '组织、用户、权限与日志管理',
      icon: <SettingOutlined style={{ fontSize: '24px' }} />,
      color: '#fa8c16',
      modules: [
        { name: '组织管理', path: '/categories/system/org-management/org-management', desc: '组织架构与部门管理' },
        { name: '用户管理', path: '/categories/system/user-management/user-management', desc: '用户信息与状态管理' },
        { name: '角色管理', path: '/categories/system/role-management/role-management', desc: '角色权限模型管理' },
        { name: '日志管理', path: '/categories/system/log-management/login-log', desc: '登录与操作日志' },
      ]
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '16px' }}>企业模型实验室系统</Title>
        <Text type="secondary">一站式模型开发、训练、评估、部署和管理平台</Text>
      </div>

      {categories.map((category) => (
        <div key={category.key} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: `${category.color}20`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              {category.icon}
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>{category.title}</Title>
              <Text type="secondary">{category.description}</Text>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            {category.modules.map((module, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Link href={module.path as any} style={{ textDecoration: 'none' }}>
                  <Card 
                    hoverable
                    style={{ 
                      height: '100%',
                      borderLeft: `4px solid ${category.color}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div>
                      <Title level={4} style={{ margin: 0, fontSize: '16px', color: category.color }}>{module.name}</Title>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                        {module.desc}
                      </Text>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <Divider style={{ margin: '32px 0' }} />

      <div style={{ textAlign: 'center', padding: '24px' }}>
        <Title level={4}>快速开始</Title>
        <Space direction="vertical" size="middle">
          <Text>1. 从上方分类中选择适合的功能模块</Text>
          <Text>2. 进入相应页面开始模型开发工作</Text>
          <Text>3. 利用平台提供的完整工具链提升效率</Text>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;