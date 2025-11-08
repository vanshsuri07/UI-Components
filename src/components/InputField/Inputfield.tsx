"use client"

import React, { useState, memo, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react"; 

interface InputFieldDemoProps {
  onSuccess?: () => void
}

interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "text" | "password" | "email"; // 👈 added type prop
}

const variantStyles = {
  filled:
    "bg-gray-900 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
  outlined:
    "bg-transparent border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
  ghost:
    "bg-transparent border-b border-gray-500 focus:border-blue-500 focus:ring-0",
};

const sizeStyles = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-2",
  lg: "text-lg px-4 py-3",
};

// Memoized InputField component
export const InputField: React.FC<InputFieldProps> = memo(({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled,
  invalid,
  variant = "outlined",
  size = "md",
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-200">{label}</label>}

      <div className="relative">
        <input
          type={type === "password" && !showPassword ? "password" : "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-md outline-none text-white placeholder-gray-400
            disabled:bg-gray-700 disabled:cursor-not-allowed
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${invalid ? "border-red-500 focus:ring-red-500" : ""}
          `}
        />

       
        {type === "password" && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {invalid && errorMessage ? (
        <span className="text-sm text-red-500">{errorMessage}</span>
      ) : helperText ? (
        <span className="text-sm text-gray-400">{helperText}</span>
      ) : null}
    </div>
  );
});

InputField.displayName = "InputField";



const InputFieldDemo: React.FC<InputFieldDemoProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    
    if (username.length < 3 || username.length > 15) {
      newErrors.username = "Username must be between 3–15 characters.";
    }

   
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

  
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

   
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   if (validateForm()) {
      if (onSuccess) onSuccess() 
    }
  };

  return (
   <div className="min-h-screen bg-black flex items-center justify-center">
    
  <form
    onSubmit={handleSubmit}
    className="p-6 bg-background backdrop-blur-md border border-blue-500/30 
               flex flex-col gap-6 max-w-md w-full rounded-2xl shadow-xl"
  >
    
      <InputField
        label="Name"
        placeholder="William.."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        helperText="Must be 3–15 characters."
        invalid={!!errors.username}
        errorMessage={errors.username}
      />

      <InputField
        label="E-mail"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="filled"
        size="lg"
        helperText="Must be a unique email address."
        invalid={!!errors.email}
        errorMessage={errors.email}
      />

      <InputField
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="ghost"
        type="password"
        helperText="Must be contain atleast 6 characters."
        invalid={!!errors.password}
        errorMessage={errors.password}
      />

      <InputField label="Domain" placeholder="Not available" disabled />

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition cursor-pointer"
      >
        Submit
      </button>
      
    </form>
    </div>
  );
};


export { InputFieldDemo };

