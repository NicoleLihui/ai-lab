'use client';

import React, { useState } from 'react';
import { MdDrawer } from '@/components/enterprise-ui';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TrainingGuideDrawerProps {
  open: boolean;
  onClose: () => void;
  modelId: number;
  modelName: string;
  experimentName?: string;
  username?: string;
}

export const TrainingGuideDrawer: React.FC<TrainingGuideDrawerProps> = ({
  open,
  onClose,
  modelId,
  modelName,
  experimentName,
  username,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success('已复制到剪贴板');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 生成实验名称和用户名（如果后端没有返回，使用默认值）
  const finalExperimentName = experimentName || `MLModel-${modelId}_V001`;
  const finalUsername = username || 'lihuihui01';

  const codeBlocks = [
    {
      id: 'params',
      title: '模型训练参数',
      code: `experiment_name = "${finalExperimentName}"  # [重要] 实验ID，请勿修改
username = "${finalUsername}"  # [重要] 开发者ID，用于权限校验
model_id = ${modelId}  # [重要] 模型ID，用于关联训练任务`,
    },
    {
      id: 'install',
      title: '安装依赖',
      code: `pip install mlflow==2.22.2 boto3 pandas numpy`,
    },
    {
      id: 'training',
      title: '模型训练示例',
      code: `import pandas as pd
import joblib
# ... 训练代码 ...

# 1. 记录训练时使用的特征列顺序 (非常重要！)
train_feature_names = X_train_df.columns.tolist()

# 2. 训练并保存 Scaler (如果用了归一化)
scaler.fit(X_train)

# 3. 计算评估指标
metrics_dict = {
    "mse": 0.045,
    "r2_score": 0.92
}

# 4. 保存模型文件
model.save("my_best_model.keras")`,
    },
    {
      id: 'deploy',
      title: '部署代码示例',
      code: `from mlops_deploy import run_pipeline_and_deploy

# 1. 组装辅助字典
aux_dict = {
    "scaler": scaler,
    "feature_names": train_feature_names,
    "seq_length": 12  # DL模型必填
}

# 2. 执行部署
if __name__ == "__main__":
    run_pipeline_and_deploy(
        sample_csv_path="load_data_source.csv",
        model_path="my_best_model.keras",
        feature_engineer_fn=feature_engineering_dl,
        post_process_fn=post_process_fn,
        aux_dict=aux_dict,
        metrics=metrics_dict,
        custom_objects={},
        model_type="keras",
        experiment_name="${finalExperimentName}",
        username="${finalUsername}",
        model_id=${modelId}  # 关联到当前模型
    )`,
    },
  ];

  return (
    <MdDrawer open={open} onClose={onClose} title="MLflow模型训练指南" width={900}>
      <div className="p-6 space-y-6">
        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">ℹ️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">模型训练参数</h3>
              <p className="text-sm text-blue-800 mb-2">
                请在部署脚本中直接使用以下核心参数，确保模型归属正确：
              </p>
              <div className="bg-white rounded p-3 mt-2 font-mono text-sm">
                <div>experiment_name = "{finalExperimentName}"</div>
                <div>username = "{finalUsername}"</div>
                <div>model_id = {modelId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 训练指南内容 */}
        <div className="space-y-6">
          {/* 1. 准备工作 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. 准备工作 (Preparation)</h2>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">1.1 获取部署脚本</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  请下载以下两个核心文件，并将其放置在您的项目根目录下：
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>test_env.py：用于验证 VPN 及服务连通性的测试脚本。</li>
                  <li>mlops_deploy.py：核心部署框架，内置了集团 MLflow/MinIO 连接配置。</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">1.2 连接集团网络</h3>
                <p className="text-sm text-muted-foreground">
                  请确保您的设备已连接到集团 VPN。如果无法连接 VPN，您将无法访问内部的 MLflow 和 MinIO 服务。
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">1.3 安装 Python 依赖</h3>
                <CodeBlock
                  code={codeBlocks[1].code}
                  onCopy={() => handleCopy(codeBlocks[1].code, codeBlocks[1].id)}
                  copied={copiedCode === codeBlocks[1].id}
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">1.4 运行环境自检 (推荐)</h3>
                <p className="text-sm text-muted-foreground mb-2">运行下载好的 test_env.py 脚本，确保网络通畅：</p>
                <CodeBlock
                  code="python test_env.py"
                  onCopy={() => handleCopy('python test_env.py', 'test-env')}
                  copied={copiedCode === 'test-env'}
                />
                <p className="text-sm text-muted-foreground mt-2">预期输出：</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                  <li>✅ MLflow 服务连接成功...</li>
                  <li>✅ S3 (MinIO) 服务连接成功...</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. 模型训练 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. 第一阶段：模型训练 (Model Training)</h2>
            <p className="text-sm text-muted-foreground mb-3 ml-4">
              在此阶段，您按常规流程训练模型。关键差异在于您不需要直接调用 MLflow 上传模型，而是将关键资产保存下来。
            </p>
            <div className="ml-4">
              <CodeBlock
                code={codeBlocks[2].code}
                onCopy={() => handleCopy(codeBlocks[2].code, codeBlocks[2].id)}
                copied={copiedCode === codeBlocks[2].id}
              />
            </div>
          </section>

          {/* 3. 逻辑标准化 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. 第二阶段：逻辑标准化 (Logic Standardization)</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3 ml-4">
              <p className="text-sm font-medium text-yellow-900 mb-2">⚠️ 开发铁律：</p>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1 ml-4">
                <li>函数内禁止读取文件 (如 pd.read_csv)，数据源必须是参数 raw_df。</li>
                <li>归一化必须使用 aux_dict['scaler'] 的 transform 方法，严禁使用 fit。</li>
              </ul>
            </div>
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">3.1 特征工程函数 (Feature Engineering)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  适用于 LSTM, GRU, Transformer 等输入为 3D 张量的模型：
                </p>
                <CodeBlock
                  code={`def feature_engineering_dl(raw_df, aux_dict):
    """
    [DL模式标准模板]
    
    参数说明:
    raw_df : pd.DataFrame - API 传入的原始数据
    aux_dict : dict - 包含训练状态的辅助字典
        - 'scaler': 训练好的归一化对象
        - 'feature_names': 训练时使用的特征列名列表
        - 'seq_length': 模型需要的序列长度
    
    返回:
    np.array - 形状为 (1, seq_length, n_features) 的 3D 张量
    """
    import pandas as pd
    import numpy as np
    
    scaler = aux_dict['scaler']
    feature_names = aux_dict['feature_names']
    seq_length = aux_dict['seq_length']
    
    # 特征对齐
    df_proc = pd.DataFrame()
    for col in feature_names:
        if col in raw_df.columns:
            df_proc[col] = raw_df[col]
        else:
            df_proc[col] = 0.0
    
    # 时序清洗
    df_proc = df_proc.interpolate(method='linear', limit_direction='both').fillna(0)
    
    # 归一化
    data_val = scaler.transform(df_proc.values.astype(np.float32))
    
    # 序列长度适配
    curr_len = len(data_val)
    if curr_len >= seq_length:
        final_seq = data_val[-seq_length:, :]
    else:
        padding = np.zeros((seq_length - curr_len, data_val.shape[1]), dtype=np.float32)
        final_seq = np.vstack((padding, data_val))
    
    # 升维
    return np.expand_dims(final_seq, axis=0)`}
                  onCopy={() => handleCopy('feature_engineering_dl', 'fe-dl')}
                  copied={copiedCode === 'fe-dl'}
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">3.2 线上后处理函数 (Post Process)</h3>
                <CodeBlock
                  code={`def post_process_fn(raw_pred, aux_dict):
    """通用后处理：将模型输出的归一化数值还原为真实业务数值"""
    import numpy as np
    scaler = aux_dict['scaler']
    
    # 提取标量结果
    val = raw_pred[0][0] if np.ndim(raw_pred) > 1 else raw_pred[0]
    
    # 反归一化
    dummy = np.zeros((1, scaler.n_features_in_))
    dummy[0, -1] = val
    real_val = scaler.inverse_transform(dummy)[0, -1]
    return real_val`}
                  onCopy={() => handleCopy('post_process_fn', 'post-process')}
                  copied={copiedCode === 'post-process'}
                />
              </div>
            </div>
          </section>

          {/* 4. 一键部署 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. 第三阶段：一键部署与验证 (Deployment)</h2>
            <p className="text-sm text-muted-foreground mb-3 ml-4">
              编写主程序调用部署接口。框架将自动执行打包、验证和上传。
            </p>
            <div className="ml-4">
              <CodeBlock
                code={codeBlocks[3].code}
                onCopy={() => handleCopy(codeBlocks[3].code, codeBlocks[3].id)}
                copied={copiedCode === codeBlocks[3].id}
              />
            </div>
            <div className="mt-4 ml-4">
              <h3 className="font-medium text-foreground mb-2">4.2 验证与归档机制</h3>
              <p className="text-sm text-muted-foreground mb-2">
                程序运行成功后，会自动在 MLflow 上归档以下两个文件，作为本次部署的唯一可信凭证：
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>📄 input_sample.csv：系统自动从您的 sample_csv_path 中截取的最后 N 行数据（标准输入样例）。</li>
                <li>📄 output_result.csv：系统使用上述样例，通过您的 feature_fn → model → post_fn 流水线计算出的预测结果（标准输出样例）。</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                当您在控制台看到 ✅ 上传成功! 字样时，即代表模型已通过验证并成功发布。
              </p>
            </div>
          </section>

          {/* 重要提示 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-2">✅ 训练完成后：</p>
            <p className="text-sm text-green-800">
              您的训练任务会自动关联到模型 <strong>{modelName}</strong> (ID: {modelId})，
              训练数据将出现在训练任务管理中，您可以在那里进行"部署测试"操作。
            </p>
          </div>
        </div>
      </div>
    </MdDrawer>
  );
};

// 代码块组件
const CodeBlock: React.FC<{ code: string; onCopy: () => void; copied: boolean }> = ({ code, onCopy, copied }) => {
  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
        title="复制代码"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};
