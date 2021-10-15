import { useEffect, useState } from "react";
import router from "next/router";

const wikiServer = process.env.NEXT_PUBLIC_WIKI_SERVER;
function Callback() {

  if (typeof window !== "undefined") {

    // Check if we have a code
    const [callbackCode, setCallbackCode] = useState();
    const code = new URLSearchParams(window.location.search).get("code") || null;
    setCallbackCode(code);

    useEffect(async () => {
      
      if (code) {

        try {

          // Send the code to the server and get a token
          const tokenResponse = await fetch(wikiServer + "/api/callback?code=" + callbackCode, {
            method: "PUT"
          });
          const jsonResponse = await tokenResponse.json();

          switch (tokenResponse.status) {

            case 400:
              break;

            case 200:

              // Save the token as a cookie
              document.cookie = `access_token=${jsonResponse.access_token};expires_in=${jsonResponse.expires_in};refresh_token=${jsonResponse.refresh_token};refresh_token_expires_in=${jsonResponse.refresh_token_expires_in};token_type=${jsonResponse.token_type}; path=/`;

              // Close the window
              window.close();
              break;

            default:
              break;

          }

        } catch (err) {

          return router.push("/");

        }

      }

      // We don't have a code, so let's take it back
      return router.push("/");
      
    }, [callbackCode]);

  }

  return null;

}

export default Callback;