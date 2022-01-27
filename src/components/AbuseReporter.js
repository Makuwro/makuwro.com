import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import Popup from "./Popup";
import styles from "../styles/AbuseReporter.module.css";
import CountryDropdown from "./CountryDropdown";

export default function AbuseReporter() {

  const [menu, setMenu] = useState([]);
  const [escalate, setEscalate] = useState(false);

  return (
    <Popup title="Report abuse">
      <p>Think you found something that shouldn't be on Makuwro? Let us know!</p>
      <form>
        <section>
          <label>What's the problem?</label>
          <Dropdown onChange={(index) => {

            setMenu([index]);
            setEscalate(index === 0 || index === 2 || index === 3);

          }}>
            <li>This is spam or misleading</li>
            <li>This is mean</li>
            <li>This isn't age-gated properly</li>
            <li>This is sexualizes minors</li>
            <li>This is infringes on my or my client's copyright or trademark</li>
            <li>This is exposes my personal information that I didn't publicly share</li>
            <li>This is something else</li>
          </Dropdown>
        </section>
        {menu[0] === 1 && (
          <section>
            <label>In what way?</label>
            <Dropdown onChange={() => setEscalate(true)}>
              <li>The uploader posted this to harass me or someone else</li>
              <li>This is hateful against a protected category, such as race, gender, sex, or disability</li>
            </Dropdown>
          </section>
        )}
        {menu[0] === 4 && (
          <>
            <section>
              <label>Did you want to contact the uploader first?</label>
              <p>This isn't required, but maybe there was a misunderstanding. You can always continue your report.</p>
              <Dropdown onChange={(index) => setMenu([4, index])}>
                <li>Yes, I'll contact the uploader before filing a complaint</li>
                <li>No, I want to file a complaint now</li>
              </Dropdown>
            </section>
            {menu[1] === 0 && (
              <p className={styles.reason}>You can message the uploader by <Link to={"/Christian?action=message"}>clicking here.</Link></p>
            )}
            {menu[1] === 1 && (
              <>
                <section>
                  <label>Who is affected?</label>
                  <p>Sending takedown requests for content you do not own is grounds for the termination of your Makuwro account.</p>
                  <Dropdown onChange={(index) => setMenu([4, 1, index])}>
                    <li>Me</li>
                    <li>My client or my organization</li>
                  </Dropdown>
                </section>
                {menu[2] !== undefined && (
                  <>
                    <section>
                      <label>What is the type of your intellectual property?</label>
                      <Dropdown onChange={(index) => {

                        setMenu([4, 1, menu[2], index]);
                        setEscalate(true);

                      }}>
                        <li>It infringes my copyright</li>
                        <li>It infringes my trademark</li>
                      </Dropdown>
                    </section>
                    {menu[3] === 0 && (
                      <>
                        <section>
                          <label>What is the relationship to copyrighted content?</label>
                          <p>Job title, role, etc.</p>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is the name of the copyright owner?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your email address?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your country?</label>
                          <CountryDropdown />
                        </section>
                        <section>
                          <label>What is your street address?</label>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your city?</label>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your state or province?</label>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What do you want Makuwro's Trust & Safety team to do?</label>
                          <Dropdown>
                            <li>Remove this content</li>
                            <li>Hide this content where only the uploader can view it, and prevent them from changing sharing settings</li>
                            <li>Transfer ownership of this content to this account</li>
                          </Dropdown>
                          <input type="checkbox" defaultChecked />
                          <label><a href="https://support.makuwro.com/policies/copyright#strikes" target="_blank" rel="noreferrer">Strike</a> the uploader's account</label>
                        </section>
                        <section>
                          <label>Legal agreements</label>
                          <section>
                            <input type="checkbox" required />
                            <label>I am in good faith that the use of this material was not authorized by the copyright owner, its agent, or the law, incliuding fair use.</label>
                          </section>
                          <section>
                            <input type="checkbox" required />
                            <label>I affirm, under penalty of perjury, that the information in the notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</label>
                          </section>
                          <section>
                            <input type="checkbox" required />
                            <label>I understand that submitting a fraudulent report is grounds for termination of my Makuwro account.</label>
                          </section>
                          <section>
                            <input type="checkbox" required />
                            <label>This is not a duplicate request.</label>
                          </section>
                          <section>
                            <label>Electronic signature</label>
                            <p>Please sign this request by typing your full legal name. This is the name that appears on your government ID.</p>
                            <input type="text" required />
                          </section>
                        </section>
                      </>
                    )}
                    {menu[3] === 1 && (
                      <>

                      </>
                    )}
                  </>
                )}
              </>
            )}
            
          </>
        )}
        {menu[0] === 6 && (
          <p className={styles.reason}>Makuwro only removes content that violates our <a href="https://about.makuwro.com/policies">policies</a>; however, you always have the option to <Link to={"/Christian?action=block"}>block</Link> the creator. You won't be able to see what they post, and they won't be able to interact with you.</p>
        )}
        {escalate && (
          <section>
            <label>Is there anything else you would like to tell us? <span>(optional)</span></label>
            <textarea>

            </textarea>
            <input type="submit" value="Submit report" />
          </section>
        )}
      </form>
    </Popup>
  );

}