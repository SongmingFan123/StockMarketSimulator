import {
  getAccountBalance,
  getLatestStockPrice,
  getStockInfoData,
  getStockPosition,
  getStockPriceData,
} from "@/app/lib/actions";
import StockChart from "@/app/ui/stock-chart";
import { notFound } from "next/navigation";
import React from "react";
import StockTradingForm from "@/app/ui/stock-trading-form";
import { StockInfoDetails } from "@/app/ui/stock-info";

interface StockInfo {
  dayHigh: number;
  dayLow: number;
  forwardPE: number;
  longBusinessSummary: string;
  marketCap: number;
  open: number;
  profitMargins: number;
  totalRevenue: number;
  trailingPE: number;
  volume: number;
}

export default async function StockInfo({
  params,
}: {
  params: { symbol: string };
}) {
  const symbol = params.symbol.toUpperCase();
  const initialPeriod = "1d";
  const stockPriceResponse = await getStockPriceData(symbol, initialPeriod);
  if (!stockPriceResponse) {
    notFound();
  }
  const stockInfoResponse = await getStockInfoData(symbol);
  const stockInfo = stockInfoResponse.data.stock_info_data;
  const stockPositionResponse = await getStockPosition(symbol);
  const position = stockPositionResponse.data.shares;
  const accountBalanceResponse = await getAccountBalance();
  const accountBalance = accountBalanceResponse.data?.balance;
  const latestStockPriceResponse = await getLatestStockPrice(symbol);
  const latestStockPrice = latestStockPriceResponse.data?.latest_stock_price;
  
  return (
    <main className="h-screen flex flex-col p-2 md:grid md:grid-rows-2 gap-2">
      <div className="h-full md:col-span-1 bg-white rounded-lg shadow-md">
        <StockChart symbol={symbol} />
      </div>
      <div className="grid md:grid-cols-2 gap-2 h-full">
        <div className="col-span-1">
          <StockTradingForm
            accountBalance={accountBalance}
            latestStockPrice={latestStockPrice}
            position={isNaN(position) ? 0 : position}
            symbol={symbol}
          />
        </div>
        <div className="col-span-1 overflow-y-scroll">
          <StockInfoDetails stockInfo={stockInfo} symbol={symbol}/>
        </div>
      </div>
    </main>
  );
}