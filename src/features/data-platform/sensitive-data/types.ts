/** 敏感级别 */
export type SensitiveLevel = "高" | "中" | "低";

/** 敏感数据类型：个人身份、财务、商业机密等 */
export type SensitiveDataType =
  | "个人身份信息"
  | "财务信息"
  | "商业机密"
  | "其他敏感信息";

/** 脱敏算法 */
export type MaskAlgorithm = "掩码" | "加密" | "替换" | "哈希";

/** 状态 */
export type SensitiveRuleStatus = "启用" | "停用";

export interface SensitiveDataRule {
  id: string;
  ruleCode: string;
  ruleName: string;
  dataType: SensitiveDataType;
  sensitiveLevel: SensitiveLevel;
  /** 匹配模式/正则或字段名 */
  matchPattern: string;
  maskAlgorithm: MaskAlgorithm;
  dataSource?: string;
  description?: string;
  status: SensitiveRuleStatus;
  creator: string;
  createTime: string;
  updateTime: string;
}
