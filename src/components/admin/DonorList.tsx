import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DonorCard from './DonorCard';
import { listarDoadorDoItem } from '../../lib/supabase';



const DonorList: React.FC = () => {
  const { donors, items } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  

  
  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const isLoading = !donors.length || !items.length;

  // 👇 Verificação de loading aqui
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div
          className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"
          style={{ borderTopColor: 'transparent' }}>
          </div>
          <p className="text-gray-500">Carregando doações...</p>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Pesquisar
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition"
          placeholder="Buscar por nome..."
        />
      </div>
      
      {filteredDonors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">Nenhum Contribuidor encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => {
            const item = items.find(item => item.item.item_id === donor.id);
            if (!item) return null;
            return (
              <DonorCard 
                key={donor.id} 
                donor={donor} 
                itemName={item ? item.item.nome : 'Unknown item'} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonorList;