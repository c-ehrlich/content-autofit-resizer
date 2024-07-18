import { useState } from "react";
import "./App.css";
import { ScalableContainer } from "./ScalableContainer";

function App() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid black",
        }}
      >
        <ScalableContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              border: "1px solid yellow",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "40px" }}>400,000ms</div>
            <div style={{ fontSize: "20px" }}>Down 30%</div>
          </div>
        </ScalableContainer>
      </div>
    </div>
  );
}

export default App;
