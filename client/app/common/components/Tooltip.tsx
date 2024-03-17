import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, placement = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className={`has-tooltip ${placement}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && <div role="tooltip">{content}</div>}
    </div>
  );
};

export default Tooltip;
