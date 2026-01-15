export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-slate-900">页面未找到</h1>
      <p className="text-sm text-slate-600">
        路径不存在或尚未收录，请从首页选择模块进入。
      </p>
    </div>
  );
}
