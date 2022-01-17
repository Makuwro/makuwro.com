import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Library.module.css";
import NotFound from "./NotFound";
import Dropdown from "./Dropdown";

export default function LibraryCreator({category, username}) {

  const titles = {
    art: "Upload art",
    character: "Create a character",
    literature: "Create literature"
  };
  let title;
  let page;
  let avatarRef;
  let urlRef;
  let state = {
    name: useState(""),
    description: useState(""),
    avatarURL: useState("https://f2.toyhou.se/file/f2-toyhou-se/users/Christian?19"),
    characterURL: useState(""),
    tags: useState(""),
    art: useState()
  };
  let updateAvatar;
  let updateInput;

  // If they're not logged in, redirect them
  /*
  if (!username) {

    location = `/login?redirect=/library/create/${category || ""}`;
    return;

  };
  */
  // Make sure the category is valid
  title = category ? titles[category] : "Create something";
  if (category && !titles[category]) return <NotFound />;

  // Change the page title
  document.title = `${title} / Makuwro`;

  switch (category) {

    case "art": {

      let artRef = useRef();

      page = (
        <form id={styles["upload-art"]}>
          <p>You can tag your characters and share your art with others.</p>
          <section>
            <section>
              <input type="file" accept="image/*" style={{display: "none"}} ref={artRef} onChange={({target: {files: [file]}}) => state.art[1](URL.createObjectURL(file))} />
              {state.art[0] && (
                <img src={state.art[0]} style={{
                  marginBottom: "1rem"
                }} />
              )}
              <button onClick={(event) => {

                event.preventDefault();
                artRef.current.click();

              }}>{state.art[0] ? "Re-s" : "S"}elect image</button>
              <p>Please only upload content that you have permission to use.</p>
            </section>
          </section>
          <section>
            <h1>Basics</h1>
            <section>
              <label>Name<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <input type="text" />
            </section>
            <section>
              <label>Caption<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <textarea></textarea>
            </section>
            <section>
              <label>Who created this art?</label>
              <Dropdown index={0}>
                <li>I am the sole artist</li>
                <li>I collaborated with another on-site artist</li>
                <li>I collaborated with an off-site artist</li>
                <li>I got this from an on-site artist</li>
                <li>I got this from an off-site artist</li>
              </Dropdown>
            </section>
          </section>
          <section>
            <h1>Organization</h1>
            <section>
              <label htmlFor="tags">Tags<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <p>You can use tags to sort your characters and easily find them later.</p>
              <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
            </section>
            <section>
              <label>Folders<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <p>You can add your character to multiple folders.</p>
              <Dropdown>

              </Dropdown>
            </section>
            <section>
              <label>Worlds<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <p>You can directly add your character to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
              <Dropdown>

              </Dropdown>
            </section>
          </section>
          <section>
            <h1>Sharing</h1>
            <section>
              <label htmlFor="url">Image URL</label>
              <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
              <section className="input-with-prefix">
                <span onClick={() => {

                  urlRef.current.focus();
                  urlRef.current.setSelectionRange(0, 0);

                }}>{`makuwro.com/${username}/images/`}</span>
                <input type="text" name="url" ref={urlRef} onChange={(event) => updateInput(event, "characterURL")} value={state.characterURL[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
              </section>
            </section>
            <section>
              <label>Who can see the watermarked version of this image?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can see the non-watermarked version of this image?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can view comments on this image?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can comment on this image?</label>
              <Dropdown index={0}>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Would you like to age-restrict this image?</label>
              <p>If so, users must sign in to view this image. If you inappropriately age-gate your image, Makuwro staff might enforce this setting.</p>
              <Dropdown index={0}>
                <li>No</li>
                <li>Yes, restrict users under 13 from viewing this</li>
                <li>Yes, restrict users under 17 from viewing this</li>
                <li>Yes, restrict users under 18 from viewing this</li>
              </Dropdown>
            </section>
            <section>
              <label>Content warning<span style={{
                color: "var(--night-text)",
                marginLeft: "0.5rem"
              }}>(optional)</span></label>
              <p>This text will be shown to viewers before they view this image.</p>
              <textarea></textarea>
            </section>
          </section>
          <input type="submit" value="Upload art" />
        </form>
      );
      break;

    }

    case "character":

      updateAvatar = ([file]) => {

        // Make sure we have a file
        if (file) state.avatarURL[1](URL.createObjectURL(file));

      };

      updateInput = ({target: {value: value}}, name) => {

        //if (name !== "characterURL" || !value || /^(?!\.|-)(\w|[-.])+(?<!\.|-)$/.test(value)) {
          
        state[name][1](value);

        //}

      };

      avatarRef = useRef();
      urlRef = useRef();
      page = (
        <form id={styles["upload-character"]}>
          <section>
            <section>
              <input type="file" style={{display: "none"}} ref={avatarRef} onChange={({target}) => updateAvatar(target.files)} accept="image/*" />
              <img src={state.avatarURL[0]} onClick={() => avatarRef.current.click()} id={styles.avatar} />
              <button>Remove</button>
            </section>
            <h1>Basics</h1>
            <section>
              <label htmlFor="name">Character name</label>
              <p>This name will be the first thing people see on the page.</p>
              <input type="text" required onChange={(event) => updateInput(event, "name")} value={state.name[0]} />
            </section>
            <section>
              <label>Description</label>
              <p>This description is shown below your character's name on their page.</p>
              <textarea onChange={(e) => {

                e.preventDefault();
                //setDescription(e.target.value);

              }} value={state.description[0]}></textarea>
            </section>
            <section>
              <label>Who created this character?</label>
              <Dropdown index={0}>
                <li>I am the sole creator of this character</li>
                <li>I collaborated with another on-site creator</li>
                <li>I collaborated with an off-site creator</li>
                <li>I got this character from an on-site creator</li>
                <li>I got this character from an off-site creator</li>
              </Dropdown>
            </section>
          </section>
          <section>
            <h1>Organization</h1>
            <section>
              <label htmlFor="tags">Tags</label>
              <p>You can use tags to sort your characters and easily find them later.</p>
              <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
            </section>
            <section>
              <label>Folders</label>
              <p>You can add your character to multiple folders.</p>
              <Dropdown>

              </Dropdown>
            </section>
            <section>
              <label>Worlds</label>
              <p>You can directly add your character to worlds you manage here. To add your character to a world you don't manage, you have to create this character first, then submit a request to the world admins.</p>
              <Dropdown>

              </Dropdown>
            </section>
          </section>
          <section>
            <h1>Sharing</h1>
            <section>
              <label htmlFor="url">Character URL</label>
              <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
              <section className="input-with-prefix">
                <span onClick={() => {

                  urlRef.current.focus();
                  urlRef.current.setSelectionRange(0, 0);

                }}>{`makuwro.com/${username}/characters/`}</span>
                <input type="text" name="url" ref={urlRef} onChange={(event) => updateInput(event, "characterURL")} value={state.characterURL[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
              </section>
            </section>
            <section>
              <label>Who can view this character?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can comment on this character?</label>
              <Dropdown index={0}>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can view comments on this character?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Character transferability</label>
              <section>
                <input type="checkbox" name="tradable" />
                <label htmlFor="tradable">This character is tradable</label>
              </section>
              <section>
                <input type="checkbox" name="sellable" />
                <label htmlFor="sellable">This character is sellable</label>
              </section>
              <section>
                <input type="checkbox" name="giftable" />
                <label htmlFor="giftable">This character is giftable</label>
              </section>
            </section>
            <section>
              <label>Terms of use</label>
              <p>This will be shown on your character's page. Your <a href={`/${username}/terms`}>global terms of use</a> will be shown below this.</p>
              <textarea>

              </textarea>
            </section>
          </section>
          <input type="submit" value="Create character" />
        </form>
      );
      break;

    case "literature":
      page = (
        <form id={styles["create-literature"]}>
          <section>
            <section>
              <input type="file" style={{display: "none"}} ref={avatarRef} onChange={({target}) => updateAvatar(target.files)} accept="image/*" />
              <img src={state.avatarURL[0]} onClick={() => avatarRef.current.click()} id={styles.cover} />
              <button>Remove</button>
            </section>
            <h1>Basics</h1>
            <section>
              <label htmlFor="name">Title</label>
              <p>This name will be the first thing people see on the page.</p>
              <input type="text" required onChange={(event) => updateInput(event, "name")} value={state.name[0]} />
            </section>
            <section>
              <label>Description</label>
              <p>This description is shown below your literature's name.</p>
              <textarea onChange={(e) => {

                e.preventDefault();
                //setDescription(e.target.value);

              }} value={state.description[0]}></textarea>
            </section>
            <section>
              <input type="checkbox" />
              <label>This literature is a work in progress</label>
            </section>
          </section>
          <section>
            <h1>Organization</h1>
            <section>
              <label htmlFor="tags">Tags</label>
              <p>You can use tags to sort your literature and easily find them later.</p>
              <input type="text" name="tags" onChange={(event) => updateInput(event, "tags")} value={state.tags[0]} />
            </section>
            <section>
              <label>Folders</label>
              <p>You can add your literature to multiple folders.</p>
              <Dropdown>

              </Dropdown>
            </section>
            <section>
              <label>Worlds</label>
              <p>You can directly add your literature to worlds you manage here. To add your literature to a world you don't manage, you have to create this literature first, then submit a request to the world admins.</p>
              <Dropdown>

              </Dropdown>
            </section>
          </section>
          <section>
            <h1>Sharing</h1>
            <section>
              <label htmlFor="url">Literature URL</label>
              <p>Only alphanumeric characters, underscores, hyphens, and periods are allowed.</p>
              <section className="input-with-prefix">
                <span onClick={() => {

                  urlRef.current.focus();
                  urlRef.current.setSelectionRange(0, 0);

                }}>{`makuwro.com/${username}/literature/`}</span>
                <input type="text" name="url" ref={urlRef} onChange={(event) => updateInput(event, "characterURL")} value={state.characterURL[0]} placeholder={state.name[0].replaceAll(" ", "-")}/>
              </section>
            </section>
            <section>
              <label>Who can view this literature?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can comment on this literature?</label>
              <Dropdown index={0}>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <label>Who can view comments on this literature?</label>
              <Dropdown index={0}>
                <li>Everyone, including visitors who aren't logged in</li>
                <li>Registered Makuwro users</li>
                <li>My followers</li>
                <li>My friends</li>
                <li>Specific people</li>
                <li>Just me</li>
              </Dropdown>
            </section>
            <section>
              <input type="checkbox" />
              <label>Disable likes</label>
            </section>
            <section>
              <input type="checkbox" />
              <label>Disable subscriptions</label>
            </section>
          </section>
          <input type="submit" value="Create literature" />
        </form>
      );
      break;

    default:
      break;

  }

  return (
    <section id={styles["library-creator"]}>
      {page}
    </section>
  );

}

LibraryCreator.propTypes = {
  category: PropTypes.string,
  username: PropTypes.string,
  popup: PropTypes.element
};