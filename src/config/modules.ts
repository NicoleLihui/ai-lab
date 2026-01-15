export type PageStatus = "已具备" | "待开发" | "待优化";

export type ModulePage = {
  key: string;
  name: string;
  description: string;
  status: PageStatus;
  existingPath?: string;
};

export type SecondaryModule = {
  key: string;
  name: string;
  description: string;
  pages: ModulePage[];
};

export type PrimaryCategory = {
  key: string;
  name: string;
  description: string;
  icon?: string;
  modules: SecondaryModule[];
};

// 一级模块 -> 二级模块的树形结构
export const categories: PrimaryCategory[] = [
  {
    key: "model-lab",
    name: "模型实验室",
    description: "实验环境",
    icon: "🧪",
    modules: [
      {
        key: "environment",
        name: "环境配置",
        description: "Notebook / 环境隔离 / 资源挂载",
        pages: [
          {
            key: "notebook-env",
            name: "Notebook 开发环境",
            description: "Python / R 开发镜像与依赖预置",
            status: "待开发"
          },
          {
            key: "env-isolation",
            name: "环境隔离管理",
            description: "Conda / Docker 隔离与模板化",
            status: "待开发"
          },
          {
            key: "resource-mount",
            name: "资源动态挂载",
            description: "GPU、分布式存储动态挂载",
            status: "待开发"
          }
        ]
      },
      {
        key: "training",
        name: "模型训练",
        description: "训练任务创建、执行和监控",
        pages: [
          {
            key: "training-tasks",
            name: "训练任务管理",
            description: "任务创建、执行与监控",
            status: "已具备",
            existingPath: "model-evaluation/model-train/index.vue"
          }
        ]
      },
      {
        key: "evaluation",
        name: "模型评估",
        description: "离线评估 / 模型回测",
        pages: [
          {
            key: "offline-evaluation",
            name: "离线评估",
            description: "模型回测与指标评估",
            status: "已具备",
            existingPath: "model-management/model-backtesting/benefitEvaluation/index.vue"
          },
          {
            key: "benefit-evaluation",
            name: "效益评估",
            description: "业务收益视角回测",
            status: "已具备",
            existingPath: "model-management/model-backtesting/benefitEvaluation/index.vue"
          },
          {
            key: "ml-evaluation",
            name: "机器学习模型评估",
            description: "ML 模型评估与对比",
            status: "已具备",
            existingPath: "model-management/model-backtesting/machineLearningEvaluation/index.vue"
          }
        ]
      },
      {
        key: "backtesting-mgmt",
        name: "回测管理",
        description: "效益 / 机器学习评估管理",
        pages: [
          {
            key: "benefit-management",
            name: "效益评估管理",
            description: "评估任务生命周期管理",
            status: "已具备",
            existingPath: "system-management/system-backtesting/systemBenefitEvaluation/index.vue"
          },
          {
            key: "ml-management",
            name: "机器学习评估管理",
            description: "ML 评估任务统一管理",
            status: "已具备",
            existingPath: "system-management/system-backtesting/systemMachineEvaluation/index.vue"
          }
        ]
      },
      {
        key: "beidou-award",
        name: "北斗奖评估",
        description: "北斗奖评估与对标",
        pages: [
          {
            key: "beidou-benefit",
            name: "北斗奖效益评估",
            description: "行业效益评估",
            status: "已具备",
            existingPath: "model-management/beidou-award/beidouEvaluation/index.vue"
          },
          {
            key: "beidou-ml",
            name: "北斗奖机器学习评估",
            description: "ML 模型评审",
            status: "已具备",
            existingPath: "model-management/beidou-award/machineLearningBeidou/index.vue"
          }
        ]
      },
      {
        key: "model-plaza",
        name: "模型广场",
        description: "预训练模型浏览与在线试用",
        pages: [
          {
            key: "model-plaza",
            name: "模型广场",
            description: "预训练模型浏览与筛选",
            status: "已具备",
            existingPath: "model-management/model-plaza/index.vue"
          },
          {
            key: "model-trial",
            name: "模型在线试用",
            description: "快速体验模型能力",
            status: "已具备",
            existingPath: "model-evaluation/model-ontrial/index.vue"
          },
          {
            key: "model-detail",
            name: "模型详情",
            description: "模型档案、版本、评估结果",
            status: "已具备",
            existingPath: "model-management/model-plaza/detail.vue"
          }
        ]
      },
      {
        key: "agent-dev",
        name: "智能体开发",
        description: "Agent 列表与配置",
        pages: [
          {
            key: "agent-list",
            name: "Agent 开发列表",
            description: "Agent 项目管理",
            status: "待优化",
            existingPath: "model-develop/agent/agent/index.vue"
          },
          {
            key: "agent-detail",
            name: "Agent 详情配置",
            description: "Agent 配置与版本",
            status: "待优化",
            existingPath: "model-management/model-plaza/detail.vue"
          }
        ]
      },
      {
        key: "data-rule-engine",
        name: "数据规则引擎",
        description: "规则模型列表与详情",
        pages: [
          {
            key: "rule-model-list",
            name: "规则模型列表",
            description: "规则模型注册与检索",
            status: "待优化",
            existingPath: "model-management/data-rule-models/index.vue"
          },
          {
            key: "rule-model-detail",
            name: "规则模型详情",
            description: "规则配置与依赖",
            status: "待优化",
            existingPath: "model-management/model-plaza/detail.vue"
          }
        ]
      }
    ]
  },
  {
    key: "model-center",
    name: "模型中心",
    description: "生产环境",
    icon: "🏭",
    modules: [
      {
        key: "model-registry",
        name: "模型库",
        description: "模型库注册与签名",
        pages: [
          {
            key: "registry",
            name: "模型库注册",
            description: "版本化注册，支持 Staging/Prod",
            status: "待开发"
          },
          {
            key: "model-signature",
            name: "模型签名",
            description: "输入输出 Schema 及兼容性检查",
            status: "待开发"
          },
          {
            key: "dependency-pack",
            name: "依赖包管理",
            description: "环境自动打包与依赖版本固定",
            status: "待开发"
          }
        ]
      },
      {
        key: "release-governance",
        name: "模型上线",
        description: "发布审批流与准入检测",
        pages: [
          {
            key: "release-approval",
            name: "发布审批流",
            description: "工作流集成的发布审批",
            status: "已具备",
            existingPath: "backend-management/review-model-release/index.vue"
          },
          {
            key: "admission-check",
            name: "准入检测",
            description: "冒烟测试 / 基准测试准入",
            status: "待开发"
          },
          {
            key: "model-release-review",
            name: "模型发布审核",
            description: "模型发布审核流程",
            status: "已具备",
            existingPath: "backend-management/review-model-release/index.vue"
          },
          {
            key: "model-deploy-review",
            name: "模型部署审核",
            description: "部署变更审核流程",
            status: "已具备",
            existingPath: "backend-management/review-model-deploy/index.vue"
          },
          {
            key: "deploy-ops",
            name: "模型部署管理",
            description: "部署实例运维管理",
            status: "已具备",
            existingPath: "model-evaluation/model-deploy/index.vue"
          }
        ]
      },
      {
        key: "scheduling",
        name: "模型调度",
        description: "定时 / 触发 / API 调度",
        pages: [
          {
            key: "cron-schedule",
            name: "定时调度",
            description: "CRON 周期调度",
            status: "待开发"
          },
          {
            key: "event-trigger",
            name: "任务触发调度",
            description: "事件触发的流水线调度",
            status: "待开发"
          },
          {
            key: "api-trigger",
            name: "API 调度",
            description: "API 触发与编排",
            status: "待开发"
          }
        ]
      },
      {
        key: "monitoring",
        name: "监控与告警",
        description: "性能、漂移、用量与告警",
        pages: [
          {
            key: "performance-monitor",
            name: "服务性能监控",
            description: "QPS / 延迟 / 错误率",
            status: "待开发"
          },
          {
            key: "data-drift",
            name: "数据漂移监控",
            description: "PSI 检测与阈值告警",
            status: "待开发"
          },
          {
            key: "usage-stats",
            name: "调用用量统计",
            description: "调用次数、费用与趋势",
            status: "已具备",
            existingPath: "backend-management/usage-statistics/index.vue"
          },
          {
            key: "alerting",
            name: "告警通知",
            description: "邮件 / 即时通讯告警",
            status: "待开发"
          }
        ]
      }
    ]
  },
  {
    key: "data-platform",
    name: "数据中台",
    description: "数据管理与治理",
    icon: "📊",
    modules: [
      {
        key: "metadata",
        name: "元数据管理",
        description: "元数据、血缘、字典",
        pages: [
          {
            key: "metadata-sync",
            name: "元数据自动采集",
            description: "表结构同步与采集",
            status: "待优化",
            existingPath: "backend-management/data-catalog/metadata-management/index.vue"
          },
          {
            key: "lineage",
            name: "血缘解析",
            description: "字段级 lineage 路径",
            status: "待优化",
            existingPath: "backend-management/data-catalog/metadata-management/index.vue"
          },
          {
            key: "data-dictionary",
            name: "数据字典",
            description: "业务含义映射与搜索",
            status: "待优化",
            existingPath: "backend-management/data-catalog/metadata-management/index.vue"
          }
        ]
      },
      {
        key: "taxonomy",
        name: "数据分类与标签",
        description: "分类体系与标签治理",
        pages: [
          {
            key: "classification",
            name: "数据分类管理",
            description: "数据资产分类编目",
            status: "已具备",
            existingPath: "backend-management/data-catalog/data-classification/index.vue"
          },
          {
            key: "classification-detail",
            name: "数据分类详情",
            description: "分类下数据详情",
            status: "已具备",
            existingPath: "data-sandbox/data-catalog/detail.vue"
          },
          {
            key: "business-topic",
            name: "业务分析主题",
            description: "主题域与指标体系",
            status: "已具备",
            existingPath: "backend-management/data-catalog/business-analysis-topic/index.vue"
          },
          {
            key: "tag-types",
            name: "标签类型管理",
            description: "标签类型建模与分层",
            status: "已具备",
            existingPath: "tag-management/tag-type.vue"
          },
          {
            key: "tag-settings",
            name: "标签设置",
            description: "标签定义与绑定",
            status: "已具备",
            existingPath: "tag-management/tag-set.vue"
          }
        ]
      },
      {
        key: "data-catalog",
        name: "数据资源目录",
        description: "实体、逻辑模型、目录搭建",
        pages: [
          {
            key: "business-entity",
            name: "业务实体管理",
            description: "实体注册与版本管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/business-entity/index.vue"
          },
          {
            key: "logical-model",
            name: "逻辑数据模型",
            description: "逻辑/物理模型管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/logical-data-model/index.vue"
          },
          {
            key: "data-directory-build",
            name: "数据目录搭建",
            description: "数据目录创建与发布",
            status: "已具备",
            existingPath: "data-sandbox/data-catalog/detail.vue"
          },
          {
            key: "report-management",
            name: "报表管理",
            description: "报表资产管理与共享",
            status: "已具备",
            existingPath: "backend-management/data-catalog/reportManagement/index.vue"
          }
        ]
      },
      {
        key: "feature-quality",
        name: "特征库",
        description: "特征库、复用、敏感数据",
        pages: [
          {
            key: "feature-registry",
            name: "特征注册",
            description: "特征入库与版本管理",
            status: "待开发"
          },
          {
            key: "feature-reuse",
            name: "特征复用分析",
            description: "跨项目特征复用洞察",
            status: "待开发"
          }
        ]
      },
      {
        key: "data-quality",
        name: "质量管理",
        description: "规则定义与门禁阻断",
        pages: [
          {
            key: "sensitive-data",
            name: "敏感数据管理",
            description: "敏感字段识别与审批",
            status: "已具备",
            existingPath: "backend-management/sensitive-data/index.vue"
          },
          {
            key: "quality-rule-definition",
            name: "规则定义",
            description: "空值/唯一性等质量规则",
            status: "待开发"
          },
          {
            key: "gatekeeping",
            name: "门禁阻断",
            description: "脏数据拦截与例外管理",
            status: "待开发"
          }
        ]
      }
    ]
  },
  {
    key: "data-sandbox",
    name: "数据沙箱",
    description: "数据申请与探索",
    icon: "🔬",
    modules: [
      {
        key: "sandbox",
        name: "数据集管理",
        description: "数据集申请与审核",
        pages: [
          {
            key: "dataset-apply",
            name: "数据集自助申请",
            description: "资源申请与审批流程",
            status: "已具备",
            existingPath: "data-sandbox/resource-application/index.vue"
          },
          {
            key: "dataset-apply-review",
            name: "数据集申请审核",
            description: "审核列表与批复",
            status: "已具备",
            existingPath: "backend-management/review-dataset-apply/index.vue"
          },
          {
            key: "review-detail",
            name: "审核详情",
            description: "审核记录与批注",
            status: "待优化",
            existingPath: "backend-management/review-management/detail.vue"
          }
        ]
      },
      {
        key: "data-prep",
        name: "数据准备",
        description: "语义加工与我的数据集",
        pages: [
          {
            key: "semantic-processing",
            name: "语义加工",
            description: "拖拽式语义加工",
            status: "待开发"
          },
          {
            key: "my-datasets",
            name: "我的数据集",
            description: "个人持有数据集列表",
            status: "待优化",
            existingPath: "data-sandbox/resource-application/"
          }
        ]
      },
      {
        key: "data-explore",
        name: "数据探查",
        description: "查询、数据集、开放、权限与审计",
        pages: [
          {
            key: "adhoc-query",
            name: "即席查询",
            description: "秒级 SQL 查询",
            status: "待开发"
          },
          {
            key: "sql-history",
            name: "SQL 历史记录",
            description: "查询历史与复用",
            status: "待开发"
          }
        ]
      },
      {
        key: "dataset-plaza",
        name: "数据集广场",
        description: "数据集浏览与开放",
        pages: [
          {
            key: "dataset-plaza",
            name: "数据集广场",
            description: "数据集浏览与筛选",
            status: "已具备",
            existingPath: "data-sandbox/dataset-management/index.vue"
          },
          {
            key: "dataset-detail",
            name: "数据集详情",
            description: "样本预览、字段信息",
            status: "已具备",
            existingPath: "data-sandbox/dataset-management/detail.vue"
          },
          {
            key: "data-open-management",
            name: "数据上架管理",
            description: "上架数据集管理",
            status: "已具备",
            existingPath: "data-sandbox/data-open/index.vue"
          },
          {
            key: "data-open-detail",
            name: "数据上架详情",
            description: "上架详情与审核记录",
            status: "已具备",
            existingPath: "data-sandbox/data-open/detail"
          },
          {
            key: "upload-review",
            name: "数据集上传审核",
            description: "上传提交流程审核",
            status: "已具备",
            existingPath: "backend-management/review-dataset-upload/index.vue"
          },
          {
            key: "data-open-review",
            name: "数据公开审核",
            description: "开放审核与批复",
            status: "已具备",
            existingPath: "backend-management/review-data-open/index.vue"
          },
          {
            key: "topn-preview",
            name: "Top N 采样预览",
            description: "快速采样预览数据",
            status: "待开发"
          },
          {
            key: "permission-apply",
            name: "权限申请",
            description: "权限自助申请与审批",
            status: "已具备",
            existingPath: "data-sandbox/resource-application/"
          }
        ]
      }
    ]
  },
  {
    key: "system",
    name: "系统管理",
    description: "组织、用户、权限与日志",
    icon: "⚙️",
    modules: [
      {
        key: "org-management",
        name: "组织管理",
        description: "组织架构与部门管理",
        pages: [
          {
            key: "org-management",
            name: "组织管理",
            description: "组织架构与部门管理",
            status: "已具备",
            existingPath: "system-management/organization/index.vue"
          }
        ]
      },
      {
        key: "user-management",
        name: "用户管理",
        description: "用户信息与状态管理",
        pages: [
          {
            key: "user-management",
            name: "用户管理",
            description: "用户信息与状态管理",
            status: "已具备",
            existingPath: "system-management/user/index.vue"
          }
        ]
      },
      {
        key: "role-management",
        name: "角色管理",
        description: "角色权限模型管理",
        pages: [
          {
            key: "role-management",
            name: "角色管理",
            description: "角色权限模型管理",
            status: "已具备",
            existingPath: "system-management/role/index.vue"
          },
          {
            key: "user-authorization",
            name: "用户授权",
            description: "授权记录与权限分配",
            status: "已具备",
            existingPath: "system-management/authorizedUser/index.vue"
          }
        ]
      },
      {
        key: "dict-management",
        name: "字典管理",
        description: "数据字典配置",
        pages: [
          {
            key: "dict-management",
            name: "字典管理",
            description: "数据字典配置",
            status: "已具备",
            existingPath: "system-management/dict/index.vue"
          }
        ]
      },
      {
        key: "log-management",
        name: "日志管理",
        description: "登录与操作日志",
        pages: [
          {
            key: "login-log",
            name: "登录日志",
            description: "登录审计与安全监控",
            status: "已具备",
            existingPath: "system-management/loginLog/index.vue"
          },
          {
            key: "operation-log",
            name: "操作日志",
            description: "操作审计与行为追踪",
            status: "已具备",
            existingPath: "system-management/operatLog/index.vue"
          }
        ]
      }
    ]
  }
];

// 向后兼容：扁平化的模块列表（用于旧的路由）
export const modules: SecondaryModule[] = categories.flatMap((category) =>
  category.modules.map((module) => ({
    ...module,
    key: `${category.key}-${module.key}`
  }))
);

// 统计信息
export const totalCategories = categories.length;
export const totalModules = categories.reduce(
  (sum, category) => sum + category.modules.length,
  0
);
export const totalPages = categories.reduce(
  (sum, category) =>
    sum +
    category.modules.reduce((moduleSum, module) => moduleSum + module.pages.length, 0),
  0
);

// 查找函数
export const findCategory = (categoryKey: string) =>
  categories.find((item) => item.key === categoryKey);

export const findModule = (categoryKey: string, moduleKey: string) => {
  const category = findCategory(categoryKey);
  if (!category) return undefined;
  return category.modules.find((module) => module.key === moduleKey);
};

export const findPage = (
  categoryKey: string,
  moduleKey: string,
  pageKey: string
) => {
  const moduleData = findModule(categoryKey, moduleKey);
  if (!moduleData) return undefined;
  return moduleData.pages.find((page) => page.key === pageKey);
};

// 获取关键模块（用于首页快速入口）
export const getKeyModules = () => {
  const trainingModule = findModule("model-lab", "training");
  const agentModule = findModule("model-lab", "agent-dev");
  const ruleEngineModule = findModule("model-lab", "data-rule-engine");
  const monitoringModule = findModule("model-center", "monitoring");
  const dataCatalogModule = findModule("data-platform", "data-catalog");

  return [
    { category: "model-lab", module: trainingModule, name: "模型训练" },
    { category: "model-lab", module: agentModule, name: "智能体开发" },
    { category: "model-lab", module: ruleEngineModule, name: "数据规则引擎" },
    { category: "model-center", module: monitoringModule, name: "监控与告警" },
    { category: "data-platform", module: dataCatalogModule, name: "数据资源目录" }
  ].filter((item) => item.module);
};
