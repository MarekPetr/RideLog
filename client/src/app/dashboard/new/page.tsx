'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ridesAPI } from '@/lib/api/rides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const rideSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  distance: z.string()
    .min(1, 'Distance is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Distance must be a positive number',
    }),
  duration: z.string()
    .min(1, 'Duration is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Duration must be a positive number',
    }),
  notes: z.string().optional(),
});

type RideFormData = z.infer<typeof rideSchema>;

export default function NewRidePage() {
  const t = useTranslations('dashboard.newRide');
  const tc = useTranslations('common');
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RideFormData>({
    resolver: zodResolver(rideSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      distance: '',
      duration: '',
      notes: '',
    },
  });

  const onSubmit = async (data: RideFormData) => {
    setError('');

    try {
      await ridesAPI.create({
        date: data.date,
        distance: parseFloat(data.distance),
        duration: parseInt(data.duration),
        notes: data.notes || undefined,
      });
      router.push('/dashboard/rides');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log ride. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('cardTitle')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">{t('distance')}</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                placeholder={t('distancePlaceholder')}
                {...register('distance')}
              />
              {errors.distance && (
                <p className="text-sm text-destructive">{errors.distance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t('duration')}</Label>
              <Input
                id="duration"
                type="number"
                placeholder={t('durationPlaceholder')}
                {...register('duration')}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                placeholder={t('notesPlaceholder')}
                rows={4}
                {...register('notes')}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('buttonLoading') : t('button')}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {tc('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
