'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { X, Loader2 } from '@/components/ui/Icons';
import { useCreateApplicantMutation } from '@/store/api/applicantApi';
import { BUSINESS_LABELS, ROLE_LABELS, SOURCE_LABELS, Business, RepRole, RecruitingSource } from '@/types';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone:    z.string().min(7, 'Phone required'),
  email:    z.string().email('Valid email required'),
  city:     z.string().min(1, 'City required'),
  state:    z.string().min(1, 'State required'),
  recruitingSource: z.string().min(1, 'Source required'),
  business: z.string().min(1, 'Business required'),
  role:     z.string().min(1, 'Role required'),
  dateApplied: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props { onClose: () => void; onSuccess: () => void; }

export function AddApplicantModal({ onClose, onSuccess }: Props) {
  const [createApplicant, { isLoading }] = useCreateApplicantMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { dateApplied: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createApplicant(data as any).unwrap();
      toast.success('Applicant added successfully');
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add applicant');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <div>
            <h2 className="font-semibold text-foreground text-lg">Add New Applicant</h2>
            <p className="text-muted-foreground text-xs mt-0.5">Fill in the applicant details below</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input {...register('fullName')} placeholder="John Smith" className="form-input" />
              {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input {...register('phone')} placeholder="(555) 000-0000" className="form-input" />
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email *</label>
            <input {...register('email')} type="email" placeholder="john@email.com" className="form-input" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">City *</label>
              <input {...register('city')} placeholder="Austin" className="form-input" />
              {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="form-label">State *</label>
              <input {...register('state')} placeholder="TX" className="form-input" />
              {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>

          {/* Business + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Business *</label>
              <select {...register('business')} className="form-input">
                <option value="">Select business</option>
                {(Object.keys(BUSINESS_LABELS) as Business[]).map(b => (
                  <option key={b} value={b}>{BUSINESS_LABELS[b]}</option>
                ))}
              </select>
              {errors.business && <p className="text-destructive text-xs mt-1">{errors.business.message}</p>}
            </div>
            <div>
              <label className="form-label">Role *</label>
              <select {...register('role')} className="form-input">
                <option value="">Select role</option>
                {(Object.keys(ROLE_LABELS) as RepRole[]).map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              {errors.role && <p className="text-destructive text-xs mt-1">{errors.role.message}</p>}
            </div>
          </div>

          {/* Source + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Recruiting Source *</label>
              <select {...register('recruitingSource')} className="form-input">
                <option value="">Select source</option>
                {(Object.keys(SOURCE_LABELS) as RecruitingSource[]).map(s => (
                  <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                ))}
              </select>
              {errors.recruitingSource && <p className="text-destructive text-xs mt-1">{errors.recruitingSource.message}</p>}
            </div>
            <div>
              <label className="form-label">Date Applied</label>
              <input {...register('dateApplied')} type="date" className="form-input" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 justify-center">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Adding...' : 'Add Applicant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
