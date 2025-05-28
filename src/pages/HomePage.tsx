import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ItemList from '../components/ItemList';
import DonationForm from '../components/DonationForm';
import { useApp } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { items } = useApp();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleDonateClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowDonationForm(true);
    setShowSuccessMessage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDonationComplete = () => {
    setShowDonationForm(false);
    setShowSuccessMessage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-90 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-rose-400 mr-2" />
            <h1 className="text-3xl font-serif font-medium text-gray-800">
              Casamento Maiara & Luiz
            </h1>
          </div>
          {/* <Link 
            to="/admin" 
            className="text-sm text-gray-500 hover:text-gray-700 transition duration-300"
          >
            Admin
          </Link> */}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-16">
        {showSuccessMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-green-100 text-green-700 rounded-lg text-center animate-fade-in">
            Sua doação foi registrada! Agradecemos muito!
          </div>
        )}

        {showDonationForm ? (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setShowDonationForm(false)}
              className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
            >
              <span>← Voltar para a lista de doações</span>
            </button>
            <DonationForm 
              itemId={selectedItemId!} 
              onComplete={handleDonationComplete}
              item={items.find(item => item.item.item_id === selectedItemId)!}
            />
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-gray-800 mb-4">Bem-vindos ao nosso site!</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
              É uma alegria imensa poder dividir com vocês esse capítulo tão especial da nossa história. Aqui vocês encontram sugestões de presentes, mas, 
              acima de tudo, agradecemos por estarem conosco neste momento único.
              </p>
            </div>
            <ItemList items={items} onDonateClick={handleDonateClick} />
          </>
        )}
      </main>

      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Casamento Maiara & Luiz</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;