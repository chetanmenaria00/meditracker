'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Prescription, HealthIssue, Reminder, AppData } from '@/types';
import { db } from '@/lib/db';

interface AppContextType {
  prescriptions: Prescription[];
  healthIssues: HealthIssue[];
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  addPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrescription: (prescription: Prescription) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
  addHealthIssue: (issue: Omit<HealthIssue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHealthIssue: (issue: HealthIssue) => Promise<void>;
  deleteHealthIssue: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: AppData) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [prescriptionsData, healthIssuesData, remindersData] = await Promise.all([
        db.getPrescriptions(),
        db.getHealthIssues(),
        db.getReminders()
      ]);

      setPrescriptions(prescriptionsData);
      setHealthIssues(healthIssuesData);
      setReminders(remindersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await db.init();
        await refreshData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
        setLoading(false);
      }
    };
    
    init();
  }, []);

  const addPrescription = async (prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.addPrescription(newPrescription);
    await refreshData();
  };

  const updatePrescription = async (prescription: Prescription) => {
    const updatedPrescription = {
      ...prescription,
      updatedAt: new Date().toISOString()
    };
    
    await db.updatePrescription(updatedPrescription);
    await refreshData();
  };

  const deletePrescription = async (id: string) => {
    await db.deletePrescription(id);
    await refreshData();
  };

  const addHealthIssue = async (issue: Omit<HealthIssue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIssue: HealthIssue = {
      ...issue,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.addHealthIssue(newIssue);
    await refreshData();
  };

  const updateHealthIssue = async (issue: HealthIssue) => {
    const updatedIssue = {
      ...issue,
      updatedAt: new Date().toISOString()
    };
    
    await db.updateHealthIssue(updatedIssue);
    await refreshData();
  };

  const deleteHealthIssue = async (id: string) => {
    await db.deleteHealthIssue(id);
    await refreshData();
  };

  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID()
    };
    
    await db.addReminder(newReminder);
    await refreshData();
  };

  const updateReminder = async (reminder: Reminder) => {
    await db.updateReminder(reminder);
    await refreshData();
  };

  const exportData = async (): Promise<string> => {
    const data = await db.exportData();
    return JSON.stringify(data, null, 2);
  };

  const importData = async (data: AppData) => {
    await db.importData(data);
    await refreshData();
  };

  const value: AppContextType = {
    prescriptions,
    healthIssues,
    reminders,
    loading,
    error,
    addPrescription,
    updatePrescription,
    deletePrescription,
    addHealthIssue,
    updateHealthIssue,
    deleteHealthIssue,
    addReminder,
    updateReminder,
    exportData,
    importData,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
