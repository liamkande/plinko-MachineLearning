import React from 'react';
import './Button.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'analyze';
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  onClick,
                                                  variant = 'secondary',
                                                  disabled = false,
                                                  className = '',
                                                  icon,
                                              }) => {
    return (
        <button
            className={`button button-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="button-icon">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};