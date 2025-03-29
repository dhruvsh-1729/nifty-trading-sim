import { WebSocketServer } from 'ws';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
const db = await open({
  filename: './data/trading.db',
  driver: sqlite3.Database
});

// WebSocket server
const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

// Simulate price change
const simulatePriceChange = (stock) => {
  const volatility = 0.02;
  const changePercent = (Math.random() * 2 - 1) * volatility;
  let newPrice = stock.current_price * (1 + changePercent);
  return Math.round(Math.max(newPrice, 1) * 100) / 100;
};

// Broadcast to all clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
};

// Update prices and broadcast
const updatePrices = async () => {
  try {
    const stocks = await db.all('SELECT * FROM stocks');
    
    const updatedStocks = await Promise.all(stocks.map(async (stock) => {
      const newPrice = simulatePriceChange(stock);
      await db.run(
        'UPDATE stocks SET current_price = ?, day_high = MAX(day_high, ?), day_low = MIN(day_low, ?) WHERE symbol = ?',
        [newPrice, newPrice, newPrice, stock.symbol]
      );
      return { ...stock, current_price: newPrice };
    }));

    broadcast({
      type: 'stock_update',
      data: updatedStocks,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Price update error:', error);
  }
};

// Handle connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send initial data
  updatePrices().catch(console.error);
  
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('error', (error) => console.error('WebSocket error:', error));
});

// Update every second
setInterval(updatePrices, 1000);