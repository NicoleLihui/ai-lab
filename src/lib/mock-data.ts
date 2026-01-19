// Mock data for model training page
export const mockTrainingTasks = [
  {
    id: 1,
    taskName: "销售预测模型训练",
    modelName: "Sales Prediction Model",
    version: "v1.2.0",
    modelType: "机器学习",
    developLanguage: "Python",
    statusName: "已完成",
    trainTime: 1250,
    deployTestStatus: 1,
    evaluateIndexData: { accuracy: 0.92, precision: 0.88, recall: 0.91 },
    createTime: "2024-01-15 10:30:00"
  },
  {
    id: 2,
    taskName: "客户流失预测",
    modelName: "Churn Prediction Model",
    version: "v2.1.0",
    modelType: "深度学习",
    developLanguage: "Python",
    statusName: "训练中",
    trainTime: 2400,
    deployTestStatus: 0,
    evaluateIndexData: { accuracy: 0.85, precision: 0.82, recall: 0.87 },
    createTime: "2024-01-14 14:20:00"
  },
  {
    id: 3,
    taskName: "推荐算法优化",
    modelName: "Recommendation Algorithm",
    version: "v3.0.1",
    modelType: "机器学习",
    developLanguage: "R",
    statusName: "失败",
    trainTime: 0,
    deployTestStatus: 0,
    evaluateIndexData: { accuracy: 0.0, precision: 0.0, recall: 0.0 },
    createTime: "2024-01-13 09:15:00"
  }
];

// Mock data for model plaza page
export const mockModels = [
  {
    id: 1,
    name: "销售预测模型",
    modelName: "Sales Prediction Model",
    description: "基于历史销售数据预测未来销售额",
    version: "v1.2.0",
    modelType: "机器学习",
    statusName: "启用",
    createTime: "2024-01-10",
    orgName: "数据分析部"
  },
  {
    id: 2,
    name: "客户分群模型",
    modelName: "Customer Segmentation Model",
    description: "根据客户行为特征进行分群",
    version: "v2.0.0",
    modelType: "聚类",
    statusName: "启用",
    createTime: "2024-01-08",
    orgName: "市场部"
  },
  {
    id: 3,
    name: "欺诈检测模型",
    modelName: "Fraud Detection Model",
    description: "实时检测潜在的欺诈交易",
    version: "v1.5.0",
    modelType: "深度学习",
    statusName: "禁用",
    createTime: "2024-01-05",
    orgName: "风控部"
  }
];

// Mock data for user management page
export const mockUsers = [
  {
    id: 1,
    name: "张三",
    username: "zhangsan",
    employeeNo: "E001",
    orgName: "技术部",
    title: "高级工程师",
    roles: [{ name: "管理员" }, { name: "开发者" }],
    status: 1,
    source: 1
  },
  {
    id: 2,
    name: "李四",
    username: "lisi",
    employeeNo: "E002",
    orgName: "市场部",
    title: "产品经理",
    roles: [{ name: "普通用户" }],
    status: 1,
    source: 1
  },
  {
    id: 3,
    name: "王五",
    username: "wangwu",
    employeeNo: "E003",
    orgName: "财务部",
    title: "财务主管",
    roles: [{ name: "审计员" }],
    status: 0,
    source: 2
  }
];

// Mock data for organization tree
export const mockOrgTree = [
  {
    orgId: 1,
    name: "总部",
    children: [
      {
        orgId: 2,
        name: "技术部",
        children: [
          { orgId: 4, name: "前端组", children: [] },
          { orgId: 5, name: "后端组", children: [] }
        ]
      },
      {
        orgId: 3,
        name: "市场部",
        children: [
          { orgId: 6, name: "推广组", children: [] },
          { orgId: 7, name: "运营组", children: [] }
        ]
      }
    ]
  }
];

// Mock data for model evaluation
export const mockEvaluationData = [
  {
    id: 1,
    modelName: "销售预测模型",
    scenario: "电商销售",
    evaluator: "系统评估",
    evaluationTime: "2024-01-15",
    status: "通过",
    metrics: { accuracy: 0.92, precision: 0.88, recall: 0.91, f1_score: 0.89 }
  },
  {
    id: 2,
    modelName: "客户流失模型",
    scenario: "电信客户",
    evaluator: "人工评估",
    evaluationTime: "2024-01-14",
    status: "待评估",
    metrics: {}
  }
];