import type { SensitiveDataRule } from "./types";

export const sensitiveDataMockData: SensitiveDataRule[] = [
  {
    id: "SDR-001",
    ruleCode: "ID_CARD",
    ruleName: "身份证号识别",
    dataType: "个人身份信息",
    sensitiveLevel: "高",
    matchPattern: "^\\d{17}[\\dXx]$",
    maskAlgorithm: "掩码",
    dataSource: "数采",
    description: "识别并脱敏18位身份证号，保留前4后4",
    status: "启用",
    creator: "张三",
    createTime: "2024-01-10 09:00:00",
    updateTime: "2024-01-20 14:30:00"
  },
  {
    id: "SDR-002",
    ruleCode: "MOBILE",
    ruleName: "手机号识别",
    dataType: "个人身份信息",
    sensitiveLevel: "中",
    matchPattern: "mobile|phone|手机",
    maskAlgorithm: "掩码",
    dataSource: "基础数据",
    description: "手机号中间4位掩码",
    status: "启用",
    creator: "李四",
    createTime: "2024-01-12 10:15:00",
    updateTime: "2024-01-18 11:20:00"
  },
  {
    id: "SDR-003",
    ruleCode: "BANK_CARD",
    ruleName: "银行卡号识别",
    dataType: "财务信息",
    sensitiveLevel: "高",
    matchPattern: "bank_card|account_no|银行卡",
    maskAlgorithm: "加密",
    dataSource: "经营",
    description: "银行卡号加密存储与传输",
    status: "启用",
    creator: "王五",
    createTime: "2024-01-14 15:30:00",
    updateTime: "2024-01-19 16:00:00"
  },
  {
    id: "SDR-004",
    ruleCode: "CUSTOMER_NAME",
    ruleName: "客户姓名",
    dataType: "商业机密",
    sensitiveLevel: "中",
    matchPattern: "customer_name|客户姓名",
    maskAlgorithm: "替换",
    dataSource: "工单数据",
    description: "客户姓名替换为匿名标识",
    status: "启用",
    creator: "赵六",
    createTime: "2024-01-16 08:45:00",
    updateTime: "2024-01-21 09:10:00"
  },
  {
    id: "SDR-005",
    ruleCode: "SALARY",
    ruleName: "薪资信息",
    dataType: "财务信息",
    sensitiveLevel: "高",
    matchPattern: "salary|wage|薪资",
    maskAlgorithm: "哈希",
    dataSource: "经营",
    description: "薪资字段哈希后仅用于统计",
    status: "停用",
    creator: "张三",
    createTime: "2024-01-17 13:00:00",
    updateTime: "2024-01-22 10:00:00"
  }
];
