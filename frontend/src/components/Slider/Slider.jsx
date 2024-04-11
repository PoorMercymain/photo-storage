import React, { useState, useEffect } from "react";
import style from "./Slider.module.css";
import Button from "../Button/Button";
import Image from "next/image";

/**
 * Компонент Slider для отображения изображений в галерее.
 * @param {Object} props - Свойства компонента.
 * @param {Function} props.onClose - Функция обратного вызова для закрытия Slider.
 * @returns {JSX.Element} - Компонент Slider.
 */
const Slider = ({ onClose }) => {
  const [images, setImages] = useState([]); // Состояние для изображений
  const [currentId, setCurrentId] = useState(0); // Состояние для текущего ID изображения
  const [loading, setLoading] = useState(false); // Состояние загрузки

  // Функция для загрузки изображений с сервера
  const fetchImages = async () => {
    try {
      setLoading(true); // Устанавливаем состояние загрузки в true
      const fetchedImages = [];
      let id = 1;
      let response = null;

      do {
        response = await fetch(`http://localhost:8080/get/${id}`);
        if (response.ok) {
          const fileData = await response.blob();
          const file = new File([fileData], `image_${id}`);
          fetchedImages.push(file);
          id++;
        }
      } while (response.ok);

      setLoading(false); // Устанавливаем состояние загрузки в false
      setImages(fetchedImages); // Устанавливаем полученные изображения в состояние
      setCurrentId(0); // Устанавливаем текущий ID изображения в 0
    } catch (error) {
      setLoading(false); // Устанавливаем состояние загрузки в false в случае ошибки
      console.error("Error fetching images:", error); // Выводим ошибку в консоль
    }
  };

  // Обработчик нажатия на кнопку "Следующее изображение"
  const handleNextButtonClick = () => {
    if (currentId < images.length - 1) {
      setCurrentId(currentId + 1); // Увеличиваем текущий ID на 1, если не достигнут конец списка изображений
    }
  };

  // Обработчик нажатия на кнопку "Предыдущее изображение"
  const handlePrevButtonClick = () => {
    if (currentId > 0) {
      setCurrentId(currentId - 1); // Уменьшаем текущий ID на 1, если не достигнуто начало списка изображений
    }
  };

  // Эффект для загрузки изображений сразу после монтирования компонента
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.slider}>
          <div className={style.navigation}>
            {/* Условие для отображения кнопки prevButton, если текущее изображение не первое */}
            {currentId > 0 && (
              <Button
                type="prevButton"
                onClick={handlePrevButtonClick}
                disabled={currentId === 0}
              >
                <Image
                  src={"/svg/arrow-prev-small-svgrepo.svg"}
                  alt="arrow-prev"
                  height={55}
                  width={0}
                />
              </Button>
            )}
          </div>

          <div className={style.imageContainer}>
            {/* Отображаем текущее изображение */}
            {!loading && images.length > 0 && (
              <Image
                src={URL.createObjectURL(images[currentId])}
                alt={`Image_${currentId}`}
                height={560}
                width={0}
              />
            )}

            {/* Кнопка закрытия Slider */}
            <div className={style.closeButton}>
              <Button type="closeButton" onClick={onClose}>
                <Image
                  src={"/svg/closeButton.svg"}
                  alt="closeButton"
                  height={35}
                  width={0}
                />
              </Button>
            </div>
          </div>

          <div className={style.navigation}>
            {/* Условие для отображения кнопки nextButton, если текущее изображение не последнее */}
            {currentId < images.length - 1 && (
              <Button
                type="nextButton"
                onClick={handleNextButtonClick}
                disabled={currentId === images.length - 1}
              >
                <Image
                  src={"/svg/arrow-next-small-svgrepo.svg"}
                  alt="arrow-next"
                  height={55}
                  width={0}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
