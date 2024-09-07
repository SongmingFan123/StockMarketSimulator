import { LeaderboardTable } from "@/app/ui/tables";
import { getLeaderboardData } from "../../lib/actions";
export default async function Leaderboard () {
  const leaderboardRankings = (await getLeaderboardData()).data;
  return (
    <main className="w-full p-2 text-left">
      <LeaderboardTable leaderboardRankings={leaderboardRankings}/>
    </main>
  );
};
