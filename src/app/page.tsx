import Link from "next/link";
import { categories, totalCategories, totalModules, totalPages, getKeyModules } from "@/config/modules";
import { MdCard, MdBadge } from "@/components/enterprise-ui";
import { Brain, BarChart3, Zap, Settings, Eye, Database, ArrowRight } from "lucide-react";

const getKeyModuleIcon = (name: string) => {
  if (name.includes("模型训练")) return <BarChart3 className="w-6 h-6" />;
  if (name.includes("智能体")) return <Zap className="w-6 h-6" />;
  if (name.includes("规则引擎")) return <Settings className="w-6 h-6" />;
  if (name.includes("监控")) return <Eye className="w-6 h-6" />;
  if (name.includes("数据资源目录")) return <Database className="w-6 h-6" />;
  return <Brain className="w-6 h-6" />;
};

const getKeyModuleColor = (name: string) => {
  if (name.includes("模型训练")) return "from-blue-500 to-blue-600";
  if (name.includes("智能体")) return "from-yellow-500 to-yellow-600";
  if (name.includes("规则引擎")) return "from-red-500 to-red-600";
  if (name.includes("监控")) return "from-pink-500 to-pink-600";
  if (name.includes("数据资源目录")) return "from-rose-500 to-rose-600";
  return "from-primary to-primary-light";
};

export default function HomePage() {
  const keyModules = getKeyModules();

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-r from-primary to-primary-light p-3 text-white">
              <Brain className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">模型实验室</h1>
              <p className="mt-2 text-base text-slate-600">
                数据中台与模型搭建平台
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-4">
            <MdBadge variant="success" className="rounded-lg px-4 py-2 text-base">
              {totalCategories} 个一级模块
            </MdBadge>
            <MdBadge variant="warning" className="rounded-lg px-4 py-2 text-base">
              {totalModules} 个二级模块
            </MdBadge>
            <MdBadge variant="info" className="rounded-lg px-4 py-2 text-base">
              {totalPages} 个页面
            </MdBadge>
          </div>
        </div>
      </div>

      {/* 关键模块快速入口 */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">快速入口</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {keyModules.map(({ category, module, name }) => {
            if (!module || !module.pages.length) return null;
            const firstPage = module.pages[0];
            const href = `/categories/${category}/${module.key}/${firstPage.key}`;
            
            return (
              <Link key={`${category}-${module.key}`} href={href}>
                <MdCard className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className={`absolute right-4 top-4 rounded-lg bg-gradient-to-r ${getKeyModuleColor(name)} p-3 text-white opacity-20 transition-opacity group-hover:opacity-100`}>
                    {getKeyModuleIcon(name)}
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {module.description}
                      </p>
                      <div className="flex items-center text-sm text-primary-600 font-medium">
                        进入模块
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </MdCard>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 所有一级模块 */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">所有模块</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const firstModule = category.modules[0];
            const firstPage = firstModule?.pages[0];
            const href = firstPage
              ? `/categories/${category.key}/${firstModule.key}/${firstPage.key}`
              : "#";

            return (
              <Link key={category.key} href={href}>
                <MdCard className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-full flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                      <div className="rounded-lg bg-slate-100 p-2 text-2xl">
                        {category.icon}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {category.modules.length} 个二级模块
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
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
