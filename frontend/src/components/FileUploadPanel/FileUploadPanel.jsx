import React, { useState, useRef } from "react";
import style from "./FileUploadPanel.module.css";
import Button from "../Button/Button";
import SuccessModal from "../SuccessModal/SuccessModal";
import Slider from "../Slider/Slider";

/**
 * Компонент для загрузки файлов на сервер и отображения интерфейса загрузки.
 * @returns {JSX.Element} - Компонент загрузки файлов.
 */
const FileUploadPanel = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // Состояние для выбранных файлов
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [fileFromServerLoaded, setFileFromServerLoaded] = useState(false); // Состояние для отслеживания загрузки файла с сервера
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Состояние для отслеживания видимости всплывающего окна
  const fileInputRef = useRef(null); // Ссылка на элемент input для выбора файла
  const [drag, setDrag] = useState(false); // Состояние перетаскивания файла
  const [currentId, setCurrentId] = useState(0); // Состояние текущего ID изображения в Slider

  // Обработчик изменения выбранных файлов
  const handleFileChange = async (event) => {
    const files = event.target.files; // Получаем выбранные файлы из события
    const validFiles = Array.from(files).filter((file) =>
      /\.(png|jpeg|webp)$/i.test(file.name)
    ); // Фильтруем файлы по формату
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles); // Устанавливаем выбранные файлы в состояние
      await Promise.all(validFiles.map(uploadFile)); // Вызываем функцию загрузки для каждого файла
    } else {
      alert("Пожалуйста, выберите файлы формата PNG, JPEG или WebP.");
    }
  };

  // Обработчик клика по кнопке выбора файла
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Эмулируем клик по input для выбора файла
  };

  // Обработчики событий перетаскивания файла
  const dragStartHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setDrag(false);
  };

  const dragEnterHandler = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    setDrag(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files: files } });
    }
  };

  // Функция для загрузки файла на сервер
  const uploadFile = async (file) => {
    try {
      const fileData = await file.arrayBuffer(); // Получаем данные файла в виде ArrayBuffer
      const blob = new Blob([fileData], { type: file.type }); // Создаем Blob из данных файла с соответствующим Content-Type

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type, // Устанавливаем Content-Type из выбранного файла
        },
        body: blob, // Устанавливаем тело запроса как Blob
      });

      console.log("File uploaded successfully", response);
      setShowSuccessModal(true); // Открываем всплывающее окно после успешной загрузки файла
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Функция для получения файла с сервера
  const fetchFileFromServer = async () => {
    try {
      setLoading(true); // Устанавливаем состояние загрузки в true
      const response = await fetch("http://localhost:8080/get/2");
      const fileData = await response.blob(); // Получаем данные файла в виде Blob
      const file = new File([fileData], "filename"); // Создаем файл с фиксированным именем

      setSelectedFiles([file]); // Устанавливаем полученный файл в состояние
      setFileFromServerLoaded(true); // Устанавливаем состояние загрузки файла с сервера в true
    } catch (error) {
      console.error("Error fetching file from server:", error);
    } finally {
      setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
    }
  };

  // Обработчик закрытия Slider и всплывающего окна
  const handleCloseSlider = () => {
    setShowSuccessModal(false); // Закрываем всплывающее окно
    setFileFromServerLoaded(false); // Скрываем Slider и снова отображаем FileUploadPanel
  };

  return (
    <>
      <div className={`${style.container} ${style.positionCenter}`}>
        <div
          className={`${style.uploadPanel}`}
          onDrop={dropHandler}
          onDragStart={dragStartHandler}
          onDragLeave={dragLeaveHandler}
          onDragEnter={dragEnterHandler}
          onDragOver={(e) => {
            e.preventDefault();
            if (!selectedFiles.length) {
              setDrag(true);
            }
          }}
        >
          {/* Показываем информацию о перетаскивании файла или выборе файла */}
          {drag ? (
            <div className={style.flexUploadPanel}>
              <h3>Отпустите файл чтобы загрузить его</h3>
            </div>
          ) : (
            <div className={style.flexUploadPanel}>
              <h3>Перетащите изображение сюда</h3>
              <span>или нажмите на кнопку</span>

              {/* Кнопки для выбора файла и загрузки файла с сервера */}
              <div className={style.flexButton}>
                <Button type="uploadPanel" onClick={handleButtonClick}>
                  Отправить на сервер
                  {/* Элемент input для выбора файла */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple // Разрешаем выбор нескольких файлов
                  />
                </Button>

                <Button
                  type="uploadPanel"
                  onClick={fetchFileFromServer}
                  disabled={loading} // Блокируем кнопку во время загрузки
                >
                  Загрузить с сервера
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Отображаем Slider, если была загружена картинка с сервера */}
        {fileFromServerLoaded ? (
          <Slider
            images={selectedFiles}
            currentId={currentId}
            onClose={handleCloseSlider} // Передаем функцию для закрытия Slider
          />
        ) : null}

        {/* Отображаем всплывающее окно в случае успеха */}
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </div>
    </>
  );
};

export default FileUploadPanel;
