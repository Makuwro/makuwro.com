import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import CharacterSubmitter from "./submitters/CharacterSubmitter";
import ArtSubmitter from "./submitters/CharacterSubmitter";
import StorySubmitter from "./submitters/StorySubmitter";

export default function Submitter({client, art, refreshArt, updated, addPopup}) {
  
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
  const [type, setType] = useState();
  const [popupConfig, setPopupConfig] = useState({});

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
            setPopupConfig({
              title: "Create character",
              open: true
            });
            setData((oldData) => ({
              ...oldData
            }));
            type = "characters";
            break;

          case "update-art":
          case "upload-art": {

            // Set up the popup.
            const update = art !== undefined;
            setPopupConfig({
              title: `Up${update ? "date" : "load"} art`,
              open: true
            });

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

            setPopupConfig({
              title: "Create a story",
              open: true
            });
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
                let oldSlug;
                let formData;
                let response;
                let i;
                let userIds;
                let worldIds;
                let characterIds;
                let folderIds;
        
                // Turn the collaborators array into an array of user IDs
                userIds = [];
                for (i = 0; (collaborators?.length || 0) > i; i++) {
        
                  userIds[i] = collaborators[i].id;
        
                }
        
                worldIds = [];
                for (i = 0; (worlds?.length || 0) > i; i++) {
        
                  worldIds[i] = worlds[i].id;
        
                }
        
                characterIds = [];
                for (i = 0; (characters?.length || 0) > i; i++) {
        
                  characterIds[i] = characters[i].id;
        
                }
        
                folderIds = [];
                for (i = 0; (folders?.length || 0) > i; i++) {
        
                  folderIds[i] = folders[i].id;
        
                }
        
                // Set up form data
                formData = new FormData();
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
                oldSlug = art?.slug;
        
                // Now we're ready to submit the request.
                response = await fetch(`${process.env.RAZZLE_API_DEV}contents/${type}/${client.user.username}/${oldSlug || slug}`, {
                  headers: {
                    token: client.token
                  },
                  body: formData,
                  method: oldSlug ? "PATCH" : "POST"
                });
        
                if (response.ok) {
        
                  navigate(`/${client.user.username}/${type}/${slug}`);
                  refreshArt();
                  updated();
        
                } else {
        
                  throw new Error((await response.json()).message);
        
                }
        
              } catch ({message}) {
        
                alert(message);
                setSubmitting(false);
        
              }
        
            }
        
          };

          setType(type);
          addPopup({
            title: popupConfig.title,
            warnUnfinished: true,
            children: (
              <form onSubmit={submitForm}>
                {comp}
              </form>
            )
          });

        }
        

      } else {

        navigate(`/signin?redirect=${location.pathname + location.search}`);

      }

    }

  }, [client, action]);

  return null;
  
}

Submitter.propTypes = {
  setPopupSettings: PropTypes.func,
  client: PropTypes.object,
  notify: PropTypes.func,
  art: PropTypes.any,
  refreshArt: PropTypes.func,
  updated: PropTypes.func
};