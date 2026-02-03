// 数据分类类型定义

export interface DataClassification {
  id: string;
  classificationCode: string;        // 分类编码
  classificationName: string;        // 分类名称
  businessObject: string;            // 业务对象
  businessObjectId?: string;         // 业务对象ID
  dataType: string;                  // 数据类型（如：基础信息、化验工单等）
  description: string;               // 描述
  parentClassificationId?: string;   // 父分类ID（支持层级分类）
  catalogCode?: string;              // 数据目录编码
  catalogPath?: string;              // 数据目录路径
  status: '启用' | '禁用';           // 状态
  fieldCount?: number;               // 关联字段数量
  creator: string;                   // 创建人
  createTime: string;                // 创建时间
  updateTime: string;                // 更新时间
  [key: string]: unknown;
}

// 字段分类关联
export interface FieldClassification {
  id: string;
  classificationId: string;          // 数据分类ID
  classificationName: string;       // 数据分类名称
  logicalModelId: string;           // 逻辑数据模型ID
  logicalModelName: string;          // 逻辑数据模型名称
  fieldId: string;                  // 字段ID
  fieldName: string;                // 字段名称
  fieldCode: string;                // 字段编码
  businessObject: string;           // 业务对象
  tags?: string[];                  // 标签
  creator: string;                  // 创建人
  createTime: string;               // 创建时间
  [key: string]: unknown;
}

// 数据分类统计
export interface ClassificationStatistics {
  totalCount: number;                // 总分类数
  enabledCount: number;              // 启用数量
  disabledCount: number;             // 禁用数量
  fieldCount: number;                // 关联字段总数
  businessObjectCount: number;       // 业务对象数量
  byDataType: Record<string, number>; // 按数据类型统计
  byBusinessObject: Record<string, number>; // 按业务对象统计
}

// 审计日志
export interface ClassificationAuditLog {
  id: string;
  classificationId: string;
  classificationName: string;
  operation: '创建' | '更新' | '删除' | '启用' | '禁用' | '字段关联' | '字段取消关联';
  operator: string;
  operationTime: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  description?: string;
  [key: string]: unknown;
}

// 权限信息
export interface ClassificationPermission {
  id: string;
  classificationId: string;
  userId?: string;
  roleId?: string;
  permission: '查看' | '编辑' | '删除' | '管理';
  grantedBy: string;
  grantTime: string;
  [key: string]: unknown;
}
