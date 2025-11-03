
import React, { useState } from 'react';
import { Role, User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [error, setError] = useState('');

  const handleAuthAction = () => {
    setError('');
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (isSigningUp) {
      if (!name || !email || !password) {
        setError('All fields are required for signup.');
        return;
      }
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('User with this email already exists.');
        return;
      }
      const newUser: User = { id: Date.now().toString(), name, email, password, role };
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === email && u.password === password && u.role === role);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or role mismatch.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          {isSigningUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isSigningUp ? 'Join the future of healthcare.' : 'Sign in to your dashboard.'}
        </p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <div className="space-y-4">
          {isSigningUp && (
            <div>
              <label className="text-sm font-medium text-black">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="mt-1 w-full bg-[#2D2D2D] text-white placeholder-gray-400 p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-black">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full bg-[#2D2D2D] text-white placeholder-gray-400 p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full bg-[#2D2D2D] text-white placeholder-gray-400 p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label className="text-sm font-medium text-black">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 w-full bg-[#2D2D2D] text-white p-3 rounded-md border-gray-700 focus:ring-blue-500 focus:border-blue-500">
              <option value={Role.PATIENT}>Patient</option>
              <option value={Role.DOCTOR}>Doctor</option>
              <option value={Role.PHARMACY}>Pharmacy</option>
            </select>
          </div>
          <button onClick={handleAuthAction} className="w-full bg-[#2563EB] text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            {isSigningUp ? 'Sign Up' : 'Login'}
          </button>
        </div>
        
        <p className="text-sm text-center text-gray-500 mt-6">
          {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSigningUp(!isSigningUp); setError(''); }} className="font-semibold text-blue-600 hover:underline ml-1">
            {isSigningUp ? 'Login' : 'Create New User'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
