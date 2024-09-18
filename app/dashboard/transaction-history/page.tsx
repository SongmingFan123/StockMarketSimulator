import Link from "next/link";
import { getTransactionData } from "../../lib/actions";
import ColumnHeaderBar from "@/app/ui/column-header-bar";
import { TransactionTable } from "@/app/ui/tables";
interface Transaction {
  amount: number;
  price: number;
  shares: number;
  symbol: string;
  time: string;
  type: "buy" | "sell";
}
export default async function Transaction() {
  const transactionDataResponse = await getTransactionData();
  const transactions = transactionDataResponse.data?.transactions;
  return (
    <main>
      {transactions && transactions.length === 0 ? (
        <p className="h-screen flex justify-center items-center text-indigo-500 text-xl font-semibold">
          No Transactions
        </p>
      ) : (
        <TransactionTable transactions={transactions}/>
      )}
    </main>
  );
}
