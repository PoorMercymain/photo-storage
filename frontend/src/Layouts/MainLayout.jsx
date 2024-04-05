import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="body">{children}</div>
    </>
  );
};

export default MainLayout;
