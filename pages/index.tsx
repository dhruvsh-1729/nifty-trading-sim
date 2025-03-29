import { useEffect, useState } from 'react';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import StockTicker from '@/src/components/StockTicker';
import StockList from '@/src/components/StockList';
import TradeForm from '@/src/components/TradeForm';
import Portfolio from '@/src/components/Portfolio';
import TransactionHistory from '@/src/components/TransactionHistory';

export default function Home() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const { isConnected, lastMessage } = useWebSocket('ws://localhost:3001');

  // Initialize user
  useEffect(() => {
    const storedUser = localStorage.getItem('trading_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const demoUser = { id: 1, name: 'Demo User', balance: 30000 };
      localStorage.setItem('trading_user', JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [stocksRes, portfolioRes, transactionsRes] = await Promise.all([
          fetch('/api/stocks'),
          fetch(`/api/portfolio?userId=${user.id}`),
          fetch(`/api/transactions?userId=${user.id}`)
        ]);

        setStocks(await stocksRes.json());
        setPortfolio(await portfolioRes.json());
        setTransactions(await transactionsRes.json());
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, lastMessage]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'stock_update') {
      setStocks(lastMessage.data);
    }
  }, [lastMessage]);

  const handleTrade = async (symbol: string, type: 'BUY' | 'SELL', quantity: number) => {
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, symbol, type, quantity }),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        setPortfolio(result.portfolio);
        localStorage.setItem('trading_user', JSON.stringify(result.user));

        // Refresh transactions
        const transactionsRes = await fetch(`/api/transactions?userId=${user.id}`);
        setTransactions(await transactionsRes.json());

        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Trade error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Stock Trading Simulator</h1>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="font-semibold">Balance:</span> ₹{user?.balance.toFixed(2)}
            <span className={`ml-4 text-sm ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div>
            <span className="font-semibold">Portfolio Value:</span> ₹{
              portfolio.reduce((total, item) => total + (item.current_price * item.quantity), 0).toFixed(2)
            }
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <StockTicker stocks={stocks} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <StockList
              stocks={stocks}
              onSelectStock={setSelectedStock}
              selectedStock={selectedStock}
            />
          </div>

          <div className="md:col-span-1 space-y-6">
            {selectedStock && (
              <TradeForm
                stock={selectedStock}
                onTrade={handleTrade}
                userBalance={user?.balance}
              />
            )}
            <Portfolio portfolio={portfolio} onSelectStock={(item) => {
              setSelectedStock(stocks.find((stock) => stock.symbol === item.symbol));
            }} />
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}