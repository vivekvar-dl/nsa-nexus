/**
 * Ripple — Magic UI (MIT), https://magicui.design/docs/components/ripple
 * Ported from TSX to JS; theme tokens mapped to this project's `bone`.
 */
import React from "react";

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className = "",
  ...props
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none mask-[linear-gradient(to_bottom,white,transparent)] ${className}`}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full border border-bone/30 bg-bone/[0.035]"
            style={{
              "--i": i,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay: `${i * 0.06}s`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
});
