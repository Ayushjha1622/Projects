import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props 
}) => {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    none: 'p-0',
  };
  
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;