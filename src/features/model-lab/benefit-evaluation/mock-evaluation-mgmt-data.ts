// 效益评估管理 Mock 数据

export interface EvaluationMgmtModel {
  id: string | null;
  orgId: string | null;
  modelId: string;
  modelKey: number;
  dataSetId: string | null;
  experimentId: string;
  runId: string;
  modelName: string;
  taskName: string;
  trainTime: number;
  inputJson: string | null;
  evaluateIndex: string | null;
  notes: string | null;
  creator: string;
  version: string;
  developLanguage: string;
  status: string | null;
  statusName: string;
  createTime: string;
  updateTime: string | null;
  deleted: string | null;
  updateUser: string | null;
  modelType: string;
  applicableScenarioStr: string;
  deployTestStatus: number;
  runCount: string;
}

// Mock 数据
export const mockEvaluationMgmtData: EvaluationMgmtModel[] = [
  {
    id: null,
    orgId: null,
    modelId: "MLModel-523",
    modelKey: 523,
    dataSetId: null,
    experimentId: "29",
    runId: "ffc98d1cc34e4648a5a7cdbb229b4e6e",
    modelName: "金刚钻-015-污水厂核心单元自适应系统的研究与应用-“进场即用，离场即停”插件化使用—东部大区",
    taskName: "smiling-penguin-106",
    trainTime: 18118,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "0.4876278256626372" },
      { name: "mape", value: "7.313339606041902" },
      { desc: "出水氨氮平均值（mean）", name: "mean", value: "6.837499756302521" },
      { desc: "拟合度（r2_score）", name: "r2_score", value: "0.9721570020852237" },
      { desc: "相对误差率（rmae）", name: "rmae", value: "7.131668636816582" }
    ]),
    notes: "采用卷积神经网络",
    creator: "何胜杰",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-19 09:17:25",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-时序序列",
    applicableScenarioStr: "无特定场景",
    deployTestStatus: 0,
    runCount: "2"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-522",
    modelKey: 522,
    dataSetId: null,
    experimentId: "28",
    runId: "af7634bc20854f7fb8307095997ef0eb",
    modelName: "金助手-006-基于复合时间序列模型（CLA）的水质预警研究与应用—东部大区（进水提升泵液位推理）",
    taskName: "selective-elk-643",
    trainTime: 18853,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "0.037841923402364516" },
      { name: "mape", value: "0.7205296991609919" },
      { desc: "进水液位平均值（mean）", name: "mean", value: "5.520077277968036" },
      { desc: "拟合度（r2_score）", name: "r2_score", value: "0.9961720032903555" },
      { desc: "相对误差率（rmae）", name: "rmae", value: "0.6855324934199887" }
    ]),
    notes: "1. 核心目标\n本课题旨在应用 CNN-LSTM-Attention 复合模型结构，充分挖掘污水处理厂运行数据的价值。通过深度学习算法，提取进水水质、水量、工艺调控参数以及过程仪表数据之间的 时间变化强耦合规律，从而实现对污水处理过程的精准预测。\n\n2. 模型输入参数 (Model Inputs)\n为了保证预测的全面性，模型选取了多维度的关键参数作为输入：\n\n进水指标：进水COD、进水TN、进水TP、进水NH3。\n\n工艺运行参数：处理水量、MLSS（混合液悬浮固体浓度）、回流比、PAC加药量、曝气风量。\n\n在线仪表数据：ORP（氧化还原电位）、DO（溶解氧）、NH3仪表读数。\n\n3. 技术架构与算法原理 (Python Implementation)\n该系统基于Python编程实现，采用了一种串联的混合神经网络架构：\n\n卷积神经网络 (CNN)：\n\n卷积层：负责提取数据的局部特征。\n\n池化层：对特征图进行下采样，在减少尺寸和参数数量、降低计算复杂度的同时，保留重要信息。\n\n全连接层：整合特征信息进行运算。\n\n长短期记忆网络 (LSTM)：\n\n核心在于处理和预测序列数据中的 时间依赖关系",
    creator: "贾世超",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-19 09:07:09",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-时序序列",
    applicableScenarioStr: "无特定场景",
    deployTestStatus: 0,
    runCount: "2"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-521",
    modelKey: 521,
    dataSetId: null,
    experimentId: "27",
    runId: "ec0977d22b574bff862463c0b203dc6c",
    modelName: "金助手-006-基于复合时间序列模型（CLA）的水质预警研究与应用—东部大区（进水COD推理）",
    taskName: "serious-boar-654",
    trainTime: 6823,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "6.976068520219699" },
      { name: "mape", value: "1.7976931348623157" },
      { desc: "进水COD平均值（mean）", name: "mean", value: "245.50593742636983" },
      { desc: "拟合度（r2_score）", name: "r2_score", value: "0.9463229317255523" },
      { desc: "相对误差率（rmae）", name: "rmae", value: "2.8415070500329165" }
    ]),
    notes: "1. 核心目标\n本课题旨在应用 CNN-LSTM-Attention 复合模型结构，充分挖掘污水处理厂运行数据的价值。通过深度学习算法，提取进水水质、水量、工艺调控参数以及过程仪表数据之间的 时间变化强耦合规律，从而实现对污水处理过程的精准预测。\n\n2. 模型输入参数 (Model Inputs)\n为了保证预测的全面性，模型选取了多维度的关键参数作为输入：\n\n进水指标：进水COD、进水TN、进水TP、进水NH3。\n\n工艺运行参数：处理水量、MLSS（混合液悬浮固体浓度）、回流比、PAC加药量、曝气风量。\n\n在线仪表数据：ORP（氧化还原电位）、DO（溶解氧）、NH3仪表读数。\n\n3. 技术架构与算法原理 (Python Implementation)\n该系统基于Python编程实现，采用了一种串联的混合神经网络架构：\n\n卷积神经网络 (CNN)：\n\n卷积层：负责提取数据的局部特征。\n\n池化层：对特征图进行下采样，在减少尺寸和参数数量、降低计算复杂度的同时，保留重要信息。\n\n全连接层：整合特征信息进行运算。\n\n长短期记忆网络 (LSTM)：\n\n核心在于处理和预测序列数据中的 时间依赖关系",
    creator: "贾世超",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-19 08:53:31",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-时序序列",
    applicableScenarioStr: "无特定场景",
    deployTestStatus: 0,
    runCount: "3"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-467",
    modelKey: 467,
    dataSetId: null,
    experimentId: "15",
    runId: "6fc858e6e22f4950b050c77ade2a0929",
    modelName: "金助手-006-基于复合时间序列模型（CLA）的水质预警研究与应用—东部大区（曝气风量预测模型推理）",
    taskName: "casual-skunk-591",
    trainTime: 20033,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "389.42163935363743" },
      { name: "mape", value: "4.713501050297774" },
      { desc: "曝气风量平均值（mean）", name: "mean", value: "8123.470385838533" },
      { desc: "拟合度（r2_score）", name: "r2_score", value: "0.7289574786194823" },
      { desc: "相对误差率（rmae）", name: "rmae", value: "4.793784193914311" }
    ]),
    notes: "1. 核心目标\n本课题旨在应用 CNN-LSTM-Attention 复合模型结构，充分挖掘污水处理厂运行数据的价值。通过深度学习算法，提取进水水质、水量、工艺调控参数以及过程仪表数据之间的 时间变化强耦合规律，从而实现对污水处理过程的精准预测。\n\n2. 模型输入参数 (Model Inputs)\n为了保证预测的全面性，模型选取了多维度的关键参数作为输入：\n\n进水指标：进水COD、进水TN、进水TP、进水NH3。\n\n工艺运行参数：处理水量、MLSS（混合液悬浮固体浓度）、回流比、PAC加药量、曝气风量。\n\n在线仪表数据：ORP（氧化还原电位）、DO（溶解氧）、NH3仪表读数。\n\n3. 技术架构与算法原理 (Python Implementation)\n该系统基于Python编程实现，采用了一种串联的混合神经网络架构：\n\n卷积神经网络 (CNN)：\n\n卷积层：负责提取数据的局部特征。\n\n池化层：对特征图进行下采样，在减少尺寸和参数数量、降低计算复杂度的同时，保留重要信息。\n\n全连接层：整合特征信息进行运算。\n\n长短期记忆网络 (LSTM)：\n\n核心在于处理和预测序列数据中的 时间依赖关系",
    creator: "贾世超",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-19 08:38:56",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-时序序列",
    applicableScenarioStr: "无特定场景",
    deployTestStatus: 0,
    runCount: "4"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-526",
    modelKey: 526,
    dataSetId: null,
    experimentId: "30",
    runId: "4d83fcc31da24c8aab27d373f88d0031",
    modelName: "金刚钻—010—水灵磷Agent——AI神经网络算法驱动的自适应加药系统—南部大区",
    taskName: "lyrical-shrimp-398",
    trainTime: 7155,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "7.566020062911746" },
      { name: "mape", value: "0.010740552" },
      { desc: "除磷加药泵流量平均值（mean）", name: "mean", value: "704.434909024577" },
      { desc: "拟合度（r2_score）", name: "r2_score", value: "0.9055338645169584" },
      { desc: "相对误差率（rmae）", name: "rmae", value: "1.0740552414400257" }
    ]),
    notes: "按时序控制算法进行对目标数据进行训练，预测，当前支持加药量、曝气风量、出水水质等13个指标预测",
    creator: "陈新竹",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-16 14:50:02",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-时序序列",
    applicableScenarioStr: "A2O工艺,氧化沟工艺,SBR工艺,MBR膜工艺",
    deployTestStatus: 0,
    runCount: "1"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-344",
    modelKey: 344,
    dataSetId: null,
    experimentId: "9",
    runId: "690a4e61a7114316bb4160344b8a8804",
    modelName: "时序数据预测模型",
    taskName: "bittersweet-flea-719",
    trainTime: 9056,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { desc: "平均绝对误差（MAE）", name: "mae", value: "46959771.294392526" },
      { name: "mse", value: "2248969309395364" },
      { name: "r2_score", value: "-111665.21976171334" },
      { desc: "均方根误差（RMSE）", name: "rmse", value: "47423299.22512102" }
    ]),
    notes: "时序数据预测模型",
    creator: "郑阳",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-15 16:44:17",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-回归",
    applicableScenarioStr: "A2O工艺,氧化沟工艺,SBR工艺,MBR膜工艺",
    deployTestStatus: 0,
    runCount: "5"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-412",
    modelKey: 412,
    dataSetId: null,
    experimentId: "26",
    runId: "e6902b0e91b04907875a2607ed67f4fb",
    modelName: "提升系统-进水提升系统成本",
    taskName: "resilient-hen-649",
    trainTime: 40438,
    inputJson: null,
    evaluateIndex: JSON.stringify([
      { name: "mae", value: "361.1396927891668" },
      { name: "mse", value: "310198.5350589719" },
      { name: "r2_score", value: "0.7616076963168182" },
      { name: "rmse", value: "556.9546974925087" }
    ]),
    notes: "经济效益评价",
    creator: "赵云峰",
    version: "V001",
    developLanguage: "",
    status: null,
    statusName: "完成",
    createTime: "2025-12-15 14:28:07",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "数据规则",
    applicableScenarioStr: "其他",
    deployTestStatus: 0,
    runCount: "4"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-385",
    modelKey: 385,
    dataSetId: null,
    experimentId: "12",
    runId: "1179dbc0bae34a83bf559d249de70191",
    modelName: "test1118",
    taskName: "merciful-goat-602",
    trainTime: 4676,
    inputJson: null,
    evaluateIndex: null,
    notes: "预测性维护电流路线",
    creator: "张斌",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-12-11 18:52:50",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-回归",
    applicableScenarioStr: "曝气风机,DO溶解氧仪,刮泥机",
    deployTestStatus: 0,
    runCount: "2"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-386",
    modelKey: 386,
    dataSetId: null,
    experimentId: "11",
    runId: "6177427cb8a946bdafa10a44b42a4857",
    modelName: "test_1118",
    taskName: "learned-goose-665",
    trainTime: 10957,
    inputJson: null,
    evaluateIndex: null,
    notes: "预测性维护",
    creator: "张聪聪",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-11-18 16:18:32",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-分类",
    applicableScenarioStr: "曝气风机,DO溶解氧仪,刮泥机",
    deployTestStatus: 0,
    runCount: "2"
  },
  {
    id: null,
    orgId: null,
    modelId: "MLModel-358",
    modelKey: 358,
    dataSetId: null,
    experimentId: "4",
    runId: "0bbf3a73ab6645d4bd4b98bde05f95df",
    modelName: "随机森林模型",
    taskName: "bright-calf-614",
    trainTime: 350,
    inputJson: null,
    evaluateIndex: null,
    notes: "随机森林模型",
    creator: "赵磊",
    version: "V001",
    developLanguage: "python",
    status: null,
    statusName: "完成",
    createTime: "2025-11-12 15:25:35",
    updateTime: null,
    deleted: null,
    updateUser: null,
    modelType: "机器学习-回归",
    applicableScenarioStr: "A2O工艺",
    deployTestStatus: 0,
    runCount: "1"
  }
];

// 获取 Mock 数据的函数
export function getMockEvaluationMgmtData(): EvaluationMgmtModel[] {
  return mockEvaluationMgmtData;
}
