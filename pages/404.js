import router, {useRouter} from "next/router";
import React from "react";
import Header from "../components/Header";

export default function Custom404(props) {

  if (typeof window !== "undefined") {

    // Check if the original path was actually valid
    const {asPath} = useRouter();
    return (/\/(articles|categories|templates)/gm.test(asPath)) ? router.push(asPath) : (
      <>
        <Header />
        <main id="not-found-container">
          Ooops... That doesn't exist!
        </main>
      </>
    );

  }

  return null;
  
}