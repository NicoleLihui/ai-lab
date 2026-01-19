# Vue 页面转 React 转换状态

本文档列出了所有标识为"已具备"的页面及其转换状态。

## 转换状态说明

- ✅ **已转换**: 已创建 React 组件
- 🔄 **进行中**: 正在转换
- ⏳ **待转换**: 尚未开始转换
- ❌ **找不到**: 路径不存在或无法找到
- ⚠️ **路径不明确**: 路径格式不完整或需要进一步确认

## 页面转换列表

### 1. 模型实验室 (model-lab)

#### 1.1 模型训练 (training)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 机器学习模型 | machine-learning-models | model-training/machine-learning-models-page.tsx | ✅ 已转换 | 已存在 React 版本 |
| 训练任务管理 | training-tasks | model-evaluation/model-train/index.vue | ✅ 已转换 | 已存在 React 版本 |

#### 1.2 模型评估 (evaluation)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 离线评估 | offline-evaluation | model-management/model-backtesting/benefitEvaluation/index.vue | ⏳ 待转换 | |
| 效益评估 | benefit-evaluation | model-management/model-backtesting/benefitEvaluation/index.vue | ⏳ 待转换 | 与离线评估共用同一文件 |
| 机器学习模型评估 | ml-evaluation | model-management/model-backtesting/machineLearningEvaluation/index.vue | ⏳ 待转换 | |

#### 1.3 回测管理 (backtesting-mgmt)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 效益评估管理 | benefit-management | system-management/system-backtesting/systemBenefitEvaluation/index.vue | ⏳ 待转换 | |
| 机器学习评估管理 | ml-management | system-management/system-backtesting/systemMachineEvaluation/index.vue | ⏳ 待转换 | |

#### 1.4 北斗奖评估 (beidou-award)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 北斗奖效益评估 | beidou-benefit | model-management/beidou-award/beidouEvaluation/index.vue | ⏳ 待转换 | |
| 北斗奖机器学习评估 | beidou-ml | model-management/beidou-award/machineLearningBeidou/index.vue | ⏳ 待转换 | |

#### 1.5 模型广场 (model-plaza)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 模型广场 | model-plaza | model-management/model-plaza/index.vue | ⏳ 待转换 | |
| 模型在线试用 | model-trial | model-evaluation/model-ontrial/index.vue | ⏳ 待转换 | |
| 模型详情 | model-detail | model-management/model-plaza/detail.vue | ⏳ 待转换 | |

### 2. 模型中心 (model-center)

#### 2.1 模型上线 (release-governance)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 发布审批流 | release-approval | backend-management/review-model-release/index.vue | ⏳ 待转换 | |
| 模型发布审核 | model-release-review | backend-management/review-model-release/index.vue | ⏳ 待转换 | 与发布审批流共用同一文件 |
| 模型部署审核 | model-deploy-review | backend-management/review-model-deploy/index.vue | ⏳ 待转换 | |
| 模型部署管理 | deploy-ops | model-evaluation/model-deploy/index.vue | ⏳ 待转换 | |

#### 2.2 监控与告警 (monitoring)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 调用用量统计 | usage-stats | backend-management/usage-statistics/index.vue | ⏳ 待转换 | |

### 3. 数据中台 (data-platform)

#### 3.1 数据分类与标签 (taxonomy)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 数据分类管理 | classification | backend-management/data-catalog/data-classification/index.vue | ⏳ 待转换 | |
| 数据分类详情 | classification-detail | data-sandbox/data-catalog/detail.vue | ⏳ 待转换 | |
| 业务分析主题 | business-topic | backend-management/data-catalog/business-analysis-topic/index.vue | ⏳ 待转换 | |
| 标签类型管理 | tag-types | tag-management/tag-type.vue | ⏳ 待转换 | |
| 标签设置 | tag-settings | tag-management/tag-set.vue | ⏳ 待转换 | |

#### 3.2 数据资源目录 (data-catalog)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 业务实体管理 | business-entity | backend-management/data-catalog/business-entity/index.vue | ⏳ 待转换 | |
| 逻辑数据模型 | logical-model | backend-management/data-catalog/logical-data-model/index.vue | ⏳ 待转换 | |
| 数据目录搭建 | data-directory-build | data-sandbox/data-catalog/detail.vue | ⏳ 待转换 | 与数据分类详情共用同一文件 |
| 报表管理 | report-management | backend-management/data-catalog/reportManagement/index.vue | ⏳ 待转换 | |

#### 3.3 质量管理 (data-quality)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 敏感数据管理 | sensitive-data | backend-management/sensitive-data/index.vue | ⏳ 待转换 | |

### 4. 数据沙箱 (data-sandbox)

#### 4.1 数据集管理 (sandbox)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 数据集自助申请 | dataset-apply | data-sandbox/resource-application/index.vue | ⏳ 待转换 | |
| 数据集申请审核 | dataset-apply-review | backend-management/review-dataset-apply/index.vue | ⏳ 待转换 | |

#### 4.2 数据集广场 (dataset-plaza)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 数据集广场 | dataset-plaza | data-sandbox/dataset-management/index.vue | ⏳ 待转换 | |
| 数据集详情 | dataset-detail | data-sandbox/dataset-management/detail.vue | ⏳ 待转换 | |
| 数据上架管理 | data-open-management | data-sandbox/data-open/index.vue | ⏳ 待转换 | |
| 数据上架详情 | data-open-detail | data-sandbox/data-open/detail | ❌ 找不到 | 该目录下只有 index.vue，无 detail 文件 |
| 数据集上传审核 | upload-review | backend-management/review-dataset-upload/index.vue | ⏳ 待转换 | |
| 数据公开审核 | data-open-review | backend-management/review-data-open/index.vue | ⏳ 待转换 | |
| 权限申请 | permission-apply | data-sandbox/resource-application/ | ⚠️ 路径不明确 | 目录下有 index.vue 和 detail.vue，需确认使用哪个 |

### 5. 系统管理 (system)

#### 5.1 组织管理 (org-management)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 组织管理 | org-management | system-management/organization/index.vue | 🔄 进行中 | 已创建基础框架 |

#### 5.2 用户管理 (user-management)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 用户管理 | user-management | system-management/user/index.vue | ⏳ 待转换 | |

#### 5.3 角色管理 (role-management)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 角色管理 | role-management | system-management/role/index.vue | ⏳ 待转换 | |
| 用户授权 | user-authorization | system-management/authorizedUser/index.vue | ⏳ 待转换 | |

#### 5.4 字典管理 (dict-management)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 字典管理 | dict-management | system-management/dict/index.vue | ⏳ 待转换 | |

#### 5.5 日志管理 (log-management)

| 页面名称 | 页面 Key | 现有路径 | 状态 | 备注 |
|---------|---------|---------|------|------|
| 登录日志 | login-log | system-management/loginLog/index.vue | ⏳ 待转换 | |
| 操作日志 | operation-log | system-management/operatLog/index.vue | ⏳ 待转换 | |

## 找不到或路径不明确的页面

以下页面的路径存在问题，需要进一步确认：

1. **data-open-detail** (数据上架详情) ❌
   - 路径: `data-sandbox/data-open/detail`
   - 问题: `model-old/src/views/data-sandbox/data-open/` 目录下只有 `index.vue`，没有 `detail.vue` 文件
   - 建议: 
     - 检查是否应该使用 `data-sandbox/data-open/index.vue` 的详情功能
     - 或者检查是否应该使用其他路径，如 `data-sandbox/resource-application/detail.vue`

2. **permission-apply** (权限申请) ⚠️
   - 路径: `data-sandbox/resource-application/`
   - 问题: 路径指向目录，目录下有 `index.vue` 和 `detail.vue` 两个文件
   - 建议: 
     - 如果权限申请是独立功能，可能需要创建新页面
     - 如果与数据集申请相关，可能使用 `data-sandbox/resource-application/index.vue` 或 `detail.vue`
     - 需要根据业务逻辑确认具体使用哪个文件

## 转换优先级建议

### 高优先级（核心功能）
1. 系统管理模块（组织、用户、角色、日志）
2. 模型训练相关页面
3. 数据集管理相关页面

### 中优先级（常用功能）
1. 模型评估与回测
2. 数据中台相关页面
3. 模型广场

### 低优先级（辅助功能）
1. 北斗奖评估
2. 审核相关页面
3. 标签管理

## 注意事项

1. 部分页面共用同一个 Vue 文件，转换时需要根据页面 Key 区分功能
2. 所有转换后的 React 组件应使用项目统一的组件库 (`@/components/enterprise-ui`)
3. API 调用需要替换为实际的 API 服务
4. 状态管理可能需要使用 React Context 或状态管理库
5. 路由跳转需要适配 Next.js 的路由系统

## 下一步行动

1. 继续转换系统管理模块的剩余页面
2. 转换模型训练和评估相关页面
3. 转换数据中台和数据沙箱相关页面
4. 确认并修复路径不明确的页面
5. 完善已转换页面的功能实现
