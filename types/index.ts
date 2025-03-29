export interface Stock {
    symbol: string;
    name: string;
    sector: string;
    current_price: number;
    day_high: number;
    day_low: number;
    last_close: number;
  }
  
  export interface PortfolioItem {
    id: number;
    symbol: string;
    name: string;
    quantity: number;
    avg_price: number;
    current_price: number;
  }
  
  export interface Transaction {
    id: number;
    symbol: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    timestamp: string;
  }
  
  export interface User {
    id: number;
    name: string;
    balance: number;
  }