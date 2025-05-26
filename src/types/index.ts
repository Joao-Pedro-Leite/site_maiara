//Usado para se comunicar com o Banco de Dados
export type Item = {
  id?: string;
  timestamp: string;
  name: string;
  price: number;
  imageUrl: string;
}

export type Donor = {
  itemId: string;
  id?: string;
  timestamp: string;
  name: string;
  email?: string;
  phoneNumber: string;
}

export type Donate = {
  id?: string;
  timestamp: string;
  amount: number;
  photoUrl: string;
  message: string;
  donorId: string;
}

//Usado como tipo para aparecer correto na tela 
export type DisplayDonate = {
  id?: number,
  name: string,
  email: string,
  phoneNumber: string,
  photoUrl: string,
  message: string,
  amount: number,
  donorId: number,
  timestamp: string,
}

export type TotalItem = {
  item: Item;
  arrecadado: number;
}