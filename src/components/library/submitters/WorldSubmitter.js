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
          <h1>Basics</h1> 
          <section>
            <label>Title</label>
            <p>This is the name that'll appear in big, <b>bold</b> text when you go to this story's profile.</p>
            <input type="text" value={data.name} onInput={(event) => setData("name", event.target.value)} required />
          </section>
          <section>
            <label>
              Description
              <Optional />
            </label>
            <textarea tabIndex="0" value={data.description} onInput={(event) => setData("description", event.target.value)}></textarea>
          </section>
          <section>
            <Checkbox checked={data.isWIP} onClick={(isWIP) => setData("isWIP", isWIP)}>
              This story is a work-in-progress
            </Checkbox>
          </section>
        </section>
        <section>
          <h1>Organization</h1>
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
            <label>
              Worlds
              <Optional />
            </label>
            <p>You can directly add this story to worlds you manage. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
            <ContentInput 
              content={data.worlds} 
              type={2} 
              client={client} 
              onChange={(worlds) => setData("worlds", worlds)} 
            />
          </section>
          <section>
            <label>
              Characters
              <Optional />
            </label>
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
          <h1>Sharing</h1>
          <section>
            <label htmlFor="url">Story URL</label>
            <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
            <SlugInput
              username={client.user.username}
              slug={data.slug}
              onChange={(slug) => setData("slug", slug)}
              placeholder={data.name.replaceAll(/[^a-zA-Z0-9_-]/gm, "-")} 
              path="worlds"
            />
          </section>
          <section>
            <label>Editors <Optional /></label>
            <p>These people will have access to view reviewer comments and edit your work. They are not able to publish, unpublish, or delete this story.</p>
            {client.user?.isTeam && <p>Admins of {client.user?.displayName} are already able to edit and <i>can</i> delete this story.</p>}
            <ContentInput
              type={0}
              client={client}
              content={data.editors}
              onChange={(editors) => setData("editors", editors)} 
            />
          </section>
          <section>
            <label>Reviewers <Optional /></label>
            <p>These people will have access to read your unpublished work and make private comments.</p>
            <ContentInput
              type={0}
              client={client}
              content={data.reviewers}
              onChange={(reviewers) => setData("reviewers", reviewers)} 
            />
          </section>
          <section>
            <label>Who can view this story?</label>
            <Dropdown tabIndex="0" index={data.permissions.view} onChange={(permission) => setPermissions("view", permission)}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers, editors, and reviewers</li>
              <li>My friends, editors, and reviewers</li>
              <li>Editors and reviewers</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can view comments on this story?</label>
            <Dropdown tabIndex="0" index={data.permissions.viewComments} onChange={(permission) => setPermissions("viewComments", permission)}>
              <li>Everyone, including visitors who aren't logged in</li>
              <li>Registered Makuwro users</li>
              <li>My followers, editors, and reviewers</li>
              <li>My friends, editors, and reviewers</li>
              <li>Editors and reviewers</li>
            </Dropdown>
          </section>
          <section>
            <label>Who can comment on this story?</label>
            <Dropdown tabIndex="0" index={data.permissions.postComments - 1} onChange={(permission) => setPermissions("postComments", permission + 1)}>
              <li>Registered Makuwro users</li>
              <li>My followers</li>
              <li>My friends</li>
              <li>Just me</li>
            </Dropdown>
          </section>
          <section>
            <label>Would you like to age-restrict this story?</label>
            <p>If so, users must sign in to view this story. If you inappropriately age-gate your story, Makuwro staff might enforce this setting.</p>
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
            <p>This text will be shown to viewers before they view this story.</p>
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

WorldSubmitter.propTypes = {
  data: PropTypes.object,
  client: PropTypes.object,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};