# 模型实验室-模块和功能规划描述

## 数据概览
- 总记录数: 60 条
- 涉及模块层级: 一级模块 → 二级模块 → 三级模块
- 主要字段: 模块信息、功能描述、开发进度、技术实现路径、技术难度

## 详细功能规划表

| 序号 | 一级模块 | 二级模块 | 三级模块 | 功能描述 | 开发进度 | 现有路径/组件 | 技术难度 |
|------|----------|----------|----------|----------|----------|---------------|----------|
| 1 | 模型实验室<br>(实验环境) | 环境配置 | - | Notebook 开发环境（Python/R 支持）、环境隔离管理（Conda/Docker）、资源动态挂载（GPU / 分布式存储） | 待开发 | - |  |
| 2 | 模型开发 | 机器学习模型 | 新建、编辑、发布、试用、版本管理和删除模型的列表，发布后的模型会出现在模型广场，发布模型要调用工作流 | 已具备 | model-evaluation/model-train/index.vue |  |  |
| 3 | 智能体模型 | Agent 开发列表，支持新增，编辑，删除，版本管理，发布；编辑配置模型的信息、关联数据集、配置参数<br>可以使用模型名称和模型id来模糊搜索<br>试用、调试智能体工作流，跳转到外链，之前是dify定义工作流； | 待优化 | model-develop/agent/agent/index.vue |  |  |  |
| 4 | 数据规则模型 | 支持根据不同的时间维度、水厂维度等，配置数据计算规则（计算公式）<br>可以进行数据汇总和计算，可以保存数据规则模型到模型广场，也可以发布和部署 | 待优化 | model-management/data-rule-models/index.vue |  |  |  |
| 5 | 模型训练 | 训练任务创建、执行和监控；对数据规则模型和机器学习模型的训练任务列表，支持对训练的模型进行部署测试、支持训练结果查看 | 已具备 | model-evaluation/model-train/index.vue |  |  |  |
| 6 | 效益评估 | 效益评估 |  | 已具备 | model-management/model-backtesting/benefitEvaluation/index.vue |  |  |
| 7 | 效益评估管理 |  | 已具备 | model-management/model-backtesting/machineLearningEvaluation/index.vue |  |  |  |
| 8 | 北斗奖效益评估 |  | 已具备 | model-management/beidou-award/beidouEvaluation/index.vue |  |  |  |
| 9 | 机器学习模型评估 | 模型评估 |  | 已具备 | system-management/system-backtesting/systemBenefitEvaluation/index.vue |  |  |
| 10 | 评估管理 |  | 已具备 | system-management/system-backtesting/systemMachineEvaluation/index.vue |  |  |  |
| 11 | 北斗奖评估 |  | 已具备 | model-management/beidou-award/machineLearningBeidou/index.vue |  |  |  |
| 12 | 模型广场 | - | 预训练模型浏览、模型在线试用、模型详情页 | 已具备 | model-management/model-plaza/index.vue |  |  |
| 13 | 模型中心<br>(生产环境) | 模型库 | - | 版本化注册（Staging/Prod 标签）、模型签名（输入输出 Schema）、依赖包管理（环境自动打包） | 待开发 | - |  |
| 14 | 模型上线 | 准入检测 | （冒烟测试 / 基准测试） | 待开发 | - |  |  |
| 15 | 模型发布审核 |  | 已具备 | backend-management/review-model-release/index.vue |  |  |  |
| 16 | 模型部署审核 |  | 已具备 | backend-management/review-model-deploy/index.vue |  |  |  |
| 17 | 模型部署管理 |  | 已具备 | model-evaluation/model-deploy/index.vue |  |  |  |
| 18 | 模型调度 | 定时调度 |  | 待开发 | - |  |  |
| 19 | 任务触发调度 |  | 待开发 | - |  |  |  |
| 20 | API 调度 |  | 待开发 | - |  |  |  |
| 21 | 模型监控 | 性能监控 | 服务性能监控（QPS / 延迟 / 错误率） | 待开发 | - |  |  |
| 22 | 数据漂移监控 | （PSI 检测） | 待开发 | - |  |  |  |
| 23 | 模型用量统计 | 模型调用用量统计 | 已具备 | backend-management/usage-statistics/index.vue |  |  |  |
| 24 | 告警通知 | （邮件 / 即时通讯） | 待开发 | - |  |  |  |
| 25 | 数据中台 | 元数据管理 | 数据列表 | 自动采集（表结构同步）、血缘解析（数据追踪） | 待优化 | backend-management/data-catalog/metadata-management/index.vue |  |
| 26 | 数据字典 | 数据字典（业务含义映射） | 待优化 | - |  |  |  |
| 27 | 标签管理 | 标签类型管理 | 已具备 | tag-management/tag-type.vue |  |  |  |
| 28 | 标签设置 | 已具备 | tag-management/tag-set.vue |  |  |  |  |
| 29 | 数据资源目录 | 业务实体管理 | 业务实体管理 | 已具备 | backend-management/data-catalog/business-entity/index.vue |  |  |
| 30 | 逻辑数据模型管理 | 逻辑数据模型管理 | 已具备 | backend-management/data-catalog/logical-data-model/index.vue |  |  |  |
| 31 | 数据目录搭建 | 数据目录搭建 | 已具备 | data-sandbox/data-catalog/detail.vue |  |  |  |
| 32 | 数据分类管理 | 数据分类管理 | 已具备 | backend-management/data-catalog/data-classification/index.vue |  |  |  |
| 33 | 数据分类详情 | 数据分类详情 | 已具备 | data-sandbox/data-catalog/detail.vue |  |  |  |
| 34 | 业务分析主题管理 | 业务分析主题管理 | 已具备 | backend-management/data-catalog/business-analysis-topic/index.vue |  |  |  |
| 35 | 报表管理 | 报表管理 | 已具备 | backend-management/data-catalog/reportManagement/index.vue |  |  |  |
| 36 | 特征库 | 特征注册 | 特征注册 | 待开发 | - |  |  |
| 37 | 特征复用分析 | 特征复用分析 | 待开发 | - |  |  |  |
| 38 | 质量管理 | 敏感数据管理 | 敏感数据管理 | 已具备 | backend-management/sensitive-data/index.vue |  |  |
| 39 | 数据规则 | 规则定义（空值 / 唯一性检查）、门禁阻断（脏数据拦截） | 待开发 | - |  |  |  |
| 40 | 数据沙箱 | 数据集管理 | 数据集列表 | 调用工作流申请数据集、数据集的审核、数据集查看详情、数据集状态（审批中、已通过、被驳回）、 | 已具备 | data-sandbox/resource-application/index.vue |  |
| 41 | 数据集详情 | 支持数据探查，数据集详情查看 | 已具备 | backend-management/review-dataset-apply/index.vue |  |  |  |
| 42 | 数据集审核 | 审核详情页，审核、工作流详情查看 | 待优化 | backend-management/review-management/detail.vue |  |  |  |
| 43 | 数据集上传审核 | 数据集上传审核 | 已具备 | backend-management/review-dataset-upload/index.vue |  |  |  |
| 44 | 数据公开审核 | 数据公开审核 | 已具备 | backend-management/review-data-open/index.vue |  |  |  |
| 45 | 语义加工 | 语义加工（拖拽式处理） | 待开发 | 这是一个功能还是一个页面 |  |  |  |
| 46 | 我的数据集 | 我的数据集，支持未申请的数据集的增删改查 | 待开发 | - |  |  |  |
| 47 | 数据探查 | - | 即席查询（秒级查询）、SQL 历史记录 | 待开发 | 与数据集广场中的数据探查有什么关联 |  |  |
| 48 | 数据集广场 | 数据集 | 数据集浏览 | 已具备 | data-sandbox/dataset-management/index.vue |  |  |
| 49 | 数据集详情 | 已具备 | data-sandbox/dataset-management/detail.vue |  |  |  |  |
| 50 | 权限申请 | 待开发 | tag-management/tag-type.vue |  |  |  |  |
| 51 | 数据公开 | 数据上架管理 | 已具备 | data-sandbox/data-open/index.vue |  |  |  |
| 52 | 数据上架详情 | 已具备 | data-sandbox/data-open/detail（复用 dataset-management/detail.vue） |  |  |  |  |
| 53 | Top N 数据采样预览 | Top N 数据采样预览 | 待开发 | - |  |  |  |
| 54 | 系统管理 | 组织管理 |  | 组织架构管理 | 已具备 | system-management/organization/index.vue |  |
| 55 | 用户管理 |  | 用户信息管理 | 已具备 | system-management/user/index.vue |  |  |
| 56 | 角色管理 |  | 角色权限管理 | 已具备 | system-management/role/index.vue |  |  |
| 57 |  | 用户授权 | 已具备 | system-management/authorizedUser/index.vue |  |  |  |
| 58 | 字典管理 |  | 数据字典配置 | 已具备 | system-management/dict/index.vue |  |  |
| 59 | 日志管理 |  | 登录日志 | 已具备 | system-management/loginLog/index.vue |  |  |
| 60 |  | 操作日志 | 已具备 | system-management/operatLog/index.vue |  |  |  |

## 说明
1. 表格中空白字段表示暂无相关信息
2. 功能描述中的换行符已转换为HTML换行标签（<br>）以便在表格中正常显示
3. 原始数据中的竖线（|）已转换为中文竖线（｜）以避免Markdown表格格式错乱
4. 数据来源于 '模型实验室-模块和功能规划描述-调整.csv' 文件
