import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./input/Dropdown";
import styles from "../styles/AbuseReporter.module.css";
import CountryDropdown from "./input/CountryDropdown";
import Checkbox from "./input/Checkbox";

export default function AbuseReporter({setPopupSettings}) {

  const [menu, setMenu] = useState([]);
  const [escalate, setEscalate] = useState(false);
  const [reported, setReported] = useState();

  let reporting = false;
  async function submitReport() {

    // Check if they're already sending the report
    if (!reporting) {

      // Make sure they don't submit duplicate requests
      reporting = true;

      // Just in case there's a problem, wrap it around a try-catch
      try {

        // Send the report to the server
        const response = await fetch();

        // Check if everything went OK
        if (!response.ok) {

          // Something bad happened, so throw an error
          throw new Error(`${response.status}: ${response.statusText}`);

        }

        // Everything went OK, so tell the user!
        setReported(true);

      } catch (err) {

        // Print the error to the console
        console.warn(`Couldn't submit report: ${err.message}`);

      }

    }

  }

  useEffect(() => {

    setPopupSettings({
      title: "Report abuse",
      warnUnfinished: true
    });

  }, []);

  return (
    <>
      <p>Think you found something that shouldn't be on Makuwro? Let us know!</p>
      <form>
        <section>
          <label>What's the problem?</label>
          <Dropdown index={menu[0]} onChange={(index) => {

            setMenu([index]);
            setEscalate(index === 0 || index === 2 || index === 3 || index === 5 || index === 6);

          }} inPopup>
            <li>This is spam or misleading</li>
            <li>This is mean</li>
            <li>This isn't age-gated properly</li>
            <li>This sexualizes minors</li>
            <li>This infringes on my or my client's copyright or trademark</li>
            <li>This encourages real-life violence</li>
            <li>This exposes my personal information that I didn't publicly share</li>
            <li>This is something else</li>
          </Dropdown>
        </section>
        {menu[0] === 1 && (
          <section>
            <label>In what way?</label>
            <Dropdown index={menu[1]} onChange={(index) => {
              
              setMenu([1, index]);
              setEscalate(true);
            
            }} inPopup>
              <li>This was posted to harass me or someone else</li>
              <li>This is hateful against a protected category, such as race, gender, sex, or disability</li>
            </Dropdown>
          </section>
        )}
        {menu[0] === 4 && (
          <>
            <section>
              <label>Did you want to contact the uploader first?</label>
              <p>This isn't required, but maybe there was a misunderstanding. You can always continue your report.</p>
              <Dropdown index={menu[1]} onChange={(index) => {

                setEscalate(false);
                setMenu([4, index]);

              }} inPopup>
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
                  <Dropdown onChange={(index) => setMenu([4, 1, index, menu[3]])} inPopup>
                    <li>Me</li>
                    <li>My client or my organization</li>
                  </Dropdown>
                </section>
                {menu[2] !== undefined && (
                  <>
                    <section>
                      <label>What intellectual property is this content infringing?</label>
                      <Dropdown onChange={(index) => {

                        setMenu([4, 1, menu[2], index]);
                        setEscalate(true);

                      }} inPopup>
                        <li>It infringes my copyright</li>
                        <li>It infringes my trademark</li>
                      </Dropdown>
                    </section>
                    {menu[3] === 0 && (
                      <>
                        <section>
                          <label>What is your relationship to copyrighted content?</label>
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
                          <input type="email" required />
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
                          <label>What is your country?</label>
                          <CountryDropdown inPopup />
                        </section>
                        <section>
                          <label>Describe the original copyrighted work in detail</label>
                          <p>If possible, include URLs where the original work was posted.</p>
                          <textarea required></textarea>
                        </section>
                        <section>
                          <label>Is there any other content that infringe your copyright?</label>
                          <p>Please include URLs pointing to art, literature, characters, worlds, or profiles. You do not have to include the content that you are reporting now.</p>
                          <textarea></textarea>
                        </section>
                        <section>
                          <label>What do you want Makuwro's Trust & Safety team to do?</label>
                          <Dropdown inPopup>
                            <li>Remove this content</li>
                            <li>Transfer ownership of this content to my account</li>
                          </Dropdown>
                          <Checkbox defaultChecked>
                            <a href="https://support.makuwro.com/policies/copyright#strikes" target="_blank" rel="noreferrer">Strike</a> the uploader's account
                          </Checkbox>
                        </section>
                        <section>
                          <label>Legal agreements</label>
                          <Checkbox required>
                            I am in good faith that the use of this material was not authorized by the copyright owner, its agent, or the law, incliuding fair use.
                          </Checkbox>
                          <Checkbox required>
                            I affirm, under penalty of perjury, that the information in the notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                          </Checkbox>
                          <Checkbox required>
                            I understand that submitting a fraudulent report is grounds for termination of my Makuwro account.
                          </Checkbox>
                          <Checkbox required>
                            This is not a duplicate request.
                          </Checkbox>
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
                        <section>
                          <label>What is the full name of the trademark owner?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your email address?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="email" required />
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
                          <label>What is your country?</label>
                          <CountryDropdown inPopup />
                        </section>
                        <section>
                          <label>At what office did you register your trademark?</label>
                          <p>For example, the USPTO.</p>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>What is your trademark's registration number?</label>
                          <input type="text" required />
                        </section>
                        <section>
                          <label>Is there any other content that infringe your trademark? <span>(optional)</span></label>
                          <p>Please include URLs pointing to art, literature, characters, worlds, or profiles. You do not have to include the content that you are reporting now.</p>
                          <textarea></textarea>
                        </section>
                        <section>
                          <label>How is the uploaded content infringing your registered trademark?</label>
                          <p>Explain in detail how users can be misled into thinking that it was endorsed or published by you or your company.</p>
                          <textarea required></textarea>
                        </section>
                        <section>
                          <label>What would be the best course of action? (i.e. username transfer, content removal, etc.)</label>
                          <textarea>

                          </textarea>
                        </section>
                        <section>
                          <label>Legal agreements</label>
                          <Checkbox required>
                            I am in good faith that the use of this material was not authorized by the trademark owner, its agent, or the law, incliuding fair use.
                          </Checkbox>
                          <Checkbox required>
                            I affirm, under penalty of perjury, that the information in the notification is accurate and that I am the trademark owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                          </Checkbox>
                          <Checkbox required>
                            I understand that submitting a fraudulent report is grounds for termination of my Makuwro account.
                          </Checkbox>
                          <Checkbox required>
                            This is not a duplicate request.
                          </Checkbox>
                          <section>
                            <label>Electronic signature</label>
                            <p>Please sign this request by typing your full legal name. This is the name that appears on your government ID.</p>
                            <input type="text" required />
                          </section>
                        </section>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {menu[0] === 7 && (
          <p className={styles.reason}>Makuwro only removes content that violates our <a href="https://about.makuwro.com/policies">policies</a>; however, you always have the option to <Link to={"/Christian?action=block"}>block</Link> the creator. You won't be able to see what they post, and they won't be able to interact with you.</p>
        )}
        {escalate && (
          <section>
            <label>Is there anything else you would like to tell us? <span>(optional)</span></label>
            <textarea>

            </textarea>
            <input type="submit" value="Submit report" />
            <p>We might follow up with you to get more information, but even if we don't, we'll send you updates about your report.</p>
          </section>
        )}
      </form>
    </>
  );

}