import React from "react";

import styles from "./App.module.scss";

import AppState from "./components/AppState";

function App() {
  return (
    <div className={styles.wrapper}>
      <AppState />
    </div>
  );
}

export default App;
