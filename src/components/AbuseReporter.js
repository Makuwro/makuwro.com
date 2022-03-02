import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown from "./input/Dropdown";
import CountryDropdown from "./input/CountryDropdown";
import Checkbox from "./input/Checkbox";

export default function AbuseReporter({setPopupSettings, currentUser, addNotification}) {

  const [menu, setMenu] = useState([]);
  const [escalate, setEscalate] = useState(false);
  const [contentArray, setContentArray] = useState([]);
  const [reporting, setReporting] = useState(false);
  const [extraDetails, setExtraDetails] = useState("");
  const [username, setUsername] = useState();
  const [type, setType] = useState();
  const [subType, setSubType] = useState();
  const [slug, setSlug] = useState();
  let [contentString, setContentString] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const regex = /^\/(?<username>[^/]+)\/?(?<subType>art)?\/?(?<slug>[^/]+)?\/?$/gm;
    const matchedPath = [...location.pathname.matchAll(regex)];
    const groups = matchedPath[0] && matchedPath[0].groups;
    if (groups) {

      setUsername(groups.username);
      setSlug(groups.slug);
      setType(groups.subType ? "contents" : "accounts");
      setSubType(groups.subType);

    }

  }, [location]);

  useEffect(() => {

    contentString = "";
    for (let i = 0; contentArray.length > i; i++) {

      if (contentArray[i]) {

        contentString += `${i > 0 ? "\n\n" : ""}${contentArray[i].question}\n${contentArray[i].answer}`;

      }

    }
    setContentString(contentString);

  }, [contentArray]);

  async function submit(event) {

    event.preventDefault();

    // Check if they're already sending the report
    if (!reporting) {

      // Make sure they don't submit duplicate requests
      setReporting(true);

      // Just in case there's a problem, wrap it around a try-catch
      try {

        // Send the report to the server
        const formData = new FormData();
        formData.append("content", `${contentString}\n\nIs there anything else you'd like us to know?\n${extraDetails || "No"}`);

        const response = await fetch(`${process.env.RAZZLE_API_DEV}${type}/${subType}/${username}${slug ? `/${slug}` : ""}/report`, {
          method: "POST",
          headers: {
            token: currentUser.token
          },
          body: formData
        });

        // Check if everything went OK
        if (response.ok) {

          // Everything went OK, so tell the user!
          addNotification({
            title: "Successfully reported to Makuwro Safety & Security",
            children: "Thanks for helping to keep the community safe."
          });
          navigate(location.pathname);

        } else {

          // Something bad happened, so throw an error
          throw new Error(`${response.status}: ${response.statusText}`);

        }

      } catch (err) {

        // Print the error to the console
        addNotification({
          title: "Couldn't submit report",
          children: err.message
        });

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
      <form onSubmit={submit}>
        <section>
          <label>What's the problem?</label>
          <Dropdown index={menu[0]} onChange={(index, text) => {

            setContentArray([{question: "What's the problem?", answer: text}]);
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
            <Dropdown index={menu[1]} onChange={(index, text) => {
              
              setContentArray(content => [content[0], {question: "In what way?", answer: text}]);
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
              <Dropdown index={menu[1]} onChange={(index, text) => {

                setContentArray(content => [content[0], {question: "Did you want to contact the uploader first?", answer: text}]);
                setEscalate(false);
                setMenu([4, index]);

              }} inPopup>
                <li>Yes, I'll contact the uploader before filing a complaint</li>
                <li>No, I want to file a complaint now</li>
              </Dropdown>
            </section>
            {menu[1] === 0 && (
              <p className="info">You can message the uploader by <Link to={`/${username}?action=message`}>clicking here.</Link></p>
            )}
            {menu[1] === 1 && (
              <>
                <section>
                  <label>Who is affected?</label>
                  <p>Sending takedown requests for content you do not own is grounds for the termination of your Makuwro account.</p>
                  <Dropdown index={menu[2]} onChange={(index, text) => {

                    setContentArray(contentArray => {

                      const a = [...contentArray];
                      a[2] = {question: "Who is affected?", answer: text};
                      return a;

                    });
                    setMenu(menu => [...menu.slice(0, 2), index, ...menu.slice(3)]);

                  }} inPopup>
                    <li>Me</li>
                    <li>My client or my organization</li>
                  </Dropdown>
                </section>
                {menu[2] !== undefined && (
                  <>
                    <section>
                      <label>What intellectual property is this content infringing?</label>
                      <Dropdown index={menu[3]} onChange={(index, text) => {

                        setContentArray(contentArray => {

                          const a = [...contentArray];
                          a[3] = {question: "What intellectual property is this content infringing?", answer: text}; 
                          a[14] = a[14] || {question: "Strike the uploader's account", answer: true}

                          return a;

                        });
                        setMenu(menu => [...menu.slice(0, 3), index, ...menu.slice(4)]);
                        setEscalate(index === 0);

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
                          <input type="text" required value={contentArray[4] ? contentArray[4].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[4] = {question: "What is your relationship to copyrighted content?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is the name of the copyright owner?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="text" required value={contentArray[5] ? contentArray[5].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[5] = {question: "What is the name of the copyright owner?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is your email address?</label>
                          <p>This will be shared with the uploader.</p>
                          <input type="email" required value={contentArray[6] ? contentArray[6].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => { 
                              
                              const a = [...contentArray];
                              a[6] = {question: "What is your email address?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is your street address?</label>
                          <input type="text" required value={contentArray[7] ? contentArray[7].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[7] = {question: "What is your street address?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is your city?</label>
                          <input type="text" required value={contentArray[8] ? contentArray[8].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[8] = {question: "What is your city?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is your state or province?</label>
                          <input type="text" required value={contentArray[9] ? contentArray[9].answer : ""} onInput={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[9] = {question: "What is your state or province?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What is your country?</label>
                          <CountryDropdown inPopup onChange={(text) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[10] = {question: "What is your country?", answer: text};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>Describe the original copyrighted work in detail</label>
                          <p>If possible, include URLs where the original work was posted.</p>
                          <textarea required value={contentArray[11] ? contentArray[11].answer : ""} onChange={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[11] = {question: "Describe the original copyrighted work in detail", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>Is there any other content that infringe your copyright?</label>
                          <p>Please include URLs pointing to art, literature, characters, worlds, or profiles. You do not have to include the content that you are reporting now.</p>
                          <textarea value={contentArray[12] ? contentArray[12].answer : ""} onChange={(event) => {

                            setContentArray(contentArray => {
                              
                              const a = [...contentArray];
                              a[12] = {question: "Is there any other content that infringe your copyright?", answer: event.target.value};

                              return a;

                            });

                          }} />
                        </section>
                        <section>
                          <label>What do you want Makuwro's Safety & Security team to do?</label>
                          <Dropdown inPopup text={contentArray[13] ? contentArray[13].answer : null} onChange={(_, text) => {

                            setContentArray(contentArray => {

                              const a = [...contentArray];
                              a[13] = {question: "What do you want Makuwro's Safety & Security team to do?", answer: text};

                              return a;

                            });

                          }}>
                            <li>Remove this content</li>
                            <li>Transfer ownership of this content to my account</li>
                          </Dropdown>
                          <Checkbox checked={contentArray[14] && contentArray[14].answer === true} onClick={(checked) => setContentArray(contentArray => {
                            
                            const a = [...contentArray];
                            a[14] = {question: "Strike the uploader's account", answer: checked};

                            return a;

                          })}>
                            <a href="https://help.makuwro.com/policies/copyright#strikes" target="_blank" rel="noreferrer">Strike</a> the uploader's account
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
                            <input type="text" required input={contentArray[15] || ""} onInput={(event) => {

                              setContentArray(contentArray => [...contentArray.slice(0, 15), {question: "Please sign this request by typing your full legal name.", answer: event.target.value}, ...contentArray.slice(16)]);

                            }} />
                          </section>
                        </section>
                      </>
                    )}
                    {menu[3] === 1 && (
                      <p className="info">Please contact us at <a href="mailto:legal@makuwro.com" target="_blank" rel="noreferrer">legal@makuwro.com</a>.</p>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {menu[0] === 7 && (
          <p className="info">Makuwro only removes content that violates our <a href="https://help.makuwro.com/policies">policies</a>; however, you always have the option to <Link to={`/${username}?action=block`}>block</Link> the creator. You won't be able to see what they post, and they won't be able to interact with you.</p>
        )}
        {escalate && (
          <section>
            <label>Is there anything else you would like to tell us? <span>(optional)</span></label>
            <textarea value={extraDetails} onInput={(event) => setExtraDetails(event.target.value)} />
            <input type="submit" value="Submit report" disabled={reporting} />
            <p>We might follow up with you to get more information, but even if we don't, we'll send you updates about your report.</p>
          </section>
        )}
      </form>
    </>
  );

}