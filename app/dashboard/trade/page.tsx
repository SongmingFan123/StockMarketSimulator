"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/ui/button";
import { searchStock } from "@/app/lib/actions";
interface Stock {
  Name: string;
  Symbol: string;
}
export default function Browse() {
  const [symbol, setSymbol] = useState("");
  const [stockList, setStockList] = useState<Stock[] | null>(null);
  const [isListDisplayed, setIsListDisplayed] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (symbol) {
      (async (symbol: string) => {
        const searchStockResponse = await searchStock(symbol);
        setStockList(searchStockResponse.data?.stock_list);
      })(symbol);
    }
  }, [symbol]);

  return (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <h1 className="text-center text-indigo-500 font-bold text-2xl">Browse for Stocks</h1>
      <div className="w-full flex items-center gap-2">

        <div className="flex-1 relative flex flex-col">
          <input
            className="p-2 text-black outline-indigo-500 border rounded-lg"
            type="text"
            value={symbol}
            placeholder="Search for stocks by symbols or stock name"
            onChange={(e) => {
              setSymbol(e.target.value);
              setIsListDisplayed(true);
            }}
          />
          {stockList && isListDisplayed && (
            <div className="absolute top-full w-full bg-white rounded-lg shadow-lg max-h-40 overflow-auto">
              {stockList.map((item) => (
                <button
                  key={item.Symbol}
                  className="w-full text-left p-2 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    setSymbol(item.Symbol);
                    setIsListDisplayed(false);
                  }}
                >
                  {item.Symbol} {item.Name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          label="Trade"
          onClick={() => {
            router.push(`/dashboard/trade/${symbol}`);
          }}
        />
      </div>
    </div>
  );
}
