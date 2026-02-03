export type FeatureStatus = "启用" | "停用";
export type FeatureType = "统计特征" | "时序特征" | "画像特征" | "衍生特征";
export type FeatureComputeMode = "实时" | "离线";

export interface FeatureRegistryItem {
  id: string;
  featureName: string;
  featureCode: string;
  featureType: FeatureType;
  computeMode: FeatureComputeMode;
  businessDomain: string;
  dataSource: string;
  owner: string;
  dataOwner: string;
  storageTable: string;
  status: FeatureStatus;
  reuseCount: number;
  lastUsedTime: string;
  description: string;
  computeLogic: string;
  tags: string[];
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

export interface FeatureUsageRecord {
  id: string;
  scenario: string;
  modelName: string;
  modelVersion: string;
  usedBy: string;
  usageCount: number;
  lastUsedTime: string;
}

export interface FeatureQualityMetrics {
  freshnessHours: number;
  coverage: number;
  stability: number;
  nullRate: number;
  driftScore: number;
}
