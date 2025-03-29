import { Stock } from '@/types';

interface StockTickerProps {
  stocks: Stock[];
}

export default function StockTicker({ stocks }: StockTickerProps) {
  return (
    <div className="bg-gray-800 text-white p-2 rounded-lg overflow-hidden">
      <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="inline-flex items-center space-x-4">
            <span className="font-semibold">{stock.symbol}</span>
            <span>₹{stock.current_price.toFixed(2)}</span>
            <span className={`text-sm ${stock.current_price > stock.last_close ? 'text-green-400' : 'text-red-400'}`}>
              {stock.current_price > stock.last_close ? '↑' : '↓'} 
              {Math.abs(((stock.current_price - stock.last_close) / stock.last_close * 100)).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}