
import React from "react";
import style from "./Button.module.css";
/**
 *
 * @param {*} props
 * @returns
 */

const Button = (props) => {
  const type = props.type;
  const children = props.children;

  return <button className={style[type]}>{children}</button>;
};

export default Button;
