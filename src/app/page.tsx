'use client';

import Link from 'next/link';
import { 
  BarChartOutlined, 
  CloudSyncOutlined, 
  DatabaseOutlined, 
  TeamOutlined, 
  ApiOutlined, 
  ControlOutlined, 
  SettingOutlined, 
  DashboardOutlined 
} from '@ant-design/icons';

const HomePage = () => {
  const categories = [
    {
      key: 'model-lab',
      title: '模型实验室',
      description: '实验环境 - 提供模型训练、评估、部署等功能',
      icon: BarChartOutlined,
      modules: [
        { name: '模型训练', path: '/categories/model-lab/training/training-tasks', desc: '训练任务创建、执行和监控' },
        { name: '模型评估', path: '/categories/model-lab/benefit-evaluation/benefit-evaluation', desc: '离线评估 / 模型回测' },
        { name: '模型广场', path: '/categories/model-lab/model-plaza/model-plaza', desc: '预训练模型浏览与在线试用' },
        { name: '模型开发', path: '/categories/model-lab/model-development/machine-learning-models', desc: '机器学习模型、智能体模型、数据规则模型' },
        { name: '模型上线', path: '/categories/model-lab/release-governance/model-release-review', desc: '发布审批流与准入检测' },
      ]
    },
    {
      key: 'model-center',
      title: '模型中心',
      description: '生产环境 - 提供模型库、上线、调度和监控功能',
      icon: DashboardOutlined,
      modules: [
        { name: '模型库', path: '/categories/model-center/model-registry/model-registry', desc: '已部署到生产环境的模型库' },
        { name: '模型调度', path: '/categories/model-center/scheduling/cron-schedule', desc: '定时 / 触发 / API 调度' },
        { name: '模型监控', path: '/categories/model-center/monitoring/performance-monitor', desc: '性能、漂移、用量与告警' },
      ]
    },
    {
      key: 'data-platform',
      title: '数据中台',
      description: '数据管理与治理平台',
      icon: DatabaseOutlined,
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
      icon: SettingOutlined,
      modules: [
        { name: '组织管理', path: '/categories/system/org-management/org-management', desc: '组织架构与部门管理' },
        { name: '用户管理', path: '/categories/system/user-management/user-management', desc: '用户信息与状态管理' },
        { name: '角色管理', path: '/categories/system/role-management/role-management', desc: '角色权限模型管理' },
        { name: '日志管理', path: '/categories/system/log-management/login-log', desc: '登录与操作日志' },
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center mb-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          模型实验室
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          一站式模型开发、训练、评估、部署和管理平台
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>企业级 AI 实验舱</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-16 mb-20">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.key} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-start gap-4 pb-2">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <IconComponent className="text-2xl" />
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.modules.map((module, index) => (
                  <Link
                    key={index}
                    href={module.path as any}
                    className="group relative block"
                  >
                    <div className="h-full p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1.5">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                          {module.name}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {module.desc}
                        </p>
                      </div>
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;