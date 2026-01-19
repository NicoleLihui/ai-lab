"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categories, type PrimaryCategory, type SecondaryModule } from "@/config/modules";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((cat) => cat.key))
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleModule = (moduleKey: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleKey)) {
      newExpanded.delete(moduleKey);
    } else {
      newExpanded.add(moduleKey);
    }
    setExpandedModules(newExpanded);
  };

  const isCategoryExpanded = (categoryKey: string) => expandedCategories.has(categoryKey);
  const isModuleExpanded = (moduleKey: string) => expandedModules.has(moduleKey);

  const isPageActive = (categoryKey: string, moduleKey: string, pageKey: string) => {
    return pathname === `/categories/${categoryKey}/${moduleKey}/${pageKey}`;
  };

  const isModuleActive = (categoryKey: string, moduleKey: string) => {
    return pathname.startsWith(`/categories/${categoryKey}/${moduleKey}/`);
  };

  const isCategoryActive = (categoryKey: string) => {
    return pathname.startsWith(`/categories/${categoryKey}/`);
  };

  return (
    <aside
      className={cn(
        "h-full w-64 border-r border-slate-200 bg-white overflow-y-auto",
        className
      )}
    >
      <nav className="p-4 space-y-1">
        {categories.map((category) => (
          <CategorySection
            key={category.key}
            category={category}
            isExpanded={isCategoryExpanded(category.key)}
            isActive={isCategoryActive(category.key)}
            onToggle={() => toggleCategory(category.key)}
            isModuleExpanded={isModuleExpanded}
            isModuleActive={isModuleActive}
            isPageActive={isPageActive}
            onModuleToggle={toggleModule}
            pathname={pathname}
          />
        ))}
      </nav>
    </aside>
  );
}

interface CategorySectionProps {
  category: PrimaryCategory;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  isModuleExpanded: (moduleKey: string) => boolean;
  isModuleActive: (categoryKey: string, moduleKey: string) => boolean;
  isPageActive: (categoryKey: string, moduleKey: string, pageKey: string) => boolean;
  onModuleToggle: (moduleKey: string) => void;
  pathname: string;
}

function CategorySection({
  category,
  isExpanded,
  isActive,
  onToggle,
  isModuleExpanded,
  isModuleActive,
  onModuleToggle,
  isPageActive,
  pathname
}: CategorySectionProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{category.icon}</span>
          <span>{category.name}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="ml-4 space-y-1 border-l-2 border-slate-200 pl-3">
          {category.modules.map((module) => (
            <ModuleSection
              key={module.key}
              category={category}
              module={module}
              isExpanded={isModuleExpanded(`${category.key}-${module.key}`)}
              isActive={isModuleActive(category.key, module.key)}
              onToggle={() => onModuleToggle(`${category.key}-${module.key}`)}
              isPageActive={isPageActive}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ModuleSectionProps {
  category: PrimaryCategory;
  module: SecondaryModule;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  isPageActive: (categoryKey: string, moduleKey: string, pageKey: string) => boolean;
  pathname: string;
}

function ModuleSection({
  category,
  module,
  isExpanded,
  isActive,
  onToggle,
  isPageActive,
  pathname
}: ModuleSectionProps) {
  const hasPages = module.pages.length > 0;
  const firstPage = hasPages ? module.pages[0] : null;

  return (
    <div className="space-y-1">
      {hasPages ? (
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors",
            isActive
              ? " text-blue-700 font-medium"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          )}
        >
          <span>{module.name}</span>
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      ) : (
        <div className="px-3 py-1.5 text-sm text-slate-500">{module.name}</div>
      )}

      {isExpanded && hasPages && (
        <div className="ml-2 space-y-0.5">
          {module.pages.map((page) => {
            const href = `/categories/${category.key}/${module.key}/${page.key}`;
            const isActive = isPageActive(category.key, module.key, page.key);
            return (
              <Link
                key={page.key}
                href={href}
                className={cn(
                  "block px-3 py-1.5 rounded-md text-xs transition-colors",
                  isActive
                    ? " text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                {page.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
