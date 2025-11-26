import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Key,
  Save,
  X,
} from "lucide-react";
import { useModal } from "../../../../hooks/useModal";
import { MODAL_COMPONENTS } from "../../../../store/features/types";
import { toast } from "sonner";
import Input from "../../../inputs/Input";
import Select from "@/components/inputs/Select";
import DateInput from "@/components/inputs/DateInput";
import { getClientTheme } from "@/config/theme.config";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";

interface PersonalData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  balance: number;
}

const Profile = () => {
  const { user } = useAppSelector((state) => state.user);
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock personal data - replace with actual API call
  const [personalData, setPersonalData] = useState<PersonalData>({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phone || "",
    dateOfBirth: "",
    gender: user?.gender || "",
    balance: user?.availableBalance ?? 0,
  });
  console.log("Personal Data:", user);

  const [originalData, setOriginalData] = useState<PersonalData>(personalData);

  useEffect(() => {
    // Fetch personal data
    fetchPersonalData();
  }, []);

  const fetchPersonalData = useCallback(() => {
    // TODO: Replace with actual API call
    // Example: getPersonalData().then(res => setPersonalData(res.data))
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalData({ ...personalData, [name]: value });
  };

  const handleSave = () => {
    setIsLoading(true);

    // TODO: Replace with actual API call
    // updatePersonalData(personalData).then(res => {
    //   if (res.success) {
    //     toast.success("Profile updated successfully");
    //     setOriginalData(personalData);
    //     setIsEditing(false);
    //   }
    // })

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
      setOriginalData(personalData);
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    setPersonalData(originalData);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };
  const { classes } = getClientTheme();

  const pageClasses = classes.account_page;

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${pageClasses["container-bg"]}`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <h1
                className={`text-base font-bold ${pageClasses["header-text"]}`}
              >
                Profile & Settings
              </h1>
              <p className={`${pageClasses["subtitle-text"]} text-xs`}>
                Manage your account information and security
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div
          className={`${pageClasses["card-bg"]} backdrop-blur-sm rounded-lg border ${pageClasses["card-border"]} p-4 flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between pb-2">
            {/* <div className="space-y-3"> */}
            <h3
              className={`text-xs font-semibold ${pageClasses["section-header-text"]} border-b ${pageClasses["section-header-border"]} pb-2`}
            >
              Personal Information
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  openModal({
                    modal_name: MODAL_COMPONENTS.CHANGE_PASSWORD,
                    title: "Change Password",
                  })
                }
                className={`flex items-center gap-2 px-3 py-1.5 ${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} text-[11px] font-medium rounded-lg transition-all shadow-lg`}
              >
                <Key size={14} />
                Change Password
              </button>
            </div>
          </div>

          <div
            className={`grid md:grid-cols-2 gap-4 ${pageClasses["input-text"]}`}
          >
            {/* Left Column */}
            <div className="space-y-3">
              <Input
                label="Username"
                name="username"
                type="text"
                value={personalData.username}
                onChange={handleInputChange}
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                placeholder={""}
              />

              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={personalData.firstName}
                onChange={handleInputChange}
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                placeholder={""}
              />
              <Input
                label="Phone"
                name="phoneNumber"
                type="text"
                value={personalData.phoneNumber}
                onChange={handleInputChange}
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                placeholder={""}
              />
              <DateInput
                label="Date of Birth"
                name="dateOfBirth"
                value={personalData.dateOfBirth as unknown as Date}
                onChange={(e) =>
                  setPersonalData({
                    ...personalData,
                    dateOfBirth: e.target.value,
                  })
                }
                height="h-[44px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                placeholder={""}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <Input
                label="Email"
                name="email"
                type="email"
                value={personalData.email}
                onChange={handleInputChange}
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                placeholder={""}
              />

              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={personalData.lastName}
                onChange={handleInputChange}
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                placeholder={""}
              />
              <Select
                label="Gender"
                value={[personalData.gender]}
                options={[
                  { id: "Male", name: "Male" },
                  { id: "Female", name: "Female" },
                ]}
                onChange={(e) =>
                  setPersonalData({
                    ...personalData,
                    gender: e[0] as string,
                  })
                }
                placeholder={""} // className="w-full"
                height="h-[40px]"
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
              />
            </div>
          </div>

          {/* Balance Card */}
          <div
            className={`mt-4 ${pageClasses["balance-card-bg"]} border ${pageClasses["balance-card-border"]} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div
                    className={`text-xs ${pageClasses["balance-label-text"]}`}
                  >
                    Account Balance
                  </div>
                  <div
                    className={`text-xl font-bold ${pageClasses["balance-value-text"]}`}
                  >
                    <CurrencyFormatter
                      amount={personalData.balance}
                      className={""}
                      spanClassName={""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
