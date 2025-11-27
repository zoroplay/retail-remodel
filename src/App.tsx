import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { useAppSelector } from "./store/hooks/useAppDispatch";
import LandingPage from "./components/pages/LandingPage";
import SignIn from "./components/pages/auth/SignIn";
import { ACCOUNT, OVERVIEW } from "./data/routes/routes";
import SportsLayout from "./components/layouts/SportsLayout";
import AccountLayout from "./components/layouts/AccountLayout";
import OverviewScreen from "./components/pages/overview/Overview";
import ModalProvider from "./components/dialogs/ModalProvider";
import LoadBetsPage from "./components/pages/overview/LoadBets";
import BetListPage from "./components/pages/overview/account/BetList";
import Commission from "./components/pages/overview/Commission";
import TransactionsPage from "./components/pages/overview/account/Transactions";
import { ToastComponent } from "./components/tools/toast";
import AppHeader from "./components/layouts/AppHeader";
import BetListPayoutPage from "./components/pages/overview/account/BetListPayout";
import Deposit from "./components/pages/overview/account/Deposit";
import DepositForm from "./components/pages/overview/account/DepositForm";
import UserList from "./components/pages/overview/account/UserList";
import NewUser from "./components/pages/overview/account/NewUser";
import TransferFunds from "./components/pages/overview/account/TransferFunds";
import CommissionReport from "./components/pages/overview/account/Commission";
import Sales from "./components/pages/overview/account/Sales";
import Bonus from "./components/pages/overview/account/Bonus";
import Profile from "./components/pages/overview/account/Profile";
import OnlineDepositPage from "./components/pages/overview/account/OnlineDepositPage";
import { getClientTheme } from "./config/theme.config";
import LiveOverviewScreen from "./components/pages/overview/LiveOverview";
import Withdraw from "./components/pages/overview/account/Withdraw";

// Route constants

// import LandingPage from "./components/LandingPage";

// import NotFoundScreen from "./app/+not-found";
// import DebugRoutes from "./app/debug-routes";
// import SafeComponentWrapper from "./components/SafeComponentWrapper";
// import { useEffect } from "react";
// import SignIn from "./app/auth/sign-in/page";
// import OverviewScreen from "./app/overview/page";

// Component to handle authentication and routing
function AuthenticationManager() {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    try {
      // If on root path, always navigate to sports
      if (pathname === "/" || pathname === "") {
        navigate(OVERVIEW.SPORTS, { replace: true });
        return;
      }

      // If no user and trying to access account routes, redirect to sports
      if (!user?.id && pathname.startsWith(ACCOUNT.HOME)) {
        navigate(OVERVIEW.SPORTS, { replace: true });
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  }, [user?.id, pathname, navigate]);

  return null;
}

// Debug component to track route changes
function RouteDebugger() {
  const location = useLocation();

  useEffect(() => {
    console.log("🔄 Route changed to:", location.pathname);
    console.log("📍 Full location:", location);
  }, [location]);

  return null;
}

function App() {
  const { classes } = getClientTheme();
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <div className={`${classes["bg-main"]}`}>
          <BrowserRouter>
            <AuthenticationManager />
            <ModalProvider />
            <ToastComponent />
            <RouteDebugger />
            <AppHeader />
            <Routes>
              {/* Debug route - for troubleshooting */}
              {/* <Route path="/debug" element={<DebugRoutes />} /> */}

              {/* Main routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/sign-in" element={<SignIn />} />
              {/* <Route
              path="/overview"
              element={
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-4">
                    Overview Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome to the main dashboard! You are successfully
                    authenticated.
                  </p>
                </div>
              }
            /> */}
              {/* <Route path="/auth/sign-in" element={<div>djh</div>} /> */}

              {/* Overview routes - wrapped with error handling */}
              <Route
                path={OVERVIEW.SPORTS}
                element={
                  <SportsLayout>
                    <OverviewScreen />
                  </SportsLayout>
                }
              />
              <Route
                path={OVERVIEW.LIVE}
                element={
                  <SportsLayout>
                    <LiveOverviewScreen />
                  </SportsLayout>
                }
              />
              {/* Overview routes - wrapped with error handling */}
              <Route
                path={OVERVIEW.SPORTS_BY_ID}
                element={
                  <SportsLayout>
                    <OverviewScreen />
                  </SportsLayout>
                }
              />
              {/* <Route
                path={OVERVIEW.SPORTS}
                element={
                  <SafeComponentWrapper pageName="Overview">
                    <OverviewScreen />
                  </SafeComponentWrapper>
                }
              /> */}

              <Route
                path={ACCOUNT.HOME}
                element={
                  <AccountLayout>
                    <Profile />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.TRANSACTIONS}
                element={
                  <AccountLayout>
                    <TransactionsPage />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.BET_LIST_PAYOUT}
                element={
                  <AccountLayout>
                    <BetListPayoutPage />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.BET_LIST}
                element={
                  <AccountLayout>
                    <BetListPage />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.DEPOSIT}
                element={
                  <AccountLayout>
                    <Deposit />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.DEPOSIT_FORM}
                element={
                  <AccountLayout>
                    <DepositForm />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.WITHDRAW}
                element={
                  <AccountLayout>
                    <Withdraw />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.USER_LIST}
                element={
                  <AccountLayout>
                    <UserList />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.NEW_USER}
                element={
                  <AccountLayout>
                    <NewUser />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.TRANSFER_TO_CASHIER}
                element={
                  <AccountLayout>
                    <TransferFunds />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.TRANSFER_TO_PLAYER}
                element={
                  <AccountLayout>
                    <OnlineDepositPage />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.COMMISSIONS}
                element={
                  <AccountLayout>
                    <CommissionReport />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.SALES}
                element={
                  <AccountLayout>
                    <Sales />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.BONUS}
                element={
                  <AccountLayout>
                    <Bonus />
                  </AccountLayout>
                }
              />
              <Route
                path={ACCOUNT.PROFILE}
                element={
                  <AccountLayout>
                    <Profile />
                  </AccountLayout>
                }
              />
              {/* </Route> */}
              <Route path={OVERVIEW.CASHDESK} element={<LoadBetsPage />} />
              <Route path={OVERVIEW.SPORTS} element={<LoadBetsPage />} />

              <Route path="/overview/commission" element={<Commission />} />

              {/* 404 handler - must be last */}
              {/* <Route path="*" element={<NotFoundScreen />} /> */}
            </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
