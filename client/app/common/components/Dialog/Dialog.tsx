import React, { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, closeOnBackdropClick = true, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  if (closeOnBackdropClick) {
    useEffect(() => {
      dialogRef.current?.addEventListener("click", e => {
        const dialogDimensions = dialogRef.current?.getBoundingClientRect()
        if (
          dialogDimensions && (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
          )) {
          handleClose();
        }
      })
    }, []);
  
  }

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current && !isOpen) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef}>
      {children}
    </dialog>
  );
};

export default Dialog;
