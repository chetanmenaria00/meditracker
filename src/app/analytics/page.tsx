'use client';

import { useApp } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { TrendingUp, Activity, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const { prescriptions, healthIssues } = useApp();

  // Calculate medication adherence (mock data for demo)
  const adherenceData = [
    { name: 'Week 1', adherence: 95 },
    { name: 'Week 2', adherence: 88 },
    { name: 'Week 3', adherence: 92 },
    { name: 'Week 4', adherence: 85 },
  ];

  // Health issues by severity
  const severityData = [
    { name: 'Low', value: healthIssues.filter(h => h.severity === 'low').length, color: '#10b981' },
    { name: 'Medium', value: healthIssues.filter(h => h.severity === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: healthIssues.filter(h => h.severity === 'high').length, color: '#ef4444' },
  ];

  // Issues over time
  const issuesOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const count = healthIssues.filter(
      issue => format(new Date(issue.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length;
    return {
      date: format(date, 'MMM d'),
      issues: count,
    };
  });

  // Active vs resolved issues
  const statusData = [
    { name: 'Active', value: healthIssues.filter(h => !h.isResolved).length, color: '#f59e0b' },
    { name: 'Resolved', value: healthIssues.filter(h => h.isResolved).length, color: '#10b981' },
  ];

  const totalPrescriptions = prescriptions.length;
  const activePrescriptions = prescriptions.filter(p => p.isActive).length;
  const totalIssues = healthIssues.length;
  const resolvedIssues = healthIssues.filter(h => h.isResolved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Insights into your health data
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalPrescriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activePrescriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{resolvedIssues}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medication Adherence */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medication Adherence</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="adherence" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issues by Severity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Issues by Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Issues Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Issues Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="issues" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issue Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Issue Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
