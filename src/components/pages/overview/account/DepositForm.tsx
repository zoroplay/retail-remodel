"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, DollarSign, Shield, Clock } from "lucide-react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { useInitializeTransactionMutation } from "../../../../store/services/wallet.service";
import environmentConfig, {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../../store/services/configs/environment.config";
import Input from "@/components/inputs/Input";
import { getClientTheme } from "@/config/theme.config";
import Spinner from "@/components/layouts/Spinner";
import { showToast } from "@/components/tools/toast";

const DepositForm = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.deposit_page;
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");

  const { user } = useAppSelector((state) => state.user);
  const { global_variables } = useAppSelector((state) => state.app);

  const [initializeTransaction, { isLoading }] =
    useInitializeTransactionMutation();

  const clientId = environmentConfig.CLIENT_ID;
  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  // Get provider display information
  const getProviderInfo = (providerName: string) => {
    const providerMap: Record<
      string,
      { name: string; image: string; color: string }
    > = {
      paystack: {
        name: "Paystack",
        image: "/images/paystack.png",
        color: "from-blue-500 to-cyan-500",
      },
      opay: {
        name: "OPay",
        image: "/images/opay.png",
        color: "from-green-500 to-emerald-500",
      },
      flutterwave: {
        name: "Flutterwave",
        image: "/images/flutterwave.png",
        color: "from-orange-500 to-yellow-500",
      },
      korapay: {
        name: "KoraPay",
        image: "/images/korapay.png",
        color: "from-purple-500 to-pink-500",
      },
      mgurush: {
        name: "mGurush",
        image: "/images/mgurush.png",
        color: "from-red-500 to-orange-500",
      },
      pawapay: {
        name: "PawaPay",
        image: "/images/pawapay.png",
        color: "from-indigo-500 to-purple-500",
      },
      palmpay: {
        name: "PalmPay",
        image: "/images/palmpay.png",
        color: "from-teal-500 to-green-500",
      },
      mtnmomo: {
        name: "MTN MoMo",
        image: "/images/mtnmomo.png",
        color: "from-yellow-500 to-orange-500",
      },
      tigo: {
        name: "Tigo",
        image: "/images/tigo.png",
        color: "from-blue-500 to-purple-500",
      },
    };

    return (
      providerMap[providerName] || {
        name: providerName?.toUpperCase() || "Unknown",
        image: "/images/default-payment.png",
        color: "from-gray-500 to-gray-600",
      }
    );
  };

  const providerInfo = getProviderInfo(provider || "");
  const minDeposit = Number(global_variables?.min_deposit || 1000);
  const currency = global_variables?.currency || "NGN";

  // Quick amount selection
  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const updateAmount = (value: number) => {
    if (value === 0) {
      setAmount("0");
      return;
    }
    const currentAmount = Number(amount) || 0;
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(amount);

    // Validation
    if (!amountNum || amountNum < minDeposit) {
      showToast({
        type: "error",
        title: `Minimum deposit amount is ${currency} ${formatNumber(
          minDeposit
        )}`,
      });

      return;
    }

    if (amountNum > 1000000) {
      showToast({
        type: "error",
        title: "Maximum deposit amount is NGN 1,000,000",
      });
      return;
    }

    if (!provider) {
      showToast({
        type: "error",
        title: "Payment method not selected",
      });
      return;
    }

    try {
      const result = await initializeTransaction({
        amount: amountNum,
        paymentMethod: provider,
        clientId,
      }).unwrap();

      if (result.success && result.data.link) {
        // Redirect to payment gateway
        window.location.href = result.data.link;
      } else {
        showToast({
          type: "error",
          title: result.message || "Failed to initialize transaction",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: error.data?.message || "An error occurred. Please try again.",
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`${pageClasses["page-bg"]} ${pageClasses["page-text"]}`}>
      <div className="p-2 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <button
            onClick={handleGoBack}
            className={`p-2 ${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} rounded-lg transition-colors backdrop-blur-sm border ${pageClasses["form-border"]}`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className={`text-base font-bold ${pageClasses["form-text"]}`}>
              Deposit Funds
            </h1>
            <p className={`text-xs ${pageClasses["label-text"]}`}>
              Complete your deposit using {providerInfo.name}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          {/* Left Side - Instructions */}
          <div
            className={`${pageClasses["form-bg"]} backdrop-blur-sm rounded-lg p-2 border ${pageClasses["form-border"]}`}
          >
            <h2
              className={`text-sm font-semibold mb-3 flex items-center gap-2 ${pageClasses["form-text"]}`}
            >
              <Shield
                className={pageClasses["button-primary-text"]}
                size={18}
              />
              How to Fund Your Wallet
            </h2>

            <div className="space-y-2.5">
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  1
                </div>
                <p
                  className={`${pageClasses["label-text"]} text-xs leading-relaxed`}
                >
                  Enter your desired deposit amount
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  2
                </div>
                <p
                  className={`${pageClasses["label-text"]} text-xs leading-relaxed`}
                >
                  Click "Make Payment" to proceed
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  3
                </div>
                <p
                  className={`${pageClasses["label-text"]} text-xs leading-relaxed`}
                >
                  Enter your bank account/card details
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  4
                </div>
                <p
                  className={`${pageClasses["label-text"]} text-xs leading-relaxed`}
                >
                  Enter your PIN and OTP when prompted
                </p>
              </div>
              <div className="flex gap-2.5">
                <div
                  className={`w-6 h-6 ${pageClasses["button-primary-bg"]} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  5
                </div>
                <p
                  className={`${pageClasses["label-text"]} text-xs leading-relaxed`}
                >
                  Confirm your details and complete payment
                </p>
              </div>
            </div>

            <div
              className={`mt-4 p-3 ${pageClasses["warning-bg"]} border ${pageClasses["warning-border"]} rounded-lg`}
            >
              <div
                className={`flex items-center gap-2 ${pageClasses["warning-text"]} mb-1.5`}
              >
                <Clock size={16} />
                <span className="font-semibold text-xs">Important Note</span>
              </div>
              <p
                className={`${pageClasses["warning-text"]} text-xs leading-relaxed`}
              >
                Transaction will expire in 30 minutes. If you're unable to
                complete the payment within this duration, please re-initiate
                the deposit.
              </p>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div
            className={`${pageClasses["form-bg"]} backdrop-blur-sm rounded-lg p-2 border flex flex-col gap-2 ${pageClasses["form-border"]}`}
          >
            {/* Provider Header */}
            <div
              className={`bg-gradient-to-r ${providerInfo.color} p-2 rounded-lg`}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <img
                      src={providerInfo.image}
                      alt={providerInfo.name}
                      className="w-7 h-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<CreditCard size={18} />`;
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {providerInfo.name}
                    </h3>
                    <p className="text-white/80 text-xs">
                      Card/Bank • Instant Credit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div
              className={`${pageClasses["info-bg"]} rounded-lg p-2 border relative ${pageClasses["info-border"]} flex flex-col gap-1`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs ${pageClasses["balance-text"]}`}>
                  Current Balance:
                </span>
                <span
                  className={`text-base font-bold ${pageClasses["balance-value"]}`}
                >
                  {currency}{" "}
                  {formatNumber(user?.availableBalance || user?.balance || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${pageClasses["balance-text"]}`}>
                  Email:
                </span>
                <span className={`text-xs ${pageClasses["form-text"]}`}>
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Quick Amount Selection */}
            <div className="flex flex-col gap-1">
              <label
                className={`block text-xs font-semibold ${pageClasses["form-text"]}`}
              >
                Quick Amount Selection
              </label>
              <div className="grid grid-cols-5 gap-1">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => updateAmount(quickAmount)}
                    className={`${pageClasses["quick-button-bg"]} ${pageClasses["quick-button-hover"]} border ${pageClasses["quick-button-border"]} ${pageClasses["quick-button-text"]} text-xs py-1.5 pb-1 rounded-md transition-all duration-200 hover:scale-105`}
                  >
                    +₦{formatNumber(quickAmount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <div className={`relative ${pageClasses["form-text"]}`}>
                  {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs font-medium">
                    {currency}
                  </span> */}
                  <Input
                    label="Deposit Amount"
                    // type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={`Min ${formatNumber(minDeposit)}`}
                    // className="w-full pl-14 pr-4 py-2 h-[32px] bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                    // autoComplete="off"
                    name={""}
                    bg_color={classes["input-bg"]}
                    text_color={classes["input-text"]}
                    border_color={`border ${classes["input-border"]}`}
                    height={"h-[36px]"}
                    className={`w-full rounded-lg ${classes["input-text"]} transition-all duration-200`}
                    type="num_select"
                    num_select_placeholder={"NGN"}
                  />
                </div>
                {amount && (
                  <p className={`text-xs mt-1 ${pageClasses["label-text"]}`}>
                    Amount: {currency} {formatNumber(amount)}
                  </p>
                )}
              </div>

              {/* Transaction Details */}
              <div
                className={`${pageClasses["info-bg"]} rounded-lg p-2 space-y-1 border ${pageClasses["info-border"]}`}
              >
                <div className="flex justify-between text-xs">
                  <span className={pageClasses["balance-text"]}>Fees:</span>
                  <span
                    className={`${pageClasses["balance-value"]} font-medium`}
                  >
                    None
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={pageClasses["balance-text"]}>
                    Minimum Deposit:
                  </span>
                  <span className={`${pageClasses["form-text"]} font-medium`}>
                    {currency} {formatNumber(minDeposit)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={pageClasses["balance-text"]}>Currency:</span>
                  <span className={`${pageClasses["form-text"]} font-medium`}>
                    {currency}
                  </span>
                </div>
              </div>

              {isLoading && <Spinner />}
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !amount || Number(amount) < minDeposit}
                  className={`flex-1  disabled:opacity-50 disabled:cursor-not-allowed py-2 ${classes["button-primary-bg"]} ${classes["button-primary-border"]} ${classes["button-primary-hover"]} ${classes["button-primary-text"]} font-medium rounded-md transition-all shadow-md border py-2 px-4  duration-200 flex items-center justify-center gap-2 text-xs `}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Make Payment
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGoBack}
                  className={`px-4 py-2 ${classes["button-secondary-bg"]} ${classes["button-secondary-hover"]} ${classes["button-secondary-text"]} border font-medium rounded-md transition-all ${classes["button-secondary-border"]} shadow text-xs rounded-lg transition-colors duration-200`}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div
              className={`p-2 ${pageClasses["security-bg"]} border ${pageClasses["security-border"]} rounded-lg`}
            >
              <div
                className={`flex items-center gap-2 ${pageClasses["security-text"]} text-[11px]`}
              >
                <Shield size={12} />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
