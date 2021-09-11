import styles from './ImageInput.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import { useRef, ChangeEvent } from 'react';

export interface ImageInputProps {
    url: string;
    label?: string;
    onChange?: (file: File) => void;
}

export function ImageInput(props: ImageInputProps) {
    const input = useRef<HTMLInputElement>(null);

    const onClickButton = () => {
        input.current?.click();
    }

    const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        if(files) {
            if(props.onChange) {
                const image = files[0];
                props.onChange(image);
            }
        }
    }

    return (
        <>
            <input
                ref={input}
                type="file"
                style={{display: 'none'}}
                accept="image/*"
                onChange={(e) => onChangeImage(e)}
            />
            <div
                onClick={onClickButton}
                className={cn('image')}
            >
                <img src={props.url}/>
                <div className={cn('cover')}>
                    {props.label}
                </div>
            </div>
        </>
    )
}