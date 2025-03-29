import { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/src/lib/db'; // Adjust the path as per your project structure
import { simulatePriceChange } from '@/src/lib/priceSimulator'; // Adjust the path as per your project structure
import { Stock } from '@/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = await getDB();
        const stocks: Stock[] = await db.all('SELECT * FROM stocks');

        const updatedStocks = await Promise.all(
            stocks.map(async (stock: Stock) => {
                const newPrice = await simulatePriceChange(stock);
                await db.run(
                    'UPDATE stocks SET current_price = ?, day_high = MAX(day_high, ?), day_low = MIN(day_low, ?) WHERE symbol = ?',
                    [newPrice, newPrice, newPrice, stock.symbol]
                );
                return { ...stock, current_price: newPrice };
            })
        );

        res.status(200).json({ updatedStocks });
    } catch (error) {
        console.error('Error updating stock prices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default handler;