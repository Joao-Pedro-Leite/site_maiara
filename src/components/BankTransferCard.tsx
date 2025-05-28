import React, { useState } from 'react';
import { Copy, Check, CreditCard, QrCode } from 'lucide-react';

const BankTransferCard: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const bankInfo = {
    bank: 'Sicredi 748',
    agency: '0710',
    account: '47642-7',
    name: 'Maiara Elias Viana',
    pix: '12996588858'
  };
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-md w-full mx-auto overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white">
      <div className="bg-[#61d4b0] p-5 text-white">
        <h2 className="text-2xl font-bold tracking-tight text-center">Dados Bancários</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <CreditCard className="text-[#61d4b0]" size={24} />
            <h3 className="text-lg font-medium text-gray-800">Transferência Bancária</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Banco:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{bankInfo.bank}</span>
                <button 
                  onClick={() => copyToClipboard(bankInfo.bank, 'bank')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copiar banco"
                >
                  {copiedField === 'bank' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-[#61d4b0]" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Agência:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{bankInfo.agency}</span>
                <button 
                  onClick={() => copyToClipboard(bankInfo.agency, 'agency')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copiar agência"
                >
                  {copiedField === 'agency' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-[#61d4b0]" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Conta corrente:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{bankInfo.account}</span>
                <button 
                  onClick={() => copyToClipboard(bankInfo.account, 'account')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copiar conta"
                >
                  {copiedField === 'account' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-[#61d4b0]" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Nome:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{bankInfo.name}</span>
                <button 
                  onClick={() => copyToClipboard(bankInfo.name, 'name')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copiar nome"
                >
                  {copiedField === 'name' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-[#61d4b0]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-5">
          <div className="flex items-center gap-3 pb-3">
            <QrCode className="text-[#61d4b0]" size={24} />
            <h3 className="text-lg font-medium text-gray-800">Pagamento PIX</h3>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 font-medium">Chave PIX:</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium">{bankInfo.pix}</span>
              <button 
                onClick={() => copyToClipboard(bankInfo.pix, 'pix')}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Copiar PIX"
              >
                {copiedField === 'pix' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-[#61d4b0]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferCard;