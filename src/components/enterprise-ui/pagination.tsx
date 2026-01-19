import React from 'react';
import { Pagination as AntPagination, PaginationProps } from 'antd';

export interface BePagerProps extends PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  list: any[];
  pageSizes?: number[];
  callback?: (page: number, pageSize: number) => void;
}

/**
 * 企业级分页组件
 */
const BePager: React.FC<BePagerProps> = ({ 
  currentPage, 
  pageSize, 
  total, 
  list, 
  pageSizes = [10, 20, 30, 50], 
  callback,
  ...props 
}) => {
  const handleChange = (page: number, size?: number) => {
    callback?.(page, size || pageSize);
  };

  return (
    <AntPagination
      current={currentPage}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `共 ${total} 条`}
      pageSizeOptions={pageSizes}
      onChange={handleChange}
      {...props}
    />
  );
};

export default BePager;