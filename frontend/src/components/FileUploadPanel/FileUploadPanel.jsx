import React from "react";
import style from "./FileUploadPanel.module.css";
import Button from "../Button/Button";

const FileUploadPanel = () => {
  return (
    <>
      <div className={`${style.container} ${style.positionCenter}`}>
        <div className={`${style.uploadPanel} ${style.flexUploadPanel} `}>
          <h3>Перетащите изображение сюда</h3>
          <span>или нажмите на кнопку</span>

          <div>
            <Button type="uploadPanel"> Выбрать файл </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadPanel;
