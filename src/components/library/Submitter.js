import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import CharacterSubmitter from "./submitters/CharacterSubmitter";
import ArtSubmitter from "./submitters/ArtSubmitter";
import StorySubmitter from "./submitters/StorySubmitter";
import WorldSubmitter from "./submitters/WorldSubmitter";

export default function Submitter({client, art}) {
  
  const [data, setData] = useState({
    name: "",
    terms: "",
    title: "",
    description: "",
    collaborators: [],
    tags: [],
    folders: [],
    worlds: [],
    slug: "",
    ageRestrictionLevel: 0,
    contentWarning: "",
    permissions: {
      view: 0,
      viewOriginal: 0,
      viewComments: 0,
      postComments: 1
    }
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const [popup, setPopup] = useState(null);

  function setDataWrapper(key, value) {

    setData((oldData) => {

      return {
        ...oldData,
        [key]: value
      };

    });

  }

  function setPermissions(key, value) {

    setData((oldData) => {

      return {
        ...oldData,
        permissions: {
          ...oldData.permissions,
          [key]: value
        }
      };

    });

  }

  useEffect(() => {

    if (action) {

      // Makuwro doesn't allow anonymous submissions, 
      // so this won't work if we're not signed in.
      if (client.user) {

        let type;
        let submitting = false;

        const submitForm = async (event) => {

          event.preventDefault();
          if (!submitting) {
            
            submitting = true;
            try {
      
              const props = {...data, slug: data.slug || (data.name || data.title)?.toLowerCase().replaceAll(/[^a-zA-Z0-9_]/gm, "-")};
      
              // Turn the collaborators array into an array of user IDs
              for (let i = 0; (props.collaborators?.length || 0) > i; i++) {
      
                props.collaborators[i] = props.collaborators[i].id;
      
              }
      
              for (let i = 0; (props.worlds?.length || 0) > i; i++) {
      
                data.worlds[i] = data.worlds[i].id;
      
              }
      
              for (let i = 0; (props.characters?.length || 0) > i; i++) {
      
                props.characters[i] = props.characters[i].id;
      
              }
      
              for (let i = 0; (props.folders?.length || 0) > i; i++) {
      
                props.folders[i] = props.folders[i].id;
      
              }

              // Now we're ready to submit the request.
              console.log(props)
              await client.user[`create${type}`](props.slug, props);

              if (type === "Character") {

                type += "s";

              } else if (type === "Story") {

                type = "stories";

              }
      
              navigate(`/${client.user.username}/${type.toLowerCase()}/${props.slug}`);
              submitting = false;
      
            } catch ({message}) {
      
              alert(message);
              submitting = false;
      
            }
      
          }
      
        };

        switch (action) {

          case "create-character":

            // Set the component.
            setPopup(
              <CharacterSubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
                submitForm={submitForm}
              />
            );

            // Set up the popup.
            type = "Character";
            break;

          case "update-art":
          case "upload-art": {

            // Set up the comp.
            setPopup(
              <ArtSubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
                submitForm={submitForm}
              />
            );

            // Fix the title.
            document.title = "Upload art to Makuwro";

            // Remember that this is art.
            type = "Art";
            break;

          }

          case "create-story":
            setPopup(
              <StorySubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
                submitForm={submitForm} />
            );

            // Remember that this a story.
            type = "Story";
            break;

          case "create-world":
            setPopup(
              <WorldSubmitter
                client={client}
                submitting={submitting}
                data={data}
                setData={setData}
                setPermissions={setPermissions}
                submitForm={submitForm} />
            );

            type = "World";
            break;

          default:
            break;

        }
        

      } else {

        navigate(`/signin?redirect=${location.pathname}${location.search}`);

      }

    }

  }, [client, action, data]);

  return popup;
  
}

Submitter.propTypes = {
  setPopupSettings: PropTypes.func,
  client: PropTypes.object,
  notify: PropTypes.func,
  art: PropTypes.any,
  refreshArt: PropTypes.func
};