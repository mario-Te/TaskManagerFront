import React, { ReactNode, FormEventHandler } from "react";
import styles from "../Register/RegisterForm.module.css";

interface FormWrapperProps {
  title: string;
  children: ReactNode;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

function FormWrapper({ title, children, handleSubmit }: FormWrapperProps) {
  return (
    <div className="border-2 p-12">
      <h2 className="mb-12 text-2xl">{title}</h2>
      <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
        {children}
        <button className={styles.button} type="submit">
          {title}
        </button>
      </form>
    </div>
  );
}

export default FormWrapper;