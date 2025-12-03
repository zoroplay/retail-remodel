import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SuccessModal from "./components/SuccessModal";
import NetworkConnectionModal from "./components/NetworkConnectionModal";
import InsufficientBalanceModal from "./components/InsufficientBalanceModal";
import MenuBar from "./components/MenuBar";
import SportMenu from "./components/SportMenu";
import GameOptionsModal from "./components/GameOptionsModal";
import CouponDetails from "./components/CouponDetails";
import BettingSlipModal from "./components/BettingSlipModal";
import OnlineDeposit from "./components/OnlineDeposit";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useModal } from "../../hooks/useModal";
import { MODAL_COMPONENTS } from "../../store/features/types";
import {
  showModal,
  closeModal as closeModalAction,
} from "../../store/features/slice/modal.slice";
import LogoutModal from "./components/LogoutModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import ConfirmationModal from "./components/ConfirmationModal";

const ModalProvider = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { title, props, description } = useAppSelector((state) => state.modal);
  const { closeModal, openModal } = useModal();

  // Get modal name from URL search parameters
  const modal_name = searchParams.get("modal");

  // Sync URL parameters with Redux state
  // useEffect(() => {
  //   if (modal_name) {
  //     openModal({
  //       component_name: modal_name,
  //       title: title || "",
  //     });
  //   } else {
  //     dispatch(closeModalAction());
  //   }
  // }, [modal_name, dispatch, title]);

  const handleClose = () => {
    closeModal();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderModal = () => {
    switch (modal_name) {
      case MODAL_COMPONENTS.SUCCESS:
        return <SuccessModal onClose={handleClose} />;
      case MODAL_COMPONENTS.NetworkConnection:
        return (
          <NetworkConnectionModal
            onRetry={props?.onRetry || handleClose}
            onClose={handleClose}
          />
        );
      case MODAL_COMPONENTS.INSUFFICIENT_BALANCE:
        return <InsufficientBalanceModal onClose={handleClose} />;
      case MODAL_COMPONENTS.MENU_BAR:
        return <MenuBar onClose={handleClose} />;
      case MODAL_COMPONENTS.SPORT_MENU:
        return <SportMenu onClose={handleClose} />;

      case MODAL_COMPONENTS.GAME_OPTIONS:
        return <GameOptionsModal onClose={handleClose} />;
      case MODAL_COMPONENTS.COUPON_DETAILS:
        return <CouponDetails onClose={handleClose} />;
      case MODAL_COMPONENTS.BETTING_SLIP:
        return <BettingSlipModal onClose={handleClose} />;
      case MODAL_COMPONENTS.ONLINE_DEPOSIT:
        return <OnlineDeposit onClose={handleClose} />;
      case MODAL_COMPONENTS.CONFIRM_LOGOUT:
        return <LogoutModal onClose={handleClose} />;
      case MODAL_COMPONENTS.CHANGE_PASSWORD:
        return <ChangePasswordModal onClose={handleClose} />;
      case MODAL_COMPONENTS.CONFIRMATION_MODAL:
        return <ConfirmationModal onClose={handleClose} />;
      default:
        return null;
    }
  };
  // Only render if there's an active modal
  if (!modal_name) {
    return null;
  }
  return (
    <div
    // className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    // onClick={handleBackdropClick}
    >
      {renderModal()}
    </div>
  );
};

export default ModalProvider;
