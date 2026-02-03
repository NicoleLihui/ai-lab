import type { DataRuleItem, DataRuleRunRecord } from "./types";

export const dataRulesMockData: DataRuleItem[] = [
  {
    id: "DR-001",
    ruleName: "用户表手机号非空检查",
    ruleCode: "user_phone_not_null",
    ruleType: "空值检查",
    gateAction: "阻断",
    targetTable: "ods.user_info",
    targetField: "phone",
    ruleParams: "空值率阈值 ≤ 0%",
    status: "启用",
    owner: "张三",
    description: "用户手机号必填，发现空值则阻断下游任务",
    lastRunTime: "2024-02-02 10:30:00",
    lastRunResult: "通过",
    lastViolationCount: 0,
    createTime: "2024-01-10 09:00:00",
    updateTime: "2024-02-01 14:20:00"
  },
  {
    id: "DR-002",
    ruleName: "订单号唯一性检查",
    ruleCode: "order_id_unique",
    ruleType: "唯一性检查",
    gateAction: "阻断",
    targetTable: "dwd.order_detail",
    targetField: "order_id",
    ruleParams: "order_id 全局唯一",
    status: "启用",
    owner: "李四",
    description: "订单号不允许重复，脏数据自动停止任务",
    lastRunTime: "2024-02-02 09:15:00",
    lastRunResult: "未通过",
    lastViolationCount: 3,
    createTime: "2024-01-12 11:30:00",
    updateTime: "2024-02-02 09:16:00"
  },
  {
    id: "DR-003",
    ruleName: "水量指标范围检查",
    ruleCode: "water_volume_range",
    ruleType: "范围检查",
    gateAction: "告警",
    targetTable: "dws.water_daily",
    targetField: "volume",
    ruleParams: "0 ≤ volume ≤ 100000（m³）",
    status: "启用",
    owner: "王五",
    description: "日水量在合理范围内，超范围仅告警不阻断",
    lastRunTime: "2024-02-02 08:00:00",
    lastRunResult: "通过",
    createTime: "2024-01-15 14:00:00",
    updateTime: "2024-01-28 10:00:00"
  },
  {
    id: "DR-004",
    ruleName: "设备编码格式检查",
    ruleCode: "device_code_format",
    ruleType: "格式检查",
    gateAction: "仅记录",
    targetTable: "ods.equipment",
    targetField: "device_code",
    ruleParams: "正则: ^EQ-[A-Z0-9]{8}$",
    status: "停用",
    owner: "赵六",
    description: "设备编码需符合 EQ-xxxxxxxx 格式，违规仅记录日志",
    lastRunTime: "2024-01-20 16:00:00",
    lastRunResult: "未通过",
    lastViolationCount: 12,
    createTime: "2024-01-18 09:00:00",
    updateTime: "2024-01-25 11:00:00"
  },
  {
    id: "DR-005",
    ruleName: "水质指标完整性自定义SQL",
    ruleCode: "water_quality_completeness_sql",
    ruleType: "自定义SQL",
    gateAction: "阻断",
    targetTable: "dwd.water_quality",
    ruleParams: "SELECT COUNT(*) FROM ... WHERE ph IS NULL OR cod IS NULL",
    status: "启用",
    owner: "钱七",
    description: "关键水质字段不得为空，自定义 SQL 校验",
    lastRunTime: "2024-02-02 06:00:00",
    lastRunResult: "通过",
    createTime: "2024-01-20 10:00:00",
    updateTime: "2024-02-01 09:00:00"
  }
];

export const dataRuleRunRecordsMock: Record<string, DataRuleRunRecord[]> = {
  "DR-001": [
    { id: "r1", ruleId: "DR-001", runTime: "2024-02-02 10:30:00", result: "通过", durationMs: 1200, taskId: "T-20240202-001" },
    { id: "r2", ruleId: "DR-001", runTime: "2024-02-01 10:30:00", result: "通过", durationMs: 1150, taskId: "T-20240201-001" },
    { id: "r3", ruleId: "DR-001", runTime: "2024-01-31 10:30:00", result: "通过", durationMs: 1180, taskId: "T-20240131-001" }
  ],
  "DR-002": [
    { id: "r4", ruleId: "DR-002", runTime: "2024-02-02 09:15:00", result: "未通过", violationCount: 3, durationMs: 2300, taskId: "T-20240202-002", message: "发现 3 条重复 order_id" },
    { id: "r5", ruleId: "DR-002", runTime: "2024-02-01 09:15:00", result: "通过", durationMs: 2100, taskId: "T-20240201-002" }
  ],
  "DR-003": [
    { id: "r6", ruleId: "DR-003", runTime: "2024-02-02 08:00:00", result: "通过", durationMs: 800, taskId: "T-20240202-003" }
  ],
  "DR-004": [
    { id: "r7", ruleId: "DR-004", runTime: "2024-01-20 16:00:00", result: "未通过", violationCount: 12, durationMs: 950, message: "12 条设备编码格式不符合规范" }
  ],
  "DR-005": [
    { id: "r8", ruleId: "DR-005", runTime: "2024-02-02 06:00:00", result: "通过", durationMs: 1500, taskId: "T-20240202-005" }
  ]
};
