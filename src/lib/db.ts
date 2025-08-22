import { Prescription, HealthIssue, Reminder, AppData } from '@/types';

const DB_NAME = 'MediTrackerDB';
const DB_VERSION = 1;
const PRESCRIPTIONS_STORE = 'prescriptions';
const HEALTH_ISSUES_STORE = 'healthIssues';
const REMINDERS_STORE = 'reminders';

class MediTrackerDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create prescriptions store
        if (!db.objectStoreNames.contains(PRESCRIPTIONS_STORE)) {
          const store = db.createObjectStore(PRESCRIPTIONS_STORE, { keyPath: 'id' });
          store.createIndex('medicineName', 'medicineName', { unique: false });
          store.createIndex('isActive', 'isActive', { unique: false });
          store.createIndex('endDate', 'endDate', { unique: false });
        }

        // Create health issues store
        if (!db.objectStoreNames.contains(HEALTH_ISSUES_STORE)) {
          const store = db.createObjectStore(HEALTH_ISSUES_STORE, { keyPath: 'id' });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('severity', 'severity', { unique: false });
          store.createIndex('isResolved', 'isResolved', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // Create reminders store
        if (!db.objectStoreNames.contains(REMINDERS_STORE)) {
          const store = db.createObjectStore(REMINDERS_STORE, { keyPath: 'id' });
          store.createIndex('prescriptionId', 'prescriptionId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('isTaken', 'isTaken', { unique: false });
        }
      };
    });
  }

  async addPrescription(prescription: Prescription): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PRESCRIPTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.add(prescription);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updatePrescription(prescription: Prescription): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PRESCRIPTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.put(prescription);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deletePrescription(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PRESCRIPTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPrescriptions(): Promise<Prescription[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PRESCRIPTIONS_STORE], 'readonly');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addHealthIssue(issue: HealthIssue): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([HEALTH_ISSUES_STORE], 'readwrite');
      const store = transaction.objectStore(HEALTH_ISSUES_STORE);
      const request = store.add(issue);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateHealthIssue(issue: HealthIssue): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([HEALTH_ISSUES_STORE], 'readwrite');
      const store = transaction.objectStore(HEALTH_ISSUES_STORE);
      const request = store.put(issue);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteHealthIssue(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([HEALTH_ISSUES_STORE], 'readwrite');
      const store = transaction.objectStore(HEALTH_ISSUES_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getHealthIssues(): Promise<HealthIssue[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([HEALTH_ISSUES_STORE], 'readonly');
      const store = transaction.objectStore(HEALTH_ISSUES_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addReminder(reminder: Reminder): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REMINDERS_STORE], 'readwrite');
      const store = transaction.objectStore(REMINDERS_STORE);
      const request = store.add(reminder);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateReminder(reminder: Reminder): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REMINDERS_STORE], 'readwrite');
      const store = transaction.objectStore(REMINDERS_STORE);
      const request = store.put(reminder);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getReminders(): Promise<Reminder[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REMINDERS_STORE], 'readonly');
      const store = transaction.objectStore(REMINDERS_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async exportData(): Promise<AppData> {
    const [prescriptions, healthIssues, reminders] = await Promise.all([
      this.getPrescriptions(),
      this.getHealthIssues(),
      this.getReminders()
    ]);

    return { prescriptions, healthIssues, reminders };
  }

  async importData(data: AppData): Promise<void> {
    const { prescriptions, healthIssues, reminders } = data;

    // Clear existing data
    await this.clearAllData();

    // Import new data
    for (const prescription of prescriptions) {
      await this.addPrescription(prescription);
    }
    for (const issue of healthIssues) {
      await this.addHealthIssue(issue);
    }
    for (const reminder of reminders) {
      await this.addReminder(reminder);
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db!.transaction(
      [PRESCRIPTIONS_STORE, HEALTH_ISSUES_STORE, REMINDERS_STORE],
      'readwrite'
    );

    await Promise.all([
      transaction.objectStore(PRESCRIPTIONS_STORE).clear(),
      transaction.objectStore(HEALTH_ISSUES_STORE).clear(),
      transaction.objectStore(REMINDERS_STORE).clear()
    ]);
  }
}

export const db = new MediTrackerDB();
