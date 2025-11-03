import React, { useState, useEffect } from 'react';
import { Prescription, User } from '../types';
import Header from './common/Header';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reminderTimes, setReminderTimes] = useState<{ [key: string]: string[] }>({});
  
  // State for the reminder modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [modalTimes, setModalTimes] = useState<string[]>([]);

  const fetchPrescriptions = () => {
    const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    setPrescriptions(allPrescriptions.filter(p => p.patientName === user.name));
  };
  
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    const savedReminders = JSON.parse(localStorage.getItem('reminderTimes') || '{}');
    setReminderTimes(savedReminders);
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.name]);

  const handleOpenReminderModal = (prescription: Prescription) => {
    alert('Reminder setup initiated! Please enter your reminder times.');
    
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    setSelectedPrescription(prescription);
    const existingTimes = reminderTimes[prescription.id] || [];
    const initialTimes = Array.from({ length: prescription.frequency }, (_, i) => existingTimes[i] || '');
    setModalTimes(initialTimes);
    setIsModalOpen(true);
  };

  const handleSaveReminders = () => {
    if (!selectedPrescription) return;

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (modalTimes.some(t => !t || !timeRegex.test(t))) {
        alert('Please enter all reminder times in a valid HH:MM format.');
        return;
    }

    const { id, medicine } = selectedPrescription;

    const newReminderTimes = { ...reminderTimes, [id]: modalTimes };
    setReminderTimes(newReminderTimes);
    localStorage.setItem('reminderTimes', JSON.stringify(newReminderTimes));
    alert('Reminders have been successfully set!');

    modalTimes.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const reminderDate = new Date();
      reminderDate.setHours(hours, minutes, 0, 0);

      let delay = reminderDate.getTime() - now.getTime();
      if (delay < 0) {
        reminderDate.setDate(reminderDate.getDate() + 1);
        delay = reminderDate.getTime() - now.getTime();
      }

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Medication Reminder', {
            body: `It's time to take your ${medicine}.`,
            tag: `med-reminder-${id}-${time}`
          });
        }
      }, delay);
    });
    
    setIsModalOpen(false);
    setSelectedPrescription(null);
    setModalTimes([]);
  };

  const handleMarkAsTaken = (id: string) => {
    const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const updatedPrescriptions = allPrescriptions.map(p => {
      if (p.id === id) {
        const totalDoses = p.frequency * p.duration;
        if (p.adherenceCount < totalDoses) {
          return { ...p, adherenceCount: p.adherenceCount + 1 };
        }
      }
      return p;
    });
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
    fetchPrescriptions(); // Refresh the state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Your Medications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.length > 0 ? prescriptions.map(p => {
            const totalDoses = p.frequency * p.duration;
            const adherencePercentage = totalDoses > 0 ? (p.adherenceCount / totalDoses) * 100 : 0;
            const currentReminders = reminderTimes[p.id] || [];

            return (
              <div key={p.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-black">{p.medicine}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status === 'Issued' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">For: {p.disease}</p>
                  <p className="text-sm font-mono text-gray-400 mb-4">{p.id}</p>
                  <div className="text-sm space-y-1 text-black">
                    <p><strong>Dosage:</strong> {p.dosage} mg</p>
                    <p><strong>Frequency:</strong> {p.frequency} times/day</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-500">Adherence: {p.adherenceCount}/{totalDoses} doses</label>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${adherencePercentage}%` }}></div>
                    </div>
                  </div>
                   {currentReminders.length > 0 && (
                      <div className="mt-4 text-xs text-gray-600 bg-gray-100 p-2 rounded-md">
                          <p className="font-semibold">Reminders set at:</p>
                          <p>{currentReminders.join(', ')}</p>
                      </div>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={() => handleOpenReminderModal(p)} className="w-full bg-gray-200 text-gray-800 text-sm font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition">Set Reminder</button>
                  <button onClick={() => handleMarkAsTaken(p.id)} disabled={p.adherenceCount >= totalDoses} className="w-full bg-[#2563EB] text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400">Mark as Taken</button>
                </div>
              </div>
            );
          }) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-xl shadow-lg">
              <p className="text-gray-500">You have no active prescriptions.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-black">Set Reminders for {selectedPrescription.medicine}</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {modalTimes.map((time, index) => (
                <div key={index}>
                  <label className="text-sm font-medium text-gray-700">Reminder {index + 1}</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...modalTimes];
                      newTimes[index] = e.target.value;
                      setModalTimes(newTimes);
                    }}
                    className="mt-1 w-full bg-[#2D2D2D] text-white p-2 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminders}
                className="w-full bg-[#2563EB] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Save Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;