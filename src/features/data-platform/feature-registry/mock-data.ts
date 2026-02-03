import type { FeatureRegistryItem, FeatureUsageRecord, FeatureQualityMetrics } from "./types";

export const featureRegistryMockData: FeatureRegistryItem[] = [
  {
    id: "FTR-001",
    featureName: "近7日水量波动率",
    featureCode: "water_volume_volatility_7d",
    featureType: "时序特征",
    computeMode: "离线",
    businessDomain: "水量",
    dataSource: "数采",
    owner: "张三",
    dataOwner: "李四",
    storageTable: "dwd_water_volume_feature",
    status: "启用",
    reuseCount: 18,
    lastUsedTime: "2024-01-22 09:45:00",
    description: "衡量近7日水量波动，用于异常检测和运行稳定性分析。",
    computeLogic: "stddev(water_volume, 7d) / avg(water_volume, 7d)",
    tags: ["异常检测", "稳定性"],
    createTime: "2023-12-05 10:20:00",
    updateTime: "2024-01-21 14:30:00"
  },
  {
    id: "FTR-002",
    featureName: "水质达标率",
    featureCode: "water_quality_pass_rate",
    featureType: "统计特征",
    computeMode: "离线",
    businessDomain: "水质",
    dataSource: "数采",
    owner: "王五",
    dataOwner: "赵六",
    storageTable: "dws_water_quality_summary",
    status: "启用",
    reuseCount: 26,
    lastUsedTime: "2024-01-23 11:15:00",
    description: "统计期内水质指标达标率，用于监管合规与绩效评价。",
    computeLogic: "count_if(is_pass=true) / count(*)",
    tags: ["合规", "绩效"],
    createTime: "2023-11-20 09:10:00",
    updateTime: "2024-01-20 17:05:00"
  },
  {
    id: "FTR-003",
    featureName: "设备能耗强度",
    featureCode: "equipment_energy_intensity",
    featureType: "衍生特征",
    computeMode: "实时",
    businessDomain: "设备",
    dataSource: "工单数据",
    owner: "孙七",
    dataOwner: "周八",
    storageTable: "rt_equipment_energy_feature",
    status: "启用",
    reuseCount: 12,
    lastUsedTime: "2024-01-23 16:40:00",
    description: "设备能耗/处理量比值，反映设备能效水平。",
    computeLogic: "energy_consumption / throughput",
    tags: ["能效", "实时"],
    createTime: "2023-12-12 13:35:00",
    updateTime: "2024-01-19 08:20:00"
  },
  {
    id: "FTR-004",
    featureName: "工单超时率",
    featureCode: "work_order_overdue_rate",
    featureType: "统计特征",
    computeMode: "离线",
    businessDomain: "工单",
    dataSource: "工单数据",
    owner: "吴九",
    dataOwner: "郑十",
    storageTable: "dws_work_order_kpi",
    status: "停用",
    reuseCount: 4,
    lastUsedTime: "2024-01-10 09:10:00",
    description: "统计工单超时比例，支撑运维效率评估。",
    computeLogic: "count_if(overdue=true) / count(*)",
    tags: ["运维", "效率"],
    createTime: "2023-10-18 15:40:00",
    updateTime: "2024-01-05 14:10:00"
  },
  {
    id: "FTR-005",
    featureName: "药剂投加异常指数",
    featureCode: "chem_dosage_anomaly_index",
    featureType: "画像特征",
    computeMode: "实时",
    businessDomain: "药剂",
    dataSource: "数采",
    owner: "钱一",
    dataOwner: "钱二",
    storageTable: "rt_chem_dosage_feature",
    status: "启用",
    reuseCount: 15,
    lastUsedTime: "2024-01-23 15:05:00",
    description: "结合药剂投加量、流量、水质指标构建异常指数。",
    computeLogic: "zscore(chem_dosage) * weight(flow, quality)",
    tags: ["异常检测", "实时"],
    createTime: "2023-12-01 11:00:00",
    updateTime: "2024-01-22 18:00:00"
  },
  {
    id: "FTR-006",
    featureName: "水厂运行画像评分",
    featureCode: "plant_operation_profile_score",
    featureType: "画像特征",
    computeMode: "离线",
    businessDomain: "经营",
    dataSource: "基础数据",
    owner: "钱三",
    dataOwner: "钱四",
    storageTable: "dws_plant_profile",
    status: "启用",
    reuseCount: 9,
    lastUsedTime: "2024-01-19 13:20:00",
    description: "综合处理效率、能耗、故障率生成水厂运行画像评分。",
    computeLogic: "weighted_sum(efficiency, energy_cost, failure_rate)",
    tags: ["画像", "评分"],
    createTime: "2023-11-05 10:30:00",
    updateTime: "2024-01-18 12:15:00"
  },
  {
    id: "FTR-007",
    featureName: "水质异常关联强度",
    featureCode: "water_quality_anomaly_association",
    featureType: "衍生特征",
    computeMode: "离线",
    businessDomain: "水质",
    dataSource: "数采",
    owner: "张三",
    dataOwner: "李四",
    storageTable: "dws_water_quality_relation",
    status: "停用",
    reuseCount: 2,
    lastUsedTime: "2023-12-28 18:00:00",
    description: "挖掘水质异常指标之间的相关性强度。",
    computeLogic: "corr(COD, NH3, TP) weighted score",
    tags: ["关联分析"],
    createTime: "2023-09-20 09:40:00",
    updateTime: "2023-12-30 10:20:00"
  },
  {
    id: "FTR-008",
    featureName: "设备故障预测窗口",
    featureCode: "equipment_failure_prediction_window",
    featureType: "时序特征",
    computeMode: "实时",
    businessDomain: "设备",
    dataSource: "台账数据",
    owner: "王五",
    dataOwner: "赵六",
    storageTable: "rt_equipment_failure_feature",
    status: "启用",
    reuseCount: 21,
    lastUsedTime: "2024-01-23 19:30:00",
    description: "基于设备传感器数据滚动计算故障预测窗口。",
    computeLogic: "rolling_window(score, 24h, 1h)",
    tags: ["预测", "时序"],
    createTime: "2023-10-30 16:05:00",
    updateTime: "2024-01-22 09:30:00"
  }
];

export const featureUsageMockData: Record<string, FeatureUsageRecord[]> = {
  "FTR-001": [
    {
      id: "U-001",
      scenario: "水量异常检测",
      modelName: "水量异常检测模型",
      modelVersion: "v2.3",
      usedBy: "监控中心",
      usageCount: 6,
      lastUsedTime: "2024-01-22 09:45:00"
    },
    {
      id: "U-002",
      scenario: "运行稳定性评估",
      modelName: "运行稳定性评分模型",
      modelVersion: "v1.4",
      usedBy: "运维部",
      usageCount: 4,
      lastUsedTime: "2024-01-21 14:10:00"
    }
  ],
  "FTR-002": [
    {
      id: "U-003",
      scenario: "合规指标追踪",
      modelName: "水质合规模型",
      modelVersion: "v3.1",
      usedBy: "监管合规部",
      usageCount: 12,
      lastUsedTime: "2024-01-23 11:15:00"
    },
    {
      id: "U-004",
      scenario: "绩效评估",
      modelName: "绩效评价模型",
      modelVersion: "v2.0",
      usedBy: "经营管理部",
      usageCount: 8,
      lastUsedTime: "2024-01-22 15:20:00"
    }
  ],
  "FTR-003": [
    {
      id: "U-005",
      scenario: "设备节能优化",
      modelName: "能效优化模型",
      modelVersion: "v1.8",
      usedBy: "能源管理部",
      usageCount: 5,
      lastUsedTime: "2024-01-23 16:40:00"
    }
  ]
};

export const featureQualityMockData: Record<string, FeatureQualityMetrics> = {
  "FTR-001": { freshnessHours: 6, coverage: 96, stability: 92, nullRate: 1.4, driftScore: 0.12 },
  "FTR-002": { freshnessHours: 12, coverage: 98, stability: 95, nullRate: 0.8, driftScore: 0.08 },
  "FTR-003": { freshnessHours: 1, coverage: 93, stability: 88, nullRate: 2.5, driftScore: 0.18 },
  "FTR-004": { freshnessHours: 24, coverage: 89, stability: 80, nullRate: 4.2, driftScore: 0.22 },
  "FTR-005": { freshnessHours: 2, coverage: 91, stability: 86, nullRate: 3.1, driftScore: 0.17 },
  "FTR-006": { freshnessHours: 24, coverage: 94, stability: 90, nullRate: 1.9, driftScore: 0.14 },
  "FTR-007": { freshnessHours: 48, coverage: 82, stability: 75, nullRate: 6.5, driftScore: 0.35 },
  "FTR-008": { freshnessHours: 2, coverage: 97, stability: 93, nullRate: 0.9, driftScore: 0.09 }
};
