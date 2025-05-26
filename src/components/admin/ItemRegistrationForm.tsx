import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImagePlus, Trash2 } from 'lucide-react';

const ItemRegistrationForm: React.FC = () => {
  const { addItem, items, deleteItem } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      newErrors.name = 'Item name is required';
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!photo) {
      newErrors.photo = 'Item photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate photo upload and processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Convert photo to base64 for demo purposes (in a real app, you'd upload to a server)
    let imageUrl = '';
    if (photo && photoPreview) {
      imageUrl = photoPreview;
    }
    
    addItem({
      name: formData.name,
      price: parseFloat(formData.price),
      imageUrl,
      amountCollected: 0,
    });
    
    // Reset form
    setFormData({
      name: '',
      price: '',
    });
    setPhoto(null);
    setPhotoPreview(null);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset success message after a delay
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? All associated donations will also be removed.')) {
      deleteItem(itemId);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            Item adicionado com sucesso!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Nome *
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
                placeholder="Qual item você gostaria de adicionar?"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Item Preco *
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  className={`w-full p-3 pl-7 border rounded-md focus:ring-2 focus:ring-rose-300 focus:border-rose-500 outline-none transition ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto do Item *
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
                      className="mx-auto h-48 w-auto max-w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="mt-4 text-sm text-rose-500 hover:text-rose-600"
                    >
                      Apagar foto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="itemPhoto"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-rose-500 hover:text-rose-600"
                      >
                        <span>Upload da foto</span>
                        <input
                          id="itemPhoto"
                          name="itemPhoto"
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
                    Adding Item...
                  </div>
                ) : (
                  'Add Item'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h3 className="text-xl font-serif text-gray-800 mb-4">Itens cadastrados</h3>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.item.item_id} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <img src={item.item.foto} alt={item.item.nome} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h4 className="font-medium text-gray-800">{item.item.nome}</h4>
                  <p className="text-gray-600">${item.item.preco.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item.item.item_id)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nenhum item cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemRegistrationForm;