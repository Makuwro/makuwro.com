import React from "react";
import styles from "../../styles/Connecting.module.css";

class CrashBoundary extends React.Component {

  constructor(props) {

    super(props);
    this.state = { hasError: false };

  }

  static getDerivedStateFromError(error) {

    // Update state so the next render will show the fallback UI.
    return { hasError: true };

  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {

    const crashMessages = [
      "Sheeeeeeeesh"
    ];

    return this.state.hasError ? (
      <section id={styles.connecting}>
        <section>
          <h1>{crashMessages[Math.floor(Math.random() * crashMessages.length)]}</h1>
          <p>The app crashed, so Makuwro needs to refresh. If you're still having a problem after refreshing, <a href="https://twitter.com/Makuwro">let us know on Twitter</a>!</p>
          <button onClick={() => location.reload()}>Refresh</button>
        </section>
      </section>
    ) : this.props.children; 

  }

}

export default CrashBoundary;