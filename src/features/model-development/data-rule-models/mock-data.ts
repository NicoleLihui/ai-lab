// 数据规则模型 Mock 数据
export interface DataRuleModelItem {
  id: string;
  modelId: string; // 模型ID
  modelName: string; // 模型名称
  version: string; // 版本
  notes: string; // 模型描述
  paramInStr: string; // 输入参数
  formula: string; // 公式
  paramOutStr: string; // 输出参数
  applicableScenario: string; // 应用场景
  releaseStatus: string; // 发布状态
  deploymentStatus: string; // 部署状态
  owner: string; // 创建组织
  creator: string; // 创建人
  createTime: string; // 创建时间
  updateTime: string; // 最近更新时间
}

// Mock 数据列表
export const mockDataRuleModels: DataRuleModelItem[] = [
  {
    id: "1",
    modelId: "DR001",
    modelName: "COD去除率计算模型",
    version: "v1.2.0",
    notes: "基于进水COD和出水COD计算去除率",
    paramInStr: "进水COD(mg/L), 出水COD(mg/L)",
    formula: "(进水COD - 出水COD) / 进水COD × 100%",
    paramOutStr: "COD去除率(%)",
    applicableScenario: "污水处理工艺评估",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "技术部",
    creator: "张三",
    createTime: "2024-01-15 10:30:00",
    updateTime: "2025-08-10 14:20:00",
  },
  {
    id: "2",
    modelId: "DR002",
    modelName: "污泥负荷计算模型",
    version: "v2.1.3",
    notes: "计算活性污泥系统的有机负荷",
    paramInStr: "进水流量(m³/d), 进水BOD(mg/L), MLSS(g/L), 池容(m³)",
    formula: "(进水流量 × 进水BOD) / (MLSS × 池容)",
    paramOutStr: "污泥负荷(kgBOD/kgMLSS·d)",
    applicableScenario: "活性污泥工艺设计",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "工艺部",
    creator: "李四",
    createTime: "2023-09-20 09:15:00",
    updateTime: "2025-07-30 16:45:00",
  },
  {
    id: "3",
    modelId: "DR003",
    modelName: "曝气量优化模型",
    version: "v1.5.0",
    notes: "根据DO浓度和MLSS动态计算最优曝气量",
    paramInStr: "DO目标值(mg/L), DO当前值(mg/L), MLSS(g/L), 池容(m³)",
    formula: "曝气量 = (DO目标值 - DO当前值) × MLSS × 池容 × 0.8",
    paramOutStr: "曝气量(m³/h)",
    applicableScenario: "生物池曝气控制",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    owner: "运营部",
    creator: "王五",
    createTime: "2022-12-05 11:20:00",
    updateTime: "2025-06-18 13:30:00",
  },
  {
    id: "4",
    modelId: "DR004",
    modelName: "加药量计算模型",
    version: "v3.0.1",
    notes: "根据进水TP和出水TP目标值计算PAC投加量",
    paramInStr: "进水TP(mg/L), 出水TP目标(mg/L), 流量(m³/h)",
    formula: "PAC投加量 = (进水TP - 出水TP目标) × 流量 × 1.5",
    paramOutStr: "PAC投加量(kg/h)",
    applicableScenario: "化学除磷控制",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "技术部",
    creator: "赵六",
    createTime: "2025-03-12 08:45:00",
    updateTime: "2025-08-15 10:10:00",
  },
  {
    id: "5",
    modelId: "DR005",
    modelName: "污泥龄计算模型",
    version: "v1.8.2",
    notes: "计算活性污泥系统的平均污泥龄",
    paramInStr: "MLSS(g/L), 池容(m³), 剩余污泥量(kg/d)",
    formula: "污泥龄 = (MLSS × 池容) / 剩余污泥量",
    paramOutStr: "污泥龄(天)",
    applicableScenario: "污泥系统运行评估",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "工艺部",
    creator: "孙七",
    createTime: "2021-11-30 14:00:00",
    updateTime: "2025-05-22 15:30:00",
  },
  {
    id: "6",
    modelId: "DR006",
    modelName: "回流比计算模型",
    version: "v2.3.0",
    notes: "根据脱氮需求计算最优污泥回流比",
    paramInStr: "进水TN(mg/L), 出水TN目标(mg/L), MLSS(g/L)",
    formula: "回流比 = (进水TN - 出水TN目标) / (MLSS × 0.1)",
    paramOutStr: "回流比(%)",
    applicableScenario: "A2O工艺优化",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    owner: "运营部",
    creator: "周八",
    createTime: "2024-06-08 09:30:00",
    updateTime: "2025-07-11 11:20:00",
  },
  {
    id: "7",
    modelId: "DR007",
    modelName: "水力停留时间计算",
    version: "v1.0.5",
    notes: "计算污水处理单元的水力停留时间",
    paramInStr: "池容(m³), 进水流量(m³/h)",
    formula: "HRT = 池容 / 进水流量",
    paramOutStr: "水力停留时间(小时)",
    applicableScenario: "工艺设计验证",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "技术部",
    creator: "吴九",
    createTime: "2023-04-17 10:15:00",
    updateTime: "2025-08-05 16:00:00",
  },
  {
    id: "8",
    modelId: "DR008",
    modelName: "污泥指数计算模型",
    version: "v1.2.1",
    notes: "计算SVI值评估污泥沉降性能",
    paramInStr: "SV30(%), MLSS(g/L)",
    formula: "SVI = (SV30 / MLSS) × 1000",
    paramOutStr: "SVI(mL/g)",
    applicableScenario: "污泥性能评估",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "工艺部",
    creator: "郑十",
    createTime: "2024-02-28 13:45:00",
    updateTime: "2025-06-30 14:30:00",
  },
  {
    id: "9",
    modelId: "DR009",
    modelName: "脱氮效率计算",
    version: "v2.0.0",
    notes: "计算生物脱氮系统的脱氮效率",
    paramInStr: "进水TN(mg/L), 出水TN(mg/L)",
    formula: "脱氮效率 = (进水TN - 出水TN) / 进水TN × 100%",
    paramOutStr: "脱氮效率(%)",
    applicableScenario: "脱氮工艺评估",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "技术部",
    creator: "钱一",
    createTime: "2020-08-10 08:00:00",
    updateTime: "2025-08-12 10:20:00",
  },
  {
    id: "10",
    modelId: "DR010",
    modelName: "除磷效率计算",
    version: "v1.1.0",
    notes: "计算化学除磷或生物除磷的效率",
    paramInStr: "进水TP(mg/L), 出水TP(mg/L)",
    formula: "除磷效率 = (进水TP - 出水TP) / 进水TP × 100%",
    paramOutStr: "除磷效率(%)",
    applicableScenario: "除磷工艺评估",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    owner: "运营部",
    creator: "孙二",
    createTime: "2025-01-05 09:00:00",
    updateTime: "2025-07-28 15:45:00",
  },
  {
    id: "11",
    modelId: "DR011",
    modelName: "F/M比计算模型",
    version: "v1.3.2",
    notes: "计算食物与微生物比值",
    paramInStr: "进水BOD(kg/d), MLSS(g/L), 池容(m³)",
    formula: "F/M = 进水BOD / (MLSS × 池容)",
    paramOutStr: "F/M比(kgBOD/kgMLSS·d)",
    applicableScenario: "活性污泥系统控制",
    releaseStatus: "已发布",
    deploymentStatus: "已部署",
    owner: "工艺部",
    creator: "李三",
    createTime: "2024-05-20 11:30:00",
    updateTime: "2025-08-01 09:15:00",
  },
  {
    id: "12",
    modelId: "DR012",
    modelName: "污泥产率计算",
    version: "v2.1.0",
    notes: "计算单位BOD去除产生的剩余污泥量",
    paramInStr: "剩余污泥量(kg/d), BOD去除量(kg/d)",
    formula: "污泥产率 = 剩余污泥量 / BOD去除量",
    paramOutStr: "污泥产率(kgSS/kgBOD)",
    applicableScenario: "污泥处理量预测",
    releaseStatus: "未发布",
    deploymentStatus: "未部署",
    owner: "运营部",
    creator: "王四",
    createTime: "2024-07-15 14:20:00",
    updateTime: "2025-07-25 16:30:00",
  },
];

// 模拟 API 响应
export interface DataRuleModelListResponse {
  success: boolean;
  data: {
    body: DataRuleModelItem[];
    total: number;
  };
  msg?: string;
}

// 获取数据规则模型列表（带分页和搜索）
export function getMockDataRuleModelList(params: {
  currentPage: number;
  pageSize: number;
  searchWord?: string;
}): DataRuleModelListResponse {
  const { currentPage, pageSize, searchWord = "" } = params;
  
  // 搜索过滤
  let filteredData = [...mockDataRuleModels];
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

// 删除数据规则模型
export function deleteMockDataRuleModel(id: string): { success: boolean; message: string } {
  const index = mockDataRuleModels.findIndex((item) => item.id === id);
  if (index !== -1) {
    mockDataRuleModels.splice(index, 1);
    return { success: true, message: "删除成功" };
  }
  return { success: false, message: "模型不存在" };
}
