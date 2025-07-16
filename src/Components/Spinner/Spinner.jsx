import React from "react";

const Spinner = ({
  size = "md",
  color = "primary",
  className = "",
  center = true,
}) => {
  const sizeClasses = {
    xs: "h-4 w-4 border-[2px]",
    sm: "h-6 w-6 border-[2px]",
    md: "h-8 w-8 border-[3px]",
    lg: "h-10 w-10 border-[3px]",
    xl: "h-12 w-12 border-[4px]",
  };

  const colorClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    destructive: "border-destructive border-t-transparent",
    accent: "border-accent border-t-transparent",
    muted: "border-muted-foreground border-t-transparent",
  };

  const spinnerElement = (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className} animate-spin rounded-full`}
      style={{
        animationTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  return center ? (
    <div className="flex items-center justify-center w-full">{spinnerElement}</div>
  ) : (
    spinnerElement
  );
};

export default Spinner;