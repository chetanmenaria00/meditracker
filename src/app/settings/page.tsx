'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Download, Upload, Moon, Sun } from 'lucide-react';
import { AppData } from '@/types';

export default function SettingsPage() {
  const { exportData, importData } = useApp();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data: ' + error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as AppData;
      
      if (window.confirm('This will replace all existing data. Are you sure?')) {
        await importData(data);
        alert('Data imported successfully!');
      }
    } catch (error) {
      alert('Error importing data: ' + error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (typeof window !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your app preferences and data
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download all your data as a JSON file for backup or migration.
              </p>
              <button
                onClick={handleExport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Import data from a previously exported JSON file. This will replace all existing data.
              </p>
              <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Theme</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Choose between light and dark mode.
            </p>
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Privacy</h2>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data Storage</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All your data is stored locally in your browser using IndexedDB. No data is sent to any external servers.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>MediTracker</strong> is a privacy-first health management application that helps you track prescriptions, health issues, and medication adherence.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version: 1.0.0
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with Next.js, TypeScript, and TailwindCSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
