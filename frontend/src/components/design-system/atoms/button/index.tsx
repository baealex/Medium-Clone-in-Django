import classNames from 'classnames/bind';
import styles from './Button.module.scss';
const cn = classNames.bind(styles);

import { forwardRef, useCallback, useRef } from 'react';

export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    isLoading?: boolean;
    isRounded?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    gap?: 'none' | 'little';
    space?: 'default' | 'spare';
    color?: 'default' | 'primary' | 'secondary' | 'point' | 'transparent';
    display?: 'inline-block' | 'block';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    type = 'button',
    gap = 'none',
    isRounded = false,
    space = 'default',
    color = 'default',
    display = 'inline-block',
    className,
    isLoading = false,
    onClick,
    children
}, ref) => {
    const button = useRef<HTMLButtonElement>(null);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading) {
            return;
        }
        onClick?.(e);

        const ripple = document.createElement('span');
        ripple.classList.add(cn('ripple'));
        button.current?.appendChild(ripple);

        setTimeout(() => {
            const absoluteTop = (button.current?.getBoundingClientRect().top || 0) + window.scrollY;
            const absoluteLeft = (button.current?.getBoundingClientRect().left || 0) + window.scrollX;

            ripple.style.top = e.pageY - absoluteTop - 25 + 'px';
            ripple.style.left = e.pageX - absoluteLeft - 25 + 'px';
            ripple.style.opacity = '0';
            ripple.style.transform = 'scale(5)';

            setTimeout(() => ripple.remove(), 1000);
        }, 0);
    }, [button, onClick]);

    return (
        <button
            ref={ref || button}
            type={type}
            className={cn(
                'button',
                { isRounded },
                gap != 'none' && `g-${gap}`,
                space != 'default' && `s-${space}`,
                color != 'default' && `c-${color}`,
                display != 'inline-block' && `d-${display}`,
                className
            )}
            onClick={handleClick}>
            {isLoading ? <i className="fas fa-spinner fa-spin" /> : children}
        </button>
    );
});
