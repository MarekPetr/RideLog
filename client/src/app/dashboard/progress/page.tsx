'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ridesAPI } from '@/lib/api/rides';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RideStats } from '@/lib/types';

export default function ProgressPage() {
  const t = useTranslations('dashboard.progress');
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

  if (!stats || stats.dailyStats.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('chart.title')}</CardTitle>
          <CardDescription>{t('chart.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value} ${tc('km')}`, t('chart.distance')]}
                />
                <Line type="monotone" dataKey="distance" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>{t('stats.totalRides')}</CardDescription>
            <CardTitle className="text-3xl">{stats.summary.totalRides}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('stats.totalDistance')}</CardDescription>
            <CardTitle className="text-3xl">{stats.summary.totalDistance} {tc('km')}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('stats.totalTime')}</CardDescription>
            <CardTitle className="text-3xl">{stats.summary.totalDuration} {tc('min')}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t('stats.avgSpeed')}</CardDescription>
            <CardTitle className="text-3xl">{stats.summary.averageSpeed} {tc('kmh')}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
