import React from "react";
import style from "./Button.module.css";

/**
 * Функциональный компонент Button.
 * @param {Object} props - Свойства компонента.
 * @param {string} props.type - Тип кнопки, используется для выбора соответствующего стиля из CSS-модуля.
 * @param {Function} props.onClick - Обработчик события клика на кнопку.
 * @param {*} props.children - Вложенные элементы кнопки.
 * @returns {JSX.Element} - Компонент кнопки.
 */
const Button = (props) => {
  const { type, onClick, children } = props;

  return (
    <button className={style[type]} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

