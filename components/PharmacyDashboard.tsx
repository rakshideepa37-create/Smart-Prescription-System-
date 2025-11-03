
import React, { useState } from 'react';
import { Prescription, User } from '../types';
import Header from './common/Header';

interface PharmacyDashboardProps {
  user: User;
  onLogout: () => void;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ user, onLogout }) => {
  const [searchId, setSearchId] = useState('');
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setPrescription(null);
    const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const found = allPrescriptions.find(p => p.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setPrescription(found);
    } else {
      setError('Prescription ID not found.');
    }
  };
  
  const handleDispense = () => {
      if (!prescription) return;
      const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      const updatedPrescriptions = allPrescriptions.map(p =>
        p.id === prescription.id ? { ...p, status: 'Dispensed' as const } : p
      );
      localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
      setPrescription({ ...prescription, status: 'Dispensed' });
      alert('Prescription marked as dispensed.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-4">Verify Prescription</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Reference ID (e.g., RX-2024-12345)"
              className="flex-grow bg-[#2D2D2D] text-white placeholder-gray-400 p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={handleSearch} className="bg-[#2563EB] text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition">Search</button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {prescription && (
            <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">Prescription Details</h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${prescription.status === 'Issued' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{prescription.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
                    <p><strong>Reference ID:</strong> <span className="font-mono">{prescription.id}</span></p>
                    <p><strong>Patient:</strong> {prescription.patientName} (Age: {prescription.patientAge})</p>
                    <p><strong>Doctor:</strong> {prescription.doctorName}</p>
                    <p><strong>Disease:</strong> {prescription.disease}</p>
                    <p className="sm:col-span-2"><strong>Medicine:</strong> {prescription.medicine}</p>
                    <p><strong>Dosage:</strong> {prescription.dosage} mg</p>
                    <p><strong>Frequency:</strong> {prescription.frequency} times/day</p>
                    <p><strong>Duration:</strong> {prescription.duration} days</p>
                </div>
                 <div className="mt-6">
                    <button onClick={handleDispense} disabled={prescription.status === 'Dispensed'} className="w-full bg-[#2563EB] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {prescription.status === 'Dispensed' ? 'Dispensed' : 'Mark as Dispensed'}
                    </button>
                 </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
