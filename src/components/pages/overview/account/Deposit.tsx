"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Shield,
  Zap,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useFetchPaymentMethodsQuery } from "../../../../store/services/wallet.service";
import { ACCOUNT, OVERVIEW } from "../../../../data/routes/routes";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../../store/services/configs/environment.config";
import { getClientTheme } from "../../../../config/theme.config";
import PaginatedTable from "@/components/common/PaginatedTable";

const Deposit = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.deposit_page;
  const navigate = useNavigate();
  const clientId = getEnvironmentVariable(
    ENVIRONMENT_VARIABLES.CLIENT_ID
  ) as string;

  const { data, error, isLoading } = useFetchPaymentMethodsQuery();
  const paymentMethods = data?.data || [];

  // Filter out 'sbengine' provider as shown in the original component
  const filteredPaymentMethods = paymentMethods.filter(
    (item) => item.provider !== "sbengine"
  );

  const getProviderInfo = (provider: string) => {
    const providerMap: Record<
      string,
      {
        image: string;
        color: string;
        name: string;
        description: string;
      }
    > = {
      paystack: {
        image: "/images/paystack.png",
        color: "from-blue-500 to-cyan-500",
        name: "Paystack",
        description: "Cards, Bank Transfer & Mobile Money",
      },
      opay: {
        image: "/images/opay.png",
        color: "from-green-500 to-emerald-500",
        name: "OPay",
        description: "Digital Wallet & Bank Transfer",
      },
      flutterwave: {
        image: "/images/flutterwave.png",
        color: "from-orange-500 to-yellow-500",
        name: "Flutterwave",
        description: "Cards & Bank Transfer",
      },
      korapay: {
        image: "/images/korapay.png",
        color: "from-purple-500 to-pink-500",
        name: "KoraPay",
        description: "Bank Transfer & Cards",
      },
      mgurush: {
        image: "/images/mgurush.png",
        color: "from-red-500 to-orange-500",
        name: "mGurush",
        description: "Mobile Money & Banking",
      },
      pawapay: {
        image: "/images/pawapay.png",
        color: "from-indigo-500 to-purple-500",
        name: "PawaPay",
        description: "Mobile Money Platform",
      },
      palmpay: {
        image: "/images/palmpay.png",
        color: "from-teal-500 to-green-500",
        name: "PalmPay",
        description: "Digital Wallet & Transfer",
      },
      mtnmomo: {
        image: "/images/mtnmomo.png",
        color: "from-yellow-500 to-orange-500",
        name: "MTN MoMo",
        description: "Mobile Money Service",
      },
      tigo: {
        image: "/images/tigo.png",
        color: "from-blue-500 to-purple-500",
        name: "Tigo",
        description: "Mobile Payment Service",
      },
      coralpay: {
        image: "/images/coralpay.png",
        color: "from-coral-500 to-pink-500",
        name: "CoralPay",
        description: "Banking & Digital Payment",
      },
      fidelity: {
        image: "/images/fidelity.png",
        color: "from-navy-500 to-blue-500",
        name: "Fidelity Bank",
        description: "Bank Transfer & Cards",
      },
      globus: {
        image: "/images/globus.png",
        color: "from-green-600 to-teal-500",
        name: "Globus Bank",
        description: "Digital Banking Service",
      },
      providus: {
        image: "/images/providus.png",
        color: "from-blue-600 to-indigo-500",
        name: "Providus Bank",
        description: "Corporate Banking",
      },
      payonus: {
        image: "/images/payonus.png",
        color: "from-purple-600 to-pink-500",
        name: "Payonus",
        description: "Digital Payment Gateway",
      },
      smileandpay: {
        image: "/images/smileandpay.png",
        color: "from-yellow-600 to-orange-500",
        name: "Smile & Pay",
        description: "Mobile Payment Service",
      },
    };

    return (
      providerMap[provider] || {
        image: "/images/default-payment.png",
        color: "from-gray-500 to-gray-600",
        name: provider?.toUpperCase() || "Unknown",
        description: "Payment Service",
      }
    );
  };

  const handleDepositClick = (provider: string) => {
    // Navigate to deposit form page for specific provider
    navigate(ACCOUNT.DEPOSIT_FORM.replace(":provider", provider));
  };

  // if (isLoading) {
  //   return (
  //     <div
  //       className={`h-[calc(100vh-110px)] overflow-y-auto ${pageClasses["container-bg"]} ${pageClasses["page-text"]} p-2`}
  //     >
  //       <div className="flex flex-col gap-4">
  //         {/* Header Skeleton */}
  //         <div
  //           className={`h-8 w-32 ${classes["bg-secondary"]} animate-pulse rounded`}
  //         ></div>

  //         {/* Warning Banner Skeleton */}
  //         <div
  //           className={`${classes["bg-secondary"]} animate-pulse rounded p-4 h-20`}
  //         ></div>

  //         {/* Table Skeleton */}
  //         <div
  //           className={`${pageClasses["card-bg"]} ${pageClasses["card-border"]} border rounded overflow-hidden`}
  //         >
  //           {/* Table Header */}
  //           <div
  //             className={`${pageClasses["table-header-bg"]} border-b ${pageClasses["card-border"]} px-4 py-3`}
  //           >
  //             <div className="grid grid-cols-[2fr,3fr,1fr,1fr,150px] gap-4">
  //               {[...Array(5)].map((_, i) => (
  //                 <div
  //                   key={i}
  //                   className={`h-4 w-24 ${classes["bg-tertiary"]} animate-pulse rounded`}
  //                 ></div>
  //               ))}
  //             </div>
  //           </div>
  //           {/* Table Rows */}
  //           {[...Array(6)].map((_, index) => (
  //             <div
  //               key={index}
  //               className={`border-b ${classes.border} px-4 py-4`}
  //             >
  //               <div className="grid grid-cols-[2fr,3fr,1fr,1fr,150px] gap-4 items-center">
  //                 <div className="flex items-center gap-3">
  //                   <div
  //                     className={`w-10 h-10 ${classes["bg-secondary"]} animate-pulse rounded`}
  //                   ></div>
  //                 </div>
  //                 <div
  //                   className={`h-4 w-48 ${classes["bg-secondary"]} animate-pulse rounded`}
  //                 ></div>
  //                 <div
  //                   className={`h-4 w-16 ${classes["bg-secondary"]} animate-pulse rounded`}
  //                 ></div>
  //                 <div
  //                   className={`h-4 w-16 ${classes["bg-secondary"]} animate-pulse rounded`}
  //                 ></div>
  //                 <div
  //                   className={`h-10 w-full ${classes["bg-secondary"]} animate-pulse rounded`}
  //                 ></div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div
        className={`min-h-screen ${pageClasses["container-bg"]} ${pageClasses["page-text"]} flex justify-center items-center`}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-red-400 mb-2">
            Error Loading Payment Methods
          </h2>
          <p className={`${classes["text-secondary"]} mb-6`}>
            We're having trouble connecting to our payment services. Please try
            again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-[calc(100vh-100px)] overflow-y-auto ${pageClasses["page-bg"]} ${pageClasses["page-text"]} p-2`}
    >
      <div className="flex flex-col gap-2">
        {/* Header Section */}
        <h1 className={`text-lg font-bold ${pageClasses["header-text"]}`}>
          Deposit
        </h1>

        {/* Warning Banner */}
        <div
          className={`${pageClasses["warning-bg"]} border ${pageClasses["warning-border"]} rounded-lg p-2 flex items-start gap-3`}
        >
          <AlertCircle
            className={`${pageClasses["warning-icon"]} flex-shrink-0 mt-0.5`}
            size={20}
          />
          <p
            className={`text-[11px] ${pageClasses["warning-text"]} leading-relaxed`}
          >
            Please note that default minimum deposit limits apply, and maximum
            deposit limits may be lower than your personal limits until
            verification is complete. Additionally, be aware that internet
            gambling restrictions may apply in your location; check local laws
            before proceeding with transactions.
          </p>
        </div>

        <PaginatedTable
          columns={[
            {
              id: "method",
              name: "Payment Method",
              className: "flex items-center gap-2 py-2 col-span-2",
              render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded flex items-center justify-center overflow-hidden bg-white p-1">
                    <img
                      src={row?.image || "row.name"}
                      alt={`${row?.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class=\"text-xs font-bold\">${row.provider.toUpperCase()}</span>`;
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className={`font-semibold text-xs`}>{row?.name}</div>
                    <div className={`text-[10px] ${pageClasses["label-text"]}`}>
                      {row?.description}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "desc",
              name: "Description",
              className: `text-[10px] col-span-3 h-full flex justify-start items-center`,
              render: (_: any, row: any) => row?.extraDescription,
            },
            {
              id: "fee",
              name: "Fee",
              className: `font-semibold text-xs h-full flex justify-start items-center`,
              render: () => "FREE",
            },
            {
              id: "min",
              name: "Min. Amount",
              className: `font-semibold text-xs  h-full flex justify-start items-center`,
              render: () => "N50",
            },
            {
              id: "action",
              name: "",
              className: `font-semibold text-xs h-full flex justify-start items-center`,
              render: (_: any, row: any) => (
                <button
                  onClick={() => handleDepositClick(row?.provider)}
                  className={`${classes["button-primary-bg"]} ${classes["button-primary-border"]} ${classes["button-primary-hover"]} ${classes["button-primary-text"]} px-3 py-2 rounded-md transition-all shadow-md border font-semibold text-[10px] flex items-center justify-center gap-2`}
                >
                  Deposit
                  <Plus
                    size={14}
                    className="bg-white rounded-full text-blue-600"
                  />
                </button>
              ),
            },
          ]}
          className="grid-cols-8"
          data={filteredPaymentMethods.map((item) => {
            const providerInfo = getProviderInfo(item.provider);
            return {
              ...item,
              image: providerInfo.image,
              name: providerInfo.name,
              description:
                item.provider === "paystack"
                  ? "(Card/bank) Instant Credit"
                  : item.provider === "opay"
                  ? "Instant Credit on deposits via Opay app and Opay agent shop"
                  : providerInfo.description,
              extraDescription:
                item.provider === "paystack"
                  ? "(Card/bank) Instant Credit"
                  : item.provider === "interswitch"
                  ? "Instant Credit"
                  : item.provider === "opay"
                  ? "Instant Credit on deposits via Opay app and Opay agent shop"
                  : item.provider === "quickteller"
                  ? "Instant Credit"
                  : item.provider === "transfer"
                  ? "Deposit may take up to 24 hours to reflect"
                  : item.provider === "zenith"
                  ? "Instant Credit"
                  : [
                      "paystack",
                      "interswitch",
                      "opay",
                      "quickteller",
                      "transfer",
                      "zenith",
                    ].includes(item.provider)
                  ? "Instant Credit"
                  : "Instant Credit",
            };
          })}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Deposit;
