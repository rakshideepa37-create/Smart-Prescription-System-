import React, { useState, useEffect } from 'react';
import { Prescription, User } from '../types';
import { generateReferenceId, validateWithAI } from '../utils/helpers';
import Header from './common/Header';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, onLogout }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [disease, setDisease] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  useEffect(() => {
    const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    setPrescriptions(allPrescriptions.filter(p => p.doctorId === user.id));
  }, [user.id]);

  const handleValidate = () => {
    const msg = validateWithAI(Number(dosage), Number(frequency), Number(patientAge), medicine);
    setValidationMsg(msg);
  };

  const clearForm = () => {
    setPatientName('');
    setPatientAge('');
    setDisease('');
    setMedicine('');
    setDosage('');
    setFrequency('');
    setDuration('');
    setValidationMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientAge || !disease || !medicine || !dosage || !frequency || !duration) {
        alert('Please fill all fields.');
        return;
    }

    const newPrescription: Prescription = {
      id: generateReferenceId(),
      patientName,
      patientAge: Number(patientAge),
      disease,
      medicine,
      dosage: Number(dosage),
      frequency: Number(frequency),
      duration: Number(duration),
      doctorId: user.id,
      doctorName: user.name,
      status: 'Issued',
      adherenceCount: 0,
    };

    const allPrescriptions: Prescription[] = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const updatedPrescriptions = [...allPrescriptions, newPrescription];
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
    setPrescriptions(prev => [...prev, newPrescription]);
    alert(`Prescription generated with ID: ${newPrescription.id}`);
    clearForm();
  };

  const inputClass = "w-full bg-[#2D2D2D] text-white placeholder-gray-400 p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-black mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-black mb-4">New Prescription</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className={labelClass}>Patient Name</label><input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Patient Age</label><input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Disease Diagnosed</label><input type="text" value={disease} onChange={e => setDisease(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Medicine Name</label><input type="text" value={medicine} onChange={e => setMedicine(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Dosage (mg)</label><input type="number" value={dosage} onChange={e => setDosage(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Frequency (times/day)</label><input type="number" value={frequency} onChange={e => setFrequency(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Duration (days)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} className={inputClass} /></div>
              {validationMsg && <p className={`p-2 rounded text-sm ${validationMsg.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{validationMsg}</p>}
              <div className="flex gap-4">
                <button type="button" onClick={handleValidate} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition">Validate with AI</button>
                <button type="submit" className="w-full bg-[#2563EB] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition">Generate</button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-black mb-4">Issued Prescriptions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-3">Ref ID</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length > 0 ? prescriptions.map(p => (
                    <tr key={p.id} className="border-b">
                      <td className="px-4 py-3 font-mono">{p.id}</td>
                      <td className="px-4 py-3">{p.patientName}</td>
                      <td className="px-4 py-3">{p.medicine}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Issued' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No prescriptions issued yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;