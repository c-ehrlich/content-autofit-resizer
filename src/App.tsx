import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ScalableContainer } from "./ScalableContainer";

function App() {
  const [count, setCount] = useState(0);

  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  return (
    <>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid black",
        }}
      >
        <ScalableContainer>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ fontSize: "40px" }}>400,000ms</div>
            <div style={{ fontSize: "20px" }}>Down 30%</div>
          </div>
          {/* <div>
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </div> */}
        </ScalableContainer>
      </div>
      <div>
        <p>Width: {width}</p>
        <input
          type="range"
          min="1"
          max="1000"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </div>
      <div>
        <p>Height: {height}</p>
        <input
          type="range"
          min="1"
          max="1000"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </div>
    </>
  );
}

export default App;
