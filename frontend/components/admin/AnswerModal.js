'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { upsertAnswer } from '@/lib/requests';

const AnswerModal = ({ question_id, answer, onClose }) => {
  const [formData, setFormData] = useState(answer ? { text: answer.text, order: answer.order } : { text: '', order: 0 });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => upsertAnswer(question_id, { ...data, ...(answer?.id && { id: answer.id }) }),
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
          <DialogTitle>{answer ? 'Redigera svar' : 'Nytt svar'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Svarstext</Label>
            <Input value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {answer ? 'Spara' : 'Skapa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerModal;
