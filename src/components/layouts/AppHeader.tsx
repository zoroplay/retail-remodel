/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import AppImage from "../inputs/AppImage";
import { useFetchUserCommissionBalanceQuery } from "../../store/services/user.service";
import { useAppSelector } from "../../store/hooks/useAppDispatch";
import { ChevronDown, Loader, LogOut, Menu } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logoutUser } from "@/store/features/slice/user.slice";
import { clearBets } from "@/store/features/slice/betting.slice";
import { Link, useNavigate } from "react-router-dom";
import { ACCOUNT, AUTH, OVERVIEW } from "@/data/routes/routes";
import { getSportRoute } from "@/data/routes/routeUtils";
import { useModal } from "@/hooks/useModal";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { setThemeByClient } from "@/utils/setThemeByClient";
import { useSportsMenuQuery } from "@/store/services/bets.service";
import { useGetGlobalVariablesQuery } from "@/store/services/app.service";
import { setTournamentDetails } from "@/store/features/slice/app.slice";
import Input from "../inputs/Input";
import { useLoginMutation } from "@/store/services/auth.service";
import { showToast } from "../tools/toast";
import { useLogin } from "@/hooks/useLogin";
import { getClientTheme } from "@/config/theme.config";

export const AppHeader: React.FC = ({}) => {
  const { user, refetch_user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { handleLogin, handleInputChange, formData, errors, isLoading } =
    useLogin();
  // Memoize query to prevent unnecessary re-initialization
  useGetGlobalVariablesQuery();

  // Memoize commission balance query to prevent unnecessary re-initialization
  const { refetch: refetchCommissionBalance } =
    useFetchUserCommissionBalanceQuery(undefined, {
      refetchOnMountOrArgChange: 30, // Only refetch if data is older than 30 seconds
      refetchOnReconnect: true,
      refetchOnFocus: false, // Disable refetch on window focus to reduce API calls
    });

  // Memoize sports query parameters to prevent unnecessary refetches

  // Get client_id from user or fallback
  // Safely get client_id from user object, fallback to 'default'
  // Set global theme on body when client_id changes
  useEffect(() => {
    setThemeByClient();
  }, []);
  // Memoize theme map to prevent recreation on every render

  const dispatch = useAppDispatch();
  const [showCommission, setShowCommission] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [, forceUpdate] = useState({});
  const pathname = window.location.pathname;
  const { openModal } = useModal();

  // Memoize top_nav to prevent recreation when sports_data changes
  const top_nav = useMemo(
    () => [
      {
        name: "Sports",
        href: OVERVIEW.SPORTS,
        current: true,
        // sub_links: [
        //   { name: "All Sports", href: OVERVIEW.SPORTS },
        //   ...sports_data.slice(0, 8).map((sport) => ({
        //     name: sport.sportName,
        //     href: getSportRoute(sport.sportID),
        //   })),
        // ],
      },
      { name: "Live", href: OVERVIEW.LIVE, sub_links: [] },
      { name: "Soccer Print", href: "#", current: false, sub_links: [] },
      { name: "Todays's Print", href: "#", current: false, sub_links: [] },
      {
        name: "Cashdesk",
        href: OVERVIEW.CASHDESK,
        current: false,
        sub_links: [],
      },
      { name: "Cashbook", href: "#", sub_links: [] },
      // Only show My Account when user is logged in
      ...(user?.id
        ? [
            {
              name: "My Account",
              href: ACCOUNT.HOME,
              sub_links: [],
            },
          ]
        : []),
    ],
    [user?.id]
  );

  // Determine whether a nav item (or any of its sub-links) should be considered active
  const isActive = useCallback(
    (href: string) => {
      if (!pathname) return false;

      // Exact match
      if (pathname === href) return true;

      // Find the top-level nav item for this href
      const navItem = top_nav.find((i) => i.href === href);
      if (!navItem) {
        // If we don't have the nav item, fallback to prefix match for dynamic subroutes
        return href !== "/" && pathname.startsWith(href);
      }

      // If the current pathname starts with the base href (e.g. /overview/sports/...), mark active
      if (href !== "/" && pathname.startsWith(href)) return true;

      return false;
    },
    [pathname, top_nav]
  );

  const selected = useMemo(
    () => top_nav.findIndex((item) => isActive(item.href)),
    [top_nav, isActive]
  );

  // Memoize active top nav item for use in sub-links rendering
  const activeTopNav = useMemo(
    () => top_nav.find((item) => isActive(item.href)),
    [top_nav, isActive]
  );

  // Optimized window resize handler with debouncing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        // Force re-render to recalculate positions after DOM update
        forceUpdate({});
      }, 100); // Debounce resize events
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Optimized position updates with reduced frequency
  useEffect(() => {
    // Small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      forceUpdate({});
    }, 100);
    return () => clearTimeout(timer);
  }, [selected]); // Removed pathname and top_nav.length to reduce updates

  // Calculate dynamic tab width based on container and content
  const getTabWidth = useCallback(() => {
    const navContainer = document.querySelector("[data-nav-container]");
    const containerWidth = navContainer
      ? navContainer.clientWidth - 16 // Account for container padding
      : Math.min(windowWidth * 0.85, 1000);

    const tabCount = top_nav.length;
    const gapCount = tabCount - 1; // Gaps between tabs
    const totalGapWidth = gapCount * 8; // 8px gap between tabs (from gap-2 class)
    const availableWidth = containerWidth - totalGapWidth;

    // Calculate width per tab, with reasonable min/max bounds
    const calculatedWidth = availableWidth / tabCount;
    return Math.max(80, Math.min(180, calculatedWidth));
  }, [windowWidth, top_nav.length]);

  const getActiveTabPosition = useCallback(() => {
    const activeIndex = top_nav.findIndex((item) => isActive(item.href));
    if (activeIndex < 0) return 8; // Default to start position

    const tabWidth = getTabWidth();
    const gapWidth = 8; // From gap-2 class (0.5rem = 8px)

    // Position = container padding + (index * tab width) + (index * gap width)
    return 8 + activeIndex * (tabWidth + gapWidth);
  }, [getTabWidth, top_nav, pathname, isActive]);

  const getActiveTabWidth = useCallback(() => {
    const activeIndex = top_nav.findIndex((item) => isActive(item.href));
    return activeIndex >= 0 ? getTabWidth() : getTabWidth(); // Default to tab width
  }, [getTabWidth, top_nav, pathname, isActive]);

  const handleLogout = useCallback(() => {
    openModal({
      modal_name: MODAL_COMPONENTS.CONFIRM_LOGOUT,
      title: "Confirm Logout",
    });
  }, [dispatch]);

  const openMenuModal = useCallback(() => {
    openModal({
      modal_name: MODAL_COMPONENTS.MENU_BAR,
      title: "Menu",
    });
  }, [openModal]);
  // Use refs to avoid stale closures in interval
  const userIdRef = useRef(user?.id);
  const refetchRef = useRef(refetchCommissionBalance);

  // Update refs when values change
  useEffect(() => {
    userIdRef.current = user?.id;
    refetchRef.current = refetchCommissionBalance;
  });

  useEffect(() => {
    refetchCommissionBalance();
  }, [refetch_user, refetchCommissionBalance]);

  // Optimized auto-refresh with debouncing and proper cleanup
  useEffect(() => {
    // Only start interval if user is logged in
    if (!userIdRef.current) return;

    const interval = setInterval(() => {
      // Check if user is still logged in and component is still mounted
      if (userIdRef.current && refetchRef.current) {
        console.log("Auto-refreshing commission balance...");
        refetchRef.current();
      }
    }, 30000); // Increased from 15s to 30s to reduce API load

    return () => clearInterval(interval);
  }, [user?.id]); // Re-create interval when user changes

  const { classes } = getClientTheme();

  return (
    <header
      className={`sticky flex justify-center flex-col items-center top-0 z-50 ${classes.app_header["header-gradient"]} shadow-lg h-[100px]`}
    >
      {/* Top Utility Bar */}
      <div
        className={`flex items-center justify-between w-full  relative max-w-[80rem]`}
      >
        <div className="flex items-center justify-between w-full bg gap-4 min-w-0">
          <div className="p-3">
            <AppImage imageKey="logo" style={{ width: 140, height: 32 }} />
          </div>
        </div>
        {/* Divider for desktop */}
        <div
          className={`hidden md:block h-10 w-px mx-6 ${classes.app_header["divider"]}`}
        />
        <div className="flex text-sm items-center justify-end gap-3 min-w-[40rem]">
          {/* User actions */}
          {user?.id ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`font-semibold truncate max-w-[80px] ${classes.app_header["inactive-route-indicator"]}`}
              >
                {user?.code}
              </span>
              <span
                className={`font-semibold truncate max-w-[120px] ${classes.app_header["inactive-route-indicator"]}`}
              >
                {user?.username}
              </span>
              <div className="flex items-center flex-wrap justify-center">
                <span className="text-green-300 h-[32px] font-bold bg-blue-950/80 px-2 py-1 flex justify-center items-center">
                  {user?.currency} {user.availableBalance ?? 0}
                </span>

                <button
                  onClick={handleLogout}
                  className={`flex gap-1 items-center bg-black hover:bg-red-700 px-3 py-1 h-[32px] text-xs font-bold shadow transition-all ${classes.app_header["inactive-route-indicator"]}`}
                >
                  <LogOut
                    className={`w-4 h-4 ${classes.app_header["inactive-route-indicator"]}`}
                  />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex g focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary transition-all">
                <div
                  className={`px-2 py-1 font-bold text-xs h-[36px] flex justify-center items-center bg-gradient-to- bg-slate-800 to-slate-700 shadow transition-all border border-slate-600  ${classes.app_header["inactive-route-indicator"]}`}
                >
                  <span>+234</span>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Mobile Number"
                  autoComplete="off"
                  className="w-full h-[36px] border-l-0 text-xs p-2 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-none outline-none text-gray-200 placeholder-slate-400 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Password"
                  autoComplete="off"
                  className="w-full h-[36px] p-2 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-none text-gray-200 text-xs placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  onClick={() => {
                    handleLogin();
                  }}
                  className={`${classes.app_header["login-button-bg"]} ${classes.app_header["login-button-hover"]} ${classes.app_header["login-button-text"]} px-4 py-1 font-bold text-xs h-[36px] shadow transition-all`}
                >
                  {isLoading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={openMenuModal}
            aria-label="Open menu"
          >
            <Menu size={24} color="white" />
          </button>
        </div>
      </div>
      <div
        className={`relative max-w-[60rem] flex gap-2  px-2 py-1 rounded-lg shadow-inner`}
        data-nav-container
      >
        {/* Moving highlight indicator - only show when a nav item is active */}
        {selected >= 0 && (
          <div
            className={`absolute outline-0 top-0 bottom-0 bg-white shadow-lg`}
            style={{
              // left: `${getActiveTabPosition()}px`,
              // width: `${getTabWidth() - 2}px`,
              // transform: `translateX(${selected * 100}%)`,
              left: `${getActiveTabPosition()}px`,
              width: `${getActiveTabWidth()}px`,
              zIndex: 1,
              background: classes.app_header["highlight-indicator"],
              // background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: "translateZ(0)", // Force hardware acceleration
              willChange: "left, width", //
              clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
            }}
          />
        )}
        {top_nav.map((item, index) => (
          <Link
            key={item.name}
            to={item.href}
            className={`relative outline-none flex justify-center items-center h-[32px] uppercase text-xs font-medium py-1 px-2 transition-all duration-300    ${
              isActive(item.href)
                ? `${classes.app_header["active-route-indicator"]} z-10`
                : classes.app_header["inactive-route-indicator"]
            }`}
            style={{
              width: `${getTabWidth()}px`,
              textAlign: "center",
            }}
            tabIndex={0}
            aria-current={isActive(item.href) ? "page" : undefined}
            onClick={() => {
              dispatch(
                setTournamentDetails({
                  tournament_id: 11,
                  sport_id: 1,
                })
              );
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      {/* User Info Panel (Mobile) */}
      {user?.id && (
        <div className="md:hidden flex flex-col items-end px-4 py-2 bg-blue-900">
          <span
            className={`font-semibold ${classes.app_header["inactive-route-indicator"]}`}
          >
            {user?.code}
          </span>
          <span
            className={`font-semibold ${classes.app_header["inactive-route-indicator"]}`}
          >
            {user?.username}
          </span>
          <span className="text-green-300 font-bold">
            {user?.currency} {user?.availableBalance ?? 0}
          </span>
        </div>
      )}
      {/* Redesigned Bottom Nav: subtle, single-line, muted links */}
      <nav className="hidden md:flex w-full justify-center items-center px-4 py-0 bg-blue-950/80">
        <section className="flex justify-center items-center ">
          {/* {bottom_nav.map((item) => (
          <Link
          key={item.name}
            to={item.href}
            className={`text-blue-200 text-sm font-medium px-2 py-1  transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-white hover:bg-blue-900 ${
              isActive(item.href) ? "text-white underline" : ""
            }`}
            tabIndex={0}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))} */}
          {/* {activeTopNav?.sub_links.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-blue-200 flex justify-center items-center relative text-sm font-medium p-1 px-[18px] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-400 hover:text-white hover:bg-blue-900 ${
                item.href === pathname ? " after:w-full bg-blue-900" : ""
              } after:absolute after:-bottom-1 after:left-[50%] after:translate-x-[-50%] after:w-0 after:h-1 after:hover:bg-blue-500/60  after:bg-blue-700 after:content-[''] after:transition-all hover:after:w-full`}
              tabIndex={0}
              aria-current={item.href === pathname ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
          {pathname.includes(OVERVIEW.SPORTS) && (
            <div className="flex relative px-[16px] items-center justify-center gap-1 text-blue-200 text-sm font-medium p-1 hover:text-white hover:bg-blue-900 cursor-pointer after:absolute after:-bottom-1 after:left-[50%] after:translate-x-[-50%] after:w-0 after:h-1 after:hover:bg-blue-500/60  after:bg-blue-700 after:content-[''] after:transition-all hover:after:w-full">
              <span>More Sports</span>
              <span>
                <ChevronDown size={16} />
              </span>
            </div>
          )} */}
        </section>
      </nav>
    </header>
  );
};

export default AppHeader;
