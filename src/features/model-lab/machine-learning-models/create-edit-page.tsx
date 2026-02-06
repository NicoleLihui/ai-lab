"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdCard, MdCardContent, MdCardDescription, MdCardHeader, MdCardTitle } from '@/components/enterprise-ui/md-card';
import { MdButton } from '@/components/enterprise-ui/md-button';
import { MdInput } from '@/components/enterprise-ui/md-input';
import { MdSelect, type SelectOption } from '@/components/enterprise-ui/md-select';
import { MdBadge } from '@/components/enterprise-ui/md-badge';
import { ArrowLeft, Save, X, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// 模型基础信息接口
interface ModelBasicInfo {
  name: string;
  category: string; // 分类：回归、分类、排序、时序序列
  owner: string; // 模型所有者：个人、所在组织
  programmingLanguage: string; // 编程语言
  applicableScenarios: string[]; // 适用场景（多选）
  description: string; // 模型描述
  tags: string[]; // 标签（多选）
}

// 树形节点接口
interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

// 标签接口
interface Tag {
  id: string;
  tagCode: string;
  tagName: string;
  tagTypeId: string;
  tagTypeName: string;
  description: string;
  status: '启用' | '禁用';
}

// 污水处理适用场景树形数据
const applicableScenarioTree: TreeNode[] = [
  {
    value: 'nonSpecific',
    label: '无特定场景',
  },
  {
    value: 'process',
    label: '污水处理工艺',
    children: [
      { value: 'a2o', label: 'A2O工艺' },
      { value: 'oxidation_ditch', label: '氧化沟工艺' },
      { value: 'sbr', label: 'SBR工艺' },
      { value: 'mbr', label: 'MBR膜工艺' }
    ]
  },
  {
    value: 'equipment',
    label: '污水处理设备',
    children: [
      { value: 'blower', label: '曝气风机' },
      { value: 'do_meter', label: 'DO溶解氧仪' },
      { value: 'sludge_pump', label: '污泥回流泵' },
      { value: 'scraper', label: '刮泥机' }
    ]
  },
  {
    value: 'facility',
    label: '污水处理设施',
    children: [
      { value: 'aeration_tank', label: '曝气池' },
      { value: 'sedimentation_tank', label: '沉淀池' },
      { value: 'sludge_thickener', label: '污泥浓缩池' },
      { value: 'disinfection_pool', label: '消毒池' },
      { value: '2', label: '粗格栅' },
      { value: '5', label: '细格栅' },
      { value: '9', label: '精细格栅' },
      { value: '15', label: '污泥浓缩池' },
      { value: '25', label: '生化池' },
      { value: '28', label: '高级氧化池（芬顿）' },
      { value: '37', label: '初沉池' },
      { value: '39', label: '污泥调理池' },
      { value: '44', label: '高级氧化池（臭氧）' },
      { value: '49', label: '滤池' },
      { value: '55', label: '储泥池' },
      { value: '62', label: '混凝沉淀池' },
      { value: '68', label: '进水提升泵房' },
      { value: '77', label: '膜车间' },
      { value: '84', label: '二次提升泵房' },
      { value: '93', label: '出水提升泵房' },
      { value: '104', label: '污泥泵房' },
    ]
  },
  {
    value: 'monitor',
    label: '监测仪表',
    children: [
      { value: 'ph_meter', label: 'PH计' },
      { value: 'cod_analyzer', label: 'COD在线分析仪' },
      { value: 'turbidity_meter', label: '浊度仪' },
      { value: 'ammonia_meter', label: '氨氮分析仪' }
    ]
  },
  {
    value: 'other',
    label: '其他',
  },
];

// 树形多选组件
interface TreeSelectProps {
  treeData: TreeNode[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  treeData,
  selectedValues,
  onChange,
  placeholder = '请选择',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(selectedValues));
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<{ top: number; left: number; minWidth: number } | null>(null);

  // 同步外部传入的选中状态
  useEffect(() => {
    setCheckedKeys(new Set(selectedValues));
  }, [selectedValues]);

  // 计算下拉框位置
  React.useLayoutEffect(() => {
    if (isOpen && triggerRef.current && typeof document !== 'undefined') {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
      });
    } else {
      setDropdownStyle(null);
    }
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 切换节点展开/收起
  const toggleExpand = (value: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  // 切换节点选中状态
  const toggleCheck = (value: string) => {
    const newCheckedKeys = new Set(checkedKeys);
    if (newCheckedKeys.has(value)) {
      newCheckedKeys.delete(value);
    } else {
      newCheckedKeys.add(value);
    }
    setCheckedKeys(newCheckedKeys);
    onChange(Array.from(newCheckedKeys));
  };

  // 获取节点标签
  const getNodeLabel = (nodes: TreeNode[], value: string): string => {
    for (const node of nodes) {
      if (node.value === value) {
        return node.label;
      }
      if (node.children) {
        const found = getNodeLabel(node.children, value);
        if (found) return found;
      }
    }
    return '';
  };

  // 渲染树节点
  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.has(node.value);
    const isChecked = checkedKeys.has(node.value);

    return (
      <div key={node.value} className="select-none">
        <div
          className={cn(
            'flex items-center py-1.5 px-2 hover:bg-primary-light cursor-pointer',
            level > 0 && 'pl-6'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.value);
              }}
              className="mr-1 p-0.5 hover:bg-primary/20 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-4 mr-1" />
          )}
          <button
            type="button"
            onClick={() => toggleCheck(node.value)}
            className="flex items-center flex-1 text-left"
          >
            <div className={cn(
              'w-4 h-4 border rounded mr-2 flex items-center justify-center',
              isChecked ? 'bg-primary border-primary' : 'border-border'
            )}>
              {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm">{node.label}</span>
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 获取选中项的显示文本
  const getDisplayText = () => {
    if (checkedKeys.size === 0) {
      return placeholder;
    }
    if (checkedKeys.size === 1) {
      const value = Array.from(checkedKeys)[0];
      return getNodeLabel(treeData, value);
    }
    return `已选择 ${checkedKeys.size} 项`;
  };

  const dropdownContent =
    isOpen &&
    dropdownStyle &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-9999 rounded-md border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95"
        style={{
          top: dropdownStyle.top,
          left: dropdownStyle.left,
          minWidth: dropdownStyle.minWidth,
          maxHeight: 400,
        }}
      >
        <div className="max-h-96 overflow-auto py-2">
          {treeData.map(node => renderTreeNode(node))}
        </div>
      </div>,
      document.body
    );

  return (
    <div className={cn('w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between h-10 px-4 text-sm border-2 border-input rounded-md hover:border-primary/50 transition-all"
      >
        <span className={cn(checkedKeys.size === 0 && 'text-muted-foreground')}>
          {getDisplayText()}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {dropdownContent}
      {checkedKeys.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from(checkedKeys).map(value => (
            <MdBadge
              key={value}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getNodeLabel(treeData, value)}
              <button
                type="button"
                onClick={() => {
                  const newValues = Array.from(checkedKeys).filter(v => v !== value);
                  onChange(newValues);
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </MdBadge>
          ))}
        </div>
      )}
    </div>
  );
};

const MachineLearningModelCreateEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('id') !== null;
  const modelId = searchParams.get('id');

  const [formData, setFormData] = useState<ModelBasicInfo>({
    name: '',
    category: '',
    owner: '',
    programmingLanguage: '',
    applicableScenarios: [],
    description: '',
    tags: [],
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // 分类选项
  const categoryOptions: SelectOption[] = [
    { value: '回归', label: '回归' },
    { value: '分类', label: '分类' },
    { value: '排序', label: '排序' },
    { value: '时序序列', label: '时序序列' },
  ];

  // 模型所有者选项
  const ownerOptions: SelectOption[] = [
    { value: '个人', label: '个人' },
    { value: '所在组织', label: '所在组织' },
  ];

  // 编程语言选项
  const programmingLanguageOptions: SelectOption[] = [
    { value: 'Python', label: 'Python' },
    { value: 'R', label: 'R' },
    { value: 'Java', label: 'Java' },
    { value: 'Scala', label: 'Scala' },
    { value: 'C++', label: 'C++' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: '其他', label: '其他' },
  ];

  // 加载标签列表
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: 调用API获取标签列表
      // 模拟数据
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockTags: Tag[] = [
        {
          id: '1',
          tagCode: 'dq_high',
          tagName: '高质量',
          tagTypeId: '1',
          tagTypeName: '数据质量',
          description: '数据质量高的标签',
          status: '启用',
        },
        {
          id: '2',
          tagCode: 'dq_medium',
          tagName: '中等质量',
          tagTypeId: '1',
          tagTypeName: '数据质量',
          description: '数据质量中等的标签',
          status: '启用',
        },
        {
          id: '3',
          tagCode: 'bd_finance',
          tagName: '金融业务',
          tagTypeId: '2',
          tagTypeName: '业务域',
          description: '金融业务相关的标签',
          status: '启用',
        },
        {
          id: '4',
          tagCode: 'bd_retail',
          tagName: '零售业务',
          tagTypeId: '2',
          tagTypeName: '业务域',
          description: '零售业务相关的标签',
          status: '启用',
        },
        {
          id: '5',
          tagCode: 'ds_database',
          tagName: '数据库',
          tagTypeId: '3',
          tagTypeName: '数据源',
          description: '来自数据库的数据源',
          status: '启用',
        },
        {
          id: '6',
          tagCode: 'sl_confidential',
          tagName: '机密',
          tagTypeId: '4',
          tagTypeName: '安全等级',
          description: '机密级别的数据',
          status: '启用',
        },
      ];
      setTags(mockTags.filter(tag => tag.status === '启用'));
    } catch (error) {
      console.error('加载标签失败:', error);
      toast.error('加载标签失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载编辑数据
  useEffect(() => {
    if (isEditMode && modelId) {
      // TODO: 从API加载模型数据
      // 这里使用模拟数据
      setFormData({
        name: '示例模型',
        category: '分类',
        owner: '个人',
        programmingLanguage: 'Python',
        applicableScenarios: ['a2o', 'aeration_tank'],
        description: '这是一个示例模型',
        tags: ['1', '3'],
      });
    }
  }, [isEditMode, modelId]);

  // 加载标签
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // 提交表单
  const handleSubmit = () => {
    // 验证必填字段
    if (!formData.name) {
      toast.error('请输入模型名称');
      return;
    }
    if (!formData.category) {
      toast.error('请选择分类');
      return;
    }
    if (!formData.owner) {
      toast.error('请选择模型所有者');
      return;
    }
    if (!formData.programmingLanguage) {
      toast.error('请选择编程语言');
      return;
    }

    // 准备提交数据
    const submitData = {
      ...formData,
    };

    console.log('提交模型数据:', submitData);
    
    // TODO: 调用API保存数据
    toast.success(isEditMode ? '模型更新成功！' : '模型创建成功！');
    router.push('/categories/model-lab/model-development/machine-learning-models');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditMode ? '编辑模型' : '创建模型'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? '编辑机器学习模型信息' : '创建新的机器学习模型'}
          </p>
        </div>
        <MdButton variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </MdButton>
      </div>

      <MdCard>
        <MdCardHeader>
          <MdCardTitle>模型基本信息</MdCardTitle>
          <MdCardDescription>填写模型的基本信息</MdCardDescription>
        </MdCardHeader>
        <MdCardContent className="space-y-6">
          {/* 模型名称 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              模型名称 <span className="text-red-500">*</span>
            </label>
            <MdInput
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入模型名称"
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              分类 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="请选择分类"
            />
          </div>

          {/* 模型所有者 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              模型所有者 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              options={ownerOptions}
              value={formData.owner}
              onChange={(value) => setFormData({ ...formData, owner: value })}
              placeholder="请选择模型所有者"
            />
          </div>

          {/* 编程语言 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              编程语言 <span className="text-red-500">*</span>
            </label>
            <MdSelect
              options={programmingLanguageOptions}
              value={formData.programmingLanguage}
              onChange={(value) => setFormData({ ...formData, programmingLanguage: value })}
              placeholder="请选择编程语言"
            />
          </div>

          {/* 模型适用场景 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              模型适用场景
            </label>
            <TreeSelect
              treeData={applicableScenarioTree}
              selectedValues={formData.applicableScenarios}
              onChange={(values) => setFormData({ ...formData, applicableScenarios: values })}
              placeholder="请选择适用场景（可多选）"
            />
          </div>

          {/* 模型描述 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              模型描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入模型描述"
              rows={4}
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              标签
            </label>
            {loading ? (
              <div className="text-sm text-muted-foreground">加载标签中...</div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 p-3 border-2 border-input rounded-md min-h-[60px]">
                  {tags.map(tag => {
                    const isSelected = formData.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const newTags = isSelected
                            ? formData.tags.filter(t => t !== tag.id)
                            : [...formData.tags, tag.id];
                          setFormData({ ...formData, tags: newTags });
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-sm transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        )}
                      >
                        {tag.tagName}
                      </button>
                    );
                  })}
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">已选择：</span>
                    {formData.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <MdBadge
                          key={tagId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag.tagName}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                tags: formData.tags.filter(t => t !== tagId),
                              });
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </MdBadge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <MdButton variant="outline" onClick={() => router.back()}>
              取消
            </MdButton>
            <MdButton onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? '保存修改' : '创建模型'}
            </MdButton>
          </div>
        </MdCardContent>
      </MdCard>
    </div>
  );
};

export default MachineLearningModelCreateEditPage;
