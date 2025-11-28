import React from "react";
import { useLocation } from "react-router-dom";
import AccountMenu from "./sidebars/AccountMenu";

interface AccountLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that renders the AccountMenu sidebar for account-related pages
 * Automatically detects if the current route contains "/account" and shows the sidebar
 */
const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-100px)] top-0 relative flex gap-4 justify-center items-start text-white">
      {/* Conditionally render AccountMenu sidebar */}
      {/* <div className="flex-shrink-0"> */}
      <AccountMenu />
      {/* </div> */}

      {/* Main content area */}
      <div className={`w-full max-w-[80rem]`}>{children}</div>
    </div>
  );
};

export default AccountLayout;
