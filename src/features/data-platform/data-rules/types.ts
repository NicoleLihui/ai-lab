/** 数据规则状态 */
export type DataRuleStatus = "启用" | "停用";

/** 规则类型：空值、唯一性、范围、格式、自定义SQL等 */
export type RuleType =
  | "空值检查"
  | "唯一性检查"
  | "范围检查"
  | "格式检查"
  | "自定义SQL";

/** 门禁动作：发现脏数据时的处理方式 */
export type GateAction = "阻断" | "告警" | "仅记录";

/** 最近执行结果 */
export type LastRunResult = "通过" | "未通过" | "未执行" | "执行中";

export interface DataRuleItem {
  id: string;
  ruleName: string;
  ruleCode: string;
  ruleType: RuleType;
  /** 门禁动作：阻断 / 告警 / 仅记录 */
  gateAction: GateAction;
  /** 关联数据源：库.表 或 表.字段 */
  targetTable: string;
  targetField?: string;
  /** 规则参数（如空值率阈值、唯一性列、范围上下界等），JSON 或描述 */
  ruleParams?: string;
  status: DataRuleStatus;
  owner: string;
  description?: string;
  lastRunTime?: string;
  lastRunResult?: LastRunResult;
  /** 最近一次触发的脏数据条数（门禁阻断时） */
  lastViolationCount?: number;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

/** 规则执行记录（详情页用） */
export interface DataRuleRunRecord {
  id: string;
  ruleId: string;
  runTime: string;
  result: "通过" | "未通过";
  violationCount?: number;
  durationMs?: number;
  taskId?: string;
  message?: string;
}
