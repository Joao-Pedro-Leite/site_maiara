import React from 'react';
import { Item } from '../types';
import ProgressBar from './ProgressBar';

interface ItemCardProps {
  item: Item;
  amountCollected: number;
  onDonateClick: () => void;
}
  const ItemCard: React.FC<ItemCardProps> = ({ item, amountCollected, onDonateClick }) => {
  const progressPercentage = Math.round((amountCollected / item.preco) * 100);
  const isComplete = progressPercentage >= 100;
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-64 overflow-hidden">
        <img 
          src={item.foto} 
          alt={item.nome} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-medium text-gray-800 mb-2">{item.nome}</h3>
        <p className="text-gray-600 mb-4">R${item.preco.toFixed(2)}</p>
        
        <div className="mb-6">
          <ProgressBar percentage={progressPercentage} />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>R$ {amountCollected.toFixed(2)} Arrecadados</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>
        
        {isComplete ? (
          <div className="w-full py-3 px-4 bg-green-100 text-green-700 font-medium text-center rounded-md">
            Finalizado!
          </div>
        ) : (
          <button
            onClick={onDonateClick}
            className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-center rounded-md transition-colors duration-300"
          >
            Contribuir
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;