import React from 'react';
import ItemCard from './ItemCard';
import { TotalItem } from '../types';

interface ItemListProps {
  items: TotalItem[];
  onDonateClick: (itemId: string) => void;
}
const ItemList: React.FC<ItemListProps> = ({ items, onDonateClick }) => {

    const isLoading = !items.length;

    // 👇 Verificação de loading aqui
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div
            className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"
            style={{ borderTopColor: 'transparent' }}>
            </div>
            <p className="text-gray-500">Carregando site, só um momento...</p>
          </div>
        </div>
      );
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map(({ item, arrecadado }) => (
        
        <ItemCard 
        
          key={item.item_id} 
          item={item}
          amountCollected={arrecadado}
          onDonateClick={() => item.item_id && onDonateClick(item.item_id)} 
        />
        
      ))}
    </div>
  );
};

export default ItemList;