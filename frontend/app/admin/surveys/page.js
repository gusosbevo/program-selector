// app/admin/surveys/page.jsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { getSurveys } from '@/lib/requests';
import { useRouter } from 'next/navigation';

const SurveysPage = () => {
  const router = useRouter();

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: getSurveys
  });

  const completedSurveys = surveys.filter((s) => s.completed);

  if (isLoading) return <div className="p-8">Laddar...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Undersökningar</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-600">Totalt</div>
          <div className="text-2xl font-bold mt-1">{surveys.length}</div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-600">Slutförda</div>
          <div className="text-2xl font-bold mt-1">{completedSurveys.length}</div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-600">Pågående</div>
          <div className="text-2xl font-bold mt-1">{surveys.length - completedSurveys.length}</div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-sm text-gray-600">Genomförande</div>
          <div className="text-2xl font-bold mt-1">{surveys.length ? Math.round((completedSurveys.length / surveys.length) * 100) : 0}%</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slutförd</TableHead>
              <TableHead>Topp 3 program</TableHead>
              <TableHead className="w-24">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.student_name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${survey.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {survey.completed ? 'Slutförd' : 'Pågående'}
                  </span>
                </TableCell>
                <TableCell>{survey.completed_at ? new Date(survey.completed_at).toLocaleDateString('sv-SE') : '-'}</TableCell>
                <TableCell>
                  {survey.results?.programs?.slice(0, 3).map((p) => (
                    <div key={p.program_id} className="text-sm">
                      {p.program_name} ({p.score.toFixed(1)})
                    </div>
                  )) || '-'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/surveys/${survey.id}`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600 mt-4">{surveys.length} undersökningar</div>
    </div>
  );
};

export default SurveysPage;
