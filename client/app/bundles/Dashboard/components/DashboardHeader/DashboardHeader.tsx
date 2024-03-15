import React from "react";

const DashboardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <header className="sticky">
      <div>{children}</div>
    </header>
  );
};

export default DashboardHeader;