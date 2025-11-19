'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ridesAPI } from '@/lib/api/rides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Ride } from '@/lib/types';

export default function RidesPage() {
  const t = useTranslations('dashboard.rides');
  const tc = useTranslations('common');
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [formData, setFormData] = useState({ date: '', distance: '', duration: '', notes: '' });
  const [error, setError] = useState('');

  const fetchRides = async () => {
    try {
      const data = await ridesAPI.getAll();
      setRides(data.rides);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleEdit = (ride: Ride) => {
    setEditingRide(ride);
    setFormData({
      date: ride.date.split('T')[0],
      distance: ride.distance.toString(),
      duration: ride.duration.toString(),
      notes: ride.notes || '',
    });
    setError('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRide) return;

    try {
      await ridesAPI.update(editingRide._id, {
        date: formData.date,
        distance: parseFloat(formData.distance),
        duration: parseInt(formData.duration),
        notes: formData.notes || undefined,
      });
      setEditingRide(null);
      fetchRides();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ride');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await ridesAPI.delete(id);
      fetchRides();
    } catch (error) {
      console.error('Failed to delete ride:', error);
    }
  };

  if (isLoading) {
    return <div>{tc('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      {rides.length === 0 ? (
        <p className="text-muted-foreground">{t('noRides')}</p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.date')}</TableHead>
                <TableHead>{t('table.distance')}</TableHead>
                <TableHead>{t('table.duration')}</TableHead>
                <TableHead>{t('table.notes')}</TableHead>
                <TableHead>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride._id}>
                  <TableCell>{new Date(ride.date).toLocaleDateString()}</TableCell>
                  <TableCell>{ride.distance}</TableCell>
                  <TableCell>{ride.duration}</TableCell>
                  <TableCell className="max-w-xs truncate">{ride.notes || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(ride)}>
                        {tc('edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ride._id)}
                      >
                        {tc('delete')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editingRide} onOpenChange={() => setEditingRide(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('edit.title')}</DialogTitle>
            <DialogDescription>{t('edit.description')}</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">{t('edit.date')}</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-distance">{t('edit.distance')}</Label>
              <Input
                id="edit-distance"
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">{t('edit.duration')}</Label>
              <Input
                id="edit-duration"
                type="number"
                min="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">{t('edit.notes')}</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setEditingRide(null)}>
                {tc('cancel')}
              </Button>
              <Button type="submit">{t('edit.save')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
