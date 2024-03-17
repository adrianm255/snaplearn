import React, { useEffect } from "react";
import ToastMessage, { ToastMessageHandle } from "../../../../common/components/ToastMessage";
import { useStore } from "../../../../hooks-store/store";

const CourseEditorNotifications: React.FC = () => {
  const toastMessageRef = React.useRef<ToastMessageHandle>(null);
  const [ state, dispatch ] = useStore();
  const toast = state.toast;

  useEffect(() => {
    if (toast.visible) {
      toastMessageRef.current?.show();
    }
  }, [toast])
  
  return (<ToastMessage ref={toastMessageRef} { ...toast } />);
};

export default CourseEditorNotifications;