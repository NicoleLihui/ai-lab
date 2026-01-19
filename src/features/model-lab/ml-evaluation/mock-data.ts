// 模型评估 Mock 数据

// 定义指标数据类型
export interface IndicatorData {
  metricStr: string; // 指标名称
  base: number; // 应用前均值
  applied: number; // 应用期均值
  rate: string; // 变化率
}

// 定义项目数据类型
export interface ProjectData {
  id: string;
  name: string; // 项目名称
  tag: string; // 项目标签
  region: string; // 所属大区
  beforeStart: string; // 应用前开始时间
  beforeEnd: string; // 应用前结束时间
  afterStart: string; // 应用期开始时间
  afterEnd: string; // 应用期结束时间
  summaryData: IndicatorData[]; // 指标数据列表
}

// Mock数据
export const mockProjectData: ProjectData[] = [
  {
    id: "ml-proj-1",
    name: "机器学习模型评估项目A",
    tag: "模型优化",
    region: "华东大区",
    beforeStart: "2024-01-01",
    beforeEnd: "2024-06-30",
    afterStart: "2024-07-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "准确率",
        base: 85.2,
        applied: 92.5,
        rate: "+8.6%"
      },
      {
        metricStr: "精确率",
        base: 82.3,
        applied: 89.1,
        rate: "+8.3%"
      },
      {
        metricStr: "召回率",
        base: 78.5,
        applied: 86.2,
        rate: "+9.8%"
      },
      {
        metricStr: "F1分数",
        base: 80.3,
        applied: 87.6,
        rate: "+9.1%"
      }
    ]
  },
  {
    id: "ml-proj-2",
    name: "深度学习模型评估项目B",
    tag: "性能提升",
    region: "华南大区",
    beforeStart: "2024-02-01",
    beforeEnd: "2024-07-31",
    afterStart: "2024-08-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "准确率",
        base: 88.5,
        applied: 94.2,
        rate: "+6.4%"
      },
      {
        metricStr: "AUC值",
        base: 0.852,
        applied: 0.921,
        rate: "+8.1%"
      },
      {
        metricStr: "损失值",
        base: 0.245,
        applied: 0.156,
        rate: "-36.3%"
      }
    ]
  },
  {
    id: "ml-proj-3",
    name: "时序预测模型评估项目C",
    tag: "预测优化",
    region: "华北大区",
    beforeStart: "2024-03-01",
    beforeEnd: "2024-08-31",
    afterStart: "2024-09-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "MAE",
        base: 12.5,
        applied: 8.3,
        rate: "-33.6%"
      },
      {
        metricStr: "RMSE",
        base: 15.8,
        applied: 10.2,
        rate: "-35.4%"
      },
      {
        metricStr: "MAPE",
        base: 5.2,
        applied: 3.1,
        rate: "-40.4%"
      },
      {
        metricStr: "R²",
        base: 0.852,
        applied: 0.936,
        rate: "+9.9%"
      }
    ]
  },
  {
    id: "ml-proj-4",
    name: "分类模型评估项目D",
    tag: "分类优化",
    region: "华东大区",
    beforeStart: "2024-04-01",
    beforeEnd: "2024-09-30",
    afterStart: "2024-10-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "准确率",
        base: 76.8,
        applied: 84.5,
        rate: "+10.0%"
      },
      {
        metricStr: "精确率",
        base: 74.2,
        applied: 82.1,
        rate: "+10.6%"
      },
      {
        metricStr: "召回率",
        base: 72.5,
        applied: 80.8,
        rate: "+11.4%"
      }
    ]
  },
  {
    id: "ml-proj-5",
    name: "回归模型评估项目E",
    tag: "回归优化",
    region: "西南大区",
    beforeStart: "2024-05-01",
    beforeEnd: "2024-10-31",
    afterStart: "2024-11-01",
    afterEnd: "2024-12-31",
    summaryData: [
      {
        metricStr: "MAE",
        base: 18.6,
        applied: 12.4,
        rate: "-33.3%"
      },
      {
        metricStr: "RMSE",
        base: 22.3,
        applied: 15.8,
        rate: "-29.1%"
      },
      {
        metricStr: "R²",
        base: 0.785,
        applied: 0.892,
        rate: "+13.6%"
      }
    ]
  }
];
