"use client";
import Link from "next/link";
import { signout } from "../lib/actions";
import { usePathname, useRouter } from "next/navigation";
import {
  AccountIcon,
  SearchIcon,
  TransactionIcon,
  PortfoliosIcon,
  SignoutIcon,
  LeaderboardIcon,
} from "./icons";
export default function SideNav() {
  const router = useRouter();
  const links = [
    {
      href: "/dashboard/trade",
      name: "Trade",
      icon: <SearchIcon />,
    },
    {
      href: "/dashboard/portfolio",
      name: "Portfolio",
      icon: <PortfoliosIcon />,
    },
    {
      href: "/dashboard/transaction-history",
      name: "Transaction History",
      icon: <TransactionIcon />,
    },
    {
      href: "/dashboard/leaderboard",
      name: "Leaderboard",
      icon: <LeaderboardIcon />,
    },
    {
      href: "/dashboard/manage-account",
      name: "Manage Account",
      icon: <AccountIcon />,
    },
  ];
  const pathname = usePathname();
  return (
    <nav className="sm:h-full sm:mt-0 mt-12 bg-indigo-500 text-white flex flex-col gap-8 text-sm p-2">
      <h1 className="sm:font-semibold sm:p-2 sm:text-lg sm:block hidden">Stock Market Simulator</h1>
      {links.map((item) => {
        return (
          <Link
            href={item.href}
            className={`flex gap-2 items-center ${
              pathname !== item.href && "hover:text-gray-200"
            } ${
              pathname.startsWith(item.href) &&
              "bg-white text-indigo-500 py-2 px-3 rounded-full"
            }`}
            key={item.name}
          >
            {item.icon}
            <p>{item.name}</p>
          </Link>
        );
      })}
      <form
        action={async () => {
          const signoutResponse = await signout();
          if (signoutResponse.success) {
            router.push("/signin");
          } else {
            alert(signoutResponse.message);
          }
        }}
      >
        <button className="w-full sm:mt-72 flex items-center bg-red-500 text-white p-2 rounded-lg hover:text-red-500 hover:bg-white">
          <SignoutIcon />
          <p>Sign Out</p>
        </button>
      </form>
    </nav>
  );
}
