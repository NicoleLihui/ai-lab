'use client';

import React, { useState } from 'react';
import { MdCard as Card, MdCardHeader as CardHeader, MdCardTitle as CardTitle, MdCardContent as CardContent } from '@/components/enterprise-ui/md-card';
import { MdButton as Button } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { cn } from '@/lib/utils';

interface DataDirectoryNode {
  id: string;
  name: string;
  type: 'root' | 'factory' | 'basic-info' | 'inspection-order' | 'facility' | 'equipment' | 'specific-equipment' | 'other';
  description?: string;
  children?: DataDirectoryNode[];
  expanded?: boolean;
  parentId?: string;
}

const initialTreeData: DataDirectoryNode[] = [
  {
    id: 'root1',
    name: '污水处理厂',
    type: 'root',
    description: '污水处理厂根节点',
    expanded: true,
    children: [
      {
        id: 'factory1-basic',
        name: '水厂基础信息',
        type: 'basic-info',
        description: '水厂的基本信息',
        expanded: false,
        parentId: 'root1',
      },
      {
        id: 'factory1-inspection',
        name: '化验工单',
        type: 'inspection-order',
        description: '化验工单信息',
        expanded: false,
        parentId: 'root1',
      },
      {
        id: 'factory1-facility',
        name: '设施',
        type: 'facility',
        description: '污水处理设施',
        expanded: true,
        parentId: 'root1',
        children: [
          {
            id: 'facility1-info',
            name: '设施信息',
            type: 'facility',
            description: '具体设施信息',
            expanded: false,
            parentId: 'factory1-facility',
          },
          {
            id: 'facility1-equipment',
            name: '设备',
            type: 'equipment',
            description: '设施相关设备',
            expanded: true,
            parentId: 'factory1-facility',
            children: [
              {
                id: 'equipment1',
                name: '泵站设备',
                type: 'specific-equipment',
                description: '泵站相关具体设备',
                expanded: false,
                parentId: 'facility1-equipment',
              },
              {
                id: 'equipment2',
                name: '过滤设备',
                type: 'specific-equipment',
                description: '过滤相关具体设备',
                expanded: false,
                parentId: 'facility1-equipment',
              },
              {
                id: 'equipment3',
                name: '消毒设备',
                type: 'specific-equipment',
                description: '消毒相关具体设备',
                expanded: false,
                parentId: 'facility1-equipment',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'root2',
    name: '供水处理厂',
    type: 'root',
    description: '供水处理厂根节点',
    expanded: false,
    children: [
      {
        id: 'supply-factory-basic',
        name: '水厂基础信息',
        type: 'basic-info',
        description: '供水厂的基本信息',
        expanded: false,
        parentId: 'root2',
      },
      {
        id: 'supply-facility',
        name: '设施',
        type: 'facility',
        description: '供水处理设施',
        expanded: false,
        parentId: 'root2',
      },
    ],
  },
];

const nodeTypeLabels: Record<string, string> = {
  'root': '根节点',
  'factory': '工厂',
  'basic-info': '基础信息',
  'inspection-order': '化验工单',
  'facility': '设施',
  'equipment': '设备',
  'specific-equipment': '具体设备',
  'other': '其他'
};

const nodeTypeIcons: Record<string, string> = {
  'root': '🏢',
  'factory': '🏭',
  'basic-info': '📋',
  'inspection-order': '📝',
  'facility': '🏗️',
  'equipment': '⚙️',
  'specific-equipment': '🔧',
  'other': '📦'
};

export default function DataDirectoryBuildPage() {
  const [treeData, setTreeData] = useState<DataDirectoryNode[]>(initialTreeData);
  const [editingNode, setEditingNode] = useState<DataDirectoryNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<DataDirectoryNode | null>(null);
  const [addingChildNode, setAddingChildNode] = useState<string | null>(null);
  const [newChildName, setNewChildName] = useState('');
  const [newNodeForm, setNewNodeForm] = useState({
    name: '',
    type: 'other' as const,
    description: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSaveStructure = () => {
    // 这里可以添加实际的保存逻辑
    console.log('保存目录结构:', treeData);
    // 可以发送请求到后端保存数据
    alert('目录结构已更新！');
  };

  const handleToggleExpand = (nodeId: string) => {
    const toggleNode = (nodes: DataDirectoryNode[]): DataDirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };

    setTreeData(toggleNode(treeData));
  };

  const handleNodeClick = (node: DataDirectoryNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node);
    
    // 如果在编辑模式下，才进入编辑状态
    if (isEditMode) {
      setEditingNode(null); // 关闭编辑模式
      setAddingChildNode(null); // 关闭添加子节点模式
    }
  };

  const startEditingNode = (node: DataDirectoryNode, e: React.MouseEvent) => {
    if (!isEditMode) return; // 只在编辑模式下允许编辑
    e.stopPropagation();
    setEditingNode({...node});
    setSelectedNode(node);
    setAddingChildNode(null); // 关闭添加子节点模式
  };

  const saveEditedNode = () => {
    if (!editingNode) return;

    const updateNode = (nodes: DataDirectoryNode[]): DataDirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === editingNode.id) {
          return {...editingNode};
        }
        if (node.children) {
          return {...node, children: updateNode(node.children)};
        }
        return node;
      });
    };

    setTreeData(updateNode(treeData));
    setEditingNode(null);
  };

  const cancelEditingNode = () => {
    setEditingNode(null);
  };

  const startAddingChild = (nodeId: string, e: React.MouseEvent) => {
    if (!isEditMode) return; // 只在编辑模式下允许添加子节点
    e.stopPropagation();
    setAddingChildNode(nodeId);
    setNewChildName('');
    setSelectedNode(null);
    setEditingNode(null); // 关闭编辑模式
  };

  const addChildNode = (parentId: string) => {
    if (!newChildName.trim()) return;

    const newNode: DataDirectoryNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newChildName,
      type: newNodeForm.type,
      description: newNodeForm.description,
      expanded: false,
      parentId: parentId,
      children: []
    };

    const addNode = (nodes: DataDirectoryNode[]): DataDirectoryNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          const updatedChildren = [...(node.children || []), newNode];
          return { ...node, children: updatedChildren, expanded: true };
        }
        if (node.children) {
          return { ...node, children: addNode(node.children) };
        }
        return node;
      });
    };

    setTreeData(addNode(treeData));
    setAddingChildNode(null);
    setNewChildName('');
    setNewNodeForm({ name: '', type: 'other', description: '' });
  };

  const deleteNode = (nodeId: string, e: React.MouseEvent) => {
    if (!isEditMode) return; // 只在编辑模式下允许删除
    e.stopPropagation();
    
    const deleteNodeRecursive = (nodes: DataDirectoryNode[]): DataDirectoryNode[] => {
      return nodes.filter(node => node.id !== nodeId)
        .map(node => {
          if (node.children) {
            return { ...node, children: deleteNodeRecursive(node.children) };
          }
          return node;
        });
    };

    setTreeData(deleteNodeRecursive(treeData));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    if (editingNode?.id === nodeId) {
      setEditingNode(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, nodeId: string, parentId: string | undefined) => {
    if (!isEditMode) return; // 只在编辑模式下允许拖拽
    e.dataTransfer.setData('nodeId', nodeId);
    e.dataTransfer.setData('parentId', parentId || 'root');
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return; // 只在编辑模式下允许拖拽
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetNodeId: string, targetParentId: string | undefined) => {
    if (!isEditMode) return; // 只在编辑模式下允许拖拽
    e.preventDefault();
    
    const draggedNodeId = e.dataTransfer.getData('nodeId');
    const draggedParentId = e.dataTransfer.getData('parentId');
    
    // 检查是否是同一个父节点，如果不是则不执行操作
    if (draggedParentId !== (targetParentId || 'root')) return;
    
    if (draggedNodeId === targetNodeId) return; // 不能拖拽到自己
    
    // 在同一父节点下移动节点
    const newTreeData = [...treeData];
    
    // 查找目标父节点并重新排序
    const reorderInParent = (nodes: DataDirectoryNode[]): DataDirectoryNode[] => {
      return nodes.map(node => {
        if ((draggedParentId === 'root' && !node.parentId) || node.id === draggedParentId) {
          // 找到目标父节点，重新排序其子节点
          if (!node.children) return node;
          
          // 找到被拖拽的节点和目标节点
          const draggedIndex = node.children.findIndex(child => child.id === draggedNodeId);
          const targetIndex = node.children.findIndex(child => child.id === targetNodeId);
          
          if (draggedIndex === -1 || targetIndex === -1) return node;
          
          // 移除被拖拽的节点
          const [draggedNode] = node.children.splice(draggedIndex, 1);
          
          // 计算插入位置（如果目标节点在被拖拽节点前面，插入位置需要调整）
          const insertIndex = targetIndex > draggedIndex ? targetIndex : targetIndex;
          
          // 插入到目标位置
          node.children.splice(insertIndex, 0, draggedNode);
          
          return { ...node, children: [...node.children] };
        }
        
        // 递归处理子节点
        if (node.children) {
          return { ...node, children: reorderInParent(node.children) };
        }
        
        return node;
      });
    };
    
    setTreeData(reorderInParent(newTreeData));
  };

  const enterEditMode = () => {
    setIsEditMode(true);
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setSelectedNode(null);
    setEditingNode(null);
    setAddingChildNode(null);
  };

  const renderTreeNode = (node: DataDirectoryNode, level: number = 0) => {
    const isSelected = selectedNode?.id === node.id;
    const isEditing = editingNode?.id === node.id;
    
    return (
      <div key={node.id} className="mb-1">
        <div 
          className={cn(
            "flex items-center py-2 px-3 rounded cursor-pointer transition-colors",
            isSelected ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100",
            "min-h-[40px]",
            isEditMode && !isEditing ? "cursor-move hover:shadow-sm" : ""
          )}
          draggable={isEditMode && !isEditing}
          onDragStart={(e) => handleDragStart(e, node.id, node.parentId)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node.id, node.parentId)}
          onClick={(e) => handleNodeClick(node, e)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-2 text-lg">{nodeTypeIcons[node.type]}</span>
            {isEditing ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <div>
                  <MdInput
                    value={editingNode.name}
                    onChange={(e) => setEditingNode({...editingNode, name: e.target.value})}
                    placeholder="节点名称"
                    className="w-full"
                  />
                  <MdSelect
                    options={Object.entries(nodeTypeLabels).map(([value, label]) => ({ value, label }))}
                    value={editingNode.type}
                    onChange={(value) => setEditingNode({...editingNode, type: value as any})}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <MdInput
                    value={editingNode.description || ''}
                    onChange={(e) => setEditingNode({...editingNode, description: e.target.value})}
                    placeholder="节点描述"
                    className="w-full"
                  />
                  <div className="flex gap-1 mt-1">
                    <Button 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); saveEditedNode(); }}
                      className="text-xs"
                    >
                      保存
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); cancelEditingNode(); }}
                      className="text-xs"
                    >
                      取消
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{node.name}</span>
                  <MdBadge variant="secondary" className="text-xs">
                    {nodeTypeLabels[node.type]}
                  </MdBadge>
                </div>
                {node.description && (
                  <p className="text-xs text-gray-500 truncate mt-1">{node.description}</p>
                )}
              </div>
            )}
          </div>
          
          {isEditMode && !isEditing && (
            <div className="flex gap-1 ml-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => startAddingChild(node.id, e)}
                className="text-xs"
              >
                +子项
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => startEditingNode(node, e)}
                className="text-xs"
              >
                编辑
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => deleteNode(node.id, e)}
                className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                删除
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); handleToggleExpand(node.id); }}
                className="text-xs w-8 h-8 flex items-center justify-center"
              >
                {node.children && node.children.length > 0 ? (node.expanded ? '▼' : '▶') : ''}
              </Button>
            </div>
          )}
        </div>
        
        {isEditMode && addingChildNode === node.id && (
          <div className="ml-8 mt-2 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <MdInput
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="子节点名称"
              />
              <MdSelect
                options={Object.entries(nodeTypeLabels).map(([value, label]) => ({ value, label }))}
                value={newNodeForm.type}
                onChange={(value) => setNewNodeForm({...newNodeForm, type: value as any})}
                placeholder="选择类型"
              />
              <Button 
                onClick={() => addChildNode(node.id)}
                disabled={!newChildName.trim()}
                className="whitespace-nowrap"
              >
                添加
              </Button>
            </div>
            <MdInput
              value={newNodeForm.description}
              onChange={(e) => setNewNodeForm({...newNodeForm, description: e.target.value})}
              placeholder="子节点描述（可选）"
            />
          </div>
        )}
        
        {node.children && node.expanded && (
          <div 
            className="ml-6 pl-2 border-l border-gray-200 mt-1"
          >
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">数据目录搭建</h1>
          <p className="text-muted-foreground mt-1">
            构建业务系统的数据目录树形结构，以污水处理厂为例进行业务梳理
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditMode ? (
            <Button variant="primary" onClick={enterEditMode}>
              编辑目录结构
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={exitEditMode}>
                退出编辑
              </Button>
              <Button variant="primary" onClick={handleSaveStructure}>
                保存目录结构
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧树形结构显示 */}
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>数据目录结构</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-background max-h-[calc(100vh-250px)] overflow-y-auto">
                {treeData.map(node => renderTreeNode(node))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧面板 - 节点详情和操作 */}
        <div className="lg:w-1/3 space-y-4">
          {!selectedNode ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">数据目录概念</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">什么是数据目录？</h4>
                    <p className="text-sm text-gray-600">
                      数据目录是一个结构化的元数据管理系统，用于组织、分类和描述企业内的各种数据资产。
                      它提供了一个中央化的视图，帮助用户发现、理解和信任数据。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">核心价值</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>提升数据发现效率：快速定位所需数据资源</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>增强数据可信度：提供数据质量、来源和更新信息</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>促进数据治理：明确数据所有权和访问权限</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>支持业务决策：通过数据血缘分析业务影响</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">业务场景</h4>
                    <p className="text-sm text-gray-600 mb-2">以污水处理厂为例：</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>根节点：污水处理厂（业务域）</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>基础信息：水厂运营基本数据（数据类别）</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>化验工单：水质检测记录（业务过程数据）</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>设施设备：具体资产信息（物理实体数据）</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 italic">
                      点击左侧树形结构中的任意节点，查看详细信息
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">节点详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">名称</p>
                    <p className="font-medium">{selectedNode.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">类型</p>
                    <p>{nodeTypeLabels[selectedNode.type]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">描述</p>
                    <p>{selectedNode.description || '暂无描述'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="text-xs text-gray-500 truncate">{selectedNode.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">快速操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      const newNode: DataDirectoryNode = {
                        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        name: '新节点',
                        type: 'other',
                        description: '新添加的节点',
                        expanded: false,
                        children: []
                      };
                      setTreeData([...treeData, newNode]);
                    }}
                  >
                    添加根节点
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}