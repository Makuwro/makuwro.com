import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import SlugInput from "../../input/SlugInput";
import Popup from "../../Popup";

export default function WorldSubmitter({client, submitting, data, setData, setPermissions, submitForm}) {

  const [warnUnfinished, setWarnUnfinished] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {

    if (action === "create-world") {

      setPopupOpen(true);
      setMounted(true);

    } else {

      setPopupOpen(false);

    }

  }, [action]);

  useEffect(() => {

    if (data.name) {

      setCanSubmit(true);
      
    } else {

      setCanSubmit(false);

    }

  }, [data]);

  return mounted ? (
    <Popup
      title="Create world"
      warnUnfinished={warnUnfinished}
      options={
        <button onClick={submitForm} disabled={!canSubmit}>Create world</button>
      }
      onClose={() => setMounted(false) || navigate(location.pathname)}
      open={popupOpen}>
      <form onSubmit={submitForm}>
        <section>
          <section>
            <h1>Name</h1>
            <p>This is the name that'll appear in big, <b>bold</b> text when you go to this world's profile.</p>
            <input type="text" value={data.name} onInput={(event) => setData("name", event.target.value)} required />
          </section>
          <section>
            <h1>World URL</h1>
            <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <SlugInput
              username={client.user.username}
              slug={data.slug}
              onChange={(slug) => setData("slug", slug)}
              placeholder={data.name?.replaceAll(/[^a-zA-Z0-9_-]/gm, "-")} 
              path="worlds"
            />
          </section>
        </section>
      </form>
    </Popup>
  ) : null;

}

WorldSubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};