"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, Space, Tag, Modal, Form, Select, Spin, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import BeTable from '@/components/enterprise-ui/table';
import BePager from '@/components/enterprise-ui/pagination';

interface MachineLearningModel {
  id: number;
  name: string;
  type: string;
  version: string;
  status: string;
  createdTime: string;
  accuracy: number;
  description: string;
}

const MachineLearningModelsPage: React.FC = () => {
  const [data, setData] = useState<MachineLearningModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<MachineLearningModel | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Mock data for machine learning models
  const mockData: MachineLearningModel[] = [
    {
      id: 1,
      name: '客户流失预测模型',
      type: '分类模型',
      version: 'v1.2.0',
      status: '已发布',
      createdTime: '2023-06-15',
      accuracy: 0.92,
      description: '基于历史客户数据预测客户流失概率'
    },
    {
      id: 2,
      name: '销售预测模型',
      type: '回归模型',
      version: 'v2.1.0',
      status: '已发布',
      createdTime: '2023-06-20',
      accuracy: 0.87,
      description: '预测未来销售额'
    },
    {
      id: 3,
      name: '信用评分模型',
      type: '分类模型',
      version: 'v1.0.5',
      status: '测试中',
      createdTime: '2023-07-01',
      accuracy: 0.94,
      description: '评估客户信用风险等级'
    },
    {
      id: 4,
      name: '需求预测模型',
      type: '时间序列',
      version: 'v1.1.2',
      status: '开发中',
      createdTime: '2023-07-05',
      accuracy: 0.89,
      description: '预测产品需求量'
    },
    {
      id: 5,
      name: '欺诈检测模型',
      type: '分类模型',
      version: 'v1.3.0',
      status: '已发布',
      createdTime: '2023-05-20',
      accuracy: 0.96,
      description: '实时检测交易欺诈行为'
    },
    {
      id: 6,
      name: '推荐系统模型',
      type: '协同过滤',
      version: 'v2.0.1',
      status: '测试中',
      createdTime: '2023-06-30',
      accuracy: 0.85,
      description: '个性化商品推荐'
    },
    {
      id: 7,
      name: '情感分析模型',
      type: 'NLP模型',
      version: 'v1.0.8',
      status: '已发布',
      createdTime: '2023-07-10',
      accuracy: 0.91,
      description: '分析文本情感倾向'
    },
    {
      id: 8,
      name: '图像识别模型',
      type: 'CNN模型',
      version: 'v1.5.0',
      status: '已发布',
      createdTime: '2023-06-25',
      accuracy: 0.95,
      description: '识别图像中的物体'
    }
  ];

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, searchTerm]);

  const loadData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filteredData = [...mockData];
      
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      
      setData(paginatedData);
      setTotal(filteredData.length);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadData();
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadData();
  };

  const handleEdit = (record: MachineLearningModel) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模型吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setData(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
      }
    });
  };

  const handleView = (record: MachineLearningModel) => {
    message.info(`查看模型: ${record.name}`);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    message.success('模型信息已更新');
  };

  const columns = [
    {
      type: 'index',
      prop: 'id',
      label: '序号',
      align: 'center',
      width: 60
    },
    {
      prop: 'name',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'type',
      label: '模型类型',
      align: 'center'
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center'
    },
    {
      prop: 'status',
      label: '状态',
      align: 'center',
      format: (record: MachineLearningModel) => {
        let color = 'default';
        if (record.status === '已发布') color = 'green';
        if (record.status === '测试中') color = 'orange';
        if (record.status === '开发中') color = 'blue';
        return `<span class="ant-tag ant-tag-${color}">${record.status}</span>`;
      }
    },
    {
      prop: 'accuracy',
      label: '准确率',
      align: 'center',
      format: (record: MachineLearningModel) => {
        return `<span>${(record.accuracy * 100).toFixed(2)}%</span>`;
      }
    },
    {
      prop: 'createdTime',
      label: '创建时间',
      align: 'center'
    },
    {
      prop: 'description',
      label: '描述',
      align: 'center'
    },
    {
      type: 'actions',
      label: '操作',
      minWidth: 180,
      buttons: (row: MachineLearningModel) => {
        return [
          {
            name: '查看',
            command: 'view',
            type: 'link',
          },
          {
            name: '编辑',
            command: 'edit',
            type: 'link'
          },
          {
            name: '删除',
            command: 'delete',
            type: 'link',
            disabled: row.status !== '开发中'
          }
        ];
      }
    }
  ];

  const onCommand = (command: string, row: MachineLearningModel) => {
    switch (command) {
      case 'view':
        handleView(row);
        break;
      case 'edit':
        handleEdit(row);
        break;
      case 'delete':
        handleDelete(row.id);
        break;
    }
  };

  return (
    <div className="machine-learning-models" style={{ padding: '24px', height: '100%', backgroundColor: '#f5f5f5' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>机器学习模型管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('创建新模型')}>
            创建模型
          </Button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Space>
            <Input
              placeholder="搜索模型名称或描述"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
            />
            <Button onClick={handleSearch}>搜索</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>
      </Card>

      <Card>
        <div className="data-table-container" style={{ marginBottom: '20px' }}>
          <Spin spinning={loading}>
            <BeTable
              tableData={data}
              columns={columns}
              options={{
                paginationConfig: {
                  currentPage,
                  pageSize,
                  total
                },
                rowKey: 'id'
              }}
              onCommand={onCommand}
            />
          </Spin>
        </div>

        <div style={{ textAlign: 'right' }}>
          <BePager
            currentPage={currentPage}
            pageSize={pageSize}
            total={total}
            list={data}
            callback={(page, size) => {
              setCurrentPage(page);
              if (size) setPageSize(size);
            }}
          />
        </div>
      </Card>

      {/* Edit Model Modal */}
      <Modal
        title="编辑模型"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        {editingRecord && (
          <Form layout="vertical">
            <Form.Item label="模型名称">
              <Input value={editingRecord.name} />
            </Form.Item>
            <Form.Item label="模型类型">
              <Select value={editingRecord.type}>
                <Select.Option value="分类模型">分类模型</Select.Option>
                <Select.Option value="回归模型">回归模型</Select.Option>
                <Select.Option value="聚类模型">聚类模型</Select.Option>
                <Select.Option value="时间序列">时间序列</Select.Option>
                <Select.Option value="NLP模型">NLP模型</Select.Option>
                <Select.Option value="CNN模型">CNN模型</Select.Option>
                <Select.Option value="协同过滤">协同过滤</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="版本">
              <Input value={editingRecord.version} />
            </Form.Item>
            <Form.Item label="状态">
              <Select value={editingRecord.status}>
                <Select.Option value="开发中">开发中</Select.Option>
                <Select.Option value="测试中">测试中</Select.Option>
                <Select.Option value="已发布">已发布</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="准确率">
              <Input value={`${(editingRecord.accuracy * 100).toFixed(2)}%`} />
            </Form.Item>
            <Form.Item label="描述">
              <Input.TextArea rows={4} value={editingRecord.description} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default MachineLearningModelsPage;