import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import initializeNifty50Stocks, { Stock } from '../../data/initData';

let _db: any = null;

export async function getDB() {
    if (!_db) {
        _db = await open({
            filename: path.join(process.cwd(), 'data', 'trading.db'),
            driver: sqlite3.Database
        });
        
        await initializeDB(_db);
    }
    return _db;
}

async function initializeDB(db: any) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS stocks (
            symbol TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sector TEXT NOT NULL,
            current_price REAL NOT NULL,
            day_high REAL NOT NULL,
            day_low REAL NOT NULL,
            last_close REAL NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS stock_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (symbol) REFERENCES stocks(symbol)
        );
        
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            balance REAL NOT NULL DEFAULT 30000
        );
        
        CREATE TABLE IF NOT EXISTS portfolios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            avg_price REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (symbol) REFERENCES stocks(symbol)
        );
        
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            type TEXT NOT NULL, -- 'BUY' or 'SELL'
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (symbol) REFERENCES stocks(symbol)
        );
    `);

    const initialData: Stock[] = initializeNifty50Stocks();

    for (const stock of initialData) {
        await db.run(
            `INSERT OR IGNORE INTO stocks (symbol, name, sector, current_price, day_high, day_low, last_close)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            stock.symbol,
            stock.name,
            stock.sector,
            stock.current_price,
            stock.day_high,
            stock.day_low,
            stock.last_close
        );
    }

    return initialData; // Return the inserted data
}