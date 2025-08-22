'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HealthIssue } from '@/types';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function HealthIssuesPage() {
  const { healthIssues, addHealthIssue, updateHealthIssue, deleteHealthIssue } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<HealthIssue | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    date: '',
    linkedPrescriptionId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const issueData = {
      ...formData,
      isResolved: false,
    };

    if (editingIssue) {
      await updateHealthIssue({
        ...editingIssue,
        ...issueData,
      });
    } else {
      await addHealthIssue(issueData);
    }

    setShowForm(false);
    setEditingIssue(null);
    setFormData({
      title: '',
      details: '',
      severity: 'medium',
      date: '',
      linkedPrescriptionId: '',
    });
  };

  const handleEdit = (issue: HealthIssue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      details: issue.details,
      severity: issue.severity,
      date: issue.date,
      linkedPrescriptionId: issue.linkedPrescriptionId || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this health issue?')) {
      await deleteHealthIssue(id);
    }
  };

  const handleToggleResolved = async (issue: HealthIssue) => {
    await updateHealthIssue({
      ...issue,
      isResolved: !issue.isResolved,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health Issues</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your symptoms and health concerns
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Issue
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingIssue ? 'Edit Health Issue' : 'Add Health Issue'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details</label>
                <textarea
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingIssue ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIssue(null);
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {healthIssues
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((issue) => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.details}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleResolved(issue)}
                    className={`p-1 rounded ${
                      issue.isResolved
                        ? 'text-green-600 hover:text-green-800'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={issue.isResolved ? 'Mark as unresolved' : 'Mark as resolved'}
                  >
                    {issue.isResolved ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(issue)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(issue.date), 'MMM d, yyyy')}
                  </span>
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
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    issue.isResolved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {issue.isResolved ? 'Resolved' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {healthIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No health issues found. Add your first issue!</p>
        </div>
      )}
    </div>
  );
}
