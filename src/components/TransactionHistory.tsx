import { Transaction } from '@/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  className?: string;
}

export default function TransactionHistory({ transactions, className = '' }: TransactionHistoryProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 text-black ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-sm">
                    {transaction.symbol}
                  </td>
                  <td className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.quantity}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    ₹{transaction.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    ₹{(transaction.quantity * transaction.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}