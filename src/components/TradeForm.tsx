import { Stock } from '@/types';
import { useState } from 'react';

interface TradeFormProps {
  stock: Stock;
  onTrade: (symbol: string, type: 'BUY' | 'SELL', quantity: number) => Promise<any>;
  userBalance: number;
}

export default function TradeForm({ stock, onTrade, userBalance }: TradeFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, isError: boolean} | null>(null);

  const maxBuyable = Math.floor(userBalance / stock.current_price);
  const totalValue = quantity * stock.current_price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    const result = await onTrade(stock.symbol, type, quantity);
    
    if (result.success) {
      setMessage({ text: `Trade executed successfully!`, isError: false });
      setQuantity(1);
    } else {
      setMessage({ text: result.error || 'Trade failed', isError: true });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg text-zinc-900 shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Trade {stock.symbol}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={type === 'BUY'}
                onChange={() => setType('BUY')}
              />
              <span className="ml-2">Buy</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={type === 'SELL'}
                onChange={() => setType('SELL')}
              />
              <span className="ml-2">Sell</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {type === 'BUY' && (
            <p className="text-sm text-gray-500 mt-1">
              Max buyable: {maxBuyable} shares (₹{(maxBuyable * stock.current_price).toFixed(2)})
            </p>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Price per share:</span>
            <span>₹{stock.current_price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total {type === 'BUY' ? 'Cost' : 'Value'}:</span>
            <span>₹{totalValue.toFixed(2)}</span>
          </div>
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || (type === 'BUY' && totalValue > userBalance)}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            type === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === 'BUY' ? 'focus:ring-green-500' : 'focus:ring-red-500'
          } ${
            (isSubmitting || (type === 'BUY' && totalValue > userBalance)) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Processing...' : `${type} ${stock.symbol}`}
        </button>
      </form>
    </div>
  );
}