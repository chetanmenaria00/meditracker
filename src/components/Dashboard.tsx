'use client';

import { useApp } from '@/context/AppContext';
import { Prescription, HealthIssue } from '@/types';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Pill, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const { prescriptions, healthIssues, loading } = useApp();
  
  const todayMedicines = useMemo(() => {
    return prescriptions.filter(p => p.isActive);
  }, [prescriptions]);

  const latestIssues = useMemo(() => {
    return healthIssues
      .filter(h => !h.isResolved)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [healthIssues]);

  const upcomingReminders = useMemo(() => {
    const today = new Date();
    return prescriptions.filter(p => {
      if (!p.endDate) return true;
      return new Date(p.endDate) >= today;
    });
  }, [prescriptions]);

  const adherenceRate = useMemo(() => {
    const activePrescriptions = prescriptions.filter(p => p.isActive);
    return activePrescriptions.length > 0 ? 85 : 0;
  }, [prescriptions]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your medications and health issues in one place
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Pill className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {healthIssues.filter(h => !h.isResolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Adherence Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{adherenceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.length + healthIssues.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Medicines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today&apos;s Medications</h2>
          </div>
          <div className="p-6">
            {todayMedicines.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No active medications
              </p>
            ) : (
              <div className="space-y-4">
                {todayMedicines.slice(0, 5).map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{prescription.medicineName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latest Health Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Health Issues</h2>
          </div>
          <div className="p-6">
            {latestIssues.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No active health issues
              </p>
            ) : (
              <div className="space-y-4">
                {latestIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{issue.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{issue.details}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.severity === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : issue.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
