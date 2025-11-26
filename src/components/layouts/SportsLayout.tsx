import React from "react";
import { useLocation, Link } from "react-router-dom";
import SportsMenu from "./sidebars/SportsMenu";
import BetSlip from "../bets/bet-slip/BetSlip";
import { OVERVIEW } from "@/data/routes/routes";

interface SportsLayoutProps {
  children: React.ReactNode;
}

export default function SportsLayout({ children }: SportsLayoutProps) {
  const pathname = useLocation().pathname;
  return (
    <div
      className={`h-[calc(100vh-100px)] flex ${
        pathname === OVERVIEW.LIVE ? "justify-center" : "justify-between"
      } items-start top-0 relative text-white`}
    >
      {/* Conditionally render AccountMenu sidebar */}
      {/* <div className="flex-shrink-0"> */}
      {pathname !== OVERVIEW.LIVE && <SportsMenu />}
      {/* </div> */}

      {/* Main content area */}
      <div
        className={`flex flex-col w-full ${
          pathname === OVERVIEW.LIVE ? "max-w-[60rem]" : ""
        } `}
      >
        {children}
      </div>
      <BetSlip />
    </div>
  );
}
