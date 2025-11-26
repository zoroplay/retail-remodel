import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../buttons/Button";
import { AUTH } from "../../data/routes/routes";
import AppImage from "../inputs/AppImage";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex  flex-col h-screen justify-center items-center bg-secondary w-full overflow-x-hidden">
      <div
        className="flex flex-col justify-center items-center w-full max-w-full p-4 sm:p-6"
        style={{
          backgroundColor: "#023c69",
          minHeight: "400px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div className="w-full mb-4 flex justify-center">
          <AppImage
            imageKey="logo"
            className="object-contain w-full max-w-sm h-auto"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              minHeight: "60px",
              maxHeight: "100px",
            }}
          />
        </div>
        <div className="flex flex-col items-center w-full px-4">
          <h2
            className="text-white text-center mb-4 font-semibold leading-tight"
            style={{
              fontSize: "1.25rem", // 20px - reduced for mobile
              lineHeight: "1.3",
              wordWrap: "break-word",
            }}
          >
            Welcome to Bwinners.net Cashbox
          </h2>
          <p
            className="text-red-500 text-center mb-4"
            style={{
              fontSize: "1rem", // 16px - reduced for mobile
              lineHeight: "1.4",
            }}
          >
            This TERMINAL not activated
          </p>
          <p
            className="text-white text-center mb-6"
            style={{
              fontSize: "0.875rem", // 14px - reduced for mobile
              lineHeight: "1.4",
            }}
          >
            Please contact your system administrator
          </p>
        </div>
        <div className="w-full flex justify-center items-center px-4 max-w-sm">
          <Button
            title="SEND REQUEST"
            onClick={() => {
              navigate(AUTH.SIGN_IN);
            }}
          />
        </div>
      </div>
    </div>
  );
}
