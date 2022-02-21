import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Settings.module.css";
import Checkbox from "../input/Checkbox";
import Dropdown from "../input/Dropdown";

export default function PrivacySettings({currentUser}) {

  const navigate = useNavigate();
  document.title = "Privacy settings / Makuwro";

  return (
    <>
      <section>
        <section>
          <h1>Blocked members</h1>
          <p>These members can't interact with you. If they create alternate accounts to bypass your block, please report them.</p>
          <Dropdown>
            
          </Dropdown>
          <button disabled>Unblock</button>
        </section>
        <section>
          <h2>Guests and your content</h2>
          <p>Allowing guests might improve your discoverability. However, it can be problematic if you want to enforce your block list. Here, you get the choice.</p>
          <Checkbox>Allow guests to view my profile and my content</Checkbox>
        </section>
        <section>
          <h2>Optional data you can send to Makuwro</h2>
          <p>There is some extra data you can give us so we can make the Makuwro experience better for you and everyone else.</p>
          <Checkbox>Use my data to personalize my experience</Checkbox>
          <Checkbox>Use my data to improve Makuwro</Checkbox>
        </section>
        <section>
          <h2>Request your data</h2>
          <p>Want to know everything we know about you? Give us up to 30 days to package your data, and then we'll shoot you an email.</p>
          <button>Request my data</button>
        </section>
        <section>
          <p>Wondering how we use your data and who we share your data to? Give the <a href="https://help.makuwro.com/policies/privacy">privacy policy</a> a read.</p>
        </section>
      </section>
    </>
  );

}