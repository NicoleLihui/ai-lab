// 智能体模型 Mock 数据
export interface AgentModelItem {
  id: string;
  modelId: string; // 模型ID
  modelName: string; // 模型名称
  modelType: string; // 分类
  notes: string; // 功能描述
  paramInStr: string; // 输入参数
  paramOutStr: string; // 输出参数
  applicableScenario: string; // 应用场景
  paramEva: string; // 评估指标
  releaseStatus: string; // 发布状态
  deploymentStatus: string; // 部署状态
  createTime: string; // 创建时间
  version: string; // 当前版本
  updateTime: string; // 更新时间
  subcateGory?: string; // 子分类（用于判断试用方式）
}

// Mock 数据列表
export const mockAgentModels: AgentModelItem[] = [
  {
    id: "1",
    modelId: "WA001",
    modelName: "智能曝气优化器",
    modelType: "智能体",
    notes: "动态调节曝气量实现节能降耗",
    paramInStr: "DO、MLSS、进水流量、温度",
    paramOutStr: "曝气设备控制参数",
    applicableScenario: "生物池溶解氧控制",
    paramEva: "节能率15%±2%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2024-01-15 10:30:00",
    version: "v3.2.1",
    updateTime: "2025-08-10 14:20:00",
    subcateGory: "Agent",
  },
  {
    id: "2",
    modelId: "WA002",
    modelName: "污泥膨胀预警机",
    modelType: "智能体",
    notes: "提前48小时预警污泥膨胀风险",
    paramInStr: "SVI、MLSS、F/M比",
    paramOutStr: "风险等级(1-5级)",
    applicableScenario: "二沉池运行监控",
    paramEva: "召回率92%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2023-09-20 09:15:00",
    version: "v1.8.3",
    updateTime: "2025-07-30 16:45:00",
    subcateGory: "Chatflow",
  },
  {
    id: "3",
    modelId: "WA003",
    modelName: "加药智能决策系统",
    modelType: "智能体",
    notes: "平衡药剂成本与出水TP达标",
    paramInStr: "进水TP、流量、pH",
    paramOutStr: "PAC投加量(g/m³)",
    applicableScenario: "化学除磷控制",
    paramEva: "年节约药剂费23万元",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2022-12-05 11:20:00",
    version: "v2.5.0",
    updateTime: "2025-06-18 13:30:00",
  },
  {
    id: "4",
    modelId: "WA004",
    modelName: "管网淤堵预测模型",
    modelType: "智能体",
    notes: "预测管网淤堵位置及严重程度",
    paramInStr: "流速、水位、历史维护记录",
    paramOutStr: "淤堵概率热力图",
    applicableScenario: "污水管网维护",
    paramEva: "AUC=0.89",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2025-03-12 08:45:00",
    version: "v0.9.7",
    updateTime: "2025-08-15 10:10:00",
  },
  {
    id: "5",
    modelId: "WA005",
    modelName: "能耗数字孪生体",
    modelType: "智能体",
    notes: "建立设备级能耗仿真模型",
    paramInStr: "设备运行参数、电价时段",
    paramOutStr: "能耗优化方案",
    applicableScenario: "全厂能耗分析",
    paramEva: "仿真误差<5%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2021-11-30 14:00:00",
    version: "v4.0.2",
    updateTime: "2025-05-22 15:30:00",
  },
  {
    id: "6",
    modelId: "WA006",
    modelName: "恶臭扩散模拟器",
    modelType: "智能体",
    notes: "模拟H2S在不同气象条件下的扩散",
    paramInStr: "气象数据、源强参数",
    paramOutStr: "浓度等值线图",
    applicableScenario: "厂界臭气浓度预测",
    paramEva: "R²=0.85",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2024-06-08 09:30:00",
    version: "v1.2.4",
    updateTime: "2025-07-11 11:20:00",
  },
  {
    id: "7",
    modelId: "WA007",
    modelName: "智能除砂机器人",
    modelType: "智能体",
    notes: "基于图像识别自动调节除砂频率",
    paramInStr: "水下摄像头画面",
    paramOutStr: "除砂机启停指令",
    applicableScenario: "沉砂池清理",
    paramEva: "砂粒去除率95%",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2023-04-17 10:15:00",
    version: "v3.1.0",
    updateTime: "2025-08-05 16:00:00",
    subcateGory: "聊天助手",
  },
  {
    id: "8",
    modelId: "WA008",
    modelName: "污泥热值分析仪",
    modelType: "智能体",
    notes: "实时检测脱水污泥热值特性",
    paramInStr: "NIR光谱数据",
    paramOutStr: "热值(kcal/kg)",
    applicableScenario: "污泥焚烧优化",
    paramEva: "RMSECV=120kcal/kg",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2024-02-28 13:45:00",
    version: "v2.3.5",
    updateTime: "2025-06-30 14:30:00",
  },
  {
    id: "9",
    modelId: "WA009",
    modelName: "出水水质预测器",
    modelType: "智能体",
    notes: "提前2小时预测出水COD/TN超标",
    paramInStr: "在线仪表数据",
    paramOutStr: "超标概率",
    applicableScenario: "工艺调控预警",
    paramEva: "F1=0.88",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2020-08-10 08:00:00",
    version: "v5.0.0",
    updateTime: "2025-08-12 10:20:00",
  },
  {
    id: "10",
    modelId: "WA010",
    modelName: "设备故障诊断专家",
    modelType: "智能体",
    notes: "基于振动频谱诊断泵机故障类型",
    paramInStr: "加速度传感器数据",
    paramOutStr: "故障代码",
    applicableScenario: "预防性维护",
    paramEva: "诊断准确率93%",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2025-01-05 09:00:00",
    version: "v1.0.0",
    updateTime: "2025-07-28 15:45:00",
  },
  {
    id: "11",
    modelId: "WA011",
    modelName: "智能加氯控制系统",
    modelType: "智能体",
    notes: "根据出水余氯自动调节加氯量",
    paramInStr: "出水余氯、流量、pH值",
    paramOutStr: "加氯泵控制信号",
    applicableScenario: "消毒工艺控制",
    paramEva: "余氯控制精度±0.1mg/L",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    createTime: "2024-05-20 11:30:00",
    version: "v2.1.0",
    updateTime: "2025-08-01 09:15:00",
  },
  {
    id: "12",
    modelId: "WA012",
    modelName: "回流比优化智能体",
    modelType: "智能体",
    notes: "动态优化污泥回流比提升脱氮效率",
    paramInStr: "进水TN、DO、MLSS",
    paramOutStr: "最优回流比",
    applicableScenario: "A2O工艺优化",
    paramEva: "脱氮率提升12%",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    createTime: "2024-07-15 14:20:00",
    version: "v1.5.0",
    updateTime: "2025-07-25 16:30:00",
  },
];

// 模拟 API 响应
export interface AgentModelListResponse {
  success: boolean;
  data: {
    body: AgentModelItem[];
    total: number;
  };
  msg?: string;
}

// 获取智能体模型列表（带分页和搜索）
export function getMockAgentModelList(params: {
  currentPage: number;
  pageSize: number;
  searchWord?: string;
}): AgentModelListResponse {
  const { currentPage, pageSize, searchWord = "" } = params;
  
  // 搜索过滤
  let filteredData = [...mockAgentModels];
  if (searchWord) {
    const searchLower = searchWord.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.modelName.toLowerCase().includes(searchLower) ||
        item.modelId.toLowerCase().includes(searchLower)
    );
  }

  // 分页
  const total = filteredData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      body: paginatedData,
      total: total,
    },
  };
}

// 删除智能体模型
export function deleteMockAgentModel(id: string): { success: boolean; message: string } {
  const index = mockAgentModels.findIndex((item) => item.id === id);
  if (index !== -1) {
    mockAgentModels.splice(index, 1);
    return { success: true, message: "删除成功" };
  }
  return { success: false, message: "模型不存在" };
}
