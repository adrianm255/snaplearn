import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

type ToastMessageProps = {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  timeout?: number;
}

export type ToastMessageHandle = {
  show: () => void;
}

const ToastMessage = forwardRef<ToastMessageHandle, ToastMessageProps>(({ message, type, timeout = 3000 }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setIsVisible(true),
  }));

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible]);

  const visibleStyles = {
    transform: 'translateY(0px)',
    visibility: 'visible',
  };

  const hiddenStyles = {
    transform: 'translateY(-100%)',
    visibility: 'hidden',
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '0px',
        top: '0px',
        right: '0px',
        padding: 'var(--spacer-4)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 'var(--z-index-tooltip)',
        pointerEvents: 'none',
        transition: 'all 0.3s ease-out 0.5s',
        ... (isVisible ? visibleStyles : hiddenStyles),
      }}
    >
      <div className={`message bg-filled ${type}`} role="alert" style={{pointerEvents: 'auto'}}>
        {message}
      </div>
    </div>
  );
});

export default ToastMessage;
