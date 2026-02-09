import Link from "next/link";
import { notFound } from "next/navigation";
import { findCategory, categories } from "@/config/modules";
import { MdCard } from "@/components/enterprise-ui";
import { ArrowRight } from "lucide-react";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.key
  }));
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { category: categoryKey } = await props.params;
  const categoryData = findCategory(categoryKey);

  if (!categoryData) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 固定头部 */}
      <div className="flex-none bg-white border-b border-slate-200 px-6 py-4 space-y-3 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            首页
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">{categoryData.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-linear-to-r from-primary to-primary-light p-2 text-xl text-white">
            {categoryData.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {categoryData.name}
            </h1>
            <p className="text-sm text-slate-500">
              {categoryData.description}
            </p>
          </div>
        </div>
      </div>

      {/* 可滚动列表区 */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryData.modules.map((module) => {
            const firstPage = module.pages[0];
            const href = firstPage
              ? `/categories/${categoryKey}/${module.key}/${firstPage.key}`
              : "#";

            return (
              <Link key={module.key} href={href as Parameters<typeof Link>[0]["href"]}>
                <MdCard className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {module.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          {module.pages.length} 个页面
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </MdCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
