import "@/styles/normalize.css"; // Импорт файла стилей для нормализации стилей в различных браузерах
import "@/styles/globals.css"; // Импорт глобальных стилей для всего приложения
import "@/styles/fonts.css"; // Импорт файла стилей для шрифтов

import React from "react"; 
import MainLayout from "../Layouts/MainLayout"; // Импорт компонента общего макета страницы

/* Корневой элемент приложения */
const App = ({ Component, pageProps }) => {
  return (
    <MainLayout> {/* Использование компонента MainLayout в качестве общего макета */}
      <Component {...pageProps} /> {/* Рендеринг компонента страницы, передача всех свойств страницы */}
    </MainLayout>
  );
};

export default App;
