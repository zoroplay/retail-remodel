import React, { useState, useEffect, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useAppDispatch";
import {
  useCreditPlayerMutation,
  useDepositCommissionMutation,
  useValidateUserMutation,
} from "../../../../store/services/user.service";
import { setUserRerender } from "../../../../store/features/slice/user.slice";
import Input from "../../../inputs/Input";
import SingleSearchInput from "../../../inputs/SingleSearchInput";
import {
  ArrowLeft,
  Wallet,
  User,
  CheckCircle,
  Loader,
  Shield,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import environmentConfig from "@/store/services/configs/environment.config";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { getClientTheme } from "@/config/theme.config";
import { useNavigate } from "react-router-dom";
import SwitchInput from "@/components/inputs/SwitchInput";
import {
  useValidateDepositCodeMutation,
  useWalletBalanceMutation,
} from "@/store/services/wallet.service";
import { showToast } from "@/components/tools/toast";

const OnlineDepositPage = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.deposit_page;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [customerId, setCustomerId] = useState("");
  const [depositCode, setDepositCode] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    username: string;
    balance: number;
    role: string;
    id: number;
    email?: string;
    phoneNumber?: string;
    code?: string;
  } | null>(null);
  const [errMessage, setErrMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState<number>(0);
  const [request_id, setRequestId] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const { global_variables } = useAppSelector((state) => state.app);
  const [validateUser] = useValidateUserMutation();
  const [creditPlayer] = useCreditPlayerMutation();

  const [validateDepositCode, { isLoading: isValidatingCode }] =
    useValidateDepositCodeMutation();
  const [depositCommision] = useDepositCommissionMutation();
  const [walletBalance] = useWalletBalanceMutation();
  const currency = global_variables?.currency_code || "NGN";

  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleValidateUser = async (customer_id: string) => {
    if (!customer_id.trim() || customer_id.trim().length < 4) return;

    setIsLoading(true);
    setErrMessage("");

    try {
      const result = await validateUser({
        searchKey: customer_id,
        clientId: Number(environmentConfig.CLIENT_ID),
      }).unwrap();

      if (result.success === false) {
        setErrMessage(result.message || "Failed to validate user");
        setUsersList([]);
        setShowDropdown(false);
        return;
      }

      const userDetails = result.data;

      if (
        !userDetails ||
        (Array.isArray(userDetails) && userDetails.length === 0)
      ) {
        setErrMessage("No user found with the provided ID");
        setUsersList([]);
        setShowDropdown(false);
        return;
      }

      setUsersList(Array.isArray(userDetails) ? userDetails : [userDetails]);
      setShowDropdown(true);
    } catch (error: any) {
      setErrMessage(error?.data?.message || "Failed to validate user");
      setUsersList([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleValidateCode = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);

    try {
      const result = await validateDepositCode({
        code: code,
        userRole: user?.role || "",
      }).unwrap();
      console.log("validate deposit code result", result);
      if (result.success === false) {
        console.log(
          "Error:",
          result.message || "Failed to validate deposit code"
        );
        showToast({
          type: "error",
          title: "Error",
          description: result.message || "Failed to validate deposit code",
        });
        return;
      }
      const balance = await walletBalance({
        user_id: result.data.user_id,
      }).unwrap();

      const transferData = result.data;

      // Ensure transferData is valid before setting state
      if (!transferData) {
        showToast({
          type: "error",
          title: "Error",
          description: "Invalid deposit code or code has expired",
        });
        return;
      }

      setRequestId(String(transferData.id) || "");
      setSelectedUser({
        username: transferData.username || "",
        balance: balance?.availableBalance || 0,
        role: transferData?.role,
        id: transferData.user_id || 0,
        email: transferData?.email,
        phoneNumber: transferData?.phoneNumber,
        code: transferData?.code,
      });
      setAmount(String(parseFloat(transferData.amount) || 0));
      // setCurrentStep(3);
    } catch (error: any) {
      console.log(
        "Error:",
        error?.data?.message || "Failed to validate deposit code"
      );
      showToast({
        type: "error",
        title: "Error",
        description: error?.data?.message || "Failed to validate deposit code",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectUser = (user: any) => {
    setSelectedUser({
      username: user.username || "",
      balance: parseFloat(user.balance) || 0,
      role: user.role || "",
      id: user.id || 0,
      email: user.email,
      phoneNumber: user.phoneNumber,
      code: user.code,
    });
    setCustomerId(user.username);
    setShowDropdown(false);
    setErrMessage("");
  };

  const handleDeposit = async () => {
    if (!amount.trim() || !selectedUser || !selectedUser.id) {
      setErrMessage("Please select a user and enter a valid amount");
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setErrMessage("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setErrMessage("");

    try {
      const result = await creditPlayer({
        amount: depositAmount,
        userId: selectedUser.id,
      }).unwrap();

      if (result && result.success === false) {
        setErrMessage(result.message || "Deposit failed");
        toast.error(result.message || "Deposit failed");
        return;
      }

      // const depositCommissionPayload = {
      //   clientId: Number(environmentConfig.CLIENT_ID),
      //   userId: selectedUser.id,
      //   commissionId: commissionData?.data?.data?.profile?.id ?? 0,
      //   amount: depositAmount,
      //   provider: "deposit",
      //   depositCode: "deposit",
      // };

      // const depositCommissionResult = await depositCommision(
      //   depositCommissionPayload
      // ).unwrap();

      // if (depositCommissionResult?.success === false) {
      //   toast.warning(
      //     depositCommissionResult.message || "Commission calculation failed"
      //   );
      // }

      // toast.success("Deposit completed successfully!");

      // Reset form
      setCustomerId("");
      setAmount("");
      setUsersList([]);
      setSelectedUser(null);
      setShowDropdown(false);
    } catch (error: any) {
      const errorMsg =
        error?.message || error?.data?.message || "Failed to process deposit";
      setErrMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      dispatch(setUserRerender());
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const updateAmount = (value: number) => {
    if (value === 0) {
      setAmount("0");
      return;
    }
    const currentAmount = Number(amount) || 0;
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <div className={`${pageClasses["page-bg"]} ${classes["text-primary"]}`}>
      <div className="p-2 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <div>
            <h1 className={`text-base font-bold `}>Online Deposit</h1>
            <p className={`text-xs ${classes["text-secondary"]}`}>
              Deposit funds to customer accounts
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 justify-center items-start">
          {/* Left Side - Instructions */}
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg p-2 border`}
          >
            <h2
              className={`text-sm font-semibold mb-3 flex items-center gap-2`}
            >
              <Shield className={classes["text-secondary"]} size={18} />
              Important Information
            </h2>

            <div className={`space-y-2.5 ${classes["text-secondary"]}`}>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} ${classes.transactions_page["column-header-text"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  1
                </div>
                <p className={`text-xs leading-relaxed`}>
                  Start typing customer ID or username. After 4 characters,
                  matching users will appear automatically.
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} ${classes.transactions_page["column-header-text"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  2
                </div>
                <p className={`text-xs leading-relaxed`}>
                  Select the customer from the dropdown to proceed with the
                  deposit.
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} ${classes.transactions_page["column-header-text"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  3
                </div>
                <p className={`text-xs leading-relaxed`}>
                  Enter the deposit amount and confirm to complete the
                  transaction.
                </p>
              </div>
            </div>

            <div
              className={`mt-4 p-2 ${pageClasses["warning-bg"]} border ${pageClasses["warning-border"]} rounded-lg`}
            >
              <div
                className={`flex items-center gap-2 ${pageClasses["warning-text"]} mb-1.5`}
              >
                <Info size={16} />
                <span className="font-semibold text-xs">Note</span>
              </div>
              <p
                className={`${pageClasses["warning-text"]} text-xs leading-relaxed`}
              >
                Deposits are processed instantly and commission is calculated
                automatically.
              </p>
            </div>
          </div>

          {/* Right Side - Deposit Form */}
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg p-2 border flex flex-col gap-2 `}
          >
            {/* Agent Info */}
            <div
              className={`${pageClasses["info-bg"]} rounded-lg p-2 border ${pageClasses["info-border"]} flex flex-col gap-1`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs ${classes["text-primary"]}`}>
                  Agent Balance:
                </span>
                <span
                  className={`text-base font-bold ${pageClasses["balance-value"]}`}
                >
                  <CurrencyFormatter
                    amount={user?.availableBalance || user?.balance || 0}
                    className=""
                    spanClassName=""
                  />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${classes["text-primary"]}`}>
                  Agent:
                </span>
                <span className={`text-xs ${classes["text-secondary"]}`}>
                  {user?.username}
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDeposit();
              }}
              className="flex flex-col gap-2"
            >
              <div className="min-w-[220px]">
                <SwitchInput
                  options={[{ title: "By Customer ID" }, { title: "By Code" }]}
                  selected={period}
                  onChange={(i) => setPeriod(i)}
                  rounded="rounded-md"
                  background={`${classes.betslip["tab-bg"]} ${classes.betslip["tab-border"]} !p-[2px] border shadow-sm`}
                  thumb_background={`${classes.betslip["tab-bg"]}`}
                  thumb_color={`${classes.betslip["tab-active-bg"]} ${classes.betslip["tab-active-text"]} transition-all duration-300 !rounded-[4px]`}
                  text_color={`${classes.betslip["tab-inactive-text"]} !text-[11px] font-medium`}
                  selected_text_color={`${classes.betslip["tab-active-text"]} !text-[11px] font-medium`}
                />
              </div>
              {/* Customer Search with Dropdown */}
              {period === 0 ? (
                <div className="relative" ref={dropdownRef}>
                  <SingleSearchInput
                    label="Customer ID / Username"
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value);
                    }}
                    searchState={{
                      isValid: !!selectedUser,
                      isNotFound: errMessage.includes("No user found"),
                      isLoading: isLoading,
                      message: errMessage,
                    }}
                    onSearch={(customer_id) => {
                      handleValidateUser(customer_id);
                    }}
                    placeholder="Start typing (min 4 characters)..."
                    name="customerId"
                    bg_color={classes["input-bg"]}
                    text_color={classes["input-text"]}
                    border_color={`border ${classes["input-border"]}`}
                    className={`w-full text-xs rounded-lg ${classes["input-text"]} transition-all duration-200`}
                  />

                  {/* Dropdown for user selection */}
                  {showDropdown && usersList.length > 0 && (
                    <div
                      className={`absolute z-50 w-full mt-1 ${pageClasses["form-bg"]} backdrop-blur-[4px] border ${pageClasses["form-border"]} rounded-lg shadow-lg max-h-60 overflow-y-auto`}
                    >
                      {usersList.map((user, index) => (
                        <div
                          key={user.id || index}
                          onClick={() => handleSelectUser(user)}
                          className={`p-2 cursor-pointer ${pageClasses["row-hover"]} border-b ${pageClasses["form-border"]} last:border-b-0`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div
                                className={`flex items-center gap-2 mb-1 ${pageClasses["form-text"]}`}
                              >
                                <span className={`text-xs font-semibold `}>
                                  {user.username}
                                </span>
                                {user.code && (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 ${pageClasses["button-primary-bg"]} rounded`}
                                  >
                                    {user.code}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5 text-[10px]">
                                {user.email && (
                                  <span className={pageClasses["label-text"]}>
                                    {user.email}
                                  </span>
                                )}
                                {user.balance !== undefined && (
                                  <span
                                    className={pageClasses["balance-value"]}
                                  >
                                    Balance: {currency}{" "}
                                    {formatNumber(user.balance)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <User
                              size={16}
                              className={pageClasses["form-text"]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <SingleSearchInput
                    label="Deposit Code"
                    value={depositCode}
                    onChange={(e) => {
                      setDepositCode(e.target.value);
                    }}
                    searchState={{
                      isValid: !!selectedUser,
                      isNotFound: errMessage.includes("No user found"),
                      isLoading: isLoading,
                      message: errMessage,
                    }}
                    onSearch={(customer_id) => {
                      if (customer_id.trim().length <= 5) {
                        setErrMessage("Please enter a valid deposit code");
                        return;
                      }
                      handleValidateCode(customer_id);
                    }}
                    placeholder="Start typing (min 4 characters)..."
                    name="depositCode"
                    bg_color={classes["input-bg"]}
                    text_color={classes["input-text"]}
                    border_color={`border ${classes["input-border"]}`}
                    className={`w-full text-xs rounded-lg ${classes["input-text"]} transition-all duration-200`}
                  />

                  {/* Dropdown for user selection */}
                  {showDropdown && usersList.length > 0 && (
                    <div
                      className={`absolute z-50 w-full mt-1 ${pageClasses["form-bg"]} backdrop-blur-[4px] border ${pageClasses["form-border"]} rounded-lg shadow-lg max-h-60 overflow-y-auto`}
                    >
                      {usersList.map((user, index) => (
                        <div
                          key={user.id || index}
                          onClick={() => handleSelectUser(user)}
                          className={`p-2 cursor-pointer ${pageClasses["row-hover"]} border-b ${pageClasses["form-border"]} last:border-b-0`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div
                                className={`flex items-center gap-2 mb-1 ${pageClasses["form-text"]}`}
                              >
                                <span className={`text-xs font-semibold `}>
                                  {user.username}
                                </span>
                                {user.code && (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 ${pageClasses["button-primary-bg"]} rounded`}
                                  >
                                    {user.code}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5 text-[10px]">
                                {user.email && (
                                  <span className={pageClasses["label-text"]}>
                                    {user.email}
                                  </span>
                                )}
                                {user.balance !== undefined && (
                                  <span
                                    className={pageClasses["balance-value"]}
                                  >
                                    Balance: {currency}{" "}
                                    {formatNumber(user.balance)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <User
                              size={16}
                              className={pageClasses["form-text"]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected User Info */}
              {selectedUser && (
                <div
                  className={`${pageClasses["info-bg"]} rounded-lg p-2 border ${pageClasses["info-border"]} flex items-center justify-between`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-semibold `}>
                      {selectedUser.username}
                    </span>
                    <span
                      className={`text-[10px] ${pageClasses["balance-text"]}`}
                    >
                      Current Balance: {currency}{" "}
                      {formatNumber(selectedUser.balance)}
                    </span>
                  </div>
                  <CheckCircle
                    size={16}
                    className={pageClasses["balance-value"]}
                  />
                </div>
              )}

              {/* Quick Amount Selection */}
              {selectedUser && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className={`block text-xs font-semibold`}>
                      Quick Amount Selection
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      <button
                        type="button"
                        onClick={() => updateAmount(0)}
                        className={`${pageClasses["quick-button-bg"]} ${pageClasses["quick-button-hover"]} border ${pageClasses["quick-button-border"]} ${pageClasses["quick-button-text"]} text-xs py-1.5 pb-1 rounded-md transition-all duration-200 hover:scale-105`}
                      >
                        Clear
                      </button>
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => updateAmount(quickAmount)}
                          className={`${pageClasses["quick-button-bg"]} ${pageClasses["quick-button-hover"]} border ${pageClasses["quick-button-border"]} ${pageClasses["quick-button-text"]} text-xs py-1.5 pb-1 rounded-md transition-all duration-200 hover:scale-105`}
                        >
                          +{currency[0]}
                          {formatNumber(quickAmount)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <Input
                      label="Deposit Amount"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setAmount(value);
                          setErrMessage("");
                        }
                      }}
                      placeholder="Enter amount"
                      name="amount"
                      type="num_select"
                      num_select_placeholder={currency}
                    />
                    {amount && (
                      <p
                        className={`text-xs mt-1 ${pageClasses["label-text"]}`}
                      >
                        Amount: {currency} {formatNumber(amount)}
                      </p>
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div
                    className={`${pageClasses["info-bg"]} rounded-lg p-2 space-y-1 border ${pageClasses["info-border"]}`}
                  >
                    <div className="flex justify-between text-xs">
                      <span className={pageClasses["balance-text"]}>
                        Recipient:
                      </span>
                      <span
                        className={`${pageClasses["form-text"]} font-medium`}
                      >
                        {selectedUser.username}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={pageClasses["balance-text"]}>
                        New Balance:
                      </span>
                      <span
                        className={`${pageClasses["balance-value"]} font-medium`}
                      >
                        <CurrencyFormatter
                          amount={
                            (selectedUser.balance || 0) + (Number(amount) || 0)
                          }
                          className=""
                          spanClassName=""
                        />
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errMessage && (
                    <div
                      className={`p-2.5 ${pageClasses["warning-bg"]} border ${pageClasses["warning-border"]} rounded-lg`}
                    >
                      <p className={`${pageClasses["warning-text"]} text-xs`}>
                        {errMessage}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-0.5">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        !selectedUser ||
                        !amount ||
                        Number(amount) <= 0
                      }
                      className={`flex-1 h-9 ${classes["button-proceed-bg"]} ${classes["button-proceed-border"]} ${classes["button-proceed-hover"]} ${classes["button-proceed-text"]} text-xs font-medium rounded-md rounded-r-none h-9 transition-all shadow-md py-2 px-4  duration-200 flex items-center justify-center gap-2 `}
                    >
                      {isLoading ? (
                        <>
                          <Loader size={14} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wallet size={14} />
                          Complete Deposit
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerId("");
                        setAmount("");
                        setSelectedUser(null);
                        setUsersList([]);
                        setShowDropdown(false);
                        setErrMessage("");
                      }}
                      className={`px-4 h-9 py-2 ${classes["button-secondary-bg"]} ${classes["button-secondary-hover"]} ${classes["button-secondary-text"]} rounded-l-none h-9 border font-medium rounded-md transition-all ${classes["button-secondary-border"]} shadow text-xs rounded-lg transition-colors duration-200`}
                    >
                      Reset
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Security Notice */}
            <div
              className={`p-2 ${pageClasses["security-bg"]} border ${pageClasses["security-border"]} rounded-lg`}
            >
              <div
                className={`flex items-center gap-2 ${pageClasses["security-text"]} text-[11px]`}
              >
                <Shield size={12} />
                <span>
                  All transactions are secured and tracked for compliance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineDepositPage;
