import Head from "next/head";
import React from "react";
import FileUploadPanel from "../components/FileUploadPanel/FileUploadPanel";

/* Домашнаяя страница */
const Home = () => (
  <>
    <Head>
      <title>file-upload-panel</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    
    <main> 
        <FileUploadPanel/>
    </main>
  </>
);

export default Home;
