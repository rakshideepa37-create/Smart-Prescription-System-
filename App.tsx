
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';
import { User, Role } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const renderDashboard = () => {
    if (!currentUser) return <LoginPage onLogin={handleLogin} />;

    switch (currentUser.role) {
      case Role.DOCTOR:
        return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;
      case Role.PATIENT:
        return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
      case Role.PHARMACY:
        return <PharmacyDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      {renderDashboard()}
    </div>
  );
}

export default App;
