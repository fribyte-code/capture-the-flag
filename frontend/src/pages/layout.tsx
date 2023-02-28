import React from "react";
import Header from "../components/defaultHeader";

const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
};

export default Layout;
