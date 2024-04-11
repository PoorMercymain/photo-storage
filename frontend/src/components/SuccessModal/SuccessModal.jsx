import React from "react";
import Image from "next/image";
import style from "./SuccessModal.module.css";
import Button from "../Button/Button";

/**
 * Компонент SuccessModal для отображения модального окна об успешной загрузке файла.
 * @param {Object} props - Свойства компонента.
 * @param {Function} props.onClose - Функция обратного вызова для закрытия модального окна.
 * @returns {JSX.Element} - Компонент модального окна.
 */
const SuccessModal = ({ onClose }) => {
  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <h2>Файл(ы) успешно отправлен(ы) на сервер</h2>
        {/* Кнопка закрытия модального окна */}
        <Button type="closeButton" onClick={onClose}>
          <Image
            src={"/svg/closeButton.svg"}
            alt="closeButton"
            height={25}
            width={25}
          />
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
