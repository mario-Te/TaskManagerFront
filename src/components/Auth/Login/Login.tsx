import React from "react";
import LoginForm from "./LoginForm";
import InfoSection from "../Register/InfoSection";

function Login() {
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 items-center justify-center">
        <LoginForm />
      </div>
      <div className="flex w-1/2 justify-center bg-[#FCFAF8] p-24">
        <InfoSection />
      </div>
    </div>
  );
}

export default Login;
