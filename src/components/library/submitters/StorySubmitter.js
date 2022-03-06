import React from "react";
import Dropdown from "../../input/Dropdown";
import PropTypes from "prop-types";
import TagInput from "../../input/TagInput";
import ContentInput from "../../input/ContentInput";
import Optional from "../../Optional";
import Checkbox from "../../input/Checkbox";
import SlugInput from "../../input/SlugInput";

export default function StorySubmitter({currentUser, submitting, data, setData, setPermissions}) {

  return (
    <>
      <section>
        <section>
          <label>Literature name</label>
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
            This literature is a work-in-progress
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
            currentUser={currentUser} 
            onChange={(folders) => setData("folders", folders)} 
          />
        </section>
        <section>
          <label>
            Worlds
            <Optional />
          </label>
          <p>You can directly add your literature to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
          <ContentInput 
            content={data.worlds} 
            type={2} 
            currentUser={currentUser} 
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
            currentUser={currentUser} 
            onChange={(characters) => setData("characters", characters)} 
          />
        </section>
      </section>
      <section>
        <h1>Sharing</h1>
        <section>
          <label htmlFor="url">Literature URL</label>
          <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
          <SlugInput
            username={currentUser.username}
            slug={data.slug}
            onChange={(slug) => setData("slug", slug)}
            placeholder={data.name.replaceAll(/[^a-zA-Z0-9_-]/gm, "-")} 
            path="stories"
          />
        </section>
        <section>
          <label>Editors</label>
          <p>These people will have access to view reviewer comments and edit your work. They are not able to publish, unpublish, or delete this literature.</p>
          {currentUser.isTeam && <p>Admins of {currentUser.displayName} are already able to edit and <i>can</i> delete this literature.</p>}
          <ContentInput
            type={0}
            currentUser={currentUser}
            content={data.editors}
            onChange={(editors) => setData("editors", editors)} 
          />
        </section>
        <section>
          <label>Reviewers</label>
          <p>These people will have access to read your unpublished work and make private comments.</p>
          <ContentInput
            type={0}
            currentUser={currentUser}
            content={data.reviewers}
            onChange={(reviewers) => setData("reviewers", reviewers)} 
          />
        </section>
        <section>
          <label>Who can view this literature?</label>
          <Dropdown tabIndex="0" index={data.permissions.view} onChange={(permission) => setPermissions("view", permission)}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers, editors, and reviewers</li>
            <li>My friends, editors, and reviewers</li>
            <li>Editors and reviewers</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can view comments on this literature?</label>
          <Dropdown tabIndex="0" index={data.permissions.viewComments} onChange={(permission) => setPermissions("viewComments", permission)}>
            <li>Everyone, including visitors who aren't logged in</li>
            <li>Registered Makuwro users</li>
            <li>My followers, editors, and reviewers</li>
            <li>My friends, editors, and reviewers</li>
            <li>Editors and reviewers</li>
          </Dropdown>
        </section>
        <section>
          <label>Who can comment on this literature?</label>
          <Dropdown tabIndex="0" index={data.permissions.postComments - 1} onChange={(permission) => setPermissions("postComments", permission + 1)}>
            <li>Registered Makuwro users</li>
            <li>My followers</li>
            <li>My friends</li>
            <li>Just me</li>
          </Dropdown>
        </section>
        <section>
          <label>Would you like to age-restrict this literature?</label>
          <p>If so, users must sign in to view this literature. If you inappropriately age-gate your literature, Makuwro staff might enforce this setting.</p>
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
          <p>This text will be shown to viewers before they view this literature.</p>
          <textarea 
            tabIndex="0" 
            value={data.contentWarning} 
            onInput={(event) => setData("contentWarning", event.target.value)} 
          />
        </section>
      </section>
      <input disabled={submitting} tabIndex="0" type="submit" value="Create literature" />
    </>
  );

}

StorySubmitter.propTypes = {
  data: PropTypes.object,
  currentUser: PropTypes.object,
  submitting: PropTypes.bool,
  setData: PropTypes.func,
  setPermissions: PropTypes.func
};