import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, Loader, Save, X } from "lucide-react";
import { environmentConfig } from "../../../../store/services/configs/environment.config";
import Input from "../../../inputs/Input";
import Select from "@/components/inputs/Select";
import DateInput from "@/components/inputs/DateInput";
import { getClientTheme } from "@/config/theme.config";

interface FormValues {
  country: string;
  state: string;
  language: string;
  currency: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  userType: string;
}

const NewUser = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const usertype = searchParams.get("usertype") || "cashier";
  const { user } = useAppSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    country: "160",
    state: "",
    language: "EN",
    currency: user?.currency || "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    userType: usertype,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.firstName.length < 3) {
      toast.error("First name must be at least 3 characters");
      return;
    }
    if (formData.lastName.length < 3) {
      toast.error("Last name must be at least 3 characters");
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (formData.password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Please enter phone number");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        ...formData,
        parentId: user?.id,
        roleId: usertype === "cashier" ? 12 : 13,
        clientId: Number(environmentConfig.CLIENT_ID),
      };

      // Replace with actual API call
      // const response = await addUser(data);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
          country: "160",
          state: "",
          language: "EN",
          currency: "NGN",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "Male",
          address: "",
          phoneNumber: "",
          email: "",
          username: "",
          password: "",
          userType: usertype,
        });
        toast.success("User details has been submitted successfully");
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`Something went wrong. Unable to save new ${usertype}!`);
    }
  };

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${pageClasses["page-bg"]} ${pageClasses["page-text"]}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <UserPlus size={24} className={pageClasses["header-icon-text"]} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${pageClasses["header-text"]}`}>
              New {usertype === "cashier" ? "Cashier" : "Player"}
            </h1>
            <p className={`${pageClasses["subtitle-text"]} text-xs`}>
              Create a new {usertype} account
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          className={`${pageClasses["card-bg"]} backdrop-blur-sm rounded-lg border ${pageClasses["card-border"]} p-4`}
        >
          <form onSubmit={submitForm} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-semibold ${pageClasses["section-header-text"]} border-b ${pageClasses["section-header-border"]} pb-2`}
              >
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <div>
                  <Select
                    label="Gender"
                    value={[formData.gender]}
                    options={[
                      { id: "male", name: "Male" },
                      { id: "female", name: "Female" },
                    ]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e[0] as string,
                      }))
                    }
                    placeholder={""}
                    bg_color={pageClasses["input-bg"]}
                    text_color={pageClasses["input-text"]}
                    border_color={`border ${pageClasses["input-border"]}`}
                    className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
                  />
                </div>

                {/* <DateInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth as unknown as Date}
                  onChange={handleChange}
                  placeholder="Select date"
                  height="h-[36px]"
                  bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                  text_color="text-gray-200"
                  border_color="border border-slate-600"
                  //   className="w-full  border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 transition-all disabled:opacity-50"
                /> */}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-semibold ${pageClasses["section-header-text"]} border-b ${pageClasses["section-header-border"]} pb-2`}
              >
                Contact Information
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  type="text"
                  phoneNumber
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                {/* <div className="md:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    height="h-[36px]"
                    bg_color="bg-slate-800"
                    border_color="border-slate-600"
                    text_color="text-white"
                  />
                </div> */}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-semibold ${pageClasses["section-header-text"]} border-b ${pageClasses["section-header-border"]} pb-2`}
              >
                Account Information
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  password
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <Input
                  label="Currency"
                  name="currency"
                  type="text"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="Currency"
                  disabled
                  bg_color={pageClasses["input-bg"]}
                  border_color={pageClasses["input-border"]}
                  text_color={pageClasses["input-text"]}
                />

                <div>
                  <Select
                    label="Language"
                    value={[formData.language]}
                    options={[{ id: "EN", name: "English" }]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language: e[0] as string,
                      }))
                    }
                    placeholder={""}
                    bg_color={pageClasses["input-bg"]}
                    text_color={pageClasses["input-text"]}
                    border_color={`border ${pageClasses["input-border"]}`}
                    className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-4 py-2 ${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} text-sm font-medium rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSubmitting ? "Saving..." : "Create User"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 px-4 py-2 ${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} ${pageClasses["button-secondary-text"]} text-sm font-medium rounded-lg transition-all`}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
