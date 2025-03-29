import { PortfolioItem } from "@/types";

interface PortfolioProps {
    portfolio: PortfolioItem[];
    onSelectStock: (stock: PortfolioItem) => void;
}

export default function Portfolio({ portfolio, onSelectStock }: PortfolioProps) {
    const totalValue = portfolio.reduce((sum, item) => sum + (item.current_price * item.quantity), 0);
    const totalInvested = portfolio.reduce((sum, item) => sum + (item.avg_price * item.quantity), 0);
    const pnl = totalValue - totalInvested;
    const pnlPercent = (pnl / totalInvested) * 100;

    return (
        <div className="bg-white rounded-lg shadow p-4 mt-4 text-black">
            <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>

            {portfolio.length === 0 ? (
                <p className="text-gray-500">You don't own any stocks yet.</p>
            ) : (
                <>
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between font-medium mb-1">
                            <span>Total Value:</span>
                            <span>₹{totalValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>P&L:</span>
                            <span className={pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ₹{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTP</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {portfolio.map((item) => {
                                    const currentValue = item.current_price * item.quantity;
                                    const investedValue = item.avg_price * item.quantity;
                                    const itemPnl = currentValue - investedValue;
                                    const itemPnlPercent = (itemPnl / investedValue) * 100;

                                    return (
                                        <tr key={item.symbol}
                                            onClick={() => onSelectStock(item)}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="font-medium">{item.symbol}</div>
                                                <div className="text-xs text-gray-500">{item.name}</div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">{item.quantity}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">₹{item.avg_price.toFixed(2)}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">₹{item.current_price.toFixed(2)}</td>
                                            <td className={`px-3 py-2 whitespace-nowrap ${itemPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ₹{itemPnl.toFixed(2)} ({itemPnlPercent.toFixed(2)}%)
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}