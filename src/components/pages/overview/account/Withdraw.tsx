"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Building2,
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  Info,
  Clock,
} from "lucide-react";
import { getClientTheme } from "@/config/theme.config";
import { useAppSelector } from "@/hooks/useAppDispatch";
import environmentConfig from "@/store/services/configs/environment.config";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import SearchSelect from "@/components/inputs/SearchSelect";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import { useWithdrawal } from "@/hooks/useWithdrawal";

interface WithdrawalInputObject {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  type: string;
  source: string;
  clientId: string;
}

const BankWithdrawal = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.deposit_page;
  const { user } = useAppSelector((state) => state.user);
  const { global_variables } = useAppSelector((state) => state.app);
  const navigate = useNavigate();

  const clientId = environmentConfig.CLIENT_ID;
  const currency = global_variables?.currency || "NGN";

  const [verified, setVerified] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [amount, setAmount] = useState<string>("");

  // Use withdrawal hook
  const {
    banks,
    banksLoading,
    verificationData,
    verifyLoading,
    withdrawalLoading,
    verifyBankAccount,
    submitBankWithdrawal,
  } = useWithdrawal();

  const [inputObject, setInputObject] = useState<WithdrawalInputObject>({
    amount: 0,
    bankCode: "",
    accountNumber: "",
    accountName: "",
    type: "online",
    source: "retail",
    clientId: clientId,
  });

  // Format number with commas
  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    return Number(num).toLocaleString();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setInputObject({
      ...inputObject,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      setInputObject({ ...inputObject, amount: Number(value) || 0 });
      setErrMessage("");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const updateAmount = (value: number) => {
    if (value === 0) {
      setAmount("0");
      setInputObject({ ...inputObject, amount: 0 });
      return;
    }
    const currentAmount = Number(amount) || 0;
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
    setInputObject({ ...inputObject, amount: newAmount });
  };

  // Quick amount selection
  const quickAmounts = [100, 200, 500, 1000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(amount);

    // Validation
    if (!amountNum || amountNum < 100) {
      setErrMessage("Minimum withdrawal amount is ₦100");
      return;
    }

    if (!inputObject.bankCode) {
      setErrMessage("Please select a bank");
      return;
    }

    if (!inputObject.accountNumber || inputObject.accountNumber.length !== 10) {
      setErrMessage("Please enter a valid 10-digit account number");
      return;
    }

    if (!verified || !inputObject.accountName) {
      setErrMessage("Please verify your account number first");
      return;
    }

    setErrMessage("");
    try {
      await submitBankWithdrawal({
        amount: inputObject.amount,
        bankCode: inputObject.bankCode,
        accountNumber: inputObject.accountNumber,
        accountName: inputObject.accountName,
        type: inputObject.type,
        source: inputObject.source,
      });

      // Reset form
      setAmount("0");
      setInputObject({
        amount: 0,
        bankCode: "",
        accountNumber: "",
        accountName: "",
        type: "online",
        source: "retail",
        clientId: clientId,
      });
      setVerified(false);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Error occurred during withdrawal";
      setErrMessage(errorMsg);
    }
  };

  const doVerify = async (accountNumber: string) => {
    if (!inputObject.bankCode) {
      setErrMessage("Please select a bank first");
      return;
    }

    if (accountNumber.length !== 10) {
      return;
    }

    setErrMessage("");
    try {
      const result = await verifyBankAccount(
        accountNumber,
        inputObject.bankCode
      );

      setVerified(true);
      // setVerificationData(result);
      setInputObject({
        ...inputObject,
        accountName: result.message, // The API returns account name in message
        accountNumber,
      });
    } catch (err: any) {
      setVerified(false);
      // setVerificationData(null);
      setInputObject({ ...inputObject, accountName: "", accountNumber });
      const errorMsg =
        err?.data?.message || err?.message || "Failed to verify account";
      setErrMessage(errorMsg);
    }
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
              Withdraw Funds
            </h1>
            <p className={`text-xs ${pageClasses["label-text"]}`}>
              Withdraw funds to your bank account
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 justify-center items-start">
          {/* Left Side - Instructions */}
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}  backdrop-blur-sm rounded-lg p-2 border `}
          >
            <h2
              className={`text-sm font-semibold mb-3 flex items-center gap-2 ${pageClasses["form-text"]}`}
            >
              <Shield
                className={pageClasses["button-primary-text"]}
                size={18}
              />
              Important Information
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
                  For easier and faster process verification, please ensure your
                  bank account information matches the details in your account.
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
                  In line with regulations, winnings above{" "}
                  <strong>₦400,000</strong> require a valid means of ID for your
                  withdrawal to be processed promptly.
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
                  Minimum withdrawal amount is <strong>₦100</strong>
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
                  Account details are verified automatically after entering
                  10-digit account number
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
                <span className="font-semibold text-xs">Processing Time</span>
              </div>
              <p
                className={`${pageClasses["warning-text"]} text-xs leading-relaxed`}
              >
                Withdrawals are typically processed within 24-48 hours. Please
                ensure all account details are correct before submitting.
              </p>
            </div>
          </div>

          {/* Right Side - Withdrawal Form */}
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}  backdrop-blur-sm rounded-lg p-2 border flex flex-col gap-2`}
          >
            {/* User Info */}
            <div
              className={`${pageClasses["info-bg"]} rounded-lg p-2 border ${pageClasses["info-border"]} flex flex-col gap-1`}
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
                    +₦{formatNumber(quickAmount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {/* Amount Input */}
              <div>
                <Input
                  label="Withdrawal Amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Min 100"
                  name="amount"
                  bg_color={classes["input-bg"]}
                  text_color={classes["input-text"]}
                  border_color={`border ${classes["input-border"]}`}
                  height="h-[36px]"
                  className={`w-full rounded-lg ${classes["input-text"]} transition-all duration-200`}
                  type="num_select"
                  num_select_placeholder="NGN"
                />
                {amount && (
                  <p className={`text-xs mt-1 ${pageClasses["label-text"]}`}>
                    Amount: {currency} {formatNumber(amount)}
                  </p>
                )}
              </div>

              {/* Bank Selection */}
              <div>
                <SearchSelect
                  label="Select Bank"
                  value={[inputObject.bankCode]}
                  isLoading={banksLoading}
                  options={banks.map((bank: any) => ({
                    id: bank.code,
                    name: bank.name,
                  }))}
                  onChange={(e) => {
                    // Reset verification when bank changes
                    setVerified(false);
                    setInputObject((prev) => ({
                      ...prev,
                      bankCode: e[0] as string,
                      accountName: "",
                    }));
                  }}
                  height={"h-[36px]"}
                  placeholder={""} // className="w-full"
                  bg_color={classes["input-bg"]}
                  border_color={`border ${classes["input-border"]}`}
                  className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                />
              </div>

              {/* Account Number */}
              <div>
                <SingleSearchInput
                  label="Account Number"
                  value={inputObject.accountNumber}
                  onChange={(e) => {
                    handleChange(e);
                    setVerified(false);
                    setErrMessage("");
                    if (e.target.value.length === 10) {
                      doVerify(e.target.value);
                    }
                  }}
                  searchState={{
                    isValid: false,
                    isNotFound: verificationData?.success === false,
                    isLoading: verifyLoading,
                    message: "",
                  }}
                  onSearch={() => {}}
                  placeholder="Enter 10-digit account number"
                  name={"accountNumber"}
                  bg_color={classes["input-bg"]}
                  text_color={classes["input-text"]}
                  border_color={`border ${classes["input-border"]}`}
                  height={"h-[36px]"}
                  className={`w-full rounded-lg ${classes["input-text"]} transition-all duration-200`}
                />
              </div>

              {/* Account Name */}
              <div className="relative">
                <Input
                  label="Account Name"
                  value={inputObject.accountName}
                  onChange={() => {}}
                  placeholder="Account name will appear after verification"
                  disabled
                  name={"accountName"}
                  bg_color={classes["input-bg"]}
                  text_color={classes["input-text"]}
                  border_color={`border ${classes["input-border"]}`}
                  height={"h-[36px]"}
                  className={`w-full rounded-lg ${classes["input-text"]} transition-all duration-200`}
                />
                {verified && inputObject.accountName && (
                  <CheckCircle
                    size={16}
                    className={`absolute right-3 top-[35px] ${pageClasses["balance-value"]}`}
                  />
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
                    Minimum Withdrawal:
                  </span>
                  <span className={`${pageClasses["form-text"]} font-medium`}>
                    {currency} 100
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={pageClasses["balance-text"]}>
                    Processing Time:
                  </span>
                  <span className={`${pageClasses["form-text"]} font-medium`}>
                    24-48 hours
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
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={
                    withdrawalLoading ||
                    !verified ||
                    !amount ||
                    Number(amount) < 100
                  }
                  className={`flex-1 ${classes["button-proceed-bg"]} ${classes["button-proceed-hover"]} disabled:opacity-50 disabled:cursor-not-allowed ${classes["button-proceed-text"]} font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-xs shadow-lg`}
                >
                  {withdrawalLoading ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet size={14} />
                      Submit Withdrawal
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGoBack}
                  className={`px-4 py-2.5 ${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} border ${pageClasses["quick-button-border"]} ${pageClasses["button-secondary-text"]} text-xs rounded-lg transition-colors duration-200`}
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
                <span>
                  Your withdrawal is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankWithdrawal;
