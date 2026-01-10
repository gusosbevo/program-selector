import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, FileCheck, CreditCard, Tag, Settings, LogOut, ChevronDown, MessageCircle, Bell } from 'lucide-react';

const TestPage = () => {
  const stats = [
    { label: 'Alla', value: 1 },
    { label: 'Ej inlämnad', value: 1 },
    { label: 'Inlämnad, inväntar signering', value: 0 },
    { label: 'Registrerad', value: 0 },
    { label: 'Försänd', value: 0 }
  ];

  const reports = [
    {
      company: 'Evocorp AB',
      period: '2025-01-01 - 2025-12-31',
      status: 'Ej inlämnad',
      declaration: 'Ej skapad',
      updated: '08 jan. 2026 16:58'
    }
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r bg-white p-6">
        <div className="mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 pr-4">
              <span className="font-medium">OS</span>
              <span className="text-gray-600">sven.svensson@gmai...</span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Inställningar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logga ut
                <span className="ml-auto text-xs text-gray-500">⌘Q</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="space-y-0">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-600 hover:bg-gray-50 rounded">
            <FileText className="w-4 h-4" />
            <span className="font-medium">Årsredovisningar</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
            <FileCheck className="w-4 h-4" />
            Deklarationer
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
            <CreditCard className="w-4 h-4" />
            Betalningar
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
            <Tag className="w-4 h-4" />
            Prisplaner
          </a>
        </nav>

        <div className="mt-10">
          <div className="text-xs font-semibold text-gray-500 mb-3">Genvägar</div>
          <div className="text-sm text-gray-600">Kommande funktionalitet</div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full">
          {' '}
          {/* Change max-w-6xl to max-w-7xl for wider container */}
          <header className="bg-white px-8 py-4 flex items-center justify-end gap-4">
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
          </header>
          <div className="px-8">
            <div className="flex items-center justify-between mb-4">
              {' '}
              {/* Change mb-6 to mb-4 or mb-5 */}
              <h1 className="text-3xl font-bold">Årsredovisningar</h1>
              <Button className="bg-black text-white hover:bg-gray-800 rounded-md">+ Skapa årsredovisning</Button>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-5">
              {' '}
              {/* Change mb-6 to mb-4 or mb-5 */}
              {stats.map((stat, i) => (
                <div key={i} className={`border rounded-md p-4 ${i === 0 ? 'border-2 border-black' : 'border-gray-200'}`}>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                  <div className="text-xl font-bold mt-1">{stat.value}</div>
                </div>
              ))}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Företag</TableHead>
                  <TableHead>Räkenskapsår</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deklaration</TableHead>
                  <TableHead>Senast uppdaterad</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{report.company}</TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>
                      <span className="text-orange-600">{report.status}</span>
                    </TableCell>
                    <TableCell>{report.declaration}</TableCell>
                    <TableCell>{report.updated}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        ⋯
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-sm text-gray-600 mt-4 pb-8 pl-2">1 resultat</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
