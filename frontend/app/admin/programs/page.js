// app/admin/programs/page.jsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getPrograms, deleteProgram } from '@/lib/requests';
import ProgramModal from '@/components/admin/ProgramModal';

const ProgramsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const queryClient = useQueryClient();

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries(['programs']);
    }
  });

  const handleEdit = (program) => {
    setEditingProgram(program);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProgram(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Är du säker på att du vill ta bort detta program?')) deleteMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProgram(null);
  };

  if (isLoading) return <div className="p-8">Laddar...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Program</h1>
        <Button onClick={handleAdd} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Nytt program
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Beskrivning</TableHead>
              <TableHead className="w-24">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell className="text-gray-600">{program.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(program)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(program.id)} disabled={deleteMutation.isLoading}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600 mt-4">{programs.length} program</div>

      {modalOpen && <ProgramModal program={editingProgram} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProgramsPage;
