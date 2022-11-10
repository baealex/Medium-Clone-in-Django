import classNames from 'classnames/bind';
import styles from './ArticleCard.module.scss';
const cn = classNames.bind(styles);

import Link from 'next/link';

import {
    Badge,
    Card,
    PopOver,
    Text
} from '@design-system';

import {
    getPostsImage,
    getUserImage
} from '~/modules/utility/image';
import { unescape } from '~/modules/utility/string';

export interface ArticleCardProps {
    number?: number;
    author?: string;
    url: string;
    image?: string;
    title: string;
    description?: string;
    authorImage?: string;
    createdDate?: string;
    readTime?: number;
    isAd?: boolean;
    className?: string;
    children?: JSX.Element;
    hasShadow?: boolean;
    isRounded?: boolean;
    highlight?: string;
}

export function ArticleCard(props: ArticleCardProps) {
    const {
        hasShadow = true,
        isRounded = true
    } = props;

    const url = props.author ? `/@${props.author}/${props.url}` : props.url;

    const description = props.highlight
        ? props.description?.replace(props.highlight, `<mark>${props.highlight}</mark>`) || ''
        : props.description;

    return (
        <article className={props.className}>
            <Card
                hasShadow={hasShadow}
                isRounded={isRounded}
                className={cn('posts')}>
                <>
                    {typeof props.image !== 'undefined' && (
                        <Link href={url}>
                            <a>
                                <img
                                    className={cn('image', 'lazy')}
                                    src={getPostsImage(props.image, { preview: true })}
                                    data-src={getPostsImage(props.image, { minify: true })}
                                />
                            </a>
                        </Link>
                    )}
                    <div className="p-3">
                        {props.number && (
                            <div className={cn('number')}>
                                {`${('0' + props.number).slice(-2)}.`}
                            </div>
                        )}
                        <Link href={url}>
                            <a>
                                <Text
                                    tag="h3"
                                    fontWeight={600}
                                    className={cn(
                                        'title',
                                        'deep-dark',
                                        'mb-2'
                                    )}>
                                    {props.title}
                                </Text>
                                {description && props.highlight ? (
                                    <p
                                        className="shallow-dark"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                ) : (
                                    <Text className="shallow-dark mb-3">{unescape(description || '')}</Text>
                                )}
                            </a>
                        </Link>
                        {props.author && (
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link href="/[author]" as={`/@${props.author}`}>
                                        <a>
                                            <img
                                                className={cn('author-image')}
                                                src={getUserImage(props.authorImage || '')}
                                                width="35"
                                                height="35"
                                            />
                                        </a>
                                    </Link>
                                    <div className="vs mx-2">
                                        <Link href="/[author]" as={`/@${props.author}`}>
                                            <a className="deep-dark">{props.author}</a>
                                        </Link>님이 작성함
                                        <br/>
                                        {props.createdDate} · <span className="shallow-dark">{props.readTime} min read</span>
                                    </div>
                                </div>
                                {props.isAd && (
                                    <PopOver text="유료 광고 포함">
                                        <Badge isRounded isSolo size="small">
                                            AD
                                        </Badge>
                                    </PopOver>
                                )}
                            </div>
                        )}
                    </div>
                </>
            </Card>
        </article>
    );
}
