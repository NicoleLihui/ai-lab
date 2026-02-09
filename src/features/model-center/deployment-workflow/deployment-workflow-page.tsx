/**
 * 模型部署上线流程页面
 * 功能：模型从开发到生产的完整部署流程管理
 * 包含：流程配置、审批、执行和监控
 */

import React from 'react';
import Link from 'next/link';

// 工作流步骤类型定义
interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

// 工作流类型定义
interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: WorkflowStep[];
}

// 定义所有工作流
const workflows: Workflow[] = [
  {
    id: 'deployment',
    title: '模型部署上线流程',
    description: '模型从开发到生产的完整部署流程管理',
    icon: '🚀',
    steps: [
      {
        id: 1,
        title: '模型开发',
        description: '创建、训练和优化机器学习模型，定义模型参数和评估指标',
        icon: '🔧',
        color: 'bg-blue-500',
        path: '/categories/model-lab/model-development/machine-learning-models'
      },
      {
        id: 2,
        title: '模型评估',
        description: '对模型进行效益评估和性能测试，验证模型效果',
        icon: '📊',
        color: 'bg-purple-500',
        path: '/categories/model-lab/benefit-evaluation/benefit-evaluation'
      },
      {
        id: 3,
        title: '模型部署',
        description: '将模型部署到测试/生产环境，进行准入检测和审批',
        icon: '🚀',
        color: 'bg-orange-500',
        path: '/categories/model-lab/release-governance/model-deploy-review'
      },
      {
        id: 4,
        title: '模型入库',
        description: '通过审批的模型进入模型库，进行版本管理和归档',
        icon: '📦',
        color: 'bg-green-500',
        path: '/categories/model-center/model-registry/model-registry'
      },
      {
        id: 5,
        title: '调度管理',
        description: '配置定时任务、触发规则和API调度，实现模型自动化运行',
        icon: '⏰',
        color: 'bg-indigo-500',
        path: '/categories/model-center/scheduling/cron-schedule'
      }
    ]
  },
  {
    id: 'invocation',
    title: '模型调用服务流程',
    description: '模型服务化调用的完整流程管理',
    icon: '🔌',
    steps: [
      {
        id: 1,
        title: '模型获取',
        description: '从模型库中获取已部署的模型服务，支持多版本管理',
        icon: '📥',
        color: 'bg-cyan-500',
        path: '/categories/model-center/scheduling/cron-schedule'
      },
      {
        id: 2,
        title: '参数配置',
        description: '配置模型调用参数、输入输出格式和推理设置',
        icon: '⚙️',
        color: 'bg-teal-500',
        path: '/categories/model-center/scheduling/cron-schedule'
      },
      {
        id: 3,
        title: '数据拉取',
        description: '拉取待推理数据，支持批量导入和实时流式接入',
        icon: '📊',
        color: 'bg-emerald-500',
        path: '/categories/model-center/scheduling/cron-schedule'
      },
      {
        id: 4,
        title: '运行监控',
        description: '监控模型运行状态、性能指标和异常情况，实现实时告警',
        icon: '📈',
        color: 'bg-lime-500',
        path: '/categories/model-center/scheduling/cron-schedule'
      }
    ]
  }
];

export function DeploymentWorkflowPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <Link
          href="/categories/model-center/deployment-workflow/deployment-workflow"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-200 inline-flex items-center gap-2">
            模型工作流管理
            <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </h1>
        </Link>
        <p className="text-sm text-muted-foreground">
          管理模型从开发到部署、调用的完整工作流程
        </p>
      </div>

      {/* 渲染所有工作流 */}
      {workflows.map((workflow) => (
        <div key={workflow.id} className="rounded-xl bg-card p-8 shadow-sm border border-border">
          {/* 工作流标题 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-md">
              {workflow.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{workflow.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{workflow.description}</p>
            </div>
          </div>

          {/* 横向流程图（桌面端） */}
          <div className="hidden lg:block">
            <div className="flex items-stretch justify-between gap-4">
              {workflow.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex-1 group">
                    <Link
                      href={step.path as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {/* 步骤卡片 */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer h-full flex flex-col">
                        {/* 序号和标题在同一行 */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-9 h-9 ${step.color} rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
                            {step.id}
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                        </div>
                        {/* 描述 */}
                        <p className="text-xs text-slate-600 leading-relaxed flex-1">{step.description}</p>
                      </div>
                    </Link>
                  </div>

                  {/* 箭头 */}
                  {index < workflow.steps.length - 1 && (
                    <div className="flex items-center justify-center px-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 纵向流程图（移动端/平板端） */}
          <div className="lg:hidden space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="relative group">
                <Link
                  href={step.path as any}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* 步骤卡片 */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    {/* 序号和标题在同一行 */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md shrink-0`}>
                        {step.id}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    </div>
                    {/* 描述 */}
                    <p className="text-sm text-slate-600 leading-relaxed pl-13">{step.description}</p>
                  </div>
                </Link>

                {/* 连接箭头 */}
                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center py-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
