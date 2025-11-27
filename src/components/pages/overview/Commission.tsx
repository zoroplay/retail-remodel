"use client";
import React, { useState } from "react";
import LoadBetsLayout from "../../layouts/LoadBetLayout";
import { useCommissionTransactionsQuery } from "../../../store/services/user.service";
import { useAppSelector } from "../../../hooks/useAppDispatch";
import { Files } from "lucide-react";
import { AppHelper } from "../../../lib/helper";
import NavigationBar from "../../layouts/CDNavigationBar";

interface CommissionTransaction {
  time: string;
  type: string;
  bMovement: string;
  balance: string;
  cMovement: string;
  commission: string;
}

const CommissionPage = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data: commissionTransactions } = useCommissionTransactionsQuery();

  const totalSaleTickets = commissionTransactions?.data?.totalSaleTickets;
  const totalBalance = commissionTransactions?.data?.balance;
  const totalCommission = commissionTransactions?.data?.commission;

  const [activeTab, setActiveTab] = useState("statements");
  const transactions = Array.isArray(commissionTransactions?.data?.transactions)
    ? commissionTransactions?.data?.transactions
    : [];

  return (
    <LoadBetsLayout title="Commission" navigationBar={<NavigationBar />}>
      {/* Main Content Area - Full Screen */}
      <div className="flex flex-row min-h-screen">
        {/* Main Data Table Area */}
        <div className="flex-1 bg-secondary">
          {/* Table Header */}
          <div className="bg-primary px-4 py-3">
            <div className="flex flex-row gap-4">
              <span className="text-white font-semibold w-32">Time</span>
              <span className="text-white font-semibold flex-1">Type</span>
              <span className="text-white font-semibold w-24">B.Movement</span>
              <span className="text-white font-semibold w-20">Balance</span>
              <span className="text-white font-semibold w-24">C.Movement</span>
              {/* <span className="text-white font-semibold w-28">Commission</span> */}
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto">
            {transactions?.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20">
                <Files size={64} color="#9CA3AF" />
                <span className="text-gray-400 text-lg font-semibold mt-4">
                  No Data Available
                </span>
                <span className="text-gray-500 text-sm mt-2 text-center px-8">
                  No commission transactions found
                </span>
              </div>
            ) : (
              transactions?.map((transaction: any, index: number) => (
                <div key={index} className="border-b border-gray-600">
                  <div className="flex flex-row px-4 py-3 bg-secondary/30 gap-4">
                    <span className="text-white text-sm w-32">
                      {AppHelper.formatDate(transaction?.created_at)}
                    </span>
                    <span className="text-white text-sm flex-1 pr-2">
                      {transaction?.type}
                    </span>
                    <span className="text-green-400 text-sm w-24 font-medium">
                      {transaction?.bMovement}
                    </span>
                    <span className="text-white text-sm w-20">
                      {transaction?.balance}
                    </span>
                    <span className="text-green-400 text-sm w-24 font-medium">
                      {transaction.cMovement}
                    </span>
                    {/* <span className="text-white text-sm w-28">
                       {transaction?.commission}
                    </span> */}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div className="bg-black px-6 py-4 border-t border-gray-600">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-8 flex-1 justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-white text-xs mb-1">
                    T. Sale Tickets
                  </span>
                  <span className="text-white font-semibold text-sm">
                    {totalSaleTickets}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white text-xs mb-1">T. Balance</span>
                  <span className="text-green-400 font-semibold text-sm">
                    {totalBalance}
                  </span>
                </div>
                {/* <div className="flex flex-col items-center">
                  <span className="text-white text-xs mb-1">Last Balance</span>
                  <span className="text-white font-semibold text-sm">
                    {lastBalance}
                  </span>
                </div> */}
                <div className="flex flex-col items-center">
                  <span className="text-white text-xs mb-1">T. Commission</span>
                  <span className="text-green-400 font-semibold text-sm">
                    {totalCommission}
                  </span>
                </div>
                {/* <div className="flex flex-col items-center">
                  <span className="text-white text-xs mb-1">
                    Last Commission
                  </span>
                  <span className="text-white font-semibold text-sm">
                    {lastCommission}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-36 bg-black">
          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-col gap-4 px-2">
            {/* Statements Tab */}
            <button
              onClick={() => setActiveTab("statements")}
              className={`w-full h-12 mx-auto rounded-lg flex flex-col items-center justify-center ${
                activeTab === "statements" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <span className="text-white font-bold text-xs">*1</span>
              <span className="text-white font-bold text-xs">Statements</span>
            </button>

            {/* Daily Tab */}
            <button
              onClick={() => setActiveTab("daily")}
              className={`w-full h-12 mx-auto rounded-lg flex flex-col items-center justify-center ${
                activeTab === "daily" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <span className="text-white font-bold text-xs">*2</span>
              <span className="text-white font-bold text-xs">Daily</span>
            </button>
          </div>
        </div>
      </div>
    </LoadBetsLayout>
  );
};

export default CommissionPage;
