import React from "react";
import { useRegisterForm } from "../../../contexts/RegisterFormContext";
import NameInput from "../components/NameInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import ConfirmPasswordInput from "../components/ConfirmPasswordInput";
import FormWrapper from "../components/FormWrapper";

function RegisterForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    showPassword,
    setShowPassword,
    handleSubmit,
  } = useRegisterForm();

  function handleName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(e.target.value);
  }

  function handlePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="p-12">
      <FormWrapper title="Register" handleSubmit={handleSubmit}>
        <NameInput name={name} handleName={handleName} errors={errors} />
        <EmailInput email={email} handleEmail={handleEmail} errors={errors} />
        <PasswordInput
          password={password}
          handlePassword={handlePassword}
          showPassword={showPassword}
          handlePasswordVisibility={handlePasswordVisibility}
          errors={errors}
        />
        <ConfirmPasswordInput
          confirmPassword={confirmPassword}
          handleConfirmPassword={handleConfirmPassword}
          errors={errors}
        />
        {errors.form && (
          <p className="text-red-500 text-sm mb-4">{errors.form}</p>
        )}
        <p className="mt-4">
          Already have an account?{" "}
          <a href="/login" className="underline text-blue-500">
            Log In
          </a>
        </p>
      </FormWrapper>
    </div>
  );
}

export default RegisterForm;