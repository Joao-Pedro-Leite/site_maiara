import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import LoginForm from '../components/admin/LoginForm';
import ItemRegistrationForm from '../components/admin/ItemRegistrationForm';
import DonorList from '../components/admin/DonorList';
import { useApp } from '../context/AppContext';

const AdminPage: React.FC = () => {
  const { isAdmin, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'items' | 'donors'>('items');

  if (!isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-90 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-rose-400 mr-2" />
            <h1 className="text-3xl font-serif font-medium text-gray-800">
              Administração dos registros
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition duration-300">
              Menu de contribuições
            </Link>
            <button 
              onClick={logout}
              className="flex items-center text-gray-500 hover:text-gray-700 transition duration-300"
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8 flex border-b border-gray-200">
          <button
            className={`px-4 py-3 text-lg font-medium ${
              activeTab === 'items'
                ? 'text-rose-500 border-b-2 border-rose-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Cadastrar item
          </button>
          <button
            className={`px-4 py-3 text-lg font-medium ${
              activeTab === 'donors'
                ? 'text-rose-500 border-b-2 border-rose-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('donors')}
          >
            Doações
          </button>
        </div>

        {activeTab === 'items' ? (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Cadastrar novo item</h2>
            <ItemRegistrationForm />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Todas doações</h2>
            <DonorList />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;