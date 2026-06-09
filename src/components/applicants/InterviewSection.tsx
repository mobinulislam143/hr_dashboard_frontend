'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Save, Loader2, Star, Lock } from '@/components/ui/Icons';
import { useGetInterviewQuery, useSaveInterviewMutation } from '@/store/api/applicantApi';

interface Props { applicantId: string; readOnly?: boolean }

export function InterviewSection({ applicantId, readOnly = false }: Props) {
  const { data: interview, isLoading } = useGetInterviewQuery(applicantId);
  const [saveInterview, { isLoading: saving }] = useSaveInterviewMutation();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { interviewDate: '', notes: '', score: '' },
  });

  useEffect(() => {
    if (interview) {
      reset({
        interviewDate: interview.interviewDate
          ? new Date(interview.interviewDate).toISOString().slice(0, 16)
          : '',
        notes: interview.notes || '',
        score: interview.score?.toString() || '',
      });
    }
  }, [interview, reset]);

  const score = parseInt(watch('score')) || 0;

  const onSubmit = async (data: any) => {
    try {
      await saveInterview({ applicantId, data }).unwrap();
      toast.success('Interview saved');
    } catch {
      toast.error('Failed to save interview');
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Interview Details</h3>
        {readOnly && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> View only
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Interview Date & Time</label>
            <input {...register('interviewDate')} type="datetime-local" className="form-input" disabled={readOnly} />
          </div>
          <div>
            <label className="form-label">Interview Score (1–10)</label>
            <input {...register('score')} type="number" min={1} max={10} placeholder="Rate 1–10" className="form-input" disabled={readOnly} />
            {score > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < score ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{score} / 10</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Interview Notes</label>
          <textarea
            {...register('notes')}
            rows={5}
            placeholder="Strong communication, prior sales experience, good energy, needs confidence, high potential..."
            className="form-input resize-none"
            disabled={readOnly}
          />
        </div>

        {!readOnly && (
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Interview
          </button>
        )}
      </form>
    </div>
  );
}
