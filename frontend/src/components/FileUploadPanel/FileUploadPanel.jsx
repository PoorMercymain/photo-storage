import React, { useState, useRef } from "react";
import style from "./FileUploadPanel.module.css";
import Button from "../Button/Button";
import Image from "next/image";

/**
 * Компонент FileUploadPanel для загрузки файлов.
 * @returns {JSX.Element} - Возвращает JSX элемент панели загрузки файлов.
 */
const FileUploadPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Состояние для хранения выбранного файла
  const fileInputRef = useRef(null); // Ссылка на элемент input для выбора файла
  const [drag, setDrag] = useState(false); // Состояние для определения, происходит ли перетаскивание файла

  // Обработчик изменения выбранного файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Проверяем формат файла (png, jpeg, webp)
    if (file && /\.(png|jpe?g|webp)$/i.test(file.name)) {
      setSelectedFile(file); // Устанавливаем выбранный файл
    } else {
      alert("Пожалуйста, выберите файл формата PNG, JPEG или WebP.");
    }
  };

  // Обработчик нажатия на кнопку выбора файла
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Эмулируем клик по элементу input
  };

  // Обработчик нажатия на кнопку закрытия файла
  const handleCloseButtonClick = () => {
    setSelectedFile(null); // Сбрасываем выбранный файл
  };

  // Обработчик начала перетаскивания файла
  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true); // Устанавливаем состояние перетаскивания
  };

  // Обработчик выхода файла из области
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false); // Сбрасываем состояние перетаскивания
  };

  // Обработчик входа файла в область
  const dragEnterHandler = (e) => {
    e.preventDefault();
    setDrag(true); // Устанавливаем состояние перетаскивания
  };

  // Обработчик отпускания файла в области
  const dropHandler = (e) => {
    e.preventDefault();
    setDrag(false); // Сбрасываем состояние перетаскивания

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files: files } }); // Вызываем обработчик изменения выбранного файла
    }
  };

  return (
    <>
      <div className={`${style.container} ${style.positionCenter}`}>
        <div
          className={`${style.uploadPanel} ${selectedFile && style.hiding}`}
          onDrop={dropHandler} // Обработчик отпускания файла
          onDragStart={dragStartHandler} // Обработчик начала перетаскивания файла
          onDragLeave={dragLeaveHandler} // Обработчик выхода файла из области
          onDragEnter={dragEnterHandler} // Обработчик входа файла в область
          onDragOver={(e) => {
            e.preventDefault();
            // Устанавливаем состояние перетаскивания только если нет выбранного файла
            if (!selectedFile) {
              setDrag(true);
            }
          }}
        >
          {drag ? ( // Если происходит перетаскивание файла
            <div className={style.flexUploadPanel}>
              <h3>Отпустите файл чтобы загрузить его</h3>
            </div>
          ) : (
            // Если нет перетаскиваемого файла
            <div className={style.flexUploadPanel}>
              <h3>Перетащите изображение сюда</h3>
              <span>или нажмите на кнопку</span>

              <div>
                <Button type="uploadPanel" onClick={handleButtonClick}>
                  Выбрать файл
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedFile && ( // Если выбран файл
          <>
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              className={style.selectedImage}
              height={360}
              width={0}
            />

            <Button type="closeButton" onClick={handleCloseButtonClick}>
              <Image
                src={"/svg/closeButton.svg"}
                alt="closeButton"
                height={25}
                width={25}
              />
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default FileUploadPanel;
