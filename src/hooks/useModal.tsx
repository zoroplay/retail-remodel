import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "./useAppDispatch";
import {
  showModal,
  closeModal as closeModalAction,
} from "../store/features/slice/modal.slice";

export const useModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const openModal = ({
    ref,
    level,
    title,
    description,
    modal_name,
    modal_function,
    props,
  }: {
    ref?: string;
    level?: number;
    title?: string;
    description?: string;
    modal_name: string;
    modal_function?: string;
    props?: Record<string, string | number>;
    onConfirm?: () => void;
  }) => {
    // Update URL with modal parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modal_name);
    if (ref) {
      params.set("ref", ref);
    }
    if (level) {
      params.set("level", level.toString());
    }

    // Update URL
    navigate(`?${params.toString()}`, { replace: true });

    // Dispatch Redux action to sync state
    dispatch(
      showModal({
        component_name: modal_name,
        title,
        description: description || "",
        modal_function: modal_function || "",
        props,
      })
    );
  };

  const closeModal = () => {
    // Remove modal parameters from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("ref");
    params.delete("level");

    // Update URL
    navigate(`?${params.toString()}`, { replace: true });

    // Dispatch Redux action to close modal
    dispatch(closeModalAction());
  };

  return {
    openModal,
    closeModal,
  };
};
