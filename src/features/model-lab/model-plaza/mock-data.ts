// 模型广场 Mock 数据

export interface ModelInfo {
  id: string;
  modelId?: string;
  modelName: string;
  name?: string;
  modelType: string;
  version: string;
  statusName: string;
  description?: string;
  createTime: string;
  orgName?: string;
  applicableScenarioStr?: string;
  releaseStatus?: number;
  tags?: string[];
}

// Mock 模型数据
export const mockModelList: ModelInfo[] = [
  {
    id: "model-1",
    modelId: "MLModel-001",
    modelName: "金刚钻-015-污水厂核心单元自适应系统",
    name: "金刚钻-015-污水厂核心单元自适应系统",
    modelType: "机器学习-时序序列",
    version: "V001",
    statusName: "已发布",
    description: "采用卷积神经网络，实现污水厂核心单元的自适应控制",
    createTime: "2024-12-19 09:17:25",
    orgName: "技术部",
    applicableScenarioStr: "A2O工艺,氧化沟工艺",
    releaseStatus: 2,
    tags: ["污水处理", "自适应控制", "时序预测"]
  },
  {
    id: "model-2",
    modelId: "MLModel-002",
    modelName: "金助手-006-基于复合时间序列模型（CLA）的水质预警",
    name: "金助手-006-基于复合时间序列模型（CLA）的水质预警",
    modelType: "机器学习-时序序列",
    version: "V001",
    statusName: "已发布",
    description: "应用 CNN-LSTM-Attention 复合模型结构，实现水质预警",
    createTime: "2024-12-19 09:07:09",
    orgName: "研发部",
    applicableScenarioStr: "无特定场景",
    releaseStatus: 2,
    tags: ["水质预警", "时间序列", "深度学习"]
  },
  {
    id: "model-3",
    modelId: "MLModel-003",
    modelName: "时序数据预测模型",
    name: "时序数据预测模型",
    modelType: "机器学习-回归",
    version: "V001",
    statusName: "已发布",
    description: "用于预测时间序列数据的趋势和周期性变化",
    createTime: "2024-12-15 16:44:17",
    orgName: "数据部",
    applicableScenarioStr: "A2O工艺,氧化沟工艺",
    releaseStatus: 2,
    tags: ["时序预测", "回归分析"]
  },
  {
    id: "model-4",
    modelId: "MLModel-004",
    modelName: "提升系统-进水提升系统成本",
    name: "提升系统-进水提升系统成本",
    modelType: "数据规则",
    version: "V001",
    statusName: "已发布",
    description: "经济效益评价模型",
    createTime: "2024-12-15 14:28:07",
    orgName: "运营部",
    applicableScenarioStr: "其他",
    releaseStatus: 2,
    tags: ["成本分析", "经济效益"]
  },
  {
    id: "model-5",
    modelId: "MLModel-005",
    modelName: "预测性维护电流路线",
    name: "预测性维护电流路线",
    modelType: "机器学习-回归",
    version: "V001",
    statusName: "已发布",
    description: "预测性维护电流路线分析模型",
    createTime: "2024-12-11 18:52:50",
    orgName: "维护部",
    applicableScenarioStr: "曝气风机,DO溶解氧仪,刮泥机",
    releaseStatus: 2,
    tags: ["预测性维护", "设备管理"]
  },
  {
    id: "model-6",
    modelId: "MLModel-006",
    modelName: "随机森林模型",
    name: "随机森林模型",
    modelType: "机器学习-回归",
    version: "V001",
    statusName: "已发布",
    description: "基于随机森林算法的回归模型",
    createTime: "2024-11-12 15:25:35",
    orgName: "算法部",
    applicableScenarioStr: "A2O工艺",
    releaseStatus: 2,
    tags: ["随机森林", "回归"]
  },
  {
    id: "model-7",
    modelId: "MLModel-007",
    modelName: "NLP文本分类模型",
    name: "NLP文本分类模型",
    modelType: "机器学习-分类",
    version: "V1.2.0",
    statusName: "已发布",
    description: "基于深度学习的文本分类模型，适用于多类别文本分类任务",
    createTime: "2024-06-15 10:00:00",
    orgName: "AI研发组",
    applicableScenarioStr: "自然语言处理",
    releaseStatus: 2,
    tags: ["自然语言处理", "文本分类", "深度学习"]
  },
  {
    id: "model-8",
    modelId: "MLModel-008",
    modelName: "图像识别模型",
    name: "图像识别模型",
    modelType: "深度学习",
    version: "V2.1.0",
    statusName: "已发布",
    description: "基于CNN的图像识别模型，准确率达到95%",
    createTime: "2024-06-14 14:30:00",
    orgName: "视觉组",
    applicableScenarioStr: "计算机视觉",
    releaseStatus: 2,
    tags: ["计算机视觉", "图像识别", "CNN"]
  },
  {
    id: "model-9",
    modelId: "MLModel-009",
    modelName: "情感分析模型",
    name: "情感分析模型",
    modelType: "深度学习",
    version: "V1.1.2",
    statusName: "已发布",
    description: "分析文本中的情感倾向，支持多种情感类别",
    createTime: "2024-06-10 09:15:00",
    orgName: "NLP组",
    applicableScenarioStr: "自然语言处理",
    releaseStatus: 2,
    tags: ["自然语言处理", "情感分析"]
  },
  {
    id: "model-10",
    modelId: "MLModel-010",
    modelName: "推荐系统模型",
    name: "推荐系统模型",
    modelType: "机器学习",
    version: "V2.0.1",
    statusName: "已发布",
    description: "基于协同过滤和内容推荐的混合推荐算法",
    createTime: "2024-06-12 11:20:00",
    orgName: "推荐组",
    applicableScenarioStr: "推荐系统",
    releaseStatus: 2,
    tags: ["推荐系统", "协同过滤"]
  }
];

// 模型类型选项
export const modelTypeOptions = [
  { label: "机器学习-时序序列", value: "机器学习-时序序列" },
  { label: "机器学习-回归", value: "机器学习-回归" },
  { label: "机器学习-分类", value: "机器学习-分类" },
  { label: "深度学习", value: "深度学习" },
  { label: "数据规则", value: "数据规则" },
];

// 组织树 Mock 数据
export interface OrgTreeNode {
  orgId: number | string;
  name: string;
  children?: OrgTreeNode[];
}

export const mockOrgTreeData: OrgTreeNode[] = [
  {
    orgId: 1,
    name: "技术部",
    children: [
      {
        orgId: 11,
        name: "AI研发组",
      },
      {
        orgId: 12,
        name: "数据工程组",
      }
    ]
  },
  {
    orgId: 2,
    name: "研发部",
    children: [
      {
        orgId: 21,
        name: "算法组",
      }
    ]
  },
  {
    orgId: 3,
    name: "数据部",
  },
  {
    orgId: 4,
    name: "运营部",
  },
  {
    orgId: 5,
    name: "维护部",
  },
  {
    orgId: 6,
    name: "算法部",
  }
];

// 标签 Mock 数据
export interface TagInfo {
  id: number;
  tagName: string;
}

export const mockTags: TagInfo[] = [
  { id: 1, tagName: "污水处理" },
  { id: 2, tagName: "水质预警" },
  { id: 3, tagName: "时序预测" },
  { id: 4, tagName: "自然语言处理" },
  { id: 5, tagName: "计算机视觉" },
  { id: 6, tagName: "推荐系统" },
  { id: 7, tagName: "预测性维护" },
  { id: 8, tagName: "成本分析" },
];

// 模型详情数据接口
export interface ModelDetailInfo extends ModelInfo {
  owner?: string;
  creator?: string;
  updateTime?: string;
  notes?: string;
  developLanguage?: string;
  paramInList?: ModelParam[];
  paramOutList?: ModelParam[];
  evaluations?: ModelEvaluation[];
  relatedDatasets?: RelatedDataset[];
  modelTypeNum?: number; // 1: 机器学习, 2: 智能体, 3: 数据规则
}

// 模型参数
export interface ModelParam {
  id: string;
  paramName: string;
  paramDesc: string;
  unit: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

// 模型评价
export interface ModelEvaluation {
  id: string;
  evaluator: string;
  score: number;
  comment: string;
  createTime: string;
  metrics?: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
  };
}

// 关联数据集
export interface RelatedDataset {
  id: string;
  name: string;
  type: string;
  description: string;
  createTime: string;
}

// 获取模型详情的 Mock 函数
export function getModelDetailById(modelId: string): ModelDetailInfo | null {
  const baseModel = mockModelList.find(m => m.id === modelId);
  if (!baseModel) return null;

  // 根据模型类型生成不同的详情数据
  const detailMap: Record<string, Partial<ModelDetailInfo>> = {
    "model-1": {
      owner: "张三",
      creator: "张三",
      updateTime: "2024-12-20 10:30:00",
      notes: "本模型采用卷积神经网络（CNN）架构，结合时序序列分析技术，实现对污水厂核心单元的自适应控制。模型能够根据实时水质数据自动调整运行参数，提高处理效率并降低能耗。\n\n## 技术特点\n- 采用深度卷积神经网络提取特征\n- 支持多变量时序数据输入\n- 自适应参数调整机制\n- 实时监控与预警功能",
      developLanguage: "Python",
      modelTypeNum: 1,
      paramInList: [
        { id: "1", paramName: "进水流量", paramDesc: "inflow_rate", unit: "m³/h", dataType: "float", required: true, description: "污水厂进水流量" },
        { id: "2", paramName: "COD浓度", paramDesc: "cod_concentration", unit: "mg/L", dataType: "float", required: true, description: "化学需氧量浓度" },
        { id: "3", paramName: "NH3-N浓度", paramDesc: "nh3n_concentration", unit: "mg/L", dataType: "float", required: true, description: "氨氮浓度" },
        { id: "4", paramName: "温度", paramDesc: "temperature", unit: "℃", dataType: "float", required: false, defaultValue: "20", description: "水温" },
      ],
      paramOutList: [
        { id: "1", paramName: "曝气量", paramDesc: "aeration_volume", unit: "m³/h", dataType: "float", required: true, description: "建议曝气量" },
        { id: "2", paramName: "回流比", paramDesc: "reflux_ratio", unit: "%", dataType: "float", required: true, description: "污泥回流比" },
      ],
      evaluations: [
        { id: "1", evaluator: "李四", score: 4.5, comment: "模型效果很好，在实际应用中表现优秀", createTime: "2024-12-19 15:30:00", metrics: { accuracy: 0.92, precision: 0.89, recall: 0.91, f1Score: 0.90 } },
        { id: "2", evaluator: "王五", score: 4.0, comment: "模型预测准确，但响应速度可以进一步优化", createTime: "2024-12-18 10:20:00", metrics: { accuracy: 0.88, precision: 0.85, recall: 0.87, f1Score: 0.86 } },
      ],
      relatedDatasets: [
        { id: "ds-1", name: "污水厂运行数据集V1", type: "时序数据", description: "包含2024年全年运行数据", createTime: "2024-12-01 09:00:00" },
        { id: "ds-2", name: "水质监测数据集", type: "监测数据", description: "实时水质监测数据", createTime: "2024-11-15 14:00:00" },
      ],
    },
    "model-2": {
      owner: "赵六",
      creator: "赵六",
      updateTime: "2024-12-19 11:00:00",
      notes: "基于CNN-LSTM-Attention复合模型结构的水质预警系统。该模型能够有效识别水质异常模式，提前预警潜在风险。\n\n## 模型架构\n- CNN层：提取局部特征\n- LSTM层：捕获时序依赖\n- Attention机制：关注关键特征\n\n## 应用场景\n适用于各类水质监测场景，支持多参数联合预警。",
      developLanguage: "Python",
      modelTypeNum: 1,
      paramInList: [
        { id: "1", paramName: "pH值", paramDesc: "ph_value", unit: "-", dataType: "float", required: true },
        { id: "2", paramName: "溶解氧", paramDesc: "dissolved_oxygen", unit: "mg/L", dataType: "float", required: true },
        { id: "3", paramName: "浊度", paramDesc: "turbidity", unit: "NTU", dataType: "float", required: true },
      ],
      paramOutList: [
        { id: "1", paramName: "预警等级", paramDesc: "alert_level", unit: "级", dataType: "int", required: true, description: "1-5级预警" },
        { id: "2", paramName: "风险概率", paramDesc: "risk_probability", unit: "%", dataType: "float", required: true },
      ],
      evaluations: [
        { id: "1", evaluator: "钱七", score: 4.8, comment: "预警准确率高，实用性强", createTime: "2024-12-19 16:00:00", metrics: { accuracy: 0.95, precision: 0.93, recall: 0.94, f1Score: 0.935 } },
      ],
      relatedDatasets: [
        { id: "ds-3", name: "水质历史数据", type: "历史数据", description: "近3年水质监测数据", createTime: "2024-10-01 08:00:00" },
      ],
    },
  };

  const detail = detailMap[modelId] || {
    owner: "系统管理员",
    creator: "系统管理员",
    updateTime: baseModel.createTime,
    notes: baseModel.description || "暂无详细描述",
    developLanguage: "Python",
    modelTypeNum: baseModel.modelType.includes("数据规则") ? 3 : 1,
    paramInList: [],
    paramOutList: [],
    evaluations: [],
    relatedDatasets: [],
  };

  return {
    ...baseModel,
    ...detail,
  };
}
