import classNames from 'classnames/bind';
import styles from './Button.module.scss';
const cn = classNames.bind(styles);

import { useRef } from 'react';

export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    isRounded?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    gap?: 'none' | 'little';
    space?: 'default' | 'spare';
    color?: 'default' | 'primary' | 'secondary' | 'point';
    display?: 'inline-block' | 'block';
}

export function Button({
    gap = 'none',
    isRounded = false,
    space = 'default',
    color = 'default',
    display = 'inline-block',
    onClick,
    children,
}: ButtonProps) {
    const button = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) {
            onClick(e);
        }
        
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
        }, 0);

        setTimeout(() => {
            if (button.current?.contains(ripple)) {
                button.current?.removeChild(ripple);
            }
        }, 1000);
    };

    return (
        <button
            ref={button}
            className={cn(
                'button',
                {
                    isRounded 
                },
                gap != 'none' && `g-${gap}`,
                space != 'default' && `s-${space}`,
                color != 'default' && `c-${color}`,
                display != 'inline-block' && `d-${display}`
            )}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}