import React from "react";
import Header from "../components/defaultHeader";

const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <>
      <Header />
      <div className="container mx-auto">{props.children}</div>
    </>
  );
};

export default Layout;
