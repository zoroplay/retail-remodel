import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ACCOUNT, OVERVIEW } from "@/data/routes/routes";
import {
  Home,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  Plus,
  Minus,
  Users,
  UserPlus,
  ArrowRightLeft,
  DollarSign,
  Percent,
  TrendingUp,
  Gift,
  Shield,
  User,
  Lock,
  Database,
  Eye,
} from "lucide-react";
import { getClientTheme } from "@/config/theme.config";

interface MenuSection {
  title: string;
  items: MenuItem[];
  color: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

type Props = {};

const AccountMenu = (props: Props) => {
  const { classes } = getClientTheme();
  const sidebarClasses = classes.sports_sidebar;
  const location = useLocation();

  const menuSections: MenuSection[] = [
    {
      title: "My Account",
      color: "bg-red-600",
      items: [
        { name: "Dashboard", href: ACCOUNT.HOME, icon: <Home size={16} /> },
        {
          name: "Bet List",
          href: ACCOUNT.BET_LIST,
          icon: <FileText size={16} />,
        },
        {
          name: "Bet List Payout",
          href: ACCOUNT.BET_LIST_PAYOUT,
          icon: <CreditCard size={16} />,
        },
        // {
        //   name: "Coupon Bet List",
        //   href: ACCOUNT.COUPON_BET_LIST,
        //   icon: <Receipt size={16} />,
        // },
        {
          name: "Transactions List",
          href: ACCOUNT.TRANSACTIONS,
          icon: <ArrowRightLeft size={16} />,
        },
        // {
        //   name: "Online Report",
        //   href: ACCOUNT.ONLINE_REPORT,
        //   icon: <BarChart3 size={16} />,
        // },
        { name: "Deposit", href: ACCOUNT.DEPOSIT, icon: <Plus size={16} /> },
        { name: "Withdraw", href: ACCOUNT.WITHDRAW, icon: <Minus size={16} /> },
      ],
    },
    {
      title: "POS",
      color: "bg-blue-600",
      items: [
        {
          name: "New User",
          href: ACCOUNT.NEW_USER,
          icon: <UserPlus size={16} />,
        },
        {
          name: "User List",
          href: ACCOUNT.USER_LIST,
          icon: <Users size={16} />,
        },
        {
          name: "Transfer Funds to Cashier",
          href: ACCOUNT.TRANSFER_TO_CASHIER,
          icon: <ArrowRightLeft size={16} />,
        },
        {
          name: "Transfer Funds to Player",
          href: ACCOUNT.TRANSFER_TO_PLAYER,
          icon: <DollarSign size={16} />,
        },
      ],
    },
    {
      title: "Reports",
      color: "bg-green-600",
      items: [
        {
          name: "Commissions",
          href: ACCOUNT.COMMISSIONS,
          icon: <Percent size={16} />,
        },
        { name: "Sales", href: ACCOUNT.SALES, icon: <TrendingUp size={16} /> },
        { name: "Bonus", href: ACCOUNT.BONUS, icon: <Gift size={16} /> },
        // {
        //   name: "Credit & Liability",
        //   href: ACCOUNT.CREDIT_LIABILITY,
        //   icon: <Shield size={16} />,
        // },
      ],
    },
    // {
    //   title: "Settings",
    //   color: "bg-gray-600",
    //   items: [
    //     {
    //       name: "Account Detail",
    //       href: ACCOUNT.ACCOUNT_DETAIL,
    //       icon: <User size={16} />,
    //     },
    //     {
    //       name: "Change Password",
    //       href: ACCOUNT.CHANGE_PASSWORD,
    //       icon: <Lock size={16} />,
    //     },
    //     {
    //       name: "Personal Data",
    //       href: ACCOUNT.PERSONAL_DATA,
    //       icon: <Database size={16} />,
    //     },
    //     {
    //       name: "View Session",
    //       href: ACCOUNT.VIEW_SESSION,
    //       icon: <Eye size={16} />,
    //     },
    //   ],
    // },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const MenuItem = ({
    item,
    isActive,
  }: {
    item: MenuItem;
    isActive: boolean;
  }) => (
    <Link
      to={item.href}
      className={`
        group flex items-center gap-2 px-4 py-2 text-xs transition-all duration-200
        ${sidebarClasses["tournament-item-hover"]} border-b ${
        sidebarClasses["tournament-item-border"]
      } ${classes.sports_page["date-separator-text"]}  last:border-b-0
        relative overflow-hidden
        ${
          isActive
            ? `${sidebarClasses["category-item-bg"]} ${sidebarClasses["category-item-text"]} border-l-4 ${sidebarClasses["category-item-border"]} shadow-sm`
            : `${sidebarClasses["tournament-item-text"]} hover:border-l-4 ${classes["item-hover-border-l"]}`
        }
      `}
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive ? sidebarClasses["account-icon-active"] : " "
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-10 font-medium">{item.name}</span>

      {/* Active Indicator */}
      {isActive && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full animate-pulse ${sidebarClasses["category-item-active"]}`}
        />
      )}
    </Link>
  );

  return (
    <section className="sticky top-[6.4rem]">
      <aside
        className={`w-72 ${sidebarClasses["main-bg"]} overflow-hidden shadow-md`}
      >
        {/* Sidebar Header */}
        <div
          className={`${classes.sports_page["header-bg"]} border-b ${classes.sports_page["header-text"]} ${classes.sports_page["header-border"]} border-b ${sidebarClasses["sport-item-border"]} px-4 py-2`}
        >
          <h2 className={` font-bold text-xs flex items-center gap-2`}>
            <User size={18} className={sidebarClasses["account-icon-active"]} />
            Account Menu
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-400">
          {menuSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={`border-b ${sidebarClasses["sport-item-border"]} last:border-b-0`}
            >
              {/* Section Header */}
              <div
                className={`${classes.sports_page["date-separator-text"]}  ${classes.sports_page["date-separator-bg"]} ${classes.sports_page["date-separator-border"]} px-4 py-2 shadow-sm relative`}
              >
                <h3 className="font-bold text-[11px] uppercase tracking-wider">
                  {section.title}
                </h3>
                {/* Subtle bottom border for visual separation */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
              </div>

              {/* Section Items */}
              <div className={sidebarClasses["category-item-bg"]}>
                {section.items.map((item) => (
                  <MenuItem
                    key={item.name}
                    item={item}
                    isActive={isActive(item.href)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default AccountMenu;
