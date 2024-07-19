import { useState } from "react";
import "./App.css";
import { ContentAutofitResizer } from "./ContentAutofitResizer";

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
        <ContentAutofitResizer>
          <div className="flex flex-col gap-2 p-2">
            <div className="text-4xl whitespace-nowrap">123,456 ms</div>
            <div>Down 30%</div>
          </div>
        </ContentAutofitResizer>
      </div>
    </div>
  );
}

export default App;
