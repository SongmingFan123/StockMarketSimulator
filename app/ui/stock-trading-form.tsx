"use client";
import { useState } from "react";
import { buyStock, sellStock, signIn } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { MinusIcon, PlusIcon } from "./icons";
import ErrorMessageContainer from "./error";
import { useParams } from "next/navigation";
const initialState = {
  success: false,
  message: "",
};
interface StockTradingFormProps {
  latestStockPrice: number;
  accountBalance: number;
  position: number;
  symbol: string;
}
export default function StockTradingForm({
  latestStockPrice,
  accountBalance,
  position,
  symbol
}: StockTradingFormProps) {
  const [buyState, buyAction] = useFormState(
    buyStock.bind(null, symbol),
    initialState
  );
  const [sellState, sellAction] = useFormState(
    sellStock.bind(null, symbol),
    initialState
  );
  const { pending } = useFormStatus();
  const params = useParams<{ symbol: string }>();

  params.symbol.toUpperCase();
  const [quantity, setQuantity] = useState<number>(0);
  const tradingInfo = [
    { label: "Position", data: position },
    { label: "Latest Price Per Share", data: latestStockPrice },
    {
      label: "Estimated Total Cost",
      data: isNaN(quantity * latestStockPrice) ? 0 : quantity * latestStockPrice,
    },
    { label: "Balance", data: accountBalance },
  ];
  return (
    <div className="h-full bg-indigo-500 rounded-lg shadow-md text-white overflow-auto">
      <form className="flex flex-col items-start p-2 gap-3">
        <div className="flex items-center gap-2">
          <label>Shares</label>
          <div
            className="text-white cursor-pointer hover:text-gray-300"
            onClick={() => {
              if (isNaN(quantity)) {
                setQuantity(0);
              }
              quantity > 0 ? setQuantity((prev) => prev - 1) : 0;
            }}
          >
            <MinusIcon />
          </div>

          <input
            className="w-24 focus:outline-none focus:ring-1 text-gray-900 p-1 rounded"
            type="number"
            value={quantity}
            name="quantity"
            onChange={(e) => {
              setQuantity(e.target.valueAsNumber);
            }}
          />
          <div
            className="text-white cursor-pointer hover:text-gray-300"
            onClick={() => {
              if (isNaN(quantity)) {
                setQuantity(0);
              }
              setQuantity(prev => prev + 1);
            }}
          >
            <PlusIcon />
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <button
            type="submit"
            disabled={pending || isNaN(quantity)}
            formAction={sellAction}
            className="bg-red-500 px-2 py-1 rounded-xl w-full hover:bg-red-400 disabled:bg-gray-300"
          >
            Sell
          </button>
          <button
            type="submit"
            disabled={pending || isNaN(quantity)}
            formAction={buyAction}
            className="bg-green-500 px-2 py-1 rounded-xl w-full hover:bg-green-400 disabled:bg-gray-300"
          >
            Buy
          </button>
        </div>
        {isNaN(quantity) && <ErrorMessageContainer errorMessage={"Quantity can't be null"} />}
        {buyState.success ? (
          <p className="bg-white text-blue-500 p-2 rounded">
            {buyState.message}
          </p>
        ) : (
          buyState.message && (
            <ErrorMessageContainer errorMessage={buyState.message} />
          )
        )}
        {sellState.success ? (
          <p className="bg-white text-blue-500 p-2 rounded">
            {sellState.message}
          </p>
        ) : (
          sellState.message && (
            <ErrorMessageContainer errorMessage={sellState.message} />
          )
        )}
        {tradingInfo.map((item, index) => {
          return (
            <div
              className="w-full flex items-center justify-between"
              key={index}
            >
              <h3>{item.label}</h3>
              <span className="text-indigo-500 py-1 px-2 bg-white rounded-full">
                {item.data}
              </span>
            </div>
          );
        })}
      </form>
    </div>
  );
}
