import React from "react";
import styles from "../../styles/Profile.module.css";
import Article from "../Article";

export default function ProfileBlog() {

  return (
    <section className={styles["profile-card"]} id={styles["profile-blog"]}>
      <form className={styles["profile-blog-post"]}>
        <img src="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" />
        <section>
          <section className={styles.names}>
            <section>Christian Toney</section>
            <section className={styles.username}>@Christian</section>
          </section>
          <textarea>

          </textarea>
          <input type="submit" value="Post" />
        </section>
      </form>
      <Article avatarURL="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" displayName="Christian Toney" username="Christian">
        <p>This is an example blog post! You can talk about the state of your characters, commissions, trades, and other stuff here.</p>
      </Article>
      <Article avatarURL="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" displayName="Christian Toney" username="Christian" commentsDisabled={true}>
        <p>This is another post. It's a little on the short end, but it's alright: a long one's coming up.</p>
      </Article>
      <Article avatarURL="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" displayName="Sudobeast" badge="NPC">
        <p>Maybe I'll add a feature where you can act as your character in articles.</p>
      </Article>
      <Article avatarURL="https://pbs.twimg.com/profile_images/1477875323953991682/MM_ZZPTh_400x400.jpg" displayName="Christian Toney" username="Christian">
        <p>I've come to make an announcement; Shadow The Hedgehog's a bitch ass motherfucker, he pissed on my fucking wife. Thats right, he took his hedgehog quilly dick out and he pissed on my fucking wife, and he said his dick was "This big" and I said that's disgusting, so I'm making a callout post on my twitter dot com, Shadow the Hedgehog, you've got a small dick, it's the size of this walnut except WAY smaller, and guess what? Here's what my dong looks like: PFFFT, THAT'S RIGHT, BABY. ALL POINTS, NO QUILLS, NO PILLOWS. Look at that, it looks like two balls and a bong. He fucked my wife so guess what? I'm gonna fuck the Earth. THAT'S RIGHT THIS IS WHAT YOU GET, MY SUPER LASER PISS! Except I'm not gonna piss on the earth. I'm gonna go higher. I'M PISSING ON THE MOON! HOW DO YOU LIKE THAT, OBAMA? I PISSED ON THE MOON YOU IDIOT! YOU HAVE 23 HOURS BEFORE THE PISS DROPLETS HIT THE FUCKING EARTH NOW GET OUT OF MY SIGHT BEFORE I PISS ON YOU TOO.</p>
      </Article>
    </section>
  );

}