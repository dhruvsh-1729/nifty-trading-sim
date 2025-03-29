import { Stock } from "@/types";

interface StockListProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  selectedStock: Stock | null;
}

export default function StockList({ stocks, onSelectStock, selectedStock }: StockListProps) {
  return (
    <div className="bg-white text-zinc-900 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Nifty 50 Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr 
                key={stock.symbol} 
                className={`hover:bg-gray-50 cursor-pointer ${selectedStock?.symbol === stock.symbol ? 'bg-blue-50' : ''}`}
                onClick={() => onSelectStock(stock)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{stock.current_price.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  stock.current_price > stock.last_close ? 'text-green-600' : 'text-red-600'
                }`}>
                  {((stock.current_price - stock.last_close) / stock.last_close * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}