# MLflow模型上传管理方案

## 一、概述

参考腾讯云TIONE的任务式建模流程，结合我们的建模过程，模型工程师在本地完成模型开发后，通过MLflow实现模型资产的上传管理，然后在模型实验室进行训练部署配置。

## 二、流程设计

### 2.1 完整流程

```
1. 模型工程师在本地开发模型
   ↓
2. 集成MLflow实现模型资产上传
   ↓
3. 在模型实验室创建训练任务（配置：资源配置、数据来源、训练参数）
   ↓
4. 训练完成后，部署到测试环境（开发/测试环境，无需审核）
   ↓
5. 在实验室中试用、模型评估
   ↓
6. 已训练好的模型做生产部署（发布到模型中心，进入模型库）
   ↓
7. 生产环境部署需要审核工作流
```

### 2.2 关键节点说明

#### 节点1：本地模型开发
- 模型工程师在自己的开发环境中完成模型代码编写
- 使用MLflow进行本地实验跟踪和模型管理
- 确保模型代码符合MLflow规范

#### 节点2：MLflow模型资产上传
- 使用MLflow Tracking API记录训练过程
- 使用MLflow Model Registry管理模型版本
- 模型资产包括：
  - 模型文件（.pkl, .h5, .pb等）
  - 模型签名（输入输出Schema）
  - 训练参数和超参数
  - 评估指标
  - 训练环境信息（Python版本、依赖包等）
  - 训练数据样本（用于验证）

#### 节点3：训练任务创建
参考TIONE任务式建模，在模型实验室创建训练任务时需要配置：

**基本信息**：
- 任务名称
- 地域
- 训练镜像（PyTorch/TensorFlow/PaddlePaddle等）
- 训练模式（单机/DDP/MPI/Ray）
- 机器来源（CVM/TIONE平台）

**资源配置**：
- 资源组
- GPU型号和数量
- CPU核数
- 内存大小
- 节点数（分布式训练）

**数据来源**：
- Git代码仓库（模型代码）
- Git存储路径
- 训练数据集（从数据集管理选择）

**训练参数**：
- 启动命令
- 调优参数（JSON格式）
- 训练输出路径

#### 节点4：测试环境部署
- 训练完成后，可以直接部署到开发/测试环境
- **无需审核**，用于快速验证和试用
- 支持模型评估和性能测试

#### 节点5：模型评估
- 在测试环境中对模型进行评估
- 支持多种评估指标（准确率、精确率、召回率、F1等）
- 可以对比不同版本的模型性能

#### 节点6：生产环境部署
- 已通过测试的模型可以申请部署到生产环境
- 需要填写审核信息：
  - 部署原因
  - 预期影响
  - 回滚方案
- 提交后进入审核工作流

#### 节点7：审核工作流
- 部署审核由工作流系统处理
- 审核通过后自动部署到生产环境
- 部署成功后，模型自动发布到模型中心并进入模型库

## 三、MLflow集成方案

### 3.1 MLflow配置

```python
import mlflow
import os

# 配置MLflow Tracking URI
os.environ['MLFLOW_TRACKING_URI'] = 'https://ailab-mlflow.bewg.net.cn/'

# 配置S3存储（MinIO）
os.environ['AWS_ACCESS_KEY_ID'] = 'minioadmin'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'minioadmin'
os.environ['MLFLOW_S3_ENDPOINT_URL'] = 'https://ailab-minio.bewg.net.cn/'

# 设置用户信息
os.environ['USER'] = '{{userName}}'
os.environ['MLFLOW_USER'] = '{{userName}}'

# 设置实验名称（使用模型ID+版本号）
mlflow.set_experiment("{{modelIdVersion}}")
```

### 3.2 模型上传示例

```python
import mlflow
import mlflow.tensorflow  # 或 mlflow.pytorch, mlflow.sklearn

# 开始一个运行
with mlflow.start_run():
    # 记录参数
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("batch_size", 32)
    mlflow.log_param("epochs", 10)
    
    # 训练模型
    model = train_model(...)
    
    # 记录评估指标
    mlflow.log_metric("accuracy", 0.95)
    mlflow.log_metric("loss", 0.05)
    
    # 记录模型
    mlflow.tensorflow.log_model(
        model,
        artifact_path="model",
        signature=mlflow.models.infer_signature(X_train, y_train)
    )
    
    # 记录训练数据样本（用于验证）
    sample_data = X_train.head(100)
    sample_data.to_csv("input_sample.csv", index=False)
    mlflow.log_artifact("input_sample.csv", artifact_path="validation")
    
    # 记录预测结果样本
    predictions = model.predict(sample_data)
    output_sample = pd.DataFrame({
        'prediction': predictions.flatten()
    })
    output_sample.to_csv("output_sample.csv", index=False)
    mlflow.log_artifact("output_sample.csv", artifact_path="validation")
```

### 3.3 模型注册

```python
# 注册模型到Model Registry
model_uri = f"runs:/{run.info.run_id}/model"
model_name = "{{modelId}}"

# 注册新版本
mlflow.register_model(model_uri, model_name)

# 或更新现有模型
client = mlflow.tracking.MlflowClient()
client.create_model_version(
    name=model_name,
    source=model_uri,
    run_id=run.info.run_id
)
```

## 四、系统集成

### 4.1 模型资产选择

在创建训练任务时，可以从MLflow Model Registry中选择已上传的模型资产：

1. **选择模型**：从MLflow Model Registry中选择模型和版本
2. **查看模型信息**：
   - 模型签名（输入输出Schema）
   - 训练参数
   - 评估指标
   - 训练环境信息
3. **验证数据**：查看输入输出样本，确保数据格式正确

### 4.2 训练任务关联

训练任务创建时：
- 关联MLflow模型ID和版本
- 关联MLflow Run ID（用于追踪训练过程）
- 训练完成后，更新MLflow模型状态

### 4.3 部署关联

部署时：
- 从MLflow Model Registry加载模型
- 使用模型签名验证输入输出
- 记录部署信息到MLflow（部署环境、部署时间等）

## 五、部署状态管理

### 5.1 部署测试状态

- **状态值**：`deployTestStatus`
- **状态说明**：
  - `0`：未部署测试
  - `1`：已部署测试
- **特点**：
  - 部署到开发/测试环境
  - 无需审核
  - 用于模型试用和评估

### 5.2 部署生产状态

- **状态值**：`deployProdStatus`
- **状态说明**：
  - `0`：未部署生产
  - `1`：已部署生产
  - `2`：审核中
- **特点**：
  - 部署到生产环境
  - 需要审核工作流
  - 部署成功后进入模型库

## 六、用户界面设计

### 6.1 训练任务创建页面

参考TIONE任务式建模界面，包含以下部分：

1. **基本信息**：任务名称、地域、训练镜像、训练模式
2. **资源配置**：资源组、GPU/CPU/内存配置、节点数
3. **数据来源**：Git代码仓库、数据集选择
4. **训练参数**：启动命令、调优参数
5. **其他配置**：日志、重启、健康检查等

### 6.2 训练任务管理页面

- 显示所有训练任务列表
- 支持操作：
  - **部署测试**：一键部署到测试环境（无需审核）
  - **部署生产**：跳转到生产部署页面（需要审核）
  - **训练结果**：查看训练指标和输出结果

### 6.3 生产部署页面

三步流程：
1. **部署配置**：资源配置、实例规格、访问配置
2. **数据目录**：业务实体、输出参数映射
3. **审核信息**：部署原因、预期影响、回滚方案

## 七、API设计

### 7.1 训练任务创建

```typescript
POST /api/training/tasks

{
  "taskName": "string",
  "region": "string",
  "trainingImage": "string",
  "trainingMode": "single" | "DDP" | "MPI" | "Ray",
  "resourceGroup": "string",
  "gpuPerNode": number,
  "cpuPerNode": number,
  "memoryPerNode": number,
  "nodeCount": number,
  "gitRepository": "string",
  "gitStoragePath": "string",
  "datasetId": "string",
  "startupCommand": "string",
  "tuningParameters": "string",
  "mlflowModelId": "string",  // MLflow模型ID
  "mlflowVersion": "string"    // MLflow模型版本
}
```

### 7.2 部署测试

```typescript
POST /api/training/tasks/{taskId}/deploy-test

{
  "modelId": "string",
  "runId": "string",
  "version": "string"
}
```

### 7.3 部署生产

```typescript
POST /api/training/tasks/{taskId}/deploy-production

{
  "modelId": "string",
  "runId": "string",
  "version": "string",
  "deployConfig": {
    "deployName": "string",
    "resourceGroup": "string",
    "instanceType": "string",
    "instanceCount": number
  },
  "dataCatalog": {
    "businessEntityId": "string",
    "topicId": "string",
    "outputParameters": [...]
  },
  "scheduleConfig": {
    "applicationScope": [...],
    "taskType": "string"
  },
  "reviewInfo": {
    "deployReason": "string",
    "expectedImpact": "string",
    "rollbackPlan": "string"
  }
}
```

## 八、注意事项

1. **MLflow模型规范**：
   - 确保模型符合MLflow Model Signature规范
   - 提供完整的输入输出样本数据
   - 记录训练环境和依赖信息

2. **数据安全**：
   - Git代码仓库需要权限控制
   - 数据集选择需要数据权限验证
   - 生产部署需要审核流程

3. **资源管理**：
   - 训练任务运行中会产生费用
   - 不使用时及时停止任务
   - 合理配置资源规格

4. **版本管理**：
   - MLflow自动管理模型版本
   - 系统记录部署版本历史
   - 支持版本回滚

## 九、后续优化

1. **MLflow集成增强**：
   - 支持从MLflow直接选择模型资产
   - 自动同步MLflow模型信息
   - 支持模型对比和版本管理

2. **自动化流程**：
   - 训练完成后自动触发测试部署
   - 评估通过后自动提交生产部署申请
   - 审核通过后自动部署

3. **监控和告警**：
   - 训练任务状态监控
   - 部署状态监控
   - 异常告警通知
