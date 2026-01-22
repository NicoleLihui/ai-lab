'use client';

import { usePathname } from "next/navigation";
import { Sidebar } from "./navigation/sidebar";
import { Brain } from "lucide-react";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // 黄金比例相关样式
  // 首页：增加留白，限制宽度，居中
  // 非首页：最大化展示空间，不限制 max-w-6xl
  
  const headerContainerClass = isHome 
    ? "mx-auto max-w-6xl px-8 py-6" 
    : "mx-auto max-w-full px-8 py-4";
    
  if (isHome) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
          <div className={`flex items-center justify-between transition-all duration-300 ${headerContainerClass}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-blue-500 text-white grid place-items-center shadow-lg shadow-blue-500/20">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  模型实验室
                </div>
                <p className="text-sm text-slate-500">
                  数据中台与模型搭建平台
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-xs text-slate-500">
              Next.js · TypeScript · Tailwind CSS
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20 lg:py-24 transition-all duration-300">
          {children}
        </main>
      </div>
    );
  }

  // 非首页：固定头部，侧边栏和内容区独立滚动
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900">
      <header className="flex-none z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-primary-600 text-white grid place-items-center text-sm">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900 leading-tight">
                模型实验室
              </div>
              <p className="text-xs text-slate-500">
                数据中台与模型搭建平台
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-400">
            企业级 AI 实验舱
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏独立滚动 */}
        <Sidebar className="flex-none" />
        
        {/* 内容区 */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
