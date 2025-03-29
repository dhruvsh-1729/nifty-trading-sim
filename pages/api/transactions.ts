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

        // Check if the user exists
        const user = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);

        // If the user does not exist, create the user
        if (!user) {
            await db.run(
                `INSERT INTO users (id, name, balance) VALUES (?, ?, ?)`,
                [userId, `User_${userId}`, 30000]
            );
        }

        const transactions = await db.all(
            `SELECT * FROM transactions 
         WHERE user_id = ? 
         ORDER BY timestamp DESC
         LIMIT 100`,
            [userId]
        );

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
}