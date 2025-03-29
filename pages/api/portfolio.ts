import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/src/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const db = await getDB();
    const portfolio = await db.all(
      `SELECT p.*, s.name, s.current_price 
       FROM portfolios p 
       JOIN stocks s ON p.symbol = s.symbol 
       WHERE p.user_id = ?`,
      [userId]
    );
    
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}