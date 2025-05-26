import React, { createContext, useState, useContext, useEffect } from 'react';
import { Item, Donor, Donate, DisplayDonate, TotalItem } from '../types';
import { 
  listarItems, 
  calcularTotalPorItem, 
  listarDonates, 
  fazerDonate, 
  excluirItem,
  calcularValorArrecadado
} from '../lib/supabase';
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://prutohdpwoflqjtsqzfm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydXRvaGRwd29mbHFqdHNxemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjIyNjEsImV4cCI6MjA2MzY5ODI2MX0.iFBRhesEm4Tb50nLhikIUbmvPXztr1cJgZR7Tmde5Hk'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


interface AppContextType {
  items: TotalItem[];
  donors: DisplayDonate[];
  addItem: (item: Omit<Item, 'id' | 'timestamp'>) => void;
  deleteItem: (itemId: string) => void;
  addDonation: (donation: Omit<Donate, 'id' | 'timestamp'>, itemId: number) => Promise<void>;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<TotalItem[]>([]);
  const [donors, setDonors] = useState<DisplayDonate[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const refreshData = async () => {
    const itemsData = await calcularTotalPorItem();
    if (itemsData) {
      setItems(itemsData);
    }

    const donorsData = await listarDonates();

    if (donorsData) {
      setDonors(donorsData);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const addItem = async (item: Omit<Item, 'id' | 'timestamp'>) => {
    const newItem: Item = {
      ...item,
      timestamp: new Date().toISOString(),
    };


    const newItemCorrigido = {
      created_at: new Date().toISOString(),
      nome: newItem.name,
      preco: newItem.price,
      foto: newItem.imageUrl,
    }
    // Add item to Supabase
    const { data, error } = await supabase
      .from('Item')
      .insert([newItemCorrigido])
      .select();

    if (!error && data) {
      refreshData();
    }
  };

  const deleteItem = async (itemId: string) => {
    await excluirItem(Number(itemId));
    refreshData();
  };

  const addDonation = async <T extends Omit<Record<string, any>, 'timestamp'>>(donation: T, itemId: number) => {   
     const newDonation  = {
      ...donation,
      timestamp: new Date().toISOString(),
    };
    await fazerDonate(newDonation as any, itemId);
    refreshData();
  };

  const login = (password: string) => {
    // Simple password check - in a real app, this would be more secure
    if (password === 'wedding2025') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider value={{ 
      items, 
      donors, 
      addItem, 
      deleteItem, 
      addDonation, 
      isAdmin, 
      login, 
      logout,
      refreshData 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};