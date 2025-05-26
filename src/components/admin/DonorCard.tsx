import React, { useState } from 'react';
import { User, DollarSign, MessageCircle, Phone } from 'lucide-react';
import { Donor } from '../../types';

interface DonorCardProps {
  donor: Donor;
  itemName: string;
}

type TabView = 'donation' | 'message';

const DonorCard: React.FC<DonorCardProps> = ({ donor, itemName }) => {
  const [activeTab, setActiveTab] = useState<TabView>('donation');
  const formattedDate = new Date(donor.timestamp).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 bg-rose-50 border-b border-rose-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {donor.photoUrl ? (
              <img 
                src={donor.photoUrl} 
                alt={donor.name} 
                className="h-10 w-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-rose-200 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-rose-500" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-800">{donor.name}</h3>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Contribuiu para: {itemName}
          </div>
        </div>
      </div>
      
      <div className="p-1 bg-gray-100">
        <div className="flex">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'donation'
                ? 'bg-white text-gray-800 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('donation')}
          >
            <div className="flex items-center justify-center">
              <DollarSign size={16} className="mr-1" />
              <span>Contribuição</span>
            </div>
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'message'
                ? 'bg-white text-gray-800 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('message')}
          >
            <div className="flex items-center justify-center">
              <MessageCircle size={16} className="mr-1" />
              <span>Mensagem</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'donation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Valor:</span>
              <span className="text-xl font-bold text-gray-800">${donor.amount.toFixed(2)}</span>
            </div>
            
            {donor.photoUrl && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Comprovante:</p>
                <img 
                  src={donor.photoUrl} 
                  alt={donor.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'message' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recado:</p>
              <blockquote className="italic text-gray-700 border-l-4 border-rose-200 pl-3 py-1">
                "{donor.message}"
              </blockquote>
            </div>
            
            <div>
              <div className="flex items-center mt-4 text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>{donor.phoneNumber}</span>
              </div>
              
              {donor.email && (
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="mr-2">✉️</span>
                  <span>{donor.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorCard;