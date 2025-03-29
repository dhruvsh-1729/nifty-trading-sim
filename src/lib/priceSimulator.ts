// In your priceSimulator.ts
export async function simulatePriceChange(stock: any): Promise<number> {
    const currentPrice = stock.current_price;
    const volatility = 0.02; // 2% annualized volatility
    const drift = 0.0001; // Small positive drift to simulate market growth
    const timeStep = 1 / 252; // Assuming 252 trading days in a year

    // Generate a random normal variable for the stochastic component
    const randomShock = Math.random() * 2 - 1; // Uniform random [-1, 1]
    const priceChangeFactor = drift * timeStep + volatility * Math.sqrt(timeStep) * randomShock;

    let newPrice = currentPrice * Math.exp(priceChangeFactor);
    newPrice = Math.max(newPrice, 1); // Ensure price doesn't go below 1
    newPrice = Math.round(newPrice * 100) / 100; // Round to 2 decimal places

    console.log(`Price change for ${stock.symbol}: ${currentPrice} -> ${newPrice} (${((newPrice - currentPrice) / currentPrice * 100).toFixed(2)}%)`);

    return newPrice;
}