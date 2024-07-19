import React, { useRef, useState, useLayoutEffect, useCallback } from "react";
import debounce from "lodash/debounce";

interface ScalableContainerProps {
  children: React.ReactNode;
  debounceDelay?: number;
  canGrow?: boolean;
}

export const ResponsiveScaleContainer: React.FC<ScalableContainerProps> = ({
  children,
  debounceDelay = 100,
  canGrow = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [resizerState, setResizerState] = useState({
    firstRun: true,
    doneSizing: false,
    childSize: { width: 0, height: 0 },
    scale: 1,
  });

  useLayoutEffect(() => {
    const childRect = contentRef.current?.getBoundingClientRect();
    if (childRect) {
      setResizerState((prevState) => ({
        ...prevState,
        childSize: { width: childRect.width, height: childRect.height },
      }));
    }
  }, [setResizerState]);

  const updateScale = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect();

      const scaleWidth = containerWidth / resizerState.childSize.width;
      const scaleHeight = containerHeight / resizerState.childSize.height;
      const newScale = Math.min(scaleWidth, scaleHeight);
      const maxScale = canGrow ? Infinity : 1;
      setResizerState((prevState) => ({
        ...prevState,
        scale: Math.min(maxScale, newScale),
      }));
    }
  }, [canGrow, resizerState.childSize.height, resizerState.childSize.width]);

  const debouncedUpdateScale = debounce(updateScale, debounceDelay);

  useLayoutEffect(() => {
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
        ref={contentRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: "fit-content",
          width: "fit-content",
          transform: `scale(${resizerState.scale}) translate(-50%, -50%)`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
