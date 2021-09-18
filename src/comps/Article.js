import React from "react";
import "../styles/article.css";
import Outline from "./Outline.js"

class Article extends React.Component {
  
  constructor(props) {
    super(props);
  };
  
  render() {
    return (
      <main>
        <article>
          <section id="article-header">
            <div id="controls">
              <button>Edit</button>
            </div>
            <div>
              <h1 id="article-header-name">Trust Fall</h1>
              <div id="article-header-contributors">by <a href="/collaborators/Christian_Toney">Christian Toney</a></div>
            </div>
          </section>

          <section id="article-content">
            <h1>Description</h1>
            <div><b>Trust Fall</b>, also known as “TSR001” to Dream, is the first season of The Showrunners game.</div>
            <h1>Plot</h1>
            <div>The season involves Ruby Endaend finally being able to defend worlds from <a href="/wiki/Demons">demons</a> with Toasty. He's been very anxious and has been doing her job for her most of the time. She hasn't questioned him because she had no idea how any of the "host junk" worked. That changes after Zeal, Lust of the Elite Seven, offers to give Ruby a glimpse of clarity on how she became the host. During their explanation, Zeal falsely accuses Toasty of killing Ruby and torturing her as a demon, rebooting the timeline whenever she stepped out of line. With the mysterious attitude of Toasty, she didn't know who to believe, but Zeal told her that she had the choice to draw her own conclusions and gave her a key to an unknown room. ...Before secretly taking a strand of her hair.</div>
            <div>Ruby had the protection of the plot armor, an invisible barrier usually given to makers. As the host, she was unable to be physically damaged by demons. Coin, the leader of the Elite Seven, was curious about this ability. Despite being only one strand of hair, it contained a significant amount of plot armor. He was going to take the power of the plot armor and distribute it to all demons, and put it in 6 bombs that could easily destroy not just worlds, but also Toasty and Ruby. Demons were constantly bested by Toasty alone, so this seemed like an opportunity for demons to get the upper hand against worldbuilders.</div>
            <div>Zeal left the world, giving Toasty the false pretense that the demons had backed down, so Ruby and Toasty went back to the Overworld. Ruby started to investigate by asking around for what the key went to. She encounters Lithicus Drakarox, a worldbuilder who never really got a feel for construction over destruction. After listening to Ruby's story, he becomes even more upset with how secretive Toasty is. He offers to help her find where the key goes.</div>
          </section>

          <section id="article-footer">
            <div id="last-edited">LAST EDITED ON JANUARY 1, 2021</div>
          </section>
        </article>

        <Outline />
      </main>
    );
  };
};

export default Article;