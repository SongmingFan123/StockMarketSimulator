import { getPortfolioData } from "../../lib/actions";
import { PortfolioTable } from "@/app/ui/tables";
export default async function Portfolios() {
  const portfolioDataResponse = await getPortfolioData();
  const portfolio = portfolioDataResponse.data?.portfolio;
  return (
    <main>
      {portfolio && portfolio.length === 0 ? (
        <p className="h-screen flex justify-center items-center text-indigo-500 text-xl font-semibold">
          No Portfolio
        </p>
      ) : (
        <PortfolioTable portfolio={portfolio} />
      )}
    </main>
  );
}
