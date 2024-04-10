import React, { useState, useEffect } from "react";
import style from "./Slider.module.css";
import Button from "../Button/Button";
import Image from "next/image";

const Slider = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
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

      setLoading(false);
      setImages(fetchedImages);
      setCurrentId(0);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching images:", error);
    }
  };

  const handleNextButtonClick = () => {
    if (currentId < images.length - 1) {
      setCurrentId(currentId + 1);
    }
  };

  const handlePrevButtonClick = () => {
    if (currentId > 0) {
      setCurrentId(currentId - 1);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.slider}>
          <div className={style.navigation}>
            {/* Условие для отображения кнопки prevButton */}
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
            {!loading && images.length > 0 && (
              <Image
                src={URL.createObjectURL(images[currentId])}
                alt={`Image_${currentId}`}
                height={560}
                width={0}
              />
            )}

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
            {/* Условие для отображения кнопки nextButton */}
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
