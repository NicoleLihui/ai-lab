import React from "react";
import { TrainingTasksPage } from "../model-training/training-tasks-page";

export function OrganizationManagementPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">
          组织管理能力总览
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          提供多层级组织树、组织信息维护、成员管理与组织级权限配置，是整个系统 RBAC 的基础。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            组织树结构（1.2.1）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 树形展示组织架构，支持部门 / 科室 / 小组多层级。</li>
            <li>· 支持节点展开 / 折叠与当前组织高亮。</li>
            <li>· 节点上展示组织名称与成员数量。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            组织创建与编辑（1.2.2 / 1.2.3）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 支持创建根组织与子组织，设置父组织节点。</li>
            <li>· 维护组织编码、类型、负责人、联系方式等基础信息。</li>
            <li>· 支持组织层级调整、位置移动、合并与拆分操作。</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            组织删除与查询（1.2.4 / 1.2.5）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 删除前检查子组织、成员与关联资源，支持级联删除配置。</li>
            <li>· 提供按名称、编码、类型、负责人等条件搜索与筛选。</li>
            <li>· 支持查看组织详情面板，集中呈现关键信息。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            成员与权限管理（1.2.6 / 1.2.7）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 维护组织成员列表，支持添加 / 移除成员与部门调整。</li>
            <li>· 设置部门负责人，支持组织级权限与数据访问范围配置。</li>
            <li>· 支持跨组织协作配置与组织数据隔离策略。</li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h3 className="text-xs font-semibold text-foreground">关键业务规则（1.3）</h3>
        <ul className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
          <li>· 同级组织名称唯一，组织编码全局唯一。</li>
          <li>· 根组织不可删除，有成员的组织不可直接删除。</li>
          <li>· 建议组织层级不超过 5 层，避免结构过深。</li>
          <li>· 删除或调整组织需校验成员与资源影响范围。</li>
        </ul>
      </section>
    </div>
  );
}

export function UserManagementPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">用户管理能力总览</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          负责用户全生命周期管理，覆盖用户创建、编辑、禁用、删除、批量操作与权限查看。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            用户列表与搜索（2.2.1 / 2.2.2）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 表格展示用户名、姓名、组织、角色、状态、创建时间、最后登录时间。</li>
            <li>· 提供分页、排序与多条件过滤能力。</li>
            <li>· 支持按用户名、姓名、手机号、邮箱、组织、角色、状态检索。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            用户创建与编辑（2.2.3 / 2.2.4）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 创建用户时维护基本信息、所属组织、工号、职位等字段。</li>
            <li>· 设置初始密码与角色，支持启用 / 禁用状态控制。</li>
            <li>· 支持修改用户信息、组织与角色，重置密码与头像更新。</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            删除与批量操作（2.2.5 / 2.2.7）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 删除前校验用户关联资源，支持逻辑删除策略与操作审计。</li>
            <li>· 支持批量导入 / 导出用户、批量启用 / 禁用与批量分配角色。</li>
            <li>· 批量调整所属组织，提升大规模运维效率。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            用户详情与权限视图（2.2.6 / 2.2.8）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 展示用户完整资料、角色列表、所属组织与创建的资源。</li>
            <li>· 可视化展示菜单权限、按钮权限与数据权限范围。</li>
            <li>· 支持权限来源追溯：直接分配 / 角色继承。</li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h3 className="text-xs font-semibold text-foreground">关键业务规则（2.3）</h3>
        <ul className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
          <li>· 用户名、手机号全局唯一，邮箱（如填写）也需唯一。</li>
          <li>· 用户必须属于至少一个组织，禁用用户无法登录。</li>
          <li>· 删除用户不影响历史数据与审计记录。</li>
        </ul>
      </section>
    </div>
  );
}

export function RoleManagementPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">角色管理（RBAC）</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          通过角色集中配置菜单、按钮和数据权限，实现灵活的基于角色访问控制。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            角色列表与创建（3.2.1 / 3.2.2）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 表格展示角色名称、编码、类型、描述、用户数与创建时间。</li>
            <li>· 支持创建系统角色 / 业务角色，配置状态与说明。</li>
            <li>· 创建时即可一次性完成菜单、按钮与数据权限配置。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            权限配置（3.2.3 / 3.2.5）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 树形勾选菜单权限，支持父子联动与全选 / 反选。</li>
            <li>· 按页面维度配置按钮权限，支持批量授权。</li>
            <li>· 数据权限支持全部、本组织、本组织及下级、仅本人、自定义范围等模式。</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            角色生命周期（3.2.4 / 3.2.6 / 3.2.7 / 3.2.8）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 删除前校验是否存在绑定用户，系统角色不可删除。</li>
            <li>· 支持角色成员管理与导出，查看并维护角色下的用户列表。</li>
            <li>· 提供角色复制能力，基于现有角色快速创建新角色。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            预置角色与业务规则（3.3 / 3.4）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 预置系统管理员、数据管理员、模型管理员、审核员、普通用户等典型角色。</li>
            <li>· 角色名称与编码全局唯一，系统角色不可编辑与删除。</li>
            <li>· 用户可拥有多个角色，权限取并集；禁用角色下的用户权限自动失效。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export function UserAuthorizationPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">用户授权</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          从“角色 → 用户”视角管理授权，支持批量分配、撤销与授权记录追踪。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            授权入口与目标（3.2.6）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 从角色详情或专门的“用户授权”页面进入授权流程。</li>
            <li>· 展示未分配当前角色的用户列表，支持条件筛选。</li>
            <li>· 支持一次性为多名用户批量授予角色。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">授权记录与审计</h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 记录每次授权的操作人、时间、目标用户与角色信息。</li>
            <li>· 支持按角色 / 用户维度查询授权历史。</li>
            <li>· 与操作日志联动，为安全审计提供完整链路。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export function LoginLogPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">登录日志</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          全量记录用户登录行为，支持安全审计、异常检测与统计分析。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            日志记录与查询（5.2.1 / 5.2.2）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 记录登录用户、时间、IP、地点、浏览器、操作系统与结果等信息。</li>
            <li>· 提供按用户、IP、时间范围、结果、地点等多维检索能力。</li>
            <li>· 支持导出查询结果，满足审计与合规要求。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            分析与告警（5.2.3 / 5.2.4）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 登录成功率统计、失败登录分析与高危 IP 识别。</li>
            <li>· 异常登录告警，包括短时间多次失败登录等场景。</li>
            <li>· 提供时段分布、地域分布等可视化分析视图。</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export function OperationLogPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground">操作日志</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          记录关键业务操作行为，包括数据新增 / 修改 / 删除 / 查询等，为审计与问题追踪提供依据。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            日志记录与查询（5.3.1 / 5.3.2）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 记录操作用户、时间、模块、类型、对象、内容前后对比、IP 与结果等。</li>
            <li>· 支持按用户、模块、类型、时间范围、结果与关键词等条件查询。</li>
            <li>· 支持日志结果导出与审计报告生成。</li>
          </ul>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <h3 className="text-xs font-semibold text-foreground">
            统计、清理与告警（5.3.3 / 5.3.4 / 5.4）
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>· 分析用户操作频率、模块访问热度与操作类型分布。</li>
            <li>· 支持日志保留策略配置、自动 / 手动清理与归档。</li>
            <li>· 对异常 / 敏感 / 高频失败操作触发告警，保障系统安全。</li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl bg-card p-4 shadow-sm border border-border">
        <h3 className="text-xs font-semibold text-foreground">业务规则与合规要求（5.5）</h3>
        <ul className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
          <li>· 所有操作必须记录日志，日志不可修改和删除。</li>
          <li>· 日志保留时间不少于 180 天，敏感操作重点记录。</li>
          <li>· 登录失败超过 5 次锁定账号，与用户管理联动。</li>
        </ul>
      </section>
    </div>
  );
}

export const systemPageComponentMap: Record<string, React.ComponentType> = {
  "data-explore:org-management": OrganizationManagementPage,
  "data-explore:user-management": UserManagementPage,
  "data-explore:role-management": RoleManagementPage,
  "data-explore:user-authorization": UserAuthorizationPage,
  "data-explore:login-log": LoginLogPage,
  "data-explore:operation-log": OperationLogPage,
  "model-lab-training:training-tasks": TrainingTasksPage,
};

