'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MdDrawer, MdButton } from '@/components/enterprise-ui';
import { Database, GitBranch, ArrowRight, AlertTriangle } from 'lucide-react';

interface NodeData {
  id: string;
  tableName: string;
  displayName: string;
  dataSource: string;
  type: 'upstream' | 'target' | 'downstream';
  x?: number;
  y?: number;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  type: string;
}

interface LineageGraphProps {
  isOpen: boolean;
  onClose: () => void;
  targetTable: {
    id: string;
    tableName: string;
    displayName: string;
    dataSource: string;
  };
  lineageData: {
    upstream: NodeData[];
    downstream: NodeData[];
  };
}

export function LineageGraphComponent({ 
  isOpen, 
  onClose, 
  targetTable, 
  lineageData 
}: LineageGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<(NodeData & { type: 'upstream' | 'target' | 'downstream' })[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);

  // 构建节点和边的数据
  useEffect(() => {
    if (!isOpen) return;

    // 创建节点数组
    const allNodes: NodeData[] = [
      {
        id: targetTable.id,
        tableName: targetTable.tableName,
        displayName: targetTable.displayName,
        dataSource: targetTable.dataSource,
        type: 'target'
      },
      ...lineageData.upstream.map(node => ({ ...node, type: 'upstream' as const })),
      ...lineageData.downstream.map(node => ({ ...node, type: 'downstream' as const }))
    ];

    // 创建边数组
    const allEdges: EdgeData[] = [
      ...lineageData.upstream.map((node, index) => ({
        id: `edge-up-${index}`,
        source: node.id,
        target: targetTable.id,
        type: 'upstream'
      })),
      ...lineageData.downstream.map((node, index) => ({
        id: `edge-down-${index}`,
        source: targetTable.id,
        target: node.id,
        type: 'downstream'
      }))
    ];

    setNodes(allNodes);
    setEdges(allEdges);
  }, [isOpen, targetTable, lineageData]);

  // 简单的布局算法
  useEffect(() => {
    if (nodes.length === 0 || !svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 600;

    // 计算布局
    const targetNode = nodes.find(n => n.type === 'target');
    const upstreamNodes = nodes.filter(n => n.type === 'upstream');
    const downstreamNodes = nodes.filter(n => n.type === 'downstream');

    if (targetNode) {
      targetNode.x = width / 2;
      targetNode.y = height / 2;
    }

    // 上游节点布局（左侧）
    upstreamNodes.forEach((node, index) => {
      const total = upstreamNodes.length;
      node.x = width * 0.25;
      node.y = height / 2 - (total - 1) * 30 + index * 60;
    });

    // 下游节点布局（右侧）
    downstreamNodes.forEach((node, index) => {
      const total = downstreamNodes.length;
      node.x = width * 0.75;
      node.y = height / 2 - (total - 1) * 30 + index * 60;
    });

    setNodes([...nodes]);
  }, [nodes]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'upstream':
        return '#3b82f6'; // blue
      case 'target':
        return '#ef4444'; // red
      case 'downstream':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'upstream':
        return <ArrowRight className="h-4 w-4 rotate-180" />;
      case 'target':
        return <Database className="h-4 w-4" />;
      case 'downstream':
        return <ArrowRight className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <MdDrawer 
      open={isOpen} 
      onClose={onClose} 
      width="90vw"
    >
      <div className="h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">血缘关系图</h2>
          <div className="flex items-center gap-2">
            <MdButton variant="outline" onClick={onClose}>
              关闭
            </MdButton>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
          <div className="bg-white rounded-lg border h-full w-full overflow-auto">
            {nodes.length > 0 ? (
              <svg 
                ref={svgRef}
                className="w-full h-full"
                viewBox="0 0 800 600"
              >
                {/* 渲染边 */}
                {edges.map(edge => {
                  const sourceNode = nodes.find(n => n.id === edge.source);
                  const targetNode = nodes.find(n => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode || sourceNode.x === undefined || 
                      sourceNode.y === undefined || targetNode.x === undefined || 
                      targetNode.y === undefined) {
                    return null;
                  }
                  
                  return (
                    <line
                      key={edge.id}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#9ca3af"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                
                {/* 定义箭头标记 */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#9ca3af"
                    />
                  </marker>
                </defs>
                
                {/* 渲染节点 */}
                {nodes.map(node => {
                  if (node.x === undefined || node.y === undefined) return null;
                  
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="30"
                        fill={getNodeColor(node.type)}
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      
                      {/* 节点图标 */}
                      <foreignObject
                        x={node.x - 12}
                        y={node.y - 12}
                        width="24"
                        height="24"
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center w-full h-full text-white">
                          {getNodeIcon(node.type)}
                        </div>
                      </foreignObject>
                      
                      {/* 节点标签 */}
                      <text
                        x={node.x}
                        y={node.y + 45}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#4b5563"
                        className="pointer-events-none"
                      >
                        {node.displayName}
                      </text>
                      
                      <text
                        x={node.x}
                        y={node.y + 60}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#9ca3af"
                        className="pointer-events-none"
                      >
                        {node.tableName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-2 text-lg font-medium">暂无血缘数据</h3>
                  <p className="mt-1 text-muted-foreground">
                    当前表没有血缘关系数据
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t bg-muted flex justify-end gap-2">
          <MdButton variant="outline" onClick={onClose}>
            关闭
          </MdButton>
          <MdButton>
            导出血缘图
          </MdButton>
        </div>
      </div>
    </MdDrawer>
  );
}