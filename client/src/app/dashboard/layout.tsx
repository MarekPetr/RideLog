'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard.nav');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: t('overview') },
    { href: '/dashboard/new', label: t('logRide') },
    { href: '/dashboard/rides', label: t('allRides') },
    { href: '/dashboard/progress', label: t('progress') },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              {tc('ridelog')}
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {tc('logout')}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-muted/10">
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={pathname === link.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
