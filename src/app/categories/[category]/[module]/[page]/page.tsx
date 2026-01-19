import Link from "next/link";
import { notFound } from "next/navigation";
import { findCategory, findModule, findPage, categories } from "@/config/modules";
import { systemPageComponentMap } from "@/features/system/system-pages";
import { MdCard } from "@/components/enterprise-ui";
import { MdBadge } from "@/components/enterprise-ui";
import { cn } from "@/lib/utils";

type PageProps = {
  params: {
    category: string;
    module: string;
    page: string;
  };
};

const statusClassMap: Record<string, string> = {
  已具备: "badge-ready",
  待开发: "badge-pending",
  待优化: "badge-optimizing"
};

export async function generateStaticParams() {
  return categories.flatMap((category) =>
    category.modules.flatMap((module) =>
      module.pages.map((page) => ({
        category: category.key,
        module: module.key,
        page: page.key
      }))
    )
  );
}

export default function CategoryModulePage(props: PageProps) {
  const { category: categoryKey, module: moduleKey, page: pageKey } = props.params;

  const categoryData = findCategory(categoryKey);
  const moduleData = findModule(categoryKey, moduleKey);
  const page = findPage(categoryKey, moduleKey, pageKey);

  if (!categoryData || !moduleData || !page) {
    return notFound();
  }

  // 构建用于查找组件的 key（扁平化格式：category-module:page）
  const flatModuleKey = `${categoryKey}-${moduleKey}`;
  const pageKeyWithModule = `${flatModuleKey}:${pageKey}`;
  const SystemPageComponent = systemPageComponentMap[pageKeyWithModule];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 固定头部：面包屑与标题 */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4 space-y-3 z-10 shadow-sm">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            首页
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href={`/categories/${categoryKey}`}
            className="hover:text-primary-600 transition-colors"
          >
            {categoryData.name}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">{moduleData.name}</span>
        </div>

        {/* 页面标题 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{page.name}</h1>
            <MdBadge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-5", statusClassMap[page.status].replace("badge-", ""))}
            >
              {page.status}
            </MdBadge>
          </div>
          <p className="text-sm text-slate-500 max-w-md truncate">{page.description}</p>
        </div>
      </div>

      {/* 可滚动内容区 */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 outline-none border-none shadow-none">
        <div className="max-w-full space-y-6 p-6">
          {!SystemPageComponent && (
            <div>
              <MdCard className="p-5 space-y-3 bg-white">
                <h2 className="text-base font-semibold text-slate-800">页面概览</h2>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>
                    · 所属分类：{categoryData.name}
                  </li>
                  <li>
                    · 所属模块：{moduleData.name}（{moduleData.pages.length} 个页面）
                  </li>
                  <li>· 状态：{page.status}</li>
                  {page.existingPath && (
                    <li>· 现有路径/组件：{page.existingPath}</li>
                  )}
                  <li>· 说明：本页面为骨架占位，可按业务需求替换内容。</li>
                </ul>
              </MdCard>

              <MdCard className="p-5 space-y-2 bg-white">
                <h3 className="text-sm font-medium text-slate-800">快速导航</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link
                    href="/"
                    className="hover:bg-primary-50 hover:text-primary-700"
                  >
                    <MdBadge variant="success" className="hover:bg-primary-50 hover:text-primary-700">
                      返回首页
                    </MdBadge>
                  </Link>
                  <Link
                    href={`/categories/${categoryKey}`}
                    className="hover:bg-primary-50 hover:text-primary-700"
                  >
                    <MdBadge variant="secondary" className="hover:bg-primary-50 hover:text-primary-700">
                      {categoryData.name}
                    </MdBadge>
                  </Link>
                  {moduleData.pages
                    .filter((item) => item.key !== page.key)
                    .slice(0, 4)
                    .map((item) => (
                      <Link
                        key={item.key}
                        href={`/categories/${categoryKey}/${moduleData.key}/${item.key}`}
                        className="hover:bg-primary-50 hover:text-primary-700"
                      >
                        <MdBadge variant="secondary" className="hover:bg-primary-50 hover:text-primary-700">
                          {item.name}
                        </MdBadge>
                      </Link>
                    ))}
                </div>
              </MdCard>
            </div>
          )}

          {SystemPageComponent && (
            <div className="bg-slate-50/50">
              <SystemPageComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
