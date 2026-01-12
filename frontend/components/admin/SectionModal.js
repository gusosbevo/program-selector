'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { upsertSection } from '@/lib/requests';

const SectionModal = ({ section, onClose }) => {
  const [formData, setFormData] = useState(section ? { id: section.id, title: section.title, description: section.description || '', order: section.order } : { title: '', description: '', order: 0 });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: upsertSection,
    onSuccess: () => {
      queryClient.invalidateQueries(['sections']);
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section ? 'Redigera sektion' : 'Ny sektion'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Sektionsnamn</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div>
            <Label>Beskrivning</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {section ? 'Spara' : 'Skapa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionModal;
