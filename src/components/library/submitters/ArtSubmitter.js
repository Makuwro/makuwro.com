import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import TagInput from "../../input/TagInput";
import ContentInput from "../../input/ContentInput";
import Optional from "../../Optional";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import styles from "../../../styles/Library.module.css";
import SlugInput from "../../input/SlugInput";
import Popup from "../../Popup";

export default function ArtSubmitter({client, submitting, data, setData, setPermissions, submitForm}) {

  const [creatorType, setCreatorType] = useState(0);
  const [imagePath, setImagePath] = useState();
  const [warnUnfinished, setWarnUnfinished] = useState();
  const [canSubmit, setCanSubmit] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const image = useRef();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (data.image) {

      // Turn the image into a local blob so that we can preview it.
      setImagePath(URL.createObjectURL(data.image));

    } else {

      // There's no image blob available, so remove the path.
      setImagePath("");

    }

  }, [data.image]);

  useEffect(() => {

    if (data.image && data.slug) {

      setCanSubmit(true);

    } else {

      setCanSubmit(false);

    }

  }, [data.image, data.slug]);

  function checkBeforeSubmitting(event) {

    if (!submitting && canSubmit) {

      submitForm(event);

    }

  }

  useEffect(() => {

    if (action === "upload-art") {

      setPopupOpen(true);
      setMounted(true);

    } else {

      setPopupOpen(false);

    }

  }, [action]);

  return mounted ? (
    <Popup
      title="Upload art"
      warnUnfinished={warnUnfinished}
      options={
        <button
          disabled={submitting || !canSubmit}
          onClick={checkBeforeSubmitting}>
          Upload art
        </button>
      }
      open={popupOpen}
      onClose={() => setMounted(false) || navigate(location.pathname)}>
      <form onSubmit={checkBeforeSubmitting}>
        <section>
          <section id={styles.fileSelectBackground}>
            <section>
              <input 
                required={!imagePath} 
                type="file" 
                accept="image/*" 
                style={{display: "none"}} 
                ref={image} 
                onChange={({target: {files: [file]}}) => setData("image", file)} 
              />
              {imagePath && (
                <img src={imagePath} />
              )}
              <button type="button" tabIndex="0" onClick={(event) => {

                event.preventDefault();
                image.current.click();

              }}>
                {imagePath ? "Re-s" : "S"}elect image
              </button>
              <p>Please only upload content that you have permission to use.</p>
            </section>
          </section>
          <section>
            <label>
              Description
              <Optional />
            </label>
            <textarea tabIndex="0" value={data.description} onInput={(event) => setData("description", event.target.value)}></textarea>
          </section>
          <section>
            <label>Who created this art?</label>
            <Dropdown tabIndex="0" index={creatorType} onChange={(choice) => setCreatorType(choice)}>
              <li>I am the sole artist</li>
              <li>I collaborated with another on-site artist</li>
              <li>I collaborated with an off-site artist</li>
            </Dropdown>
          </section>
          {creatorType === 1 && (
            <section>
              <label>Who did you collaborate with?</label>
              <ContentInput 
                content={data.collaborators} 
                type={0} 
                client={client} 
                onChange={(collaborators) => setData("collaborators", collaborators)} 
              />
            </section>
          )}
          {creatorType === 2 && (
            <section>
              <label>Who did you collaborate with?</label>
              <TagInput 
                tags={data.collaborators}
                onChange={(collaborators) => setData("collaborators", collaborators)}
              />
            </section>
          )}
        </section>
        <section>
          <section>
            <label htmlFor="tags">
              Tags
              <Optional />
            </label>
            <p>You can use tags to sort your characters and easily find them later.</p>
            <TagInput 
              onChange={(tags) => setData("tags", tags)} 
              tags={data.tags} 
            />
          </section>
          <section>
            <label>
              Folders
              <Optional />
            </label>
            <p>You can add your character to multiple folders.</p>
            <ContentInput 
              content={data.folders} 
              type={1} 
              client={client} 
              onChange={(folders) => setData("folders", folders)} 
            />
          </section>
          <section>
            <label>Worlds<Optional /></label>
            <p>You can directly add your art to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
            <ContentInput 
              content={data.worlds} 
              type={2} 
              client={client} 
              onChange={(worlds) => setData("worlds", worlds)} 
            />
          </section>
          <section>
            <label>Characters<Optional /></label>
            <p>You can directly tag your characters.</p>
            <ContentInput 
              content={data.characters} 
              type={3} 
              client={client} 
              onChange={(characters) => setData("characters", characters)} 
            />
          </section>
        </section>
        <section>
          <section>
            <label htmlFor="url">Art URL</label>
            <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <SlugInput
              username={client.user.username}
              slug={data.slug}
              onChange={(slug) => setData("slug", slug)}
              placeholder={data.name.replaceAll(/[^a-zA-Z0-9_-]/gm, "-").toLowerCase()} 
              path="art"
              required
            />
          </section>
          <section>
            <label>Who can see the watermarked version of this image?</label>
            <Dropdown tabIndex="0" index={data.permissions.view} onChange={(permission) => setPermissions("view", permission)}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can see the non-watermarked version of this image?</label>
            <Dropdown tabIndex="0" index={data.permissions.viewOriginal} onChange={(permission) => setPermissions("viewOriginal", permission)}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can view comments on this image?</label>
            <Dropdown tabIndex="0" index={data.permissions.viewComments} onChange={(permission) => setPermissions("viewComments", permission)}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can comment on this image?</label>
            <Dropdown tabIndex="0" index={data.permissions.postComments - 1} onChange={(permission) => setPermissions("postComments", permission + 1)}>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Would you like to age-restrict this image?</label>
            <p>If so, users must sign in to view this image. If you inappropriately age-gate your image, Makuwro staff might enforce this setting.</p>
            <Dropdown tabIndex="0" index={data.ageRestrictionLevel} onChange={(level) => setData("ageRestrictionLevel", level)}>
              <li>No</li>
              <li>Yes, restrict users under 13 from viewing this</li>
              <li>Yes, restrict users under 17 from viewing this</li>
              <li>Yes, restrict users under 18 from viewing this</li>
            </Dropdown>
          </section>
          <section>
            <label>
              Content warning
              <Optional />
            </label>
            <p>This text will be shown to viewers before they view this image.</p>
            <textarea 
              tabIndex="0" 
              value={data.contentWarning} 
              onInput={(event) => setData("contentWarning", event.target.value)} 
            />
          </section>
        </section>
      </form>
    </Popup>
  ) : null;

}

ArtSubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func,
  update: PropTypes.bool
};