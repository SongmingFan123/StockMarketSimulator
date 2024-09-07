"use client";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getStockPriceData } from "../lib/actions";
import PeriodButton from "./period-button";
type StockPriceData = {
  AdjClose: number;
  Close: number;
  High: number;
  Low: number;
  Open: number;
  Volume: number;
  Time: string;
};
interface StockChartProps {
  symbol: string;
}
export default function StockChart({ symbol }: StockChartProps) {
  const [currentData, setCurrentData] = useState<StockPriceData | null>(null);
  const StockPriceDataTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      setCurrentData(payload[0].payload as StockPriceData);
    }
    return null;
  };
  const currentStockData = [
    {
      label: "Open",
      data: currentData?.Open,
    },
    {
      label: "High",
      data: currentData?.High,
    },
    {
      label: "Low",
      data: currentData?.Low,
    },
    {
      label: "Volume",
      data: currentData?.Volume,
    },
    {
      label: "Time",
      data: currentData?.Time,
    },
  ];

  const [stockPriceData, setStockPriceData] = useState<StockPriceData[]>([]);
  const initialPeriod = "1d";
  useEffect(() => {
    (async () => {
      const stockPriceResponse = await getStockPriceData(symbol, initialPeriod);
      setStockPriceData(stockPriceResponse?.data?.stock_price_data);
    })();
  }, []);
  return (
    <div className="flex h-full">
      <div className="w-1/2">
        <div className="flex items-start gap-2 m-2">
          <PeriodButton
            label="1D"
            value={"1d"}
            id="1"
            selectedValue={initialPeriod}
            onChange={async () => {
              const stockPriceResponse = await getStockPriceData(symbol, "1d");
              setStockPriceData(stockPriceResponse?.data.stock_price_data);
            }}
          />
          <PeriodButton
            label="5D"
            value={"5d"}
            id="2"
            onChange={async () => {
              const stockPriceResponse = await getStockPriceData(symbol, "5d");
              setStockPriceData(stockPriceResponse?.data.stock_price_data);
            }}
          />
          <PeriodButton
            label="1M"
            value={"1mo"}
            id="3"
            onChange={async () => {
              const stockPriceResponse = await getStockPriceData(symbol, "1mo");
              setStockPriceData(stockPriceResponse?.data.stock_price_data);
            }}
          />
          <PeriodButton
            label="1Y"
            value={"1y"}
            id="4"
            onChange={async () => {
              const stockPriceResponse = await getStockPriceData(symbol, "1y");
              setStockPriceData(stockPriceResponse?.data.stock_price_data);
            }}
          />
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={stockPriceData}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#3F51B5" stopOpacity={0.6} />
                <stop offset="80%" stopColor="#3F51B5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="none" display="none" />
            <YAxis tickCount={10} />
            <Tooltip content={<StockPriceDataTooltip />} />
            <Area
              type="monotone"
              dataKey="Close"
              stroke="#3F51B5"
              fillOpacity={1}
              fill="url(#colorClose)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2 h-full bg-indigo-500 text-white p-2 rounded-lg">
        {currentData ? (
          <div className="flex flex-col p-2">
            {currentStockData.map((item, index) => (
              <p key={index} className="w-full flex gap-2 justify-between">
                <span>{item.label}</span>
                {item.data}
              </p>
            ))}
          </div>
        ) : (
          <p className="font-semibold text-center flex justify-center">
            Hover Over Chart to View Stock Data
          </p>
        )}
      </div>
    </div>
  );
}
