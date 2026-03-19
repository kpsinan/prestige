import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    
    // Base styles applied to all buttons
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // Strictly typed Theme variations
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: "bg-prestige-primary text-white hover:bg-teal-800 focus:ring-prestige-primary",
      accent: "bg-prestige-accent text-white hover:bg-orange-700 focus:ring-prestige-accent shadow-md",
      outline: "border-2 border-prestige-primary text-prestige-primary hover:bg-prestige-primary hover:text-white focus:ring-prestige-primary",
      ghost: "text-prestige-dark hover:bg-slate-200 focus:ring-prestige-dark",
    };

    // Strictly typed Size variations
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg w-full md:w-auto",
    };

    // Safe fallback in case undefined is somehow passed
    const safeVariant = variant || 'primary';
    const safeSize = size || 'md';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[safeVariant]} ${sizes[safeSize]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };