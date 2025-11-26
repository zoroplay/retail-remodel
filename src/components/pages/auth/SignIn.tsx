import { useCallback, useEffect, useState } from "react";
import Input from "../../inputs/Input";
import Button from "../../buttons/Button";
import { showToast } from "../../tools/toast";
import { OVERVIEW } from "../../../data/routes/routes";
import { Link, useNavigate } from "react-router-dom";
import {
  ENVIRONMENT_VARIABLES,
  getEnvironmentVariable,
} from "../../../store/services/configs/environment.config";
import { useLoginMutation } from "../../../store/services/auth.service";
import { Antenna, BookA, BookUser } from "lucide-react";
import { useFindCouponMutation } from "@/store/services/bets.service";
import { FindCouponResponse } from "@/store/services/data/betting.types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useModal } from "@/hooks/useModal";
import { MODAL_COMPONENTS } from "@/store/features/types/modal.types";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import { setCouponData } from "@/store/features/slice/fixtures.slice";
// import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

// StatusBar not used on web

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [searchData, setSearchData] = useState({
    searchTerm: "",
  });
  const { openModal } = useModal();
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const dispatch = useAppDispatch();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();
  const [findCoupon, { isLoading: isFindingCoupon }] = useFindCouponMutation();
  // const { user } = useAppSelector((state: any) => state.user);
  const [login, { isLoading, isSuccess, isError, data, error }] =
    useLoginMutation();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCouponChange = (field: string, value: string) => {
    // setCouponData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCouponCheck = () => {
    // if (!couponData.couponCode.trim()) {
    //   showToast({
    //     type: "error",
    //     title: "Invalid Input",
    //     description: "Please enter a coupon code",
    //   });
    //   return;
    // }
    // showToast({
    //   type: "info",
    //   title: "Checking Coupon",
    //   description: `Verifying coupon: ${couponData.couponCode}`,
    // });
    // Add actual coupon check logic here
  };

  const handleOddsSearch = () => {
    if (!searchData.searchTerm.trim()) {
      showToast({
        type: "error",
        title: "Invalid Input",
        description: "Please enter a search term",
      });
      return;
    }

    showToast({
      type: "info",
      title: "Searching Odds",
      description: `Searching for: ${searchData.searchTerm}`,
    });
    // Add actual odds search logic here
  };

  const handleLogin = async () => {
    try {
      const newErrors: Record<string, string | null> = {};

      // Validate email
      if (!formData.username) {
        newErrors.username = "Username is required";
      }

      // Validate password
      // const passwordError = Validators.validatePassword(formData.password);
      // if (passwordError) {
      //   newErrors.password = passwordError;
      // }

      if (!formData.password) {
        newErrors.password = "Password is required";
      }

      setErrors(newErrors);
      if (Object.values(newErrors).some((error) => error)) {
        return;
      }

      await login({
        username: formData.username,
        password: formData.password,
        clientId: Number(
          getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) ?? 0
        ),
      }).unwrap();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error?.message ||
        "Network error. Please check your connection.";
      showToast({
        type: "error",
        title: "Login Failed",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {

      if (data?.success) {
        showToast({
          type: "error",
          title: "Welcome back!",
          description: `Good to see you, ${data?.data?.username}`,
        });
        navigate(OVERVIEW.HOME);
      } else {
        showToast({
          type: "error",
          title: "Login Failed",
          description: data?.error,
        });
      }
    }
    if (isError) {
      showToast({
        type: "error",
        title: "Login Failed",
        description: "Invalid username or password",
      });
    }
  }, [isSuccess, isError, isLoading]);

  const top_links = [
    { title: "Book a bet", icon: BookUser, url: "" },
    { title: "Live Viewer", icon: Antenna, url: "" },
    { title: "Live Scores", icon: BookA, url: "" },
  ];

  const handleCouponCodeChange = useCallback(
    async (text: string) => {
      setCouponCode(text);

      if (text.length === 7) {
        try {
          const result = (await findCoupon({
            betslipId: text,
            clientId:
              getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) || "",
          })) as unknown as { data: FindCouponResponse };

          if (result.data && result.data.success) {
            dispatch(setCouponData(result.data.data));
            openModal({
              modal_name: MODAL_COMPONENTS.COUPON_DETAILS,
              title: `Betslip ${result.data.data.betslipId}`,
            });

            showToast({
              type: "success",
              title: "Coupon Found!",
              description: "Coupon details displayed",
            });
          }
        } catch (error) {
          console.error("Error checking coupon:", error);
          showToast({
            type: "error",
            title: "Error",
            description: "Failed to validate coupon code",
          });
        }
      }
    },
    [findCoupon, dispatch]
  );
  return (
    <div className="font-comfortaa h-[calc(100vh-110px)] ">
      {/* Quick Action Bar */}
      <div className=" border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-4">
            {top_links.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className="flex items-center gap-3 p-4  rounded-lg border border-gray-700 
                         hover:border-blue-700/20 hover:bg-blue-700/50 transition-all duration-200 group"
              >
                <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700/50">
                  <link.icon className="w-5 h-5 text-blue-300" />
                </div>
                <span className="font-medium text-gray-300 ">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Login Section - Left Side */}
          <div className="lg:col-span-5 relative">
            <div className=" rounded-lg border border-gray-700 shadow-sm">
              <div className="bg-blue-800 text-gray-300 p-2 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <BookUser className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">
                    Staff Authentication
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-5 text-gray-300">
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  required
                  error={errors.username}
                  bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                  text_color="text-gray-200"
                  border_color="border border-slate-600"
                  name="username"
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  password
                  required
                  error={errors.password}
                  bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                  text_color="text-gray-200"
                  border_color="border border-slate-600"
                  name="password"
                />

                <Button
                  title="Sign In"
                  onClick={handleLogin}
                  isLoading={isLoading}
                  fullWidth
                  size="lg"
                />

                <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
                  Secure access to betting terminal
                </div>
              </div>
            </div>
          </div>

          {/* Tools Section - Right Side */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-2">
              {/* Coupon Check */}
              <div className=" rounded-lg border border-gray-700 shadow-sm">
                <div className="bg-green-600 text-white p-2 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <BookA className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">
                      Coupon Verification
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <div className="flex-1">
                    <SingleSearchInput
                      label="Coupon Code"
                      placeholder="Enter 8-digit coupon code"
                      value={couponCode}
                      onChange={(e) => handleCouponCodeChange(e.target.value)}
                      bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                      text_color="text-gray-200"
                      border_color="border border-slate-600"
                      name="couponCode"
                      onSearch={() => {}}
                      searchState={{
                        isValid: false,
                        isNotFound: false,
                        isLoading: isFindingCoupon,
                        message: "",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 ">
                    Verify bet slip status, check winnings and payout
                    information
                  </p>
                </div>
              </div>

              {/* Odds Search */}
              <div className=" rounded-lg border border-gray-700 shadow-sm">
                <div className="bg-orange-600 text-white p-2 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Antenna className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Live Odds Search</h3>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <div className="flex-1">
                    <SingleSearchInput
                      label="Search Events"
                      placeholder="Team name, league, or sport"
                      value={searchData.searchTerm}
                      onChange={(e) =>
                        handleSearchChange("searchTerm", e.target.value)
                      }
                      bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
                      text_color="text-gray-200"
                      border_color="border border-slate-600"
                      name="searchTerm"
                      onSearch={() => {}}
                      searchState={{
                        isValid: false,
                        isNotFound: false,
                        isLoading: false,
                        message: "",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 ">
                    Find current odds, live events and betting markets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
