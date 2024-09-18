import { LeaderboardTable } from "@/app/ui/tables";
import { getLeaderboardData } from "../../lib/actions";
export default async function Leaderboard() {
  const rankings = (await getLeaderboardData()).data;
  return (
    <main>
      {rankings && rankings.length === 0 ? (
        <p className="h-screen flex justify-center items-center text-indigo-500 text-xl font-semibold">
          No Leaderboard
        </p>
      ) : (
        <LeaderboardTable rankings={rankings} />
      )}
    </main>
  );
}
