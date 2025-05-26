import React from 'react';
import ItemCard from './ItemCard';
import { TotalItem } from '../types';

interface ItemListProps {
  items: TotalItem[];
  onDonateClick: (itemId: string) => void;
}
const ItemList: React.FC<ItemListProps> = ({ items, onDonateClick }) => {
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