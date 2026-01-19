"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Pagination, Modal, Form, Select, Tree, Tag, Space, Spin, Alert, Empty, Divider, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import BeTable from '@/components/enterprise-ui/table';
import BePager from '@/components/enterprise-ui/pagination';

interface ModelInfo {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  description: string;
  createdTime: string;
  tags: string[];
}

interface TreeNode {
  id: number | string;
  name: string;
  orgId?: number;
  children?: TreeNode[];
}

const ModelPlazaPage: React.FC = () => {
  const [dataList, setDataList] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [classification, setClassification] = useState<'business' | 'organization'>('organization');
  const [currentTagId, setCurrentTagId] = useState<number | null>(null);
  const [currentTreeId, setCurrentTreeId] = useState<number | string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    publicStatus: '',
    modelType: '',
    applicableScenario: '',
  });
  const [commonTags, setCommonTags] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isShowAddModel, setIsShowAddModel] = useState<boolean>(false);

  // Mock data for models
  const mockModels: ModelInfo[] = [
    {
      id: 1,
      name: 'NLP文本分类模型',
      type: '机器学习',
      version: 'v1.2.0',
      status: '已发布',
      description: '基于深度学习的文本分类模型，适用于多类别文本分类任务',
      createdTime: '2023-06-15',
      tags: ['自然语言处理', '分类']
    },
    {
      id: 2,
      name: '图像识别模型',
      type: '深度学习',
      version: 'v2.1.0',
      status: '已发布',
      description: '基于CNN的图像识别模型，准确率达到95%',
      createdTime: '2023-06-14',
      tags: ['计算机视觉', '识别']
    },
    {
      id: 3,
      name: '时间序列预测模型',
      type: '机器学习',
      version: 'v1.0.5',
      status: '开发中',
      description: '用于预测时间序列数据的趋势和周期性变化',
      createdTime: '2023-06-16',
      tags: ['预测', '时间序列']
    },
    {
      id: 4,
      name: '情感分析模型',
      type: '深度学习',
      version: 'v1.1.2',
      status: '已发布',
      description: '分析文本中的情感倾向，支持多种情感类别',
      createdTime: '2023-06-10',
      tags: ['自然语言处理', '情感分析']
    },
    {
      id: 5,
      name: '推荐系统模型',
      type: '机器学习',
      version: 'v2.0.1',
      status: '测试中',
      description: '基于协同过滤和内容推荐的混合推荐算法',
      createdTime: '2023-06-12',
      tags: ['推荐系统', '协同过滤']
    },
    {
      id: 6,
      name: '异常检测模型',
      type: '机器学习',
      version: 'v0.9.0',
      status: '开发中',
      description: '用于检测数据中的异常点或异常模式',
      createdTime: '2023-06-18',
      tags: ['异常检测', '监督学习']
    }
  ];

  // Mock data for organization tree
  const mockTreeData: TreeNode[] = [
    {
      id: 1,
      name: '技术部',
      orgId: 1,
      children: [
        {
          id: 11,
          name: 'AI研发组',
          orgId: 11
        },
        {
          id: 12,
          name: '数据工程组',
          orgId: 12
        }
      ]
    },
    {
      id: 2,
      name: '产品部',
      orgId: 2,
      children: [
        {
          id: 21,
          name: 'AI产品组',
          orgId: 21
        }
      ]
    },
    {
      id: 3,
      name: '市场部',
      orgId: 3
    }
  ];

  // Mock data for tags
  const mockTags = [
    { id: 1, tagName: '自然语言处理' },
    { id: 2, tagName: '计算机视觉' },
    { id: 3, tagName: '推荐系统' },
    { id: 4, tagName: '预测分析' },
    { id: 5, tagName: '异常检测' },
    { id: 6, tagName: '语音识别' },
    { id: 7, tagName: '图像处理' },
    { id: 8, tagName: '强化学习' }
  ];

  // Load initial data
  useEffect(() => {
    loadTags();
    loadTreeData();
    loadData();
  }, [currentPage, pageSize, classification, currentTagId, currentTreeId, formData]);

  const loadTags = () => {
    // In real app, this would call an API
    setCommonTags(mockTags);
  };

  const loadTreeData = () => {
    // In real app, this would call an API
    setTreeData(mockTreeData);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter data based on search criteria
      let filteredData = [...mockModels];

      // Apply name filter
      if (formData.name) {
        filteredData = filteredData.filter(model => 
          model.name.toLowerCase().includes(formData.name.toLowerCase())
        );
      }

      // Apply model type filter
      if (formData.modelType) {
        filteredData = filteredData.filter(model => 
          model.type === formData.modelType
        );
      }

      // Apply tag filter
      if (classification === 'business' && currentTagId) {
        // Simplified tag filtering for demo
        filteredData = filteredData.filter(model => 
          model.tags.some(tag => tag.includes(mockTags.find(t => t.id === currentTagId)?.tagName || ''))
        );
      }

      // Apply tree filter
      if (classification === 'organization' && currentTreeId) {
        // For demo purposes, we'll skip actual tree filtering
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

      setDataList(paginatedData);
      setTotal(filteredData.length);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClass = (type: 'business' | 'organization') => {
    setClassification(type);
    if (type === 'organization') {
      setCurrentTagId(null);
    }
  };

  const handleNodeClick = (selectedKeys: React.Key[], info: any) => {
    const nodeId = selectedKeys[0];
    setCurrentTreeId(nodeId);
  };

  const tagHandle = (item: any) => {
    if (currentTagId === item.id) {
      setCurrentTagId(null);
    } else {
      setCurrentTagId(item.id);
    }
  };

  const handleFilterSearch = (values: any) => {
    setFormData(prev => ({
      ...prev,
      ...values
    }));
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterReset = () => {
    setFormData({
      name: '',
      publicStatus: '',
      modelType: '',
      applicableScenario: '',
    });
    setCurrentPage(1);
    setPageSize(20);
    setCurrentTagId(null);
    setCurrentTreeId(null);
  };

  const handlePageSizeChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddModel = () => {
    setIsShowAddModel(true);
  };

  const handleCloseModel = () => {
    setIsShowAddModel(false);
    loadData(); // Refresh data after closing
  };

  const modelTypes = [
    { label: '机器学习', value: '机器学习' },
    { label: '深度学习', value: '深度学习' },
    { label: '传统算法', value: '传统算法' }
  ];

  return (
    <div className="detail-config" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="left-content" style={{ width: '310px', paddingRight: '24px', borderRight: '1px solid #ddd', height: '100%', overflow: 'hidden', overflowY: 'auto' }}>
        <div className="content-title" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>模型分类</h3>
          <div className="content-title-extra">
            <Button
              type={classification === 'organization' ? 'primary' : 'text'}
              onClick={() => handleClass('organization')}
            >
              按组织
            </Button>
            <Divider type="vertical" />
            <Button 
              type={classification === 'business' ? 'primary' : 'text'} 
              onClick={() => handleClass('business')}
            >
              按标签
            </Button>
          </div>
        </div>

        {classification === 'organization' ? (
          <div className="catalog-tree">
            <Tree
              treeData={treeData}
              onSelect={handleNodeClick}
              defaultExpandAll
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
            />
          </div>
        ) : (
          <div>
            <div className="tag-target-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {commonTags.map((item) => (
                <Tag
                  key={item.id}
                  color={currentTagId === item.id ? '#ff8929' : '#b3e4ff'}
                  style={{
                    cursor: 'pointer',
                    color: currentTagId === item.id ? '#fff' : 'inherit',
                    borderColor: currentTagId === item.id ? '#ff8929' : '#b3e4ff'
                  }}
                  onClick={() => tagHandle(item)}
                >
                  {item.tagName}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="right-content" style={{ flex: 1, paddingLeft: '24px', overflow: 'auto' }}>
        <div className="content-title" style={{ marginBottom: '20px' }}>
          <h3>模型列表</h3>
        </div>

        <div className="search-criteria" style={{ marginBottom: '20px' }}>
          <Form
            layout="inline"
            onFinish={handleFilterSearch}
            initialValues={formData}
          >
            <Form.Item label="模型名称" name="name">
              <Input placeholder="请输入模型名称" />
            </Form.Item>
            
            <Form.Item label="模型类型" name="modelType">
              <Select placeholder="请选择模型类型" style={{ width: 150 }}>
                {modelTypes.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button onClick={handleFilterReset}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        <div className="content-main" style={{ flex: 1, overflow: 'auto' }}>
          <div className="data-table-container">
            <div className="card-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Spin spinning={loading}>
                {dataList.length > 0 ? (
                  dataList.map((item) => (
                    <Card 
                      key={item.id} 
                      title={item.name}
                      style={{ width: 'calc(33% - 11px)', marginBottom: '16px' }}
                      hoverable
                      onClick={() => message.info(`查看模型 ${item.name} 详情`)}
                    >
                      <div>
                        <p><strong>类型:</strong> {item.type}</p>
                        <p><strong>版本:</strong> {item.version}</p>
                        <p><strong>状态:</strong> 
                          <Tag color={
                            item.status === '已发布' ? 'green' : 
                            item.status === '测试中' ? 'orange' : 'blue'
                          }>
                            {item.status}
                          </Tag>
                        </p>
                        <p><strong>标签:</strong> {item.tags.join(', ')}</p>
                        <p><strong>创建时间:</strong> {item.createdTime}</p>
                        <p><strong>描述:</strong> {item.description}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Empty description="暂无数据" />
                  </div>
                )}
              </Spin>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Model Modal */}
      {isShowAddModel && (
        <Modal
          title="创建模型"
          open={isShowAddModel}
          onCancel={handleCloseModel}
          footer={null}
          width={800}
        >
          <p>创建模型的表单内容...</p>
        </Modal>
      )}
    </div>
  );
};

export default ModelPlazaPage;