// app/admin/sections/page.jsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { getSections, deleteSection } from '@/lib/requests';
import SectionModal from '@/components/admin/SectionModal';

const SectionsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries(['sections']);
    }
  });

  const handleEdit = (section) => {
    setEditingSection(section);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSection(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Är du säker på att du vill ta bort denna sektion?')) deleteMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSection(null);
  };

  if (isLoading) return <div className="p-8">Laddar...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Frågesektioner</h1>
        <Button onClick={handleAdd} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Ny sektion
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  {section.description && <p className="text-sm text-gray-600 mt-1">{section.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(section)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(section.id)} disabled={deleteMutation.isLoading}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-600 mt-4">{sections.length} sektioner</div>

      {modalOpen && <SectionModal section={editingSection} onClose={handleCloseModal} />}
    </div>
  );
};

export default SectionsPage;
