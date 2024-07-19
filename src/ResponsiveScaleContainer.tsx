import React, { useRef, useState, useLayoutEffect } from "react";
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
  const [childSize, setChildSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const childRect = contentRef.current?.getBoundingClientRect();
    if (childRect) {
      setChildSize({ width: childRect.width, height: childRect.height });
    }
  }, [setChildSize]);

  const updateScale = () => {
    if (containerRef.current && contentRef.current) {
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect();

      const scaleWidth = containerWidth / childSize.width;
      const scaleHeight = containerHeight / childSize.height;
      const newScale = Math.min(scaleWidth, scaleHeight);
      const maxScale = canGrow ? Infinity : 1;
      setScale(Math.min(maxScale, newScale));
    }
  };

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
          transform: `scale(${scale}) translate(-50%, -50%)`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
