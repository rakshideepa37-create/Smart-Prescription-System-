
import React from 'react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white p-4 shadow-md mb-8 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-black">
          <span className="text-blue-600">Smart</span> Prescription Tracker
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-black hidden sm:block">Welcome, {user.name} ({user.role})</span>
          <button
            onClick={onLogout}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
