import React, { useRef, useEffect, useState } from "react";
import debounce from "lodash/debounce";

interface ScalableContainerProps {
  children: React.ReactNode;
  debounceDelay?: number;
  maxScale?: number;
  minScale?: number;
}

export const ScalableContainer: React.FC<ScalableContainerProps> = ({
  children,
  debounceDelay = 100,
  maxScale = Infinity,
  minScale = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const childWidth = containerRef.current.scrollWidth;
      const childHeight = containerRef.current.scrollHeight;
      const scaleWidth = width / childWidth;
      const scaleHeight = height / childHeight;
      const newScale = Math.min(scaleWidth, scaleHeight);
      setScale(Math.max(minScale, Math.min(maxScale, newScale)));
      console.log("tktk", {
        scale,
        newScale,
        minScale,
        maxScale,
        w: { width, childWidth },
        h: { height, childHeight },
      });
    }
  };

  const debouncedUpdateScale = debounce(updateScale, debounceDelay);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(debouncedUpdateScale);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [debouncedUpdateScale]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "fit-content",
          height: "fit-content",
        }}
      >
        {children}
      </div>
    </div>
  );
};
