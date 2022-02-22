import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Profile.module.css";

export default function ProfileTerms({setLocation, profileInfo, currentUser}) {

  const navigate = useNavigate();
  const location = useLocation();
  const [terms, setTerms] = useState();

  useEffect(() => {

    const terms = profileInfo && profileInfo.terms;
    
    if (terms) {

      const matches = [...terms.matchAll(/\n?(.+)/gm)];
      const content = [];
      for (let i = 0; matches.length > i; i++) {

        content.push(<p key={i}>{matches[i][1]}</p>);

      }

      setTerms(content);

    } else {

      setTerms();

    }

  }, [profileInfo]);

  return (
    <>
      <section className={styles["profile-card"]} id={styles["profile-terms"]}>
        {terms || <p>This user isn't sharing any terms with Makuwro. If you want to commission them, or want to use their characters, art, or literature, you should ask them about their policies before doing so.</p>}
        {profileInfo.id === currentUser.id && (
          <button style={{display: "block", marginTop: "1rem"}} onClick={() => {
            
            navigate("/settings/profile#terms");
            setLocation(location);

          }}>Edit terms</button>
        )}
      </section>
    </>
  );

}