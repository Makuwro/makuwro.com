import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import CharacterSubmitter from "./submitters/CharacterSubmitter";
import ArtSubmitter from "./submitters/ArtSubmitter";
import StorySubmitter from "./submitters/StorySubmitter";
import Popup from "../popups/Popup";

export default function Submitter({client, art, refreshArt, updated}) {
  
  const [data, setData] = useState({
    name: "",
    terms: "",
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
      viewComments: 0,
      postComments: 1
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const image = useRef();
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

        let comp;
        let type;
        let title;

        switch (action) {

          case "create-character":

            // Set the component.
            comp = (
              <CharacterSubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
              />
            );

            // Set up the popup.
            title = "Create character";
            setData((oldData) => ({
              ...oldData
            }));
            type = "characters";
            break;

          case "update-art":
          case "upload-art": {

            // Set up the popup.
            const update = art !== undefined;
            title = `Up${update ? "date" : "load"} art`;

            // Set up the comp.
            comp = (
              <ArtSubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
                update={update}
              />
            );

            // Set states.
            setData((oldData) => ({
              ...oldData,
              description: art?.description || oldData.description,
              collaborators: art?.collaborators || oldData.collaborators,
              tags: art?.tags || oldData.tags,
              characters: art?.characters || oldData.characters,
              folders: art?.folders || oldData.folders,
              worlds: art?.worlds || oldData.worlds,
              slug: art?.slug || oldData.slug,
              ageRestrictionLevel: art?.ageRestrictionLevel || oldData.ageRestrictionLevel,
              contentWarning: art?.contentWarning || oldData.contentWarning,
              permissions: {
                ...art?.permissions || oldData.permissions,
                viewOriginal: art?.permissions.viewOriginal || 0,
              }
            }));

            // Fix the title.
            document.title = "Upload art to Makuwro";

            // Remember that this is art.
            type = "art";

            break;

          }

          case "create-story":
            comp = (
              <StorySubmitter 
                client={client}
                submitting={submitting}
                data={data}
                setData={setDataWrapper}
                setPermissions={setPermissions}
              />
            );

            title = "Create a story";
            break;

          default:
            break;

        }

        if (type) {

          const submitForm = async (event) => {

            event.preventDefault();
            if (!submitting) {
              
              setSubmitting(true);
              try {
        
                const {
                  name, slug = data.name?.toLowerCase().replaceAll(/[^a-zA-Z0-9_]/gm, "-"),
                  collaborators, worlds, characters, folders, description, tags, permissions,
                  ageRestrictionLevel, contentWarning
                } = data;
        
                // Turn the collaborators array into an array of user IDs
                const userIds = [];
                for (let i = 0; (collaborators?.length || 0) > i; i++) {
        
                  userIds[i] = collaborators[i].id;
        
                }
        
                const worldIds = [];
                for (let i = 0; (worlds?.length || 0) > i; i++) {
        
                  worldIds[i] = worlds[i].id;
        
                }
        
                const characterIds = [];
                for (let i = 0; (characters?.length || 0) > i; i++) {
        
                  characterIds[i] = characters[i].id;
        
                }
        
                const folderIds = [];
                for (let i = 0; (folders?.length || 0) > i; i++) {
        
                  folderIds[i] = folders[i].id;
        
                }
        
                // Set up form data
                const formData = new FormData();
                formData.append("image", image.current.files[0]);
                formData.append("description", description);
                formData.append("tags", JSON.stringify(tags));
                formData.append("folders", JSON.stringify(folderIds));
                formData.append("worlds", JSON.stringify(worldIds));
                formData.append("characters", JSON.stringify(characterIds));
                formData.append("permissions", JSON.stringify(permissions));
                formData.append("ageRestrictionBLevel", ageRestrictionLevel);
                formData.append("contentWarning", contentWarning);
                formData.append("slug", slug);
        
                if (type !== "art") {
        
                  formData.append("name", name);
        
                }
        
                if (type !== "characters") {
                  
                  formData.append("collaborators", JSON.stringify(userIds));
        
                }
        
                // If this isn't false, that means we have to update the content
                // rather than create new content.
                const oldSlug = art?.slug;
        
                // Now we're ready to submit the request.
                await client.requestREST(`contents/${type}/${client.user.username}/${oldSlug || slug}`, {
                  body: formData,
                  method: oldSlug ? "PATCH" : "POST"
                });
        
                navigate(`/${client.user.username}/${type}/${slug}`);
                refreshArt();
                updated();
        
              } catch ({message}) {
        
                alert(message);
                setSubmitting(false);
        
              }
        
            }
        
          };

          setPopup(
            <Popup title={title} warnUnfinished onClose={() => {
              
              navigate(location.pathname);
              setPopup(null);
            
            }}>
              <form onSubmit={submitForm}>
                {comp}
              </form>
            </Popup>
          );

        }
        

      } else {

        navigate(`/signin?redirect=${location.pathname + location.search}`);

      }

    }

  }, [client, action]);

  return popup;
  
}

Submitter.propTypes = {
  setPopupSettings: PropTypes.func,
  client: PropTypes.object,
  notify: PropTypes.func,
  art: PropTypes.any,
  refreshArt: PropTypes.func,
  updated: PropTypes.func
};