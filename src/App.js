import "./styles/global.css";
import Article from "./comps/Article.js";
import Header from "./comps/Header.js";
import MenuOverlay from "./comps/MenuOverlay";

function App() {
  return (
    <>
      <MenuOverlay />
      <Header />
      <Article />
    </>)
}

export default App;
