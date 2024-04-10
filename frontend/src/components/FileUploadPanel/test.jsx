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




/*

import React, { useState, useRef, useEffect } from "react";
import style from "./FileUploadPanel.module.css";
import Button from "../Button/Button";
import Image from "next/image";

const FileUploadPanel = () => {
  // Состояния компонента
  const [selectedFile, setSelectedFile] = useState(null); // Выбранный файл
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [fileFromServerLoaded, setFileFromServerLoaded] = useState(false); // Состояние для отслеживания загрузки файла с сервера
  const fileInputRef = useRef(null); // Ссылка на элемент input для выбора файла
  const [drag, setDrag] = useState(false); // Состояние перетаскивания файла

  // Обработчик изменения выбранного файла
  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Получаем выбранный файл из события
    // Проверяем соответствие формата файла требуемым расширениям
    if (file && /\.(png|jpeg|webp)$/i.test(file.name)) {
      setSelectedFile(file); // Устанавливаем выбранный файл в состояние
      await uploadFile(file); // Вызываем функцию загрузки файла сразу после выбора
    } else {
      alert("Пожалуйста, выберите файл формата PNG, JPEG или WebP.");
    }
  };

  // Обработчик клика по кнопке выбора файла
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Эмулируем клик по input для выбора файла
  };

  // Обработчик клика по кнопке закрытия выбранного файла
  const handleCloseButtonClick = () => {
    setSelectedFile(null); // Сбрасываем выбранный файл
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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Функция для получения файла с сервера
  const fetchFileFromServer = async () => {
    try {
      setLoading(true); // Устанавливаем состояние загрузки в true
      const response = await fetch("http://localhost:8080/get/10"); // Замените "10" на конкретный идентификатор файла
      const fileData = await response.blob(); // Получаем данные файла в виде Blob
      const file = new File([fileData], "filename"); // Создаем файл с фиксированным именем

      setSelectedFile(file); // Устанавливаем полученный файл в состояние
      setFileFromServerLoaded(true); // Устанавливаем состояние загрузки файла с сервера в true
    } catch (error) {
      console.error("Error fetching file from server:", error);
    } finally {
      setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
    }
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
            if (!selectedFile) {
              setDrag(true);
            }
          }}
        >
       
          {drag ? (
            <div className={style.flexUploadPanel}>
              <h3>Отпустите файл чтобы загрузить его</h3>
            </div>
          ) : (
            // Показываем информацию о выборе файла
            <div className={style.flexUploadPanel}>
              <h3>Перетащите изображение сюда</h3>
              <span>или нажмите на кнопку</span>

              <div className={style.flexButton}>
              
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

        
                <Button
                  type="uploadPanel"
                  onClick={fetchFileFromServer}
                  disabled={loading} // Блокируем кнопку во время загрузки
                >
                  Загрузить файл с сервера
                </Button>
              </div>
            </div>
          )}
        </div>

       
        {fileFromServerLoaded && selectedFile && (
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

*/


/*
import React, { useState, useRef } from "react";
import style from "./FileUploadPanel.module.css";
import Button from "../Button/Button";
import Image from "next/image";
import SuccessModal from "../SuccessModal/SuccessModal"; // Импортируем компонент всплывающего окна

const FileUploadPanel = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // Состояние для выбранных файлов
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [fileFromServerLoaded, setFileFromServerLoaded] = useState(false); // Состояние для отслеживания загрузки файла с сервера
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Состояние для отслеживания видимости всплывающего окна
  const fileInputRef = useRef(null); // Ссылка на элемент input для выбора файла
  const [drag, setDrag] = useState(false); // Состояние перетаскивания файла

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

  // Обработчик клика по кнопке закрытия выбранного файла
  const handleCloseButtonClick = () => {
    setSelectedFiles([]); // Сбрасываем выбранные файлы
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

  // Обработчик закрытия всплывающего окна
  const handleCloseModal = () => {
    setShowSuccessModal(false);
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
  
          {drag ? (
            <div className={style.flexUploadPanel}>
              <h3>Отпустите файл чтобы загрузить его</h3>
            </div>
          ) : (
            // Показываем информацию о выборе файла
            <div className={style.flexUploadPanel}>
              <h3>Перетащите изображение сюда</h3>
              <span>или нажмите на кнопку</span>

              <div className={style.flexButton}>
               
                <Button type="uploadPanel" onClick={handleButtonClick}>
                  Отправить на сервер
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

        
        {fileFromServerLoaded &&
          selectedFiles.map((file, index) => (
            <div key={index}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`Selected ${index}`}
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
            </div>
          ))}

        
        {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
      </div>
    </>
  );
};

export default FileUploadPanel; 
*/