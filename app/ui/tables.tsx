import Link from "next/link";

interface Ranking {
  username: string;
  totalProfit: string;
  gainLossPercentage: string;
}
interface LeaderboardTableProps {
  leaderboardRankings: Ranking[];
}
export function LeaderboardTable({
  leaderboardRankings,
}: LeaderboardTableProps) {
  const headers = ["Username", "Total Profit", "Gain/Loss Percentage"];
  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 ">
        <tr className="flex justify-around p-2 max-w-full bg-indigo-500 text-white rounded-lg m-2">
          {headers.map((item) => {
            return <th className="ml-9 flex-1">{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {leaderboardRankings.map((item) => {
          return (
            <tr
              className="max-w-full p-2 bg-white m-2 rounded-full border flex justify-around"
              key={item.username}
            >
              <td className="flex-1 ml-9">{item.username}</td>
              <td className="flex-1 ml-9">{item.totalProfit}</td>
              <td className="flex-1 ml-9">{item.gainLossPercentage}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
interface Portfolio {
  average_cost: number;
  percentage_gain_loss: number;
  shares: number;
  symbol: string;
  total_cost: number;
  total_market_value: number;
}
interface PortfolioTableProps {
  portfolio: Portfolio[];
}
export function PortfolioTable({ portfolio }: PortfolioTableProps) {
  const headers = [
    "Symbol",
    "Shares",
    "Average Cost",
    "Gain/Loss Percentage",
    "Total Cost",
    "Total Market Value",
  ];
  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 ">
        <tr className="flex justify-around p-2 max-w-full bg-indigo-500 text-white rounded-lg m-2">
          {headers.map((item) => {
            return <th className="ml-9 flex-1">{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {portfolio.map((item) => {
          return (
            <tr
              className="max-w-full p-2 bg-white m-2 rounded-full border flex justify-around"
              key={item.symbol}
            >
              <td className="items-start flex-1 ml-9">
                <Link
                  className="text-indigo-500 underline hover:text-indigo-400"
                  href={`/dashboard/trade/${item.symbol.toUpperCase()}`}
                >
                  {item.symbol}
                </Link>
              </td>
              <td className="flex-1 ml-9">{item.shares}</td>
              <td className="flex-1 ml-9">{item.average_cost}</td>
              <td
                className={`flex-1 ml-9 ${
                  item.percentage_gain_loss >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.percentage_gain_loss}%
              </td>
              <td className="flex-1 ml-9">{item.total_cost}</td>
              <td className="flex-1 ml-9">{item.total_market_value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface Transaction {
  amount: number;
  price: number;
  shares: number;
  symbol: string;
  time: string;
  type: "buy" | "sell";
}
interface TransactionTableProps {
  transactions: Transaction[];
}
export function TransactionTable({ transactions }: TransactionTableProps) {
  const headers = [
    "Symbol",
    "Shares",
    "Average Cost",
    "Gain/Loss Percentage",
    "Total Cost",
    "Total Market Value",
  ];
  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 ">
        <tr className="flex justify-around p-2 max-w-full bg-indigo-500 text-white rounded-lg m-2">
          {headers.map((item) => {
            return <th className="ml-9 flex-1">{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {transactions.map((item: Transaction) => {
          return (
            <tr
              className="max-w-full p-2 bg-white m-2 rounded-full border flex justify-around"
              key={item.symbol}
            >
              <td className="items-start flex-1 ml-9">
                <Link
                  className="text-indigo-500 underline hover:text-indigo-400"
                  href={`/dashboard/trade/${item.symbol.toUpperCase()}`}
                >
                  {item.symbol}
                </Link>
              </td>
              <td className="flex-1 ml-9">{item.shares}</td>
              <td className="flex-1 ml-9">{item.price}</td>
              <td className="flex-1 ml-9">{item.time}</td>
              <td className="flex-1 ml-9">{item.amount}</td>
              <td className="flex-1 ml-9">{item.type.toUpperCase()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
