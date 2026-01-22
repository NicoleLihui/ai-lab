import React from 'react';
import { Table as AntTable, TableProps } from 'antd';

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
        width: col.minWidth,
        align: col.align,
        render: (_: any, record: any) => {
          const buttons = col.buttons ? col.buttons(record) : [];
          return (
            <div>
              {buttons.map((btn: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  className={`btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onCommand?.(btn.command, record)}
                  disabled={btn.disabled}
                >
                  {btn.name}
                </button>
              ))}
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