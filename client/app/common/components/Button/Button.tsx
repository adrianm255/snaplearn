import React from "react";

interface ButtonProps {
  buttonClass?: string;
  isLoading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

const Button: React.FC<ButtonProps> = ({ buttonClass = '', isLoading = false, onClick, children, ...buttonProps }) => {
  return <button className={buttonClass} style={isLoading ? { 'position': 'relative' } : {}} onClick={onClick} disabled={isLoading} {...buttonProps}>
    {isLoading && (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )}
    {children}
  </button>;
};

export default Button;