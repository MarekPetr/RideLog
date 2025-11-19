'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ridesAPI } from '@/lib/api/rides';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RideStats } from '@/lib/types';

export default function DashboardPage() {
  const t = useTranslations('dashboard.overview');
  const tc = useTranslations('common');
  const [stats, setStats] = useState<RideStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ridesAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>{tc('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>{t('totalRides')}</CardDescription>
            <CardTitle className="text-3xl">{stats?.summary.totalRides || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('totalDistance')}</CardDescription>
            <CardTitle className="text-3xl">{stats?.summary.totalDistance || 0} {t('km')}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('totalTime')}</CardDescription>
            <CardTitle className="text-3xl">{stats?.summary.totalDuration || 0} {t('min')}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('avgSpeed')}</CardDescription>
            <CardTitle className="text-3xl">{stats?.summary.averageSpeed || 0} {t('kmh')}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
