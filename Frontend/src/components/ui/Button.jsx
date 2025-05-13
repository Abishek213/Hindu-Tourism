export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const variantStyles = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    link: 'text-orange-600 hover:text-orange-800'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3'
  };
  
  return (
    <button 
      className={`rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 flex items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon className={`${children ? 'mr-2' : ''} h-4 w-4`} />}
      {children}
    </button>
  );
};