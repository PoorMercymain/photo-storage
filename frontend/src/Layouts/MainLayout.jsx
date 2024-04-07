import React from "react";

/* Компонент общего макета страницы */
const MainLayout = ({ children }) => {
  return (
    <>
      <div className="body">{children}</div>
    </>
  );
};

export default MainLayout;
