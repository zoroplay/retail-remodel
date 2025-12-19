/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
"use client";
import React, { useEffect, useState } from "react";
// import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import { AppHelper } from "../../lib/helper";
import { cn } from "../../lib/utils";
import { useTheme } from "../providers/ThemeProvider";
import { Eye, EyeClosed } from "lucide-react";
import { getClientTheme } from "@/config/theme.config";
import { useAppSelector } from "@/hooks/useAppDispatch";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en");
const { classes } = getClientTheme();

type Props = {
  placeholder: string;
  name: string;
  value?: string;
  checked?: boolean;
  code_value?: string;
  type?:
    | string
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "textarea"
    | "num_select"
    | "fx_select";
  optionalLabel?: React.ReactElement;
  bottomLabel?: React.ReactElement;
  error?: null | string;
  rows?: null | number;
  disabled?: boolean;
  password?: boolean;
  required?: boolean;
  doCopy?: boolean;
  textarea?: boolean;
  defaultValue?: string;
  num_select?: boolean;
  card?: boolean;
  file?: boolean;
  label?: string;
  ref?: any;
  onFocus?: any;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
  data_testid?: string;
  href?: string;
  changeDesc?: boolean;
  phoneNumber?: boolean;
  outline?: boolean;
  className?: string;
  fxSelect?: boolean;
  onChange: (t: any) => void;
  onSelect?: (t: any) => void;
  isValid?: boolean;
  isChecking?: boolean;
  check_box?: boolean;
  options?: { id: string; name: string }[];
  selectValue?: string;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  accent_color?: string;
  height?: string;
  num_select_placeholder?: string | React.ReactElement;
  isLoading?: boolean;
  rounded?: string;
};

// Add this type definition for a generic blur handler
export type BlurHandler = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

// Use FormEventHandler instead of InvalidEvent for compatibility
export type InvalidHandler = (
  e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

// Add this password validation function at the top of the file
const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (!password) return { isValid: false, message: "Password is required" };

  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumber = /[0-9]/.test(password);
  // const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 8;

  const requirements = [];
  // if (!hasUpperCase) requirements.push("uppercase letter");
  // if (!hasLowerCase) requirements.push("lowercase letter");
  // if (!hasNumber) requirements.push("number");
  // if (!hasSpecialChar) requirements.push("special character");
  if (!isLongEnough) requirements.push("minimum of 8 characters");

  if (requirements.length === 0) {
    return { isValid: true, message: "" };
  }

  const message = `Password must include ${requirements.join(", ")}`;
  return { isValid: false, message };
};

// Reusable Label Component
const InputLabel = ({
  label,
  required,
  showError,
  optionalLabel,
}: {
  label: string;
  required?: boolean;
  showError?: boolean;
  optionalLabel?: React.ReactElement;
}) => (
  <div className="flex justify-between items-center gap-4">
    <label
      className={`text-[11px] font-semibold tracking-wide ${
        showError ? "text-[tomato]" : ""
      }`}
      htmlFor=""
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {optionalLabel && (
      <span className="text-[10px] text-slate-700">{optionalLabel}</span>
    )}
  </div>
);

// Reusable Bottom Label Component
const BottomLabel = ({ children }: { children: React.ReactElement }) => (
  <div className="flex justify-end w-full items-center gap-4 text-[10px]">
    {children}
  </div>
);

// Reusable Error Message Component
const ErrorMessage = ({
  showError,
  error,
  validationMessage,
}: {
  showError: boolean;
  error?: string | null;
  validationMessage: string;
}) => (
  <div
    className={`overflow-hidden ${
      showError || error ? "min-h-5" : "h-0"
    } transition-all duration-200`}
  >
    <p
      className={`text-[10px] capitalize font-bold text-[tomato] transition-all ${
        showError || error ? "opacity-100" : "opacity-0"
      }`}
    >
      {validationMessage || error || ""}
    </p>
  </div>
);

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      type = "text",
      textarea,
      password,
      doCopy = false,
      disabled = false,
      defaultValue,
      required = false,
      name,
      href,
      changeDesc,
      optionalLabel,
      bottomLabel,
      phoneNumber,
      outline,
      code_value,
      value,
      file,
      rows,
      label,
      card,
      onFocus,
      onKeyDown,
      tabIndex,
      num_select,
      num_select_placeholder,
      fxSelect,
      error,
      onChange,
      onSelect,
      className,
      options,
      selectValue,
      isValid,
      isChecking,
      check_box,
      checked,
      border_color = `${classes["input-border"]}`,
      bg_color = classes["input-bg"],
      text_color = classes["input-text"],
      accent_color = "text-gray-500",
      height = "h-[38px]",
      isLoading = false,
      rounded = "rounded-md",
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string>("");
    const [previousValue, setPreviousValue] = useState(value);
    const [passwordValidation, setPasswordValidation] = useState<{
      isValid: boolean;
      message: string;
    }>({
      isValid: true,
      message: "",
    });
    const { global_variables } = useAppSelector((store) => store.app);

    const { theme } = useTheme();

    const getBorderColor = () => {
      if (showError || error) return "!border-[#ff6347] border ring-[#ff6347]"; // tomato
      if (isFocused) return `${border_color} ${classes["input-ring"]}`; // use the same color as border
      return `${border_color} border `; // gray-200
    };

    const inputStyle = `flex ${height} ${bg_color} w-full ${rounded} border border text-xs ring-offset-background file:border-0 file:text-xs file:font-medium placeholder:text-muted-foreground ${
      classes["input-focus-within"]
    } disabled:cursor-not-allowed disabled:opacity-50 transition-all  ${getBorderColor()} ${
      AppHelper.isDarkColor(bg_color)
        ? `hover:bg-blue-500/50 ${text_color}`
        : `hover:bg-blue-50/10  ${text_color}`
    } `;

    const [phoneNo, setPhoneNumber] = useState(value);

    useEffect(() => {
      if (value !== previousValue && (showError || error)) {
        setShowError(false);
        setValidationMessage("");
      }
      setPreviousValue(value);
    }, [value, previousValue, showError, error]);

    // Add password validation effect
    useEffect(() => {
      if (password && value) {
        const validation = validatePassword(value as string);
        setPasswordValidation(validation);
        if (!validation.isValid) {
          setShowError(true);
          setValidationMessage(validation.message);
        } else if (
          showError &&
          validationMessage === passwordValidation.message
        ) {
          setShowError(false);
          setValidationMessage("");
        }
      }
    }, [value, password]);

    // Update handleBlur to include password validation
    const handleBlur: BlurHandler = (e) => {
      if (password) {
        const validation = validatePassword(e.target.value);
        setPasswordValidation(validation);
        if (!validation.isValid) {
          setShowError(true);
          setValidationMessage(validation.message);
          return;
        }
      }

      if (e.target.validity.valid) {
        setShowError(false);
        setValidationMessage("");
      } else {
        setShowError(true);
        setValidationMessage(e.target.validationMessage);
      }
    };

    const handleInvalid: InvalidHandler = (e) => {
      e.preventDefault();
      setShowError(true);
      // Cast to HTMLInputElement to access validationMessage
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      setValidationMessage(target.validationMessage);
    }; // Update to use FormEvent instead of InvalidEvent

    if (isLoading) {
      const loadingHeight =
        textarea || type === "textarea" ? "h-[220px]" : height;
      return (
        <div className="flex flex-col gap-0.5 w-full">
          {label && (
            <InputLabel
              label={label}
              required={required}
              showError={showError}
              optionalLabel={optionalLabel}
            />
          )}
          <div
            className={`relative ${loadingHeight} w-full ${inputStyle} ${getBorderColor()} border ${bg_color} flex items-center justify-between px-3 ${className} bg-gray-200 animate-pulse`}
          >
            {/* Skeleton placeholder for loading */}
          </div>
        </div>
      );
    }

    return (
      <>
        {password || type === "password" ? (
          <div
            className="flex flex-col gap-0.5 w-full"
            tabIndex={-1}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setIsFocused(false);
            }}
          >
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div
              className={`${inputStyle} ${className} overflow-hidden`}
              tabIndex={-1}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setIsFocused(false);
              }}
            >
              {doCopy ? (
                <input
                  required
                  name={name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  tabIndex={tabIndex}
                  placeholder={placeholder}
                  value={value}
                  type={showPassword ? "text" : "password"}
                  className={`outline-none border-none disabled:cursor-not-allowed disabled:opacity-50 !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2`}
                  onBlur={(e) => {
                    setIsFocused(false);
                    handleBlur(e);
                  }}
                  onFocus={() => setIsFocused(true)}
                  disabled={disabled}
                  onInvalid={handleInvalid}
                />
              ) : (
                <input
                  required
                  name={name}
                  disabled={disabled}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  tabIndex={tabIndex}
                  placeholder={placeholder}
                  value={value}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  type={showPassword ? "text" : "password"}
                  className={`outline-none border-none disabled:cursor-not-allowed disabled:opacity-50 !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2`}
                  onBlur={(e) => {
                    setIsFocused(false);
                    handleBlur(e);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onInvalid={handleInvalid}
                />
              )}
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className={`w-10 min-w-[2rem] cursor-pointer 4  h-full flex justify-center items-center p-2 ${text_color}`}
              >
                {showPassword ? (
                  <Eye fontSize={20} className={text_color} />
                ) : (
                  <EyeClosed fontSize={20} className={text_color} />
                )}
              </div>
            </div>
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : textarea || type === "textarea" ? (
          <div className="flex flex-col gap-0.5 w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <textarea
              required={required}
              name={name}
              disabled={disabled}
              value={value}
              // minH={10}
              rows={rows ?? 10}
              cols={6}
              onChange={onChange}
              autoFocus
              spellCheck={true}
              autoCapitalize=""
              placeholder={placeholder}
              className={`!h-auto resize-y ${inputStyle} ${className}  px-3 py-2 test-instructions`}
              onBlur={handleBlur}
            />
            <div className="flex justify-end items-center gap-4 w-full">
              {bottomLabel && <>{bottomLabel}</>}
            </div>
            <div
              className={`overflow-hidden ${
                showError || error ? "h-5" : "h-0"
              } transition-all duration-200`}
            >
              <p
                className={`text-[10px] font-bold text-[tomato] transition-all ${
                  showError || error ? "opacity-100" : "opacity-0"
                }`}
              >
                {validationMessage || error || ""}
              </p>
            </div>
          </div>
        ) : outline && textarea ? (
          <div className="input-container w-full">
            {label && (
              <div className="flex justify-between items-center gap-4">
                <label
                  className={`label ${showError ? "text-[tomato]" : ""}`}
                  htmlFor=""
                >
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {optionalLabel && (
                  <span className="text-[10px] text-slate-700">
                    {optionalLabel}
                  </span>
                )}
              </div>
            )}
            <textarea
              required={required}
              name={name}
              disabled={disabled}
              value={value}
              // minH={10}
              rows={rows ?? 10}
              cols={6}
              onChange={onChange}
              autoFocus
              autoCapitalize=""
              placeholder={placeholder}
              className={`cursor-pointer input`}
              onBlur={handleBlur}
            />
            <div className="flex justify-end items-center gap-4 w-full">
              {bottomLabel && <>{bottomLabel}</>}
            </div>
            <div
              className={`overflow-hidden ${
                showError || error ? "h-5" : "h-0"
              } transition-all duration-200`}
            >
              <p
                className={`text-[10px] font-bold text-[tomato] transition-all ${
                  showError || error ? "opacity-100" : "opacity-0"
                }`}
              >
                {validationMessage || error || ""}
              </p>
            </div>
          </div>
        ) : num_select || type === "num_select" ? (
          <div
            className="flex flex-col gap-0.5 w-full"
            tabIndex={-1}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setIsFocused(false);
            }}
          >
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div
              className={`${inputStyle} overflow-hidden`}
              tabIndex={-1}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setIsFocused(false);
              }}
            >
              <input
                required={required}
                name={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                value={value}
                placeholder={placeholder}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={(e) => {
                  setIsFocused(false);
                  handleBlur(e);
                }}
                onFocus={() => setIsFocused(true)}
                onInvalid={handleInvalid}
              />
              <div
                onClick={() => {
                  setShowPassword((prev) => !prev);
                  setIsFocused(true);
                }}
                className="w-14  min-w-[3rem] cursor-pointer text-gray-900 h-full flex justify-center items-center p-2 px-3"
              >
                {typeof num_select_placeholder === "string" ? (
                  <span className={` ${classes["text-secondary"]} `}>
                    {num_select_placeholder}
                  </span>
                ) : (
                  num_select_placeholder
                )}
              </div>
            </div>
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : fxSelect || type === "fx_select" ? (
          <div className="flex flex-col gap-2 w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div className={`${inputStyle} `}>
              <input
                required={required}
                name={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                value={value}
                placeholder={"Enter value"}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
              <select
                value={selectValue}
                onChange={onSelect}
                className="p-2 min-w-20 outline-none -translate-x-2  cursor-pointer"
              >
                {options?.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    className="cursor-pointer p-4"
                  >
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : changeDesc ? (
          <div className="flex flex-col gap-2">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div className={`${inputStyle} `}>
              <input
                required={required}
                name={name}
                // onChange={onChange}
                onChange={() => {}}
                value={value}
                type={"text"}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
              <div className="w-[10rem] flex justify-center items-center p-2">
                <button
                  onClick={onChange}
                  type="button"
                  className="w-36 font-medium whitespace-nowrap border rounded-full text-xs min-w-[3rem] cursor-pointer text-gray-900 p-2 flex justify-center items-center"
                >
                  {placeholder}
                </button>
              </div>
            </div>
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : check_box ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-semibold justify-start gap-2 ">
              <input
                // size="sm"
                name={name}
                checked={checked}
                className="-translate-x-2"
                onChange={(e: { target: { checked: boolean } }) =>
                  onChange({ target: { name, value: e.target.checked } })
                }
              />
              {label && (
                <label
                  htmlFor="terms"
                  className={cn(
                    `whitespace-nowrap text-xs text-white`,
                    className
                  )}
                >
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
              )}
              <div className="flex justify-end items-center gap-4 w-full">
                {bottomLabel && <>{bottomLabel}</>}
              </div>
              <div
                className={`overflow-hidden ${
                  showError || error ? "min-h-5" : "h-0"
                } transition-all duration-200`}
              >
                <p
                  className={`text-[10px] capitalize font-bold text-[tomato] transition-all ${
                    showError || error ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {validationMessage || error || ""}
                </p>
              </div>
            </div>
          </div>
        ) : phoneNumber || type === "tel" ? (
          <div className="flex flex-col gap-0.5 w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div
              className={`${inputStyle} ${className} overflow-hidden`}
              tabIndex={-1}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setIsFocused(false);
              }}
            >
              <div
                className={`w-10 min-w-[2rem] font-semibold h-full flex justify-center items-center p-2 ${text_color}`}
              >
                {global_variables?.dial_code || ""}
              </div>
              <input
                required={required}
                name={name}
                type="text"
                ref={ref}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                tabIndex={tabIndex}
                disabled={disabled}
                // value={phoneNo}
                value={value}
                // onChange={handlePhoneNumberChange}
                onChange={onChange}
                placeholder={placeholder}
                className={`outline-none border-none disabled:cursor-not-allowed disabled:opacity-50 !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2`}
                onBlur={handleBlur}
                onInvalid={handleInvalid}
                // pattern="^\+[0-9]+$"
                // title="Please enter a valid phone number starting with + followed by digits"
              />
            </div>

            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : card ? (
          <div className="flex flex-col gap-2 w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <div className={`${inputStyle} overflow-hidden`}>
              <div className="w-20 min-w-[5rem] p-3 cursor-pointer h-full flex justify-center items-center">
                <div className="  h-full  flex justify-center items-center ">
                  <img
                    src="/images/mastercard.svg"
                    alt={""}
                    width={80}
                    height={80}
                  />
                </div>
              </div>
              <input
                required={required}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                type={type}
                className="outline-none !bg-transparent w-full focus:!bg-transparent focus-within:!bg-transparent focus-visible:!bg-transparent  px-3 py-2"
                onBlur={handleBlur}
                onInvalid={handleInvalid}
              />
            </div>
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : outline ? (
          <div className="input-container w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError}
                optionalLabel={optionalLabel}
              />
            )}
            <input
              required={required}
              name={name}
              type={type}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              placeholder={placeholder}
              className={`cursor-pointer input`}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
            />
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 w-full">
            {label && (
              <InputLabel
                label={label}
                required={required}
                showError={showError || !!error}
                optionalLabel={optionalLabel}
              />
            )}
            <input
              required={required}
              name={name}
              type={type}
              ref={ref}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              tabIndex={tabIndex}
              disabled={disabled}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              placeholder={placeholder}
              className={`${inputStyle} ${className}  px-3 py-2`}
              onBlur={handleBlur}
              onInvalid={handleInvalid}
            />
            {bottomLabel && <BottomLabel>{bottomLabel}</BottomLabel>}
            <ErrorMessage
              showError={showError}
              error={error}
              validationMessage={validationMessage}
            />
          </div>
        )}
      </>
    );
  }
);

export default Input;
