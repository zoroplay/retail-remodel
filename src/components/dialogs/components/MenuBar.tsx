"use client";

import React from "react";
import { LogOut } from "lucide-react";
import SideOverlay from "../SideOverlay";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { clearBets } from "../../../store/features/slice/betting.slice";
import { logoutUser } from "../../../store/features/slice/user.slice";
import { useLocation, useNavigate } from "react-router-dom";

const MenuBar = ({ onClose }: { onClose: () => void }) => {
  // const router = useRouter();
  // const pathname = usePathname();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuData = [
    {
      title: "Products",
      items: [
        {
          id: "11",
          number: "11",
          code: "#11",
          label: "Sports",
          link: "/overview",
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          id: "21",
          number: "21",
          code: "#21",
          label: "Statements",
          link: "/overview/transactions",
        },
        {
          id: "23",
          number: "23",
          code: "#23",
          label: "Bet List",
          link: "/overview/bet-list",
        },
      ],
    },
    {
      title: "Actions",
      items: [
        {
          id: "31",
          number: "31",
          code: "#31",
          label: "Load Bet",
          link: "/overview/load-bets",
        },
        {
          id: "37",
          number: "37",
          code: "#37",
          label: "Commission",
          link: "/overview/commission",
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearBets());
    onClose();
    // router.push("/auth/sign-in");
  };

  const isActiveItem = (link?: string) => {
    if (!link) return false;
    // const clean = (path: string) => path.replace(/\/$/, "");
    // const current = clean(pathname || "");
    // const target = clean(link);
    return pathname === link;
  };
  // Helper function to check if a path matches a route pattern

  return (
    <SideOverlay open={true} onOpenChange={onClose} width="1400px">
      <div className="flex flex-col h-full p-4 bg-gray-900 text-white">
        {/* Menu Sections */}
        <div className="flex flex-wrap  gap-6 justify-between">
          {menuData.map((section) => (
            <div key={section.title} className="flex-1 min-w-[200px]">
              <h3 className="text-gray-300 font-semibold mb-3">
                {section.title}
              </h3>
              <div className="space-y-3  grid grid-cols-1">
                {section.items.map((item) => {
                  const active = isActiveItem(item.link);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.link) {
                          console.log("Y@YY", item.link);
                          onClose();
                          navigate(item.link);
                        }
                      }}
                      className={`flex items-center w-full rounded-lg p-2 transition ${
                        active
                          ? "bg-blue-600/30 border border-blue-500/50"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`rounded px-3 py-2 mr-3 min-w-[60px] text-center ${
                          active ? "bg-blue-500" : "bg-blue-700"
                        }`}
                      >
                        <p className="text-white text-sm font-medium">
                          {item.number}
                        </p>
                        <p className="text-blue-200 text-xs">{item.code}</p>
                      </div>
                      <span
                        className={`text-base flex-1 ${
                          active
                            ? "text-blue-300 font-semibold"
                            : "text-gray-100"
                        }`}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-base">Logout</span>
          </button>
        </div>
      </div>
    </SideOverlay>
  );
};

export default MenuBar;
