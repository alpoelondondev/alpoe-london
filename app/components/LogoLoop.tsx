"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  CSSProperties,
  ReactNode,
} from "react";
import "./LogoLoop.css";

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

type ImageLogo = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
};
type NodeLogo = {
  node: ReactNode;
  title?: string;
  ariaLabel?: string;
  href?: string;
};
export type LogoItem = ImageLogo | NodeLogo;

type LogoLoopProps = {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  /** Let the viewer throw the strip by hand; it eases back to `speed` after. */
  draggable?: boolean;
  renderItem?: (item: LogoItem, key: string) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const toCssLength = (value?: number | string) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const useResizeObserver = (
  callback: () => void,
  elements: React.RefObject<HTMLElement | null>[],
  dependencies: unknown[]
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: unknown[]
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remaining = images.length;
    const handle = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };
    images.forEach((img) => {
      if (img.complete) handle();
      else {
        img.addEventListener("load", handle, { once: true });
        img.addEventListener("error", handle, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handle);
        img.removeEventListener("error", handle);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad, ...dependencies]);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean,
  draggable: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  /** Set once a press has travelled far enough to be a drag, not a click. */
  const movedRef = useRef(false);
  /** Live gesture state. Refs, not closure variables — see the drag effect. */
  const dragRef = useRef({ startPos: 0, startOffset: 0, lastPos: 0, lastTime: 0 });

  // Mirrored into refs so the drag effect can read the current values without
  // listing them as dependencies.
  const targetVelocityRef = useRef(targetVelocity);
  const seqSizeRef = useRef(0);
  targetVelocityRef.current = targetVelocity;
  seqSizeRef.current = isVertical ? seqHeight : seqWidth;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // While a pointer is down the offset is driven by the gesture and this
      // loop stands off entirely — but the drag keeps writing velocity, so a
      // release hands its speed straight to the easing here and the strip
      // carries on from exactly the speed it was thrown at.
      if (draggingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;
        track.style.transform = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);

  // Deliberately a separate effect with near-static dependencies. Folded into
  // the loop above it would re-subscribe whenever the hover state or measured
  // width changed — and on touch a press fires a synthetic mouseenter, so the
  // listeners were being torn down and rebuilt in the middle of the very
  // gesture they were meant to be tracking.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !draggable || isVertical) return;

    const onPointerDown = (e: PointerEvent) => {
      // Mouse: left button only. Touch and pen always qualify.
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (seqSizeRef.current <= 0) return;
      draggingRef.current = true;
      movedRef.current = false;
      dragRef.current = {
        startPos: e.clientX,
        startOffset: offsetRef.current,
        lastPos: e.clientX,
        lastTime: e.timeStamp,
      };
      track.setPointerCapture(e.pointerId);
      track.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const seqSize = seqSizeRef.current;
      if (seqSize <= 0) return;
      const drag = dragRef.current;
      const travel = e.clientX - drag.startPos;
      if (Math.abs(travel) > 4) movedRef.current = true;

      // Dragging right should carry the strip right, and the track is drawn at
      // translate(-offset), so the offset moves opposite to the pointer.
      const next = drag.startOffset - travel;
      offsetRef.current = ((next % seqSize) + seqSize) % seqSize;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      const dt = (e.timeStamp - drag.lastTime) / 1000;
      if (dt > 0) velocityRef.current = -(e.clientX - drag.lastPos) / dt;
      drag.lastPos = e.clientX;
      drag.lastTime = e.timeStamp;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      track.style.cursor = "";
      if (track.hasPointerCapture(e.pointerId))
        track.releasePointerCapture(e.pointerId);
      // A slow release should not fling; anything faster keeps its momentum and
      // is eased back to the resting speed by the loop above.
      if (Math.abs(velocityRef.current) < 20)
        velocityRef.current = targetVelocityRef.current;
    };

    // A drag that ends on a logo must not also follow its link.
    const onClickCapture = (e: MouseEvent) => {
      if (!movedRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("click", onClickCapture, true);
      draggingRef.current = false;
    };
  }, [draggable, isVertical, trackRef]);
};

const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  draggable = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === "up" || direction === "down";

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    let directionMultiplier: number;
    if (isVertical) directionMultiplier = direction === "up" ? 1 : -1;
    else directionMultiplier = direction === "left" ? 1 : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;
    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);
        if (containerRef.current.style.height !== `${targetHeight}px`)
          containerRef.current.style.height = `${targetHeight}px`;
      }
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical, draggable);

  const cssVariables = useMemo(
    () =>
      ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }) as CSSProperties,
    [gap, logoHeight, fadeOutColor]
  );

  const rootClassName = useMemo(
    () =>
      [
        "logoloop",
        isVertical ? "logoloop--vertical" : "logoloop--horizontal",
        fadeOut && "logoloop--fade",
        scaleOnHover && "logoloop--scale-hover",
        draggable && "logoloop--draggable",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [isVertical, fadeOut, scaleOnHover, className]
  );

  // Gated on a real mouse. A touch fires a synthetic enter with no matching
  // leave, which on a phone left the strip paused for good after one tap.
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    },
    [effectiveHoverSpeed]
  );
  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    },
    [effectiveHoverSpeed]
  );

  const renderLogoItem = useCallback(
    (item: LogoItem, key: string) => {
      if (renderItem) {
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }
      const isNodeItem = "node" in item;
      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );
      const itemAriaLabel = isNodeItem
        ? item.ariaLabel ?? item.title
        : item.alt ?? item.title;
      const isInternal = item.href?.startsWith("/");
      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || "logo link"}
          {...(isInternal ? {} : { target: "_blank", rel: "noreferrer noopener" })}
        >
          {content}
        </a>
      ) : (
        content
      );
      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      );
    },
    [renderItem]
  );

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) =>
            renderLogoItem(item, `${copyIndex}-${itemIndex}`)
          )}
        </ul>
      )),
    [copyCount, logos, renderLogoItem]
  );

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width: isVertical
        ? toCssLength(width) === "100%"
          ? undefined
          : toCssLength(width)
        : toCssLength(width) ?? "100%",
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style, isVertical]
  );

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {logoLists}
      </div>
    </div>
  );
});

export default LogoLoop;
