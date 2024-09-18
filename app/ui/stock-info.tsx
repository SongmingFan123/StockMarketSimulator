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
interface StockInfoDetailsProps {
  stockInfo: StockInfo;
  symbol: string;
}

export function StockInfoDetails({ stockInfo, symbol }: StockInfoDetailsProps) {
  const stockInfoData = [
    {
      label: "Day High",
      data: stockInfo?.dayHigh,
    },
    {
      label: "Day Low",
      data: stockInfo?.dayLow,
    },
    {
      label: "Open",
      data: stockInfo?.open,
    },
    {
      label: "Volume",
      data: stockInfo?.volume,
    },
    {
      label: "Market Cap",
      data: stockInfo?.marketCap,
    },
    {
      label: "Total Revenue",
      data: stockInfo?.totalRevenue,
    },
    {
      label: "Profit Margins",
      data: stockInfo?.profitMargins,
    },
    {
      label: "Forward P/E",
      data: stockInfo?.forwardPE,
    },
    {
      label: "Trailing P/E",
      data: stockInfo?.trailingPE,
    },
    {
      label: "Business Summary",
      data: stockInfo?.longBusinessSummary,
    },
  ];
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg ">
      <h2 className="text-2xl text-indigo-500 font-bold">{symbol}</h2>
      <div className="flex flex-col gap-2 mt-2">
        {stockInfoData.map((item, index) => {
          return (
            <p key={index}>
              <span className="font-semibold">{item.label}:</span> {item.data}
            </p>
          );
        })}
      </div>
    </div>
  );
}
