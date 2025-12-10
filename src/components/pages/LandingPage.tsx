import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../layouts/Spinner";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex  flex-col h-screen justify-center items-center bg-secondary w-full overflow-x-hidden">
      <Spinner />
    </div>
  );
}
