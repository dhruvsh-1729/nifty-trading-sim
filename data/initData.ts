export type Stock = {
    symbol: string;
    name: string;
    sector: string;
    current_price: number;
    day_high: number;
    day_low: number;
    last_close: number;
};

function generateRandomPrice(base: number): number {
    const variation = Math.random() * 20 - 10; // Random variation between -10 and +10
    return parseFloat((base + variation).toFixed(2));
}

function initializeNifty50Stocks(): Stock[] {
    const stocks: { symbol: string; name: string; sector: string }[] = [
        { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy" },
        { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT" },
        { symbol: "INFY", name: "Infosys", sector: "IT" },
        { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking" },
        { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking" },
        { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG" },
        { symbol: "SBIN", name: "State Bank of India", sector: "Banking" },
        { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom" },
        { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking" },
        { symbol: "ITC", name: "ITC Limited", sector: "FMCG" },
        { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure" },
        { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking" },
        { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer Goods" },
        { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Automobile" },
        { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT" },
        { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma" },
        { symbol: "TITAN", name: "Titan Company", sector: "Consumer Goods" },
        { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "Financial Services" },
        { symbol: "WIPRO", name: "Wipro", sector: "IT" },
        { symbol: "ULTRACEMCO", name: "UltraTech Cement", sector: "Cement" },
        { symbol: "ONGC", name: "Oil and Natural Gas Corporation", sector: "Energy" },
        { symbol: "POWERGRID", name: "Power Grid Corporation", sector: "Energy" },
        { symbol: "NTPC", name: "NTPC Limited", sector: "Energy" },
        { symbol: "ADANIPORTS", name: "Adani Ports", sector: "Infrastructure" },
        { symbol: "GRASIM", name: "Grasim Industries", sector: "Cement" },
        { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", sector: "Automobile" },
        { symbol: "HEROMOTOCO", name: "Hero MotoCorp", sector: "Automobile" },
        { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", sector: "Pharma" },
        { symbol: "CIPLA", name: "Cipla", sector: "Pharma" },
        { symbol: "JSWSTEEL", name: "JSW Steel", sector: "Steel" },
        { symbol: "TATASTEEL", name: "Tata Steel", sector: "Steel" },
        { symbol: "BPCL", name: "Bharat Petroleum", sector: "Energy" },
        { symbol: "COALINDIA", name: "Coal India", sector: "Energy" },
        { symbol: "DIVISLAB", name: "Divi's Laboratories", sector: "Pharma" },
        { symbol: "EICHERMOT", name: "Eicher Motors", sector: "Automobile" },
        { symbol: "SHREECEM", name: "Shree Cement", sector: "Cement" },
        { symbol: "TECHM", name: "Tech Mahindra", sector: "IT" },
        { symbol: "BRITANNIA", name: "Britannia Industries", sector: "FMCG" },
        { symbol: "HDFCLIFE", name: "HDFC Life Insurance", sector: "Insurance" },
        { symbol: "SBILIFE", name: "SBI Life Insurance", sector: "Insurance" },
        { symbol: "ICICIPRULI", name: "ICICI Prudential Life", sector: "Insurance" },
        { symbol: "M&M", name: "Mahindra & Mahindra", sector: "Automobile" },
        { symbol: "INDUSINDBK", name: "IndusInd Bank", sector: "Banking" },
        { symbol: "UPL", name: "UPL Limited", sector: "Chemicals" },
        { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG" },
        { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Automobile" },
        { symbol: "HINDALCO", name: "Hindalco Industries", sector: "Aluminium" },
        { symbol: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate" },
        { symbol: "APOLLOHOSP", name: "Apollo Hospitals", sector: "Healthcare" },
    ];

    return stocks.map((stock) => {
        const last_close = generateRandomPrice(1000 + Math.random() * 2000); // Base price between 1000 and 3000
        const current_price = generateRandomPrice(last_close);
        const day_high = generateRandomPrice(Math.max(current_price, last_close));
        const day_low = generateRandomPrice(Math.min(current_price, last_close));

        return {
            ...stock,
            current_price,
            day_high: Math.max(current_price, day_high),
            day_low: Math.min(current_price, day_low),
            last_close,
        };
    });
}

export default initializeNifty50Stocks;