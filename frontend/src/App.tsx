import { useState } from "react";

import "./App.css";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Sidebar />
      <Canvas />
    </>
  );
}

export default App;
