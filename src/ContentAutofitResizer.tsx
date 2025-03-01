import debounce from "lodash/debounce";
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";

interface ContentAutofitResizerProps {
  children: React.ReactNode;
  debounceDelay?: number;
  canGrow?: boolean;
}

type ContentAutofitResizerState = {
  firstRun: boolean;
  doneSizing: boolean;
  containerSize: { width: number; height: number };
  childSize?: { width: number; height: number };
  scale: number;
};

export const ContentAutofitResizer = ({
  children,
  debounceDelay = 100,
  canGrow = true,
}: ContentAutofitResizerProps) => {
  const animationFrameID = React.useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [resizerState, setResizerState] = useState<ContentAutofitResizerState>({
    firstRun: true,
    doneSizing: false,
    containerSize: { width: 0, height: 0 },
    childSize: undefined,
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
    if (
      !resizerState.doneSizing &&
      containerRef.current &&
      contentRef.current
    ) {
      const { width: containerWidth, height: containerHeight } =
        containerRef.current.getBoundingClientRect();

      const realChildSize =
        resizerState.childSize || contentRef.current.getBoundingClientRect();

      const scaleWidth = containerWidth / realChildSize.width;
      const scaleHeight = containerHeight / realChildSize.height;
      const newScale = Math.min(scaleWidth, scaleHeight);
      const maxScale = canGrow ? Infinity : 1;
      setResizerState((prevState) => ({
        ...prevState,
        scale: Math.min(maxScale, newScale),
        containerSize: { width: containerWidth, height: containerHeight },
        doneSizing: true,
      }));
    }
  }, [canGrow, resizerState.childSize, resizerState.doneSizing]);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale]);

  const causeResize = () => {
    setResizerState((prev) => ({
      ...prev,
      doneSizing: false,
      finalSize: 0,
    }));

    animationFrameID.current = window.requestAnimationFrame(() => {
      updateScale();
    });
  };

  const onResize = () => {
    if (resizerState.firstRun) {
      setResizerState((prev) => ({ ...prev, firstRun: false }));
    } else {
      const currentContainerSize =
        containerRef.current?.getBoundingClientRect();
      if (
        currentContainerSize?.width !== resizerState.containerSize.width ||
        currentContainerSize?.height !== resizerState.containerSize.height
      ) {
        causeResize();
      }
    }
  };

  const debouncedOnResize = debounce(onResize, debounceDelay);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(debouncedOnResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [debouncedOnResize]);

  useLayoutEffect(() => {
    return () => {
      if (window !== null) {
        window.cancelAnimationFrame(animationFrameID.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      causeResize();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [contentRef, causeResize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div
        ref={contentRef}
        className="absolute top-1/2 left-1/2 h-fit w-fit select-none"
        style={{
          transform: `scale(${resizerState.scale}) translate(-50%, -50%)`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
