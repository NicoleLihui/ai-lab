import React from 'react';
import { Table as AntTable, TableProps } from 'antd';
import { MdButton } from './md-button';

export interface BeTableProps extends Omit<TableProps<any>, 'columns'> {
  isLock?: boolean;
  tableData: any[];
  columns: any[];
  options: any;
  onCommand?: (command: string, row: any) => void;
}

/**
 * 企业级表格组件
 */
const BeTable: React.FC<BeTableProps> = ({ 
  isLock = false, 
  tableData, 
  columns, 
  options, 
  onCommand,
  ...props 
}) => {
  // 处理列定义
  const processedColumns = columns.map(col => {
    if (col.type === 'index') {
      return {
        title: col.label,
        key: col.prop,
        width: col.width,
        align: col.align,
        render: (_: any, __: any, index: number) => (options?.paginationConfig?.currentPage - 1) * options?.paginationConfig?.pageSize + index + 1,
      };
    } else if (col.type === 'actions') {
      return {
        title: col.label,
        key: 'actions',
        width: col.width || col.minWidth,
        align: col.align,
        render: (_: any, record: any) => {
          // 如果提供了自定义render函数，优先使用
          if (col.render) {
            return col.render(record);
          }
          // 否则使用buttons函数生成按钮
          const buttons = col.buttons ? col.buttons(record) : [];
          return (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {buttons.map((btn: any, idx: number) => {
                // 映射按钮类型到MdButton的variant
                const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost'> = {
                  'primary': 'primary',
                  'secondary': 'secondary',
                  'success': 'success',
                  'danger': 'danger',
                  'warning': 'warning',
                  'info': 'info',
                  'outline': 'outline',
                  'ghost': 'ghost',
                  'default': 'outline'
                };
                const variant = variantMap[btn.type || 'default'] || 'outline';
                
                return (
                  <MdButton
                    key={idx}
                    variant={variant}
                    size="sm"
                    onClick={() => onCommand?.(btn.command, record)}
                    disabled={btn.disabled}
                  >
                    {btn.name}
                  </MdButton>
                );
              })}
            </div>
          );
        },
      };
    } else if (col.format) {
      return {
        title: col.label,
        dataIndex: col.prop,
        key: col.prop,
        align: col.align,
        render: (value: any, record: any) => {
          // 这里简单处理格式化函数
          return <span dangerouslySetInnerHTML={{ __html: col.format(record) }} />;
        },
      };
    } else {
      return {
        title: col.label,
        dataIndex: col.prop,
        key: col.prop,
        align: col.align,
        render: col.render ? (value: any, record: any) => col.render?.(record) : undefined,
      };
    }
  });

  return (
    <AntTable
      dataSource={tableData}
      columns={processedColumns}
      rowKey={options.rowKey}
      pagination={false}
      loading={props.loading}
      scroll={{ x: 'max-content' }}
      {...props}
    />
  );
};

export default BeTable;