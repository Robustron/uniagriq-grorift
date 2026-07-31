import React from 'react';
export const Slider = React.forwardRef(({ className, ...props }, ref) => {
  return <input type="range" ref={ref} className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer ${className}`} {...props} />;
});
Slider.displayName = 'Slider';
