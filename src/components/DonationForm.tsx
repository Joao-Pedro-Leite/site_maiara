import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item, TotalItem } from '../types';
import { ImagePlus } from 'lucide-react';

interface DonationFormProps {
  itemId: string;
  item: TotalItem;
  onComplete: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ itemId, item, onComplete }) => {
  const { addDonation } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
    amount: 10,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value;

  // Atualiza o estado para o valor em string (mesmo que vazio)
  setFormData(prev => ({ ...prev, amount: raw === "" ? "" : Number(raw) }));

  // Se estiver vazio, não faz mais nada (evita parseInt em string vazia)
  if (raw === "") return;

  const value = parseInt(raw, 10);

  if (!isNaN(value) && value > 0) {
    const maxAmount = item.item.preco - item.arrecadado;
    const amount = Math.min(value, maxAmount);
    setFormData(prev => ({ ...prev, amount }));
  }
};

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setPhoto(selectedFile);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!photo) {
      newErrors.photo = 'Photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert photo to base64 for demo purposes (in a real app, you'd upload to a server)
      let photoUrl = '';
      if (photo && photoPreview) {
        photoUrl = photoPreview;
      }

      // Create donor first
      const donorData = {
        
        timestamp: new Date().toISOString(),
      };

      // Create donation
      const donationData = {
        amount: formData.amount,
        photoUrl,
        message: formData.message,
        donorId: '', // This will be set after donor creation
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        itemId,
        timestamp: new Date().toISOString(),
      };

      await addDonation(donationData, parseInt(itemId));
      
      setIsSubmitting(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting donation:', error);
      setIsSubmitting(false);
    }
  };
  const maxDonationAmount = Math.max(0, item.item.preco - item.arrecadado);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-serif text-gray-800 mb-2">Contribuir para: {item.item.nome}</h2>
      <p className="text-gray-600 mb-6">
        R${item.arrecadado.toFixed(2)} de R${item.item.preco.toFixed(2)}
      </p>
      <p>Porcentagem arrecadada
      ({Math.floor((item.arrecadado / item.item.preco) * 100)}%)</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition"
              placeholder="Exemplo@gmail.com"
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu telefone"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Valor da contribuição *
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                min="0"
                max={maxDonationAmount}
                className="w-full p-3 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Valor máximo da contribuição: R${maxDonationAmount.toFixed(2)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprovante pagamento *
            </label>
            <div 
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                errors.photo ? 'border-red-500' : 'border-gray-300'
              } hover:border-rose-400 transition-colors`}
            >
              {photoPreview ? (
                <div className="text-center">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="mx-auto h-32 w-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="mt-4 text-sm text-rose-500 hover:text-rose-600"
                  >
                    Remover imagem
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-rose-500 hover:text-rose-600"
                    >
                      <span>Upload a photo</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem para o casal *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Escreva uma mensagem para a noiva e o noivo..."
            />
            {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium text-center rounded-md transition-colors duration-300 disabled:bg-rose-300"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </div>
              ) : (
                'Enviar contribuição'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;