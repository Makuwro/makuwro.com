import "../styles/global.css";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
        <title>The Showrunners Wiki</title>
      </Head>
      <Component {...pageProps} />
    </>
  );

}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
};

export default App;
