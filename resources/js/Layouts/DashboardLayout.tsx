import { ReactNode, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Masjid',
    href: '/masjid',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: 'Pendaftaran Masjid',
    href: '/masjid-registrations',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Donasi',
    href: '/donasi',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Pengguna',
    href: '/pengguna',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: 'Laporan',
    href: '/laporan',
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children, auth }: DashboardLayoutProps) {
  // desktop: collapsed state; mobile: open/close overlay
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentPath = window.location.pathname;

  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

  const handleLogout = () => router.post('/logout');

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo + toggle */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        {(!collapsed || isMobile) && (
          <a href="/dashboard" className="flex items-center gap-2">
            <img src="/logo.webp" alt="DanaMasjid" className="h-8 w-auto" />
            <span className="text-lg font-bold text-gray-900">DanaMasjid</span>
          </a>
        )}
        {collapsed && !isMobile && (
          <a href="/dashboard" className="mx-auto">
            <img src="/logo.webp" alt="DanaMasjid" className="h-8 w-auto" />
          </a>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              }
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? item.name : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`}
            >
              <span className={active ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
              {(!collapsed || isMobile) && <span>{item.name}</span>}
            </a>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-100 p-3">
        {(!collapsed || isMobile) ? (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{auth.user.name}</p>
              <p className="truncate text-xs text-gray-500">{auth.user.email}</p>
            </div>
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold" title={auth.user.name}>
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className={`w-full text-xs ${collapsed && !isMobile ? 'px-0' : ''}`}
          onClick={handleLogout}
          title="Logout"
        >
          {collapsed && !isMobile ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ) : 'Logout'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isMobile />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Cari..."
              className="w-64 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
