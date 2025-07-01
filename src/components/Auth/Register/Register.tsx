import React from "react";
import RegisterForm from "./RegisterForm";
import InfoSection from "./InfoSection";
import { RegisterFormProvider } from "../../../contexts/RegisterFormContext";

function Register() {
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 items-center justify-center">
        <RegisterFormProvider>
          <RegisterForm />
        </RegisterFormProvider>
      </div>
      <div className="flex w-1/2 justify-center bg-[#FCFAF8] p-24">
        <InfoSection />
      </div>
    </div>
  );
}

export default Register;
