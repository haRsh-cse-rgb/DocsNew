import { cn } from '../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const variantClasses = {
    primary: 'border-b-2 border-primary-600',
    secondary: 'border-b-2 border-gray-600',
    white: 'border-b-2 border-white'
  };

  const containerClasses = cn(
    'flex items-center justify-center',
    fullScreen ? 'fixed inset-0 bg-black bg-opacity-20 z-50' : '',
    size === 'sm' ? 'p-2' : size === 'md' ? 'p-4' : 'p-6',
    className
  );

  const spinnerClasses = cn(
    'animate-spin rounded-full',
    sizeClasses[size],
    variantClasses[variant]
  );

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
    </div>
  );
}