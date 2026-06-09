'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, CheckCircle2, XCircle, Clock, Lock } from '@/components/ui/Icons';
import { useGetTrainingsQuery, useSaveTrainingMutation } from '@/store/api/applicantApi';
import { Training } from '@/types';
import { cn } from '@/lib/utils';

interface Props { applicantId: string; readOnly?: boolean }

const trainingTheme = [
  { borderColor: 'border-primary/30',  headerBg: 'bg-primary/5',  dotColor: 'bg-primary'   },
  { borderColor: 'border-violet-500/30', headerBg: 'bg-violet-500/5', dotColor: 'bg-violet-500' },
  { borderColor: 'border-emerald-500/30', headerBg: 'bg-emerald-500/5', dotColor: 'bg-emerald-500' },
];

function TrainingCard({ num, training, applicantId, readOnly = false }: {
  num: number; training?: Training; applicantId: string; readOnly?: boolean;
}) {
  const theme = trainingTheme[num - 1];
  const [saveTraining, { isLoading }] = useSaveTrainingMutation();

  const [scheduledDate, setScheduledDate] = useState(
    training?.scheduledDate ? new Date(training.scheduledDate).toISOString().split('T')[0] : ''
  );
  const [completedDate, setCompletedDate] = useState(
    training?.completedDate ? new Date(training.completedDate).toISOString().split('T')[0] : ''
  );
  const [result, setResult] = useState(training?.result || '');

  const save = async () => {
    try {
      await saveTraining({ applicantId, data: { trainingNumber: num, scheduledDate, completedDate, result } }).unwrap();
      toast.success(`Training ${num} saved`);
    } catch {
      toast.error('Failed to save training');
    }
  };

  return (
    <div className={cn('card border overflow-hidden', theme.borderColor)}>
      {/* Header */}
      <div className={cn('px-5 py-3.5 border-b border-border flex items-center justify-between', theme.headerBg)}>
        <div className="flex items-center gap-2.5">
          <div className={cn('w-2 h-2 rounded-full', theme.dotColor)} />
          <span className="font-semibold text-sm text-foreground">Training {num}</span>
        </div>
        {training?.result === 'PASS' && (
          <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
          </span>
        )}
        {training?.result === 'FAIL' && (
          <span className="flex items-center gap-1 text-xs text-destructive font-semibold">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        )}
        {!training?.result && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <div>
          <label className="form-label text-xs">Scheduled Date</label>
          <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="form-input text-sm" disabled={readOnly} />
        </div>
        <div>
          <label className="form-label text-xs">Completed Date</label>
          <input type="date" value={completedDate} onChange={e => setCompletedDate(e.target.value)} className="form-input text-sm" disabled={readOnly} />
        </div>
        <div>
          <label className="form-label text-xs">Result</label>
          <select value={result} onChange={e => setResult(e.target.value)} className="form-input text-sm" disabled={readOnly}>
            <option value="">Pending</option>
            <option value="PASS">Pass ✓</option>
            <option value="FAIL">Fail ✗</option>
          </select>
        </div>
        {readOnly ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Lock className="w-3 h-3" /> View only — Manager access required to edit
          </div>
        ) : (
          <button onClick={save} disabled={isLoading} className="btn-primary w-full justify-center text-sm py-2 mt-1">
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Training {num}
          </button>
        )}
      </div>
    </div>
  );
}

export function TrainingSection({ applicantId, readOnly = false }: Props) {
  const { data: trainings = [], isLoading } = useGetTrainingsQuery(applicantId);

  if (isLoading) {
    return (
      <div className="card p-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-4">Training Progress</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map(num => (
          <TrainingCard
            key={num}
            num={num}
            training={trainings.find((t: Training) => t.trainingNumber === num)}
            applicantId={applicantId}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
