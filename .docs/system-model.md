# 模型实验室 - 模块和功能规划描述

## 数据概览

- **工作表名称**: 模块划分
- **数据行数**: 72 行
- **数据列数**: 6 列
- **包含字段**: 一级模块, 二级模块, 功能描述, 开发进度, 现有路径 / 组件, 技术难度

## 详细功能规划表

| 序号 | 一级模块 | 二级模块 | 功能描述 | 开发进度 | 现有路径 / 组件 | 技术难度 |
|------|----------|----------|----------|----------|-------------------|----------|
| 1 | 模型实验室 (实验环境) | 环境配置 | Notebook 开发环境（Python/R 支持） | 待开发 | - | - |
| 2 | - | - | 环境隔离管理（Conda/Docker） | 待开发 | - | - |
| 3 | - | - | 资源动态挂载（GPU / 分布式存储） | 待开发 | - | - |
| 4 | - | 模型训练 | 训练任务创建、执行和监控 | 已具备 | model-evaluation/model-train/index.vue | - |
| 5 | - | 模型评估 | 离线评估 / 模型回测 | 已具备 | model-management/model-backtesting/benefitEvaluation/index.vue | - |
| 6 | - | - | 模型回测：效益评估 | 已具备 | model-management/model-backtesting/benefitEvaluation/index.vue | - |
| 7 | - | - | 模型回测：机器学习模型评估 | 已具备 | model-management/model-backtesting/machineLearningEvaluation/index.vue | - |
| 8 | - | - | 模型回测管理：效益评估管理 | 已具备 | system-management/system-backtesting/systemBenefitEvaluation/index.vue | - |
| 9 | - | - | 模型回测管理：机器学习模型评估管理 | 已具备 | system-management/system-backtesting/systemMachineEvaluation/index.vue | - |
| 10 | - | - | 北斗奖评估：效益评估 | 已具备 | model-management/beidou-award/beidouEvaluation/index.vue | - |
| 11 | - | - | 北斗奖评估：机器学习模型评估 | 已具备 | model-management/beidou-award/machineLearningBeidou/index.vue | - |
| 12 | - | 模型广场 | 预训练模型浏览 | 已具备 | model-management/model-plaza/index.vue | - |
| 13 | - | - | 模型在线试用 | 已具备 | model-evaluation/model-ontrial/index.vue | - |
| 14 | - | - | 模型详情页 | 已具备 | model-management/model-plaza/detail.vue | - |
| 15 | - | 智能体开发 | Agent 开发列表 | 待优化 | model-develop/agent/agent/index.vue | - |
| 16 | - | - | Agent 详情 / 配置 | 待优化 | model-management/model-plaza/detail.vue（复用） | - |
| 17 | - | 数据规则引擎 | 规则模型列表 | 待优化 | model-management/data-rule-models/index.vue | - |
| 18 | - | - | 规则模型详情 | 待优化 | model-management/model-plaza/detail.vue（复用） | - |
| 19 | 模型中心 (生产环境) | 模型库 | 版本化注册（Staging/Prod 标签） | 待开发 | - | - |
| 20 | - | - | 模型签名（输入输出 Schema） | 待开发 | - | - |
| 21 | - | - | 依赖包管理（环境自动打包） | 待开发 | - | - |
| 22 | - | 模型上线 | 发布审批流（工作流集成） | 已具备 | backend-management/review-model-release/index.vue | - |
| 23 | - | - | 准入检测（冒烟测试 / 基准测试） | 待开发 | - | - |
| 24 | - | - | 模型发布审核 | 已具备 | backend-management/review-model-release/index.vue | - |
| 25 | - | - | 模型部署审核 | 已具备 | backend-management/review-model-deploy/index.vue | - |
| 26 | - | - | 模型部署管理 | 已具备 | model-evaluation/model-deploy/index.vue | - |
| 27 | - | 模型调度 | 定时调度 | 待开发 | - | - |
| 28 | - | - | 任务触发调度 | 待开发 | - | - |
| 29 | - | - | API 调度 | 待开发 | - | - |
| 30 | - | 模型监控 | 服务性能监控（QPS / 延迟 / 错误率） | 待开发 | - | - |
| 31 | - | - | 数据漂移监控（PSI 检测） | 待开发 | - | - |
| 32 | - | - | 模型调用用量统计 | 已具备 | backend-management/usage-statistics/index.vue | - |
| 33 | - | - | 告警通知（邮件 / 即时通讯） | 待开发 | - | - |
| 34 | 数据中台 | 元数据管理 | 自动采集（表结构同步） | 待优化 | backend-management/data-catalog/metadata-management/index.vue | - |
| 35 | - | - | 血缘解析（数据追踪） | 待优化 | backend-management/data-catalog/metadata-management/index.vue | - |
| 36 | - | - | 数据字典（业务含义映射） | 待优化 | backend-management/data-catalog/metadata-management/index.vue | - |
| 37 | - | - | 标签类型管理 | 已具备 | tag-management/tag-type.vue | - |
| 38 | - | - | 标签设置 | 已具备 | tag-management/tag-set.vue | - |
| 39 | - | 数据资源目录 | 业务实体管理 | 已具备 | backend-management/data-catalog/business-entity/index.vue | - |
| 40 | - | - | 逻辑数据模型管理 | 已具备 | backend-management/data-catalog/logical-data-model/index.vue | - |
| 41 | - | - | 数据目录搭建 | 已具备 | data-sandbox/data-catalog/detail.vue | - |
| 42 | - | - | 数据分类管理 | 已具备 | backend-management/data-catalog/data-classification/index.vue | - |
| 43 | - | - | 数据分类详情 | 已具备 | data-sandbox/data-catalog/detail.vue | - |
| 44 | - | - | 业务分析主题管理 | 已具备 | backend-management/data-catalog/business-analysis-topic/index.vue | - |
| 45 | - | - | 报表管理 | 已具备 | backend-management/data-catalog/reportManagement/index.vue | - |
| 46 | - | 特征库 | 特征注册 | 待开发 | - | - |
| 47 | - | - | 特征复用分析 | 待开发 | - | - |
| 48 | - | 质量管理 | 敏感数据管理 | 已具备 | backend-management/sensitive-data/index.vue | - |
| 49 | - | - | 规则定义（空值 / 唯一性检查） | 待开发 | - | - |
| 50 | - | - | 门禁阻断（脏数据拦截） | 待开发 | - | - |
| 51 | 数据沙箱 | 数据集管理 | 自助申请 | 已具备 | data-sandbox/resource-application/index.vue | - |
| 52 | - | - | 数据集申请审核 | 已具备 | backend-management/review-dataset-apply/index.vue | - |
| 53 | - | - | 审核详情页 | 待优化 | backend-management/review-management/detail.vue | - |
| 54 | - | - | 语义加工（拖拽式处理） | 待开发 | - | - |
| 55 | - | - | 我的数据集 | 待优化 | data-sandbox/resource-application/（需改造） | - |
| 56 | - | 数据探查 | 即席查询（秒级查询） | 待开发 | - | - |
| 57 | - | - | SQL 历史记录 | 待开发 | - | - |
| 58 | - | 数据集广场 | 数据集浏览 | 已具备 | data-sandbox/dataset-management/index.vue | - |
| 59 | - | - | 数据集详情 | 已具备 | data-sandbox/dataset-management/detail.vue | - |
| 60 | - | - | 数据上架管理 | 已具备 | data-sandbox/data-open/index.vue | - |
| 61 | - | - | 数据上架详情 | 已具备 | data-sandbox/data-open/detail（复用 dataset-management/detail.vue） | - |
| 62 | - | - | 数据集上传审核 | 已具备 | backend-management/review-dataset-upload/index.vue | - |
| 63 | - | - | 数据公开审核 | 已具备 | backend-management/review-data-open/index.vue | - |
| 64 | - | - | Top N 数据采样预览 | 待开发 | - | - |
| 65 | - | - | 权限申请 | 已具备 | data-sandbox/resource-application/（功能内置） | - |
| 66 | 系统管理 | 组织管理 | 组织架构管理 | 已具备 | system-management/organization/index.vue | - |
| 67 | - | 用户管理 | 用户信息管理 | 已具备 | system-management/user/index.vue | - |
| 68 | - | 角色管理 | 角色权限管理 | 已具备 | system-management/role/index.vue | - |
| 69 | - | - | 用户授权 | 已具备 | system-management/authorizedUser/index.vue | - |
| 70 | - | 字典管理 | 数据字典配置 | 已具备 | system-management/dict/index.vue | - |
| 71 | - | 日志管理 | 登录日志 | 已具备 | system-management/loginLog/index.vue | - |
| 72 | - | - | 操作日志 | 已具备 | system-management/operatLog/index.vue | - |

## 统计分析

### 1. 开发进度分布

| 开发进度 | 功能数量 | 占比 |
|----------|----------|------|
| 已具备 | 42 | 58.3% |
| 待开发 | 21 | 29.2% |
| 待优化 | 9 | 12.5% |

### 2. 一级模块功能分布

| 一级模块 | 功能数量 |
|----------|----------|
| 模型实验室 (实验环境) | 1 |
| 模型中心 (生产环境) | 1 |
| 数据中台 | 1 |
| 数据沙箱 | 1 |
| 系统管理 | 1 |
