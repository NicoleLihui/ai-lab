"use client";

import * as React from "react";
import { MdButton } from "./md-button";
import { MdInput } from "./md-input";
import { MdSelect } from "./md-select";
import { SelectOption } from "./md-select";
import { cn } from "@/lib/utils";

export interface FormItem {
  type: "input" | "select";
  label: string;
  paramKey: string;
  placeholder?: string;
  modelValue?: string | number;
  selectOptions?: SelectOption[];
  isSlot?: boolean;
}

export interface AdvancedSearchProps {
  formItemList: FormItem[];
  onSearch: (data: Record<string, any>) => void;
  onReset: () => void;
  onClear?: (primaryKey: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function AdvancedSearch({
  formItemList,
  onSearch,
  onReset,
  onClear,
  children,
  className
}: AdvancedSearchProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    formItemList.forEach(item => {
      initialData[item.paramKey] = item.modelValue || "";
    });
    setFormData(initialData);
  }, [formItemList]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch(formData);
  };

  const handleReset = () => {
    const resetData: Record<string, any> = {};
    formItemList.forEach(item => {
      resetData[item.paramKey] = "";
    });
    setFormData(resetData);
    onReset();
  };

  const handleClear = (primaryKey: string) => {
    setFormData(prev => ({
      ...prev,
      [primaryKey]: ""
    }));
    onClear?.(primaryKey);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-background border rounded-lg", className)}>
      {formItemList.map((item, index) => (
        <div key={index} className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-foreground">{item.label}</label>
          {item.type === "input" ? (
            <MdInput
              value={formData[item.paramKey] || ""}
              onChange={(e) => handleChange(item.paramKey, e.target.value)}
              placeholder={item.placeholder}
            />
          ) : item.isSlot ? (
            <div className="flex-1">{children}</div>
          ) : (
            <MdSelect
              options={item.selectOptions || []}
              value={formData[item.paramKey] || ""}
              onChange={(value: any) => handleChange(item.paramKey, value)}
              placeholder={item.placeholder}
            />
          )}
        </div>
      ))}
      <div className="flex items-end space-x-2">
        <MdButton onClick={handleSearch} className="w-full md:w-auto">
          搜索
        </MdButton>
        <MdButton variant="outline" onClick={handleReset} className="w-full md:w-auto">
          重置
        </MdButton>
      </div>
    </div>
  );
}