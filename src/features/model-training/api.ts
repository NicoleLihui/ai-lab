// 模拟 API 服务
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  msg?: string;
  message?: string;
}

export interface TrainPageParams {
  currentPage: number;
  pageSize: number;
  searchWord?: string;
  sort?: number;
  pageType?: number;
}

export interface TrainPageResponse {
  body: any[];
  total: number;
}

export interface DeployTestParams {
  modelId: number;
  runId: number;
  modelKey: string;
  modelName: string;
  version: string;
}

// 模拟获取训练页面数据
export const getTrainPage = (params: TrainPageParams): Promise<ApiResponse<TrainPageResponse>> => {
  return new Promise((resolve) => {
    // 模拟 API 延迟
    setTimeout(() => {
      // 创建模拟数据
      const mockData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        taskName: `训练任务${index + 1}`,
        modelName: `模型${index + 1}`,
        version: `v${Math.floor(index / 10)}.${index % 10}.0`,
        modelType: index % 3 === 0 ? '机器学习' : index % 3 === 1 ? '深度学习' : '传统算法',
        developLanguage: ['Python 3.7', 'Python 3.8', 'Python 3.9'][index % 3],
        statusName: ['运行中', '已完成', '等待中'][index % 3],
        trainTime: Math.floor(Math.random() * 10000),
        deployTestStatus: index % 3 === 0 ? 1 : 0,
        evaluateIndex: JSON.stringify([
          { name: 'accuracy', value: (0.7 + Math.random() * 0.3).toFixed(3) },
          { name: 'precision', value: (0.6 + Math.random() * 0.3).toFixed(3) },
          { name: 'recall', value: (0.65 + Math.random() * 0.25).toFixed(3) }
        ]),
        createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        modelId: index + 100,
        runId: index + 200,
        modelKey: `model_${index}`
      }));

      // 应用搜索过滤
      let filteredData = mockData;
      if (params.searchWord) {
        const searchLower = params.searchWord.toLowerCase();
        filteredData = mockData.filter(item => 
          item.taskName.toLowerCase().includes(searchLower) || 
          item.modelName.toLowerCase().includes(searchLower)
        );
      }

      // 应用分页
      const startIndex = (params.currentPage - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      resolve({
        success: true,
        data: {
          body: paginatedData,
          total: filteredData.length
        }
      });
    }, 300);
  });
};

// 模拟部署测试
export const getDeployTest = (params: DeployTestParams): Promise<ApiResponse<string>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `模型 ${params.modelName} 部署测试成功`,
        data: 'success'
      });
    }, 500);
  });
};