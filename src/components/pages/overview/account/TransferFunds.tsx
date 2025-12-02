import React, { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/useAppDispatch";
import { useParams } from "react-router-dom";
import {
  ArrowRightLeft,
  Search,
  Loader,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Wallet,
} from "lucide-react";
import Input from "../../../inputs/Input";
import { useGetAgentUsersQuery } from "../../../../store/services/user.service";
import { environmentConfig } from "../../../../store/services/configs/environment.config";
import { getClientTheme } from "@/config/theme.config";
import { useTransferFundsMutation } from "@/store/services/wallet.service";
import { showToast } from "@/components/tools/toast";
import { setUserRerender } from "@/store/features/slice/user.slice";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import PaginatedTable from "@/components/common/PaginatedTable";

interface TransferFormData {
  fromUserId: number;
  fromUsername: string;
  toUsername: string;
  toUserId: number;
  amount: string;
  description: string;
  type: string;
  action: "deposit" | "withdraw";
}

const TransferFunds = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const { type } = useParams<{ type: string }>();
  const { user } = useAppSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const dispatch = useAppDispatch();
  const [sendFund, { isLoading: is_sending, isSuccess }] =
    useTransferFundsMutation();
  const [formData, setFormData] = useState<TransferFormData>({
    fromUserId: user?.id || 0,
    fromUsername: user?.username || "",
    toUsername: "",
    toUserId: 0,
    amount: "",
    description: type === "internal" ? "" : `Credit to user ${user?.username}`,
    type: type === "internal" ? "internal" : "external",
    action: "deposit",
  });

  const { data, isLoading } = useGetAgentUsersQuery(
    {
      agentId: user?.id || 0,
    },
    {
      skip: !user?.id,
    }
  );

  const users = data?.data || [];

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchText.toLowerCase())
  );
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        fromUserId: user?.id || 0,
        fromUsername: user?.username || "",
        toUsername: "",
        toUserId: 0,
        amount: "",
        description:
          type === "internal" ? "" : `Credit to user ${user?.username}`,
        type: type === "internal" ? "internal" : "external",
        action: "deposit",
      });
    }
    dispatch(setUserRerender());
  }, [isSuccess]);
  const handleTransfer = (targetUser: any, isWithdraw: boolean) => {
    if (isWithdraw) {
      // Withdraw from selected user to current user
      setFormData({
        ...formData,
        toUserId: user?.id || 0,
        toUsername: user?.username || "",
        fromUserId: targetUser.id,
        fromUsername: targetUser.username,
        action: "withdraw",
      });
    } else {
      // Deposit from current user to selected user
      setFormData({
        ...formData,
        toUserId: targetUser.id,
        toUsername: targetUser.username,
        fromUserId: user?.id || 0,
        fromUsername: user?.username || "",
        action: "deposit",
      });
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast({ type: "error", title: "Please enter a valid amount" });
      return;
    }

    if (!formData.toUsername) {
      showToast({ type: "error", title: "Please select a user" });
      return;
    }

    try {
      // Replace with actual API call
      const response = await sendFund({
        fromUserId: formData?.fromUserId || 0,
        fromUsername: formData?.fromUsername || "",
        toUsername: formData.toUsername,
        toUserId: formData.toUserId,
        amount: Number(formData.amount),
        description:
          type === "internal" ? "" : `Credit to user ${user?.username}`,
        type: type === "internal" ? "internal" : "external",
        action: "deposit",
      }).unwrap();

      showToast({
        type: "success",
        title: "Transaction was completed successfully",
      });
    } catch (error: any) {
      showToast({
        type: "error",
        title: error?.message || "Internal server error!",
      });
    }
  };

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${classes["text-primary"]}`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <ArrowRightLeft
              size={20}
              className={pageClasses["header-icon-text"]}
            />
          </div>
          <div>
            <h1 className={`text-base font-bold `}>
              Transfer Funds to{" "}
              {type === "internal" ? "Cashier/Player" : "External Account"}
            </h1>
            <p className={`${classes["text-secondary"]} text-xs`}>
              Send or receive funds from users
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-4 justify-start items-start">
          {/* User List */}
          <div
            className={`backdrop-blur-sm rounded-lg border ${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}`}
          >
            <div className="p-2 px-3">
              <Input
                label="Search Users"
                name="search"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by username..."
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
              />
            </div>
            <PaginatedTable
              columns={[
                {
                  id: "name",
                  name: "Name",
                  className: "col-span-2",
                },

                {
                  id: "balance",
                  name: "Balance",
                },
                {
                  id: "actions",
                  name: "Actions",
                  render: (_: any, row: any) => (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleTransfer(row.user, true)}
                        className={`p-1.5 ${pageClasses["button-action-withdraw-bg"]} ${pageClasses["button-action-withdraw-hover"]} ${pageClasses["button-action-withdraw-text"]} rounded transition-colors`}
                        title="Withdraw from user"
                      >
                        <ArrowDownLeft size={16} />
                      </button>
                      <button
                        onClick={() => handleTransfer(row.user, false)}
                        className={`p-1.5 ${pageClasses["button-action-deposit-bg"]} ${pageClasses["button-action-deposit-hover"]} ${pageClasses["button-action-deposit-text"]} rounded transition-colors`}
                        title="Deposit to user"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  ),
                },
              ]}
              className="grid-cols-4"
              data={filteredUsers.map((user) => ({
                id: user.id,
                name: user.username,
                user: user,
                balance: (
                  <CurrencyFormatter
                    amount={user.balance || 0}
                    className={""}
                    spanClassName={""}
                  />
                ),
              }))}
              isLoading={isLoading}
            />
          </div>

          {/* Transfer Form */}
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg border p-4`}
          >
            <h3
              className={`text-sm font-semibold border-b ${classes["border"]} pb-2 mb-4`}
            >
              Transfer Details
            </h3>

            <form onSubmit={submitTransfer} className="space-y-3">
              <Input
                label="From User"
                name="fromUsername"
                type="text"
                value={formData.fromUsername}
                onChange={handleChange}
                placeholder="From username"
                disabled
              />

              <Input
                label="To User"
                name="toUsername"
                type="text"
                value={formData.toUsername}
                onChange={handleChange}
                placeholder="To username"
                disabled
              />

              <Input
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                type="num_select"
                num_select_placeholder={user?.currency}
              />

              <Input
                label="Description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description (optional)"
              />

              <div className="pt-2">
                <div
                  className={`${classes.deposit_page["info-bg"]} rounded-lg p-2 mb-3 border ${classes.deposit_page["info-border"]}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={classes["text-secondary"]}>
                      Transfer Type:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        formData.action === "deposit"
                          ? `${pageClasses["badge-deposit-bg"]} ${pageClasses["badge-deposit-text"]}`
                          : `${pageClasses["badge-withdraw-bg"]} ${pageClasses["badge-withdraw-text"]}`
                      }`}
                    >
                      {formData.action === "deposit" ? "Deposit" : "Withdraw"}
                    </span>
                  </div>
                  {formData.toUsername && (
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className={classes["text-secondary"]}>
                        Selected User:
                      </span>
                      <span className={`font-medium`}>
                        {formData.toUsername}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={is_sending || !formData.toUsername}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${classes["button-proceed-bg"]} ${classes["button-proceed-border"]} ${classes["button-proceed-hover"]} ${classes["button-proceed-text"]} text-xs font-medium rounded-md transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {is_sending ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet size={16} />
                      Transfer Funds
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferFunds;
