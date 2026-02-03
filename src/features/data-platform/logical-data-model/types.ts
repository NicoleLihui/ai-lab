export interface LogicalDataModel {
  id: string;
  entity: string;              // 实体/表名
  entityCode: string;          // 实体编码
  fieldCount: number;          // 字段数量
  businessDomain: string;       // 业务域
  dataSource: string;          // 数据来源
  businessEntity: string;       // 业务实体
  versionInfo: string;         // 版本信息
  businessDefinition: string;  // 业务定义
  businessRules: string;       // 业务规则
  responsibleDepartment: string; // 责任部门
  lifecycleStatus: string;     // 生命周期状态
  accessPermissions: string;   // 访问权限
  modelType: 'dimension' | 'detail'; // 模型类型：维度表/明细表
  creator: string;
  createTime: string;
  updateTime: string;
  [key: string]: unknown;
}

export interface ModelField {
  id: string;
  fieldName: string;      // 字段中文名称
  fieldCode: string;      // 字段标识
  fieldType: string;      // 字段类型
}

export type ModelType = 'dimension' | 'detail';
