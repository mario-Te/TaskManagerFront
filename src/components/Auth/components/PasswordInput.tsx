import React from 'react';
import styles from "../Register/RegisterForm.module.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface PasswordInputProps {
  password: string;
  handlePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  handlePasswordVisibility: () => void;
  errors: {
    password?: string;
  };
}

const PasswordInput = ({
  password,
  handlePassword,
  showPassword = true, // Default to visible
  handlePasswordVisibility,
  errors
}: PasswordInputProps) => {
  return (
    <div className="form-group relative">
      <label htmlFor="password">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        required
        value={password}
        className={styles.input}
        onChange={handlePassword}
      />
      <button
        type="button"
        onClick={handlePasswordVisibility}
        className="absolute bottom-3 right-3 cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <VscEye /> : <VscEyeClosed />}
      </button>
      {errors.password && <p className={styles.error}>{errors.password}</p>}
    </div>
  );
};

export default PasswordInput;