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
  const contentRef = useRef<HTMLDivElement>(null);
  const [childSize, setChildSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const childRect = contentRef.current?.getBoundingClientRect();
    if (childRect) {
      setChildSize({ width: childRect.width, height: childRect.height });
    }
    console.log("tktk childRect", childRect);
  }, []);

  const updateScale = () => {
    if (containerRef.current && contentRef.current) {
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect();

      const scaleWidth = containerWidth / childSize.width;
      const scaleHeight = containerHeight / childSize.height;
      const newScale = Math.min(scaleWidth, scaleHeight);
      setScale(Math.max(minScale, Math.min(maxScale, newScale)));
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
        border: "1px solid green",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          border: "1px solid red",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "fit-content",
          height: "fit-content",
        }}
      >
        <div style={{}} ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};
