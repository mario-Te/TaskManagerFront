import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../components/FormWrapper";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import { loginUser } from "../../../services/api";
import axios from "axios";

interface Errors {
  [key: string]: string;
}

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      document.cookie = `token=${response.token}; path=/`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({
        general: "Invalid email or password. Please try again."
      });
    }
  };

  return (
    <div className="p-12">
      <FormWrapper title="Login" handleSubmit={handleSubmit}>
        <EmailInput email={email} handleEmail={handleEmail} errors={errors} />
        <PasswordInput
          password={password}
          handlePassword={handlePassword}
          showPassword={showPassword}
          handlePasswordVisibility={handlePasswordVisibility}
          errors={errors}
        />
        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )}
        <p>
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Sign Up
          </a>
        </p>
      </FormWrapper>
    </div>
  );
}

export default LoginForm;