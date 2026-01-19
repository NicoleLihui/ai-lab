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
            key: "environment-config",
            name: "环境配置",
            description: "Notebook 开发环境、环境隔离管理、资源动态挂载",
            status: "待开发"
          }
        ]
      },
      {
        key: "model-development",
        name: "模型开发",
        description: "机器学习模型、智能体模型、数据规则模型",
        pages: [
          {
            key: "machine-learning-models",
            name: "机器学习模型",
            description: "新建、编辑、发布、试用、版本管理和删除模型的列表",
            status: "已具备",
            existingPath: "model-evaluation/model-train/index.vue"
          },
          {
            key: "agent-models",
            name: "智能体模型",
            description: "Agent 开发列表，支持新增、编辑、删除、版本管理、发布",
            status: "待优化",
            existingPath: "model-develop/agent/agent/index.vue"
          },
          {
            key: "data-rule-models",
            name: "数据规则模型",
            description: "支持根据不同的时间维度、水厂维度等，配置数据计算规则",
            status: "待优化",
            existingPath: "model-management/data-rule-models/index.vue"
          }
        ]
      },
      {
        key: "training",
        name: "模型训练",
        description: "训练任务创建、执行和监控",
        pages: [
          {
            key: "model-training",
            name: "模型训练",
            description: "模型训练",
            status: "已具备",
            existingPath: "model-evaluation/model-train/index.vue"
          },
          {
            key: "training-tasks",
            name: "训练任务管理",
            description: "对数据规则模型和机器学习模型的训练任务列表，支持对训练的模型进行部署测试、支持训练结果查看",
            status: "已具备",
            existingPath: "model-evaluation/model-train/index.vue"
          }
        ]
      },
      {
        key: "benefit-evaluation",
        name: "效益评估",
        description: "效益评估、效益评估管理",
        pages: [
          {
            key: "benefit-evaluation",
            name: "效益评估",
            description: "效益评估",
            status: "已具备",
            existingPath: "model-management/model-backtesting/benefitEvaluation/index.vue"
          },
          {
            key: "benefit-evaluation-mgmt",
            name: "效益评估管理",
            description: "效益评估管理",
            status: "已具备",
            existingPath: "model-management/model-backtesting/machineLearningEvaluation/index.vue"
          },
        ]
      },
      {
        key: "ml-evaluation",
        name: "模型评估",
        description: "模型评估、模型评估管理",
        pages: [
          {
            key: "ml-evaluation",
            name: "模型评估",
            description: "模型评估",
            status: "已具备",
            existingPath: "system-management/system-backtesting/systemBenefitEvaluation/index.vue"
          },
          {
            key: "evaluation-mgmt",
            name: "评估管理",
            description: "评估管理",
            status: "已具备",
            existingPath: "system-management/system-backtesting/systemMachineEvaluation/index.vue"
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
            description: "预训练模型浏览、模型在线试用、模型详情页",
            status: "已具备",
            existingPath: "model-management/model-plaza/index.vue"
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
        description: "准入检测、发布审核、部署审核、部署管理",
        pages: [
          {
            key: "admission-check",
            name: "准入检测",
            description: "冒烟测试 / 基准测试",
            status: "待开发"
          },
          {
            key: "model-release-review",
            name: "模型发布审核",
            description: "模型发布审核",
            status: "已具备",
            existingPath: "backend-management/review-model-release/index.vue"
          },
          {
            key: "model-deploy-review",
            name: "模型部署审核",
            description: "模型部署审核",
            status: "已具备",
            existingPath: "backend-management/review-model-deploy/index.vue"
          },
          {
            key: "deploy-ops",
            name: "模型部署管理",
            description: "模型部署管理",
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
        name: "模型监控",
        description: "性能监控、数据漂移监控、模型用量统计、告警通知",
        pages: [
          {
            key: "performance-monitor",
            name: "性能监控",
            description: "服务性能监控（QPS / 延迟 / 错误率）",
            status: "待开发"
          },
          {
            key: "data-drift",
            name: "数据漂移监控",
            description: "PSI 检测",
            status: "待开发"
          },
          {
            key: "usage-stats",
            name: "模型用量统计",
            description: "模型调用用量统计",
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
        description: "数据列表、数据字典",
        pages: [
          {
            key: "metadata-list",
            name: "数据列表",
            description: "自动采集（表结构同步）、血缘解析（数据追踪）",
            status: "待优化",
            existingPath: "backend-management/data-catalog/metadata-management/index.vue"
          },
          {
            key: "data-dictionary",
            name: "数据字典",
            description: "数据字典（业务含义映射）",
            status: "待优化"
          }
        ]
      },
      {
        key: "tag-management",
        name: "标签管理",
        description: "标签类型管理、标签设置",
        pages: [
          {
            key: "tag-types",
            name: "标签类型管理",
            description: "标签类型管理",
            status: "已具备",
            existingPath: "tag-management/tag-type.vue"
          },
          {
            key: "tag-settings",
            name: "标签设置",
            description: "标签设置",
            status: "已具备",
            existingPath: "tag-management/tag-set.vue"
          }
        ]
      },
      {
        key: "data-catalog",
        name: "数据资源目录",
        description: "业务实体、逻辑模型、数据目录、数据分类、业务分析主题、报表",
        pages: [
          {
            key: "business-entity",
            name: "业务实体管理",
            description: "业务实体管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/business-entity/index.vue"
          },
          {
            key: "logical-model",
            name: "逻辑数据模型管理",
            description: "逻辑数据模型管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/logical-data-model/index.vue"
          },
          {
            key: "data-directory-build",
            name: "数据目录搭建",
            description: "数据目录搭建",
            status: "已具备",
            existingPath: "data-sandbox/data-catalog/detail.vue"
          },
          {
            key: "classification",
            name: "数据分类管理",
            description: "数据分类管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/data-classification/index.vue"
          },
          {
            key: "classification-detail",
            name: "数据分类详情",
            description: "数据分类详情",
            status: "已具备",
            existingPath: "data-sandbox/data-catalog/detail.vue"
          },
          {
            key: "business-topic",
            name: "业务分析主题管理",
            description: "业务分析主题管理",
            status: "已具备",
            existingPath: "backend-management/data-catalog/business-analysis-topic/index.vue"
          },
          {
            key: "report-management",
            name: "报表管理",
            description: "报表管理",
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
        description: "敏感数据管理、数据规则",
        pages: [
          {
            key: "sensitive-data",
            name: "敏感数据管理",
            description: "敏感数据管理",
            status: "已具备",
            existingPath: "backend-management/sensitive-data/index.vue"
          },
          {
            key: "data-rules",
            name: "数据规则",
            description: "规则定义（空值 / 唯一性检查）、门禁阻断（脏数据拦截）",
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
        key: "dataset-management",
        name: "数据集管理",
        description: "数据集列表、数据集详情、数据集审核、数据集上传审核、数据公开审核",
        pages: [
          {
            key: "dataset-list",
            name: "数据集列表",
            description: "调用工作流申请数据集、数据集的审核、数据集查看详情、数据集状态（审批中、已通过、被驳回）",
            status: "已具备",
            existingPath: "data-sandbox/resource-application/index.vue"
          },
          {
            key: "dataset-detail",
            name: "数据集详情",
            description: "支持数据探查，数据集详情查看",
            status: "已具备",
            existingPath: "backend-management/review-dataset-apply/index.vue"
          },
          {
            key: "dataset-review",
            name: "数据集审核",
            description: "审核详情页，审核、工作流详情查看",
            status: "待优化",
            existingPath: "backend-management/review-management/detail.vue"
          },
          {
            key: "upload-review",
            name: "数据集上传审核",
            description: "数据集上传审核",
            status: "已具备",
            existingPath: "backend-management/review-dataset-upload/index.vue"
          },
          {
            key: "data-open-review",
            name: "数据公开审核",
            description: "数据公开审核",
            status: "已具备",
            existingPath: "backend-management/review-data-open/index.vue"
          }
        ]
      },
      {
        key: "semantic-processing",
        name: "语义加工",
        description: "语义加工（拖拽式处理）",
        pages: [
          {
            key: "semantic-processing",
            name: "语义加工",
            description: "语义加工（拖拽式处理）",
            status: "待开发"
          }
        ]
      },
      {
        key: "my-datasets",
        name: "我的数据集",
        description: "我的数据集，支持未申请的数据集的增删改查",
        pages: [
          {
            key: "my-datasets",
            name: "我的数据集",
            description: "我的数据集，支持未申请的数据集的增删改查",
            status: "待开发"
          }
        ]
      },
      {
        key: "data-explore",
        name: "数据探查",
        description: "即席查询、SQL 历史记录",
        pages: [
          {
            key: "adhoc-query",
            name: "即席查询",
            description: "即席查询（秒级查询）",
            status: "待开发"
          },
          {
            key: "sql-history",
            name: "SQL 历史记录",
            description: "SQL 历史记录",
            status: "待开发"
          }
        ]
      },
      {
        key: "dataset-plaza",
        name: "数据集广场",
        description: "数据集浏览、数据集详情、权限申请、数据公开、Top N 数据采样预览",
        pages: [
          {
            key: "dataset-plaza",
            name: "数据集",
            description: "数据集浏览",
            status: "已具备",
            existingPath: "data-sandbox/dataset-management/index.vue"
          },
          {
            key: "dataset-detail-plaza",
            name: "数据集详情",
            description: "数据集详情",
            status: "已具备",
            existingPath: "data-sandbox/dataset-management/detail.vue"
          },
          {
            key: "permission-apply",
            name: "权限申请",
            description: "权限申请",
            status: "待开发"
          },
          {
            key: "data-open-management",
            name: "数据上架管理",
            description: "数据上架管理",
            status: "已具备",
            existingPath: "data-sandbox/data-open/index.vue"
          },
          {
            key: "data-open-detail",
            name: "数据上架详情",
            description: "数据上架详情",
            status: "已具备",
            existingPath: "data-sandbox/data-open/detail"
          },
          {
            key: "topn-preview",
            name: "Top N 数据采样预览",
            description: "Top N 数据采样预览",
            status: "待开发"
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
  const modelDevelopmentModule = findModule("model-lab", "model-development");
  const monitoringModule = findModule("model-center", "monitoring");
  const dataCatalogModule = findModule("data-platform", "data-catalog");

  return [
    { category: "model-lab", module: trainingModule, name: "模型训练" },
    { category: "model-lab", module: modelDevelopmentModule, name: "模型开发" },
    { category: "model-center", module: monitoringModule, name: "模型监控" },
    { category: "data-platform", module: dataCatalogModule, name: "数据资源目录" }
  ].filter((item) => item.module);
};
