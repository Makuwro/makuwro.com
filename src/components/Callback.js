import React, {useEffect} from "react";
import { useHistory } from "react-router";

const wikiServer = process.env.NEXT_PUBLIC_WIKI_SERVER;
export default function Callback() {

  const [preRendered, setPrerendered] = React.useState(false);
  const history = useHistory();

  useEffect(async () => {

    if (!preRendered) {

      setPrerendered(true);
      return;

    }
    
    // Check if we have a code
    const code = new URLSearchParams(window.location.search).get("code") || null;
    if (code) {

      try {

        // Send the code to the server and get a token
        const tokenResponse = await fetch(wikiServer + "/api/callback?code=" + code, {
          method: "PUT"
        });
        const jsonResponse = await tokenResponse.json();

        switch (tokenResponse.status) {

          case 400:
            break;

          case 200:

            // Save the token as a cookie
            document.cookie = `access_token=${jsonResponse.access_token};expires_in=${jsonResponse.expires_in};refresh_token=${jsonResponse.refresh_token};refresh_token_expires_in=${jsonResponse.refresh_token_expires_in};token_type=${jsonResponse.token_type}; path=/`;
            console.log(jsonResponse);

            // Close the window
            window.close();
            break;

          default:
            break;

        }

      } catch (err) {

        history.replace("/");
        return;

      }

    }

    // We don't have a code, so let's take it back
    history.replace("/");
    
  }, [preRendered]);

  return null;

}