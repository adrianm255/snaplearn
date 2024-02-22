import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive'

interface DropdownButtonContextValue {
  isOpen: boolean;
  options?: object;
  toggle: () => void;
  close: () => void;
  setOptions?: (newOptions: object) => void;
}

const DropdownButtonContext = createContext<DropdownButtonContextValue | undefined>(undefined);

interface DropdownButtonProps {
  children: ReactNode;
  onOpen?: () => void;
}

interface DropdownProps {
  placement?: string;
  children: ReactNode;
  closable?: boolean;
  expandable?: boolean;
  options?: object;
};

const DropdownButton: React.FC<DropdownButtonProps> & {
  Button: React.FC<{ buttonClass?: string, children: ReactNode }>;
  Dropdown: React.FC<DropdownProps>;
} = ({ onOpen, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && onOpen) {
      onOpen();
    }
  };

  const close = () => setIsOpen(false);

  return (
    <DropdownButtonContext.Provider value={{ isOpen, toggle, close }}>
      <div className="popover toggle">{children}</div>
    </DropdownButtonContext.Provider>
  );
};

export const useDropdownButtonContext = () => {
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

DropdownButton.Dropdown = ({ placement = '', closable = false, expandable = false, children }) => {
  const { isOpen, toggle } = useDropdownButtonContext();
  const isSmallScreen = useMediaQuery({
    query: '(max-width: 1023px)'
  })
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const expandButtonClass = isExpanded ? 'icon icon-collapse' : 'icon icon-expand';
  // TODO this is mostly hardcoded for now
  const dropdownPlacement = isSmallScreen ? 'top' : placement;

  return isOpen
    ? ( closable || expandable
      ? <div className={`dropdown ${dropdownPlacement} ${isExpanded ? 'expanded' : ''}`}>
          <header>
            <div></div>
            <div className='actions'>
              {expandable && <div role="button" className={expandButtonClass} onClick={toggleExpanded}></div>}
              {closable && <div role="button" className="icon icon-solid-x" aria-label="Close" onClick={toggle}></div>}
            </div>
          </header>
          {children}
        </div>
      : <div className={'dropdown ' + dropdownPlacement}>{children}</div>
    )
    : null;
};

export default DropdownButton;