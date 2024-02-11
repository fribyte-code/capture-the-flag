import React, { PropsWithChildren } from "react";
import Header from "../components/defaultHeader";
import style from "./layout.module.scss";
import classNames from "classnames";

interface LayoutProps extends PropsWithChildren {
  wide?: boolean;
  narrow?: boolean;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <Header />
      <div
        className={classNames(style.container, {
          [style.wide]: props.wide,
          [style.narrow]: props.narrow,
        })}
      >
        {props.children}
      </div>
    </>
  );
};

export default Layout;
