import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Dropdown from "../../input/Dropdown";
import TagInput from "../../input/TagInput";
import Optional from "../../Optional";
import ContentInput from "../../input/ContentInput";
import SlugInput from "../../input/SlugInput";
import Popup from "../../Popup";

export default function CharacterSubmitter({client, submitting, data, setData, setPermissions, submitForm}) {

  const [creatorType, setCreatorType] = useState(0);
  const [warnUnfinished, setWarnUnfinished] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatarInput = useRef();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (action === "create-character") {

      setPopupOpen(true);
      setMounted(true);

    } else {

      setPopupOpen(false);

    }

  }, [action]);

  return mounted ? (
    <Popup 
      title="Create character"
      warnUnfinished={warnUnfinished}
      options={
        <button 
          disabled={submitting || !data.name} 
          onClick={submitForm}>
          Create character
        </button>
      }
      open={popupOpen}
      onClose={() => setMounted(false) || navigate(location.pathname)}>
        <form onSubmit={submitForm}>
          <section>
            <section>
              <label htmlFor="name">Character name</label>
              <p>This name will be the first thing people see on the page.</p>
              <input type="text" required onInput={(event) => setData("name", event.target.value)} value={data.name} />
            </section>
            <section>
              <input type="file" style={{display: "none"}} ref={avatarInput} onChange={({target}) => setData("image", target.files[0])} accept="image/*" />
              <label>Character avatar<Optional /></label>
              <p>This is the image that people see before clicking on your character. You can add more art later.</p>
              {data.image && (
                <img style={{marginTop: "1rem"}} src={URL.createObjectURL(data.image)} className="avatar-preview" />
              )}
              <section style={{marginTop: "1rem"}}>
                <input type="button" value="Change avatar" onClick={() => avatarInput.current.click()} />
                <input type="button" className="destructive" value="Remove avatar" style={{marginLeft: "10px"}} onClick={() => setData("image")} disabled={!data.image} />
              </section>
            </section>
            <section>
              <label htmlFor="url">Character URL</label>
              <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
              <SlugInput 
                username={client.user.username}
                slug={data.slug}
                onChange={(slug) => setData("slug", slug)}
                placeholder={data.name.replaceAll(/[^a-zA-Z0-9_-]/gm, "-").toLowerCase()} 
                path="characters"
              />
            </section>
          </section>
        </form>
    </Popup>
  ) : null;

}

CharacterSubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};