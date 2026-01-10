// components/admin/QuestionModal.js
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createQuestion, updateQuestion } from '@/lib/requests';

const QuestionModal = ({ question, sections, onClose }) => {
  const [formData, setFormData] = useState(
    question ? { text: question.text, section_id: question.section_id, required: question.required, order: question.order } : { text: '', section_id: '', required: false, order: 0 }
  );
  const queryClient = useQueryClient();
  const isEdit = !!question;

  const mutation = useMutation({
    mutationFn: (data) => (isEdit ? updateQuestion(question.id, data) : createQuestion(data)),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
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
          <DialogTitle>{isEdit ? 'Redigera fråga' : 'Ny fråga'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Frågetext</Label>
            <Input value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required />
          </div>

          <div>
            <Label>Sektion</Label>
            <Select value={formData.section_id.toString()} onValueChange={(value) => setFormData({ ...formData, section_id: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Välj sektion" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="required" checked={formData.required} onChange={(e) => setFormData({ ...formData, required: e.target.checked })} className="w-4 h-4" />
            <Label htmlFor="required">Obligatorisk fråga</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {isEdit ? 'Spara' : 'Skapa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
