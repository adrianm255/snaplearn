import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DropdownButtonContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const DropdownButtonContext = createContext<DropdownButtonContextValue | undefined>(undefined);

interface DropdownButtonProps {
  children: ReactNode;
}

const DropdownButton: React.FC<DropdownButtonProps> & {
  Button: React.FC<{ buttonClass?: string, children: ReactNode }>;
  Dropdown: React.FC<{ customClass?: string, children: ReactNode }>;
} = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <DropdownButtonContext.Provider value={{ isOpen, toggle }}>
      <div className="popover toggle">{children}</div>
    </DropdownButtonContext.Provider>
  );
};

const useDropdownButtonContext = () => {
  const context = useContext(DropdownButtonContext);
  if (!context) {
    throw new Error('This component must be used within a <DropdownButton> component.');
  }
  return context;
}

DropdownButton.Button = ({ buttonClass = '', children }) => {
  const { toggle } = useDropdownButtonContext();
  return <button className={buttonClass} onClick={toggle}>{children}</button>;
};

DropdownButton.Dropdown = ({ customClass = '', children }) => {
  const { isOpen } = useDropdownButtonContext();
  return isOpen ? <div className={'dropdown ' + customClass}>{children}</div> : null;
};

export default DropdownButton;