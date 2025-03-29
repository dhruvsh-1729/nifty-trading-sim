import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/src/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, symbol, type, quantity } = req.body;

  if (!userId || !symbol || !type || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await getDB();
    const stock = await db.get('SELECT * FROM stocks WHERE symbol = ?', [symbol]);
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!stock || !user) {
      return res.status(400).json({ error: 'Invalid stock or user' });
    }

    const totalCost = stock.current_price * quantity;

    if (type === 'BUY') {
      if (user.balance < totalCost) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Update user balance
      await db.run(
        'UPDATE users SET balance = balance - ? WHERE id = ?',
        [totalCost, userId]
      );

      // Check if user already has this stock
      const existingHolding = await db.get(
        'SELECT * FROM portfolios WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (existingHolding) {
        // Update existing holding
        const newAvgPrice = (
          (existingHolding.avg_price * existingHolding.quantity + totalCost) / 
          (existingHolding.quantity + quantity)
        );
        
        await db.run(
          'UPDATE portfolios SET quantity = quantity + ?, avg_price = ? WHERE id = ?',
          [quantity, newAvgPrice, existingHolding.id]
        );
      } else {
        // Create new holding
        await db.run(
          'INSERT INTO portfolios (user_id, symbol, quantity, avg_price) VALUES (?, ?, ?, ?)',
          [userId, symbol, quantity, stock.current_price]
        );
      }
    } else if (type === 'SELL') {
      const holding = await db.get(
        'SELECT * FROM portfolios WHERE user_id = ? AND symbol = ?',
        [userId, symbol]
      );

      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough shares to sell' });
      }

      // Update user balance
      await db.run(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [totalCost, userId]
      );

      if (holding.quantity === quantity) {
        // Remove holding completely
        await db.run(
          'DELETE FROM portfolios WHERE id = ?',
          [holding.id]
        );
      } else {
        // Reduce holding quantity
        await db.run(
          'UPDATE portfolios SET quantity = quantity - ? WHERE id = ?',
          [quantity, holding.id]
        );
      }
    }

    // Record transaction
    await db.run(
      'INSERT INTO transactions (user_id, symbol, type, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [userId, symbol, type, quantity, stock.current_price]
    );

    // Get updated user data
    const updatedUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    const updatedPortfolio = await db.all(
      'SELECT p.*, s.name, s.current_price FROM portfolios p JOIN stocks s ON p.symbol = s.symbol WHERE p.user_id = ?',
      [userId]
    );

    res.status(200).json({
      user: updatedUser,
      portfolio: updatedPortfolio
    });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}