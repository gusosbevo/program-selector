'use client';

import { usePathname } from 'next/navigation';
import { FileText, ListTree, HelpCircle, Grid3x3, BarChart } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/programs', label: 'Program', icon: FileText },
    { href: '/admin/sections', label: 'Frågesektioner', icon: ListTree },
    { href: '/admin/questions', label: 'Frågor & Svar', icon: HelpCircle },
    { href: '/admin/scoring', label: 'Poängmatris', icon: Grid3x3 },
    { href: '/admin/surveys', label: 'Undersökningar', icon: BarChart }
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r bg-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">Gymnasieval</h1>
          <p className="text-sm text-gray-600">Admin Dashboard</p>
        </div>
        <nav className="space-y-0">
          {navItems.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${pathname === href ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-50`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  );
};

export default AdminLayout;
