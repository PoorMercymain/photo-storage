import React, { useState, useEffect } from "react";
import style from "./Slider.module.css";
import Button from "../Button/Button";
import Image from "next/image";

const Slider = ({ onClose }) => {
  const [images, setImages] = useState([]); // Состояние для хранения изображений
  const [currentId, setCurrentId] = useState(1); // Текущий ID изображения

  // Функция для загрузки изображений с сервера
  const fetchImages = async () => {
    try {
      const fetchedImages = [];
      let id = currentId;
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

      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Обработчик нажатия на кнопку "Вправо"
  const handleNextButtonClick = () => {
    setCurrentId(currentId + 1);
  };

  // Обработчик нажатия на кнопку "Влево"
  const handlePrevButtonClick = () => {
    if (currentId > 1) {
      setCurrentId(currentId - 1);
    }
  };

  // Загрузка изображений при монтировании компонента и при изменении текущего ID
  useEffect(() => {
    fetchImages();
  }, [currentId]);

  return (
    <>
      <div className={style.container}>
        <div className={style.slider}>
          {/* Кнопка "Влево" */}
          <Button type="prevButton" onClick={handlePrevButtonClick}>
            <Image
              src={"/svg/arrow-prev-small-svgrepo.svg"}
              alt="arrow-prev"
              height={55}
              width={0}
            />
          </Button>

          {/* Отображение текущего изображения */}
          <div className={style.imageContainer}>
            {images.length > 0 && (
              <Image
                src={URL.createObjectURL(images[0])}
                alt={`Image_${currentId}`}
                height={560}
                width={0}
              />
            )}

            {/* Кнопка "Закрытия" */}
            <Button type="closeButton">
              <Image
                src={"/svg/closeButton.svg"}
                alt="closeButton"
                height={25}
                width={20}
              />
            </Button>
          </div>

          {/* Кнопка "Вправо" */}
          <Button type="nextButton" onClick={handleNextButtonClick}>
            <Image
              src={"/svg/arrow-next-small-svgrepo.svg"}
              alt="arrow-next"
              height={55}
              width={0}
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Slider;
