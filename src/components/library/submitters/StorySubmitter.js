import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import TagInput from "../../input/TagInput";
import ContentInput from "../../input/ContentInput";
import Optional from "../../Optional";
import Checkbox from "../../input/Checkbox";
import SlugInput from "../../input/SlugInput";
import Popup from "../../Popup";

export default function StorySubmitter({client, submitting, data, setData, setPermissions, submitForm}) {

  const [warnUnfinished, setWarnUnfinished] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatarInput = useRef();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {

    if (action === "create-story") {

      setPopupOpen(true);
      setMounted(true);

    } else {

      setPopupOpen(false);

    }

  }, [action]);

  useEffect(() => {

    if (data.title) {

      setCanSubmit(true);
      
    } else {

      setCanSubmit(false);

    }

  }, [data]);

  return mounted ? (
    <Popup
      title="Create story"
      warnUnfinished={warnUnfinished}
      options={
        <button onClick={submitForm} disabled={!canSubmit}>Create story</button>
      }
      onClose={() => setMounted(false) || navigate(location.pathname)}
      open={popupOpen}>
      <form onSubmit={submitForm}>
        <section>
          <section>
            <h1>Title</h1>
            <p>This is the name that'll appear in big, <b>bold</b> text when you go to this story's profile.</p>
            <input type="text" value={data.title} onInput={(event) => setData("title", event.target.value)} required />
          </section>
          <section>
            <label htmlFor="url">Story URL</label>
            <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <SlugInput
              username={client.user.username}
              slug={data.slug}
              onChange={(slug) => setData("slug", slug)}
              placeholder={data.title.replaceAll(/[^a-zA-Z0-9_-]/gm, "-")} 
              path="stories"
            />
          </section>
        </section>
      </form>
    </Popup>
  ) : null;

}

StorySubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};