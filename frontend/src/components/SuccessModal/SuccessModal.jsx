import React from "react";
import Image from "next/image";
import style from "./SuccessModal.module.css";
import Button from "../Button/Button";

const SuccessModal = ({ onClose }) => {
  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <h2>Файл(ы) успешно отправлен(ы) на сервер</h2>
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
