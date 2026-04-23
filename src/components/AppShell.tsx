import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileEdit,
  User,
  HelpCircle,
  LogOut,
  FolderKanban,
  Calculator,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  to?: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Se true, mostra como item de menu em destaque, mas sem navegação. */
  disabled?: boolean;
};

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { label: "Projetos", icon: FolderKanban, disabled: true },
  { to: "/central-solicitacoes", label: "Central de Solicitações", icon: FileEdit },
  { label: "Simulador Orçamentário", icon: Calculator, disabled: true },
  { label: "Banco de Talentos", icon: Users, disabled: true },
  { to: "/perfil", label: "Meu Perfil", icon: User },
  { to: "/ajuda", label: "Ajuda", icon: HelpCircle },
];

export function AppShell() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside
        className={cn(
          "hidden md:flex flex-col text-[color:var(--sidebar-fg)] sticky top-0 h-screen transition-[width] duration-200",
          collapsed ? "w-16" : "w-64"
        )}
        style={{ background: "var(--sidebar-bg)" }}
      >
        <div className={cn("-my-4 py-0 flex items-center gap-0", collapsed ? "px-3 justify-center" : "px-6")}>
          <div className="flex items-center justify-center shrink-0 leading-none">
            <img
              src={logo}
              alt="Logo"
              className={cn(collapsed ? "h-12 w-12" : "h-45 w-45", "rounded-lg object-contain block leading-none -my-2")}
            />
          </div>
        </div>
        

        {!collapsed && (
          <div className="px-4 mb-4">
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/30 flex items-center justify-center font-semibold">RB</div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">Renata Braga</div>
                <div className="text-xs opacity-70 truncate">Coordenadora</div>
              </div>
            </div>
          </div>
        )}

        <nav className={cn("space-y-1 flex-1", collapsed ? "px-2" : "px-3")}>
          {!collapsed && (
            <div className="px-3 pb-2 text-[11px] uppercase tracking-wider opacity-60">Menu</div>
          )}
          {nav.map((item) => {
            const active = !!item.to && (pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to)));
            const Icon = item.icon;
            const baseClass = cn(
              "flex items-center rounded-lg text-sm transition-colors",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/5 opacity-90"
            );
            const inner = (
              <>
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            );
            if (item.disabled || !item.to) {
              return (
                <div key={item.label} className={baseClass} title={collapsed ? item.label : undefined}>
                  {inner}
                </div>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={baseClass}
                title={collapsed ? item.label : undefined}
              >
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t border-white/10", collapsed ? "p-2" : "p-4")}>
          <button
            className={cn(
              "flex items-center text-sm opacity-80 hover:opacity-100 w-full",
              collapsed ? "justify-center" : "gap-3"
            )}
            title="Sair"
          >
            <LogOut className="size-4" />
            {!collapsed && "Sair"}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}