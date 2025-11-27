import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import {
  useCreditPlayerMutation,
  useDepositCommissionMutation,
  useValidateUserMutation,
} from "../../../store/services/user.service";
import { MODAL_COMPONENTS } from "../../../store/features/types";
import { useModal } from "../../../hooks/useModal";
import {
  ENVIRONMENT_VARIABLES,
  getEnvironmentVariable,
} from "../../../store/services/configs/environment.config";
import { setUserRerender } from "../../../store/features/slice/user.slice";
import Modal from "../Modal";

type Props = {
  onClose: () => void;
};
const OnlineDeposit: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    username: string;
    balance: number;
    role: string;
    id: number;
  } | null>(null);
  const { user } = useAppSelector((state) => state.user);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validateUser, { isLoading: isValidating }] = useValidateUserMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [creditPlayer, { isLoading: isCrediting }] = useCreditPlayerMutation();

  const { openModal } = useModal();

  const [depositCommision] = useDepositCommissionMutation();
  const showSuccessModal = (title: string) => {
    openModal({
      modal_name: MODAL_COMPONENTS.SUCCESS,
      title,
    });
    // dispatch(
    //   showModal({
    //     type: "popup",
    //     component_name: MODAL_COMPONENTS.SUCCESS,
    //     title,
    //     props: {
    //       message,
    //       onClose: () => {
    //         dispatch(closeModal());
    //         if (onClose) onClose();
    //       },
    //     },
    //   })
    // );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleValidateUser = async () => {
    if (!customerId.trim()) return;

    setIsLoading(true);

    try {
      const result = await validateUser({
        searchKey: customerId,
        clientId: getEnvironmentVariable(
          ENVIRONMENT_VARIABLES.CLIENT_ID
        ) as unknown as number,
      }).unwrap();
      console.log("validate user result", result);
      if (result.success === false) {
        console.log("Error:", result.message || "Failed to validate user");
        // showToast({
        //   type: "error",
        //   title: "Error",
        //   description: result.message || "Failed to validate user",
        // });
        return;
      }
      const userDetails = result.data;
      console.log("userDetails", userDetails);

      // Ensure userDetails is valid before setting state
      if (
        !userDetails ||
        (Array.isArray(userDetails) && userDetails.length === 0)
      ) {
        // showToast({
        //   type: "error",
        //   title: "Error",
        //   description: "No user found with the provided ID",
        // });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setUserDetails((prev) => ({
        username: Array.isArray(userDetails)
          ? userDetails[0]?.username || ""
          : "",
        balance: Array.isArray(userDetails)
          ? parseFloat(userDetails[0]?.balance) || 0
          : 0,
        role: Array.isArray(userDetails) ? userDetails[0]?.role || "" : "",
        id: Array.isArray(userDetails) ? userDetails[0]?.id || 0 : 0,
      }));
      setCurrentStep(2);
    } catch (error: any) {
      console.log("Error:", error?.data?.message || "Failed to validate user");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeposit = async () => {
    if (!amount.trim() || !userDetails || !userDetails.id) {
      // showToast({
      //   type: "error",
      //   title: "Error",
      //   description: "Please validate user first and enter a valid amount",
      // });
      return;
    }

    setIsLoading(true);

    try {
      const depositAmount = parseFloat(amount);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        // showToast({
        //   type: "error",
        //   title: "Error",
        //   description: "Please enter a valid amount",
        // });
        setIsLoading(false);
        return;
      }

      const result = await creditPlayer({
        amount: depositAmount,
        userId: userDetails.id,
      }).unwrap();
      console.log("credit player", result);

      // Check if the API response indicates success
      if (result && result.success === false) {
        // showToast({
        //   type: "error",
        //   title: "Error",
        //   description: result.message || "Deposit failed",
        // });
        return;
      }
      // dispatch(closeModal());

      showSuccessModal("Success");
      // showSuccessModal("Success", "Deposit completed successfully!", () => {
      // Reset form and close modal logic here
      //   setCurrentStep(1);
      //   setCustomerId("");
      //   setAmount("");
      //   setUserDetails(null);
      // });
    } catch (error: any) {
      console.log(
        "Error:",
        error?.message || error?.data?.message || "Failed to process deposit"
      );
      // showToast({
      //   type: "error",
      //   title: "Error",
      //   description:
      //     error?.message || error?.data?.message || "Failed to process deposit",
      // });
    } finally {
      setIsLoading(false);
      dispatch(setUserRerender());
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancel = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setAmount("");
    } else {
      onClose();
      // Close modal logic here
      console.log("Cancelling deposit");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBack = () => {
    setCurrentStep(1);
    setAmount("");
  };

  // const renderStep = () => {
  //   // Step 1: Customer ID Validation
  //   if (currentStep === 1) {
  //     return (
  //       <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-md">
  //         <h2 className="text-2xl font-bold text-gray-200 text-center mb-6">
  //           Online Deposit
  //         </h2>
  //         <div className="mb-6">
  //           <Input
  //             label="Customer ID / Username"
  //             type="text"
  //             placeholder="Enter Customer ID or Username"
  //             className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             value={customerId}
  //             onChange={(e) => setCustomerId(e.target.value)}
  //             name={""}
  //           />
  //         </div>

  //         <div className="flex gap-3">
  //           <button
  //             onClick={handleCancel}
  //             className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
  //           >
  //             <ArrowLeft className="w-5 h-5" />
  //             Cancel
  //           </button>

  //           <button
  //             onClick={handleValidateUser}
  //             disabled={!customerId.trim() || isLoading}
  //             className={`flex-1 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
  //               customerId.trim() && !isLoading
  //                 ? "bg-green-500 hover:bg-green-600"
  //                 : "bg-gray-400 cursor-not-allowed"
  //             }`}
  //           >
  //             {isLoading ? "Validating..." : "Validate user"}
  //             <ArrowRight className="w-5 h-5" />
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   // Step 2: Amount Input and Deposit
  //   return (
  //     <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-md">
  //       <h2 className="text-2xl font-bold text-gray-200 text-center mb-6">
  //         Online Deposit
  //       </h2>
  //       <div className="mb-4 p-4 bg-gray-700 rounded-lg text-center">
  //         <p className="text-gray-300">
  //           Customer:{" "}
  //           <span className="font-semibold">{userDetails?.username}</span>
  //         </p>
  //         <p className="text-gray-300">
  //           Current Balance:{" "}
  //           <span className="font-semibold">
  //             ₦{userDetails?.balance.toFixed(2)}
  //           </span>
  //         </p>
  //       </div>

  //       <div className="mb-6">
  //         <label className="block text-sm text-gray-400 mb-2">
  //           Deposit Amount
  //         </label>
  //         <Input
  //           type="number"
  //           label="Deposit Amount"
  //           placeholder="0"
  //           className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-center text-black focus:outline-none focus:ring-2 focus:ring-green-500"
  //           value={amount}
  //           onChange={(e) => setAmount(e.target.value)}
  //           name={""}
  //         />
  //       </div>

  //       <div className="flex gap-3">
  //         <button
  //           onClick={handleBack}
  //           className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
  //         >
  //           <ArrowLeft className="w-5 h-5" />
  //           Cancel
  //         </button>

  //         <button
  //           onClick={handleDeposit}
  //           disabled={!amount.trim() || isLoading}
  //           className={`flex-1 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
  //             amount.trim() && !isLoading
  //               ? "bg-green-500 hover:bg-green-600"
  //               : "bg-gray-400 cursor-not-allowed"
  //           }`}
  //         >
  //           {isLoading ? "Processing..." : "Deposit"}
  //           <ArrowRight className="w-5 h-5" />
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <Modal
      open={true}
      onOpenChange={(_open) => {
        if (!_open) onClose();
      }}
      className={`p-4 overflow-hidden max-w-[90vw] !w-[600px]  rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border border-slate-700/50 text-gray-100 shadow-2xl shadow-black/50
       `}
    >
      hjgjh
      {/* {renderStep()} */}
    </Modal>
  );
};

export default OnlineDeposit;
