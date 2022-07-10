import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import Router from 'next/router';

import {
    Button,
    Card,
    Modal,
    SpeechBubble
} from '@design-system';
import {
    Footer, SEO
} from '@system-design/shared';
import { SeriesArticleCard } from '@system-design/series';

import { snackBar } from '@modules/ui/snack-bar';

import * as API from '@modules/api';
import { getUserImage } from '@modules/utility/image';

import { authStore } from '@stores/auth';
import { configStore } from '@stores/config';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { cookies } = context.req;
    configStore.serverSideInject(cookies);

    const {
        author = '', seriesurl = ''
    } = context.query;

    if (!author.includes('@')) {
        return { notFound: true };
    }

    try {
        const { data } = await API.getAnUserSeries(
            author.toString(),
            seriesurl.toString()
        );
        return { props: { series: data.body } };
    } catch (error) {
        return { notFound: true };
    }
};

interface Props {
    series: API.GetAnUserSeriesData,
}

interface State {
    isLogin: boolean;
    username: string;
    seriesTitle: string;
    seriesDescription: string;
    seriesPosts: API.GetAnUserSeriesDataPosts[];
    isSeriesModalOpen: boolean;
    isSortOldFirst: boolean;
}

class Series extends React.Component<Props, State> {
    private authUpdateKey: string;
    private configUpdateKey: string;

    constructor(props: Props) {
        super(props);
        this.state = {
            isLogin: authStore.state.isLogin,
            username: authStore.state.username,
            seriesTitle: props.series.name,
            seriesDescription: props.series.description,
            seriesPosts: props.series.posts,
            isSeriesModalOpen: false,
            isSortOldFirst: configStore.state.isSortOldFirst
        };
        this.authUpdateKey = authStore.subscribe((state) => this.setState({
            isLogin: state.isLogin,
            username: state.username
        }));
        this.configUpdateKey = configStore.subscribe((state) => this.setState({ isSortOldFirst: state.isSortOldFirst }));
    }

    componentWillUnmount() {
        authStore.unsubscribe(this.authUpdateKey);
        configStore.unsubscribe(this.configUpdateKey);
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.series.name !== this.props.series.name ||
            prevProps.series.description !== this.props.series.description ||
            prevProps.series.posts !== this.props.series.posts
        ) {
            this.setState({
                seriesTitle: this.props.series.name,
                seriesDescription: this.props.series.description,
                seriesPosts: this.props.series.posts
            });
        }
    }

    onOpenModal(modalName: 'isSeriesModalOpen') {
        this.setState({ [modalName]: true });
    }

    onCloseModal(modalName: 'isSeriesModalOpen') {
        this.setState({ [modalName]: false });
    }

    onInputChange(e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }

    async seriesUpdate() {
        const { data } = await API.putUserSeries(
            '@' + this.props.series.owner,
            this.props.series.url,
            {
                title: this.state.seriesTitle,
                description: this.state.seriesDescription
            }
        );
        if (data.status === 'DONE') {
            if (data.body.url) {
                Router.replace(
                    '/[author]/series/[seriesurl]',
                    `/@${this.state.username}/series/${data.body.url}`
                );
            }
            this.onCloseModal('isSeriesModalOpen');
            snackBar('😀 시리즈가 업데이트 되었습니다.');
        } else {
            snackBar('😯 변경중 오류가 발생했습니다.');
        }
    }

    async onPostsRemoveInSeries(url: string) {
        if (confirm('😮 이 포스트를 시리즈에서 제거할까요?')) {
            const { data } = await API.putAnUserPosts('@' + this.props.series.owner, url, 'series');
            if (data.status === 'DONE') {
                let { seriesPosts } = this.state;
                seriesPosts = seriesPosts.filter(post => (
                    post.url !== url
                ));
                this.setState({ seriesPosts });
                snackBar('😀 시리즈가 업데이트 되었습니다.');
            } else {
                snackBar('😯 변경중 오류가 발생했습니다.');
            }
        }
    }

    render() {
        const {
            seriesTitle,
            seriesDescription,
            seriesPosts
        } = this.state;

        const SeriesModal = this.props.series.owner == this.state.username && (
            <Modal
                title="시리즈 수정"
                isOpen={this.state.isSeriesModalOpen}
                onClose={() => this.onCloseModal('isSeriesModalOpen')}
                submitText="시리즈를 수정합니다"
                onSubmit={() => this.seriesUpdate()}>
                <div className="input-group mb-3 mr-sm-2 mt-3">
                    <div className="input-group-prepend">
                        <div className="input-group-text">시리즈명</div>
                    </div>
                    <input
                        type="text"
                        name="seriesTitle"
                        value={seriesTitle}
                        placeholder="시리즈의 이름"
                        className="form-control"
                        maxLength={50}
                        required
                        onChange={(e) => this.onInputChange(e)}
                    />
                </div>
                <textarea
                    name="seriesDescription"
                    cols={40}
                    rows={5}
                    placeholder="설명을 작성하세요."
                    className="form-control"
                    onChange={(e) => this.onInputChange(e)}
                    value={seriesDescription}
                />
                {seriesPosts.map((post, idx) => (
                    <Card key={idx} hasShadow isRounded className="p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <span className="deep-dark">
                                {idx + 1}. {post.title}
                            </span>
                            <a onClick={() => this.onPostsRemoveInSeries(post.url)}>
                                <i className="fas fa-times"></i>
                            </a>
                        </div>
                    </Card>
                ))}
            </Modal>
        );

        const { isSortOldFirst } = this.state;

        return (
            <>
                <Head>
                    <title>'{this.props.series.name}' 시리즈 — {this.props.series.owner}</title>
                </Head>
                <SEO
                    title={`'${this.props.series.name}' 시리즈 — ${this.props.series.owner}`}
                    image={this.props.series.image}
                />

                {SeriesModal}

                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="font-weight-bold h5 mb-3">
                                '{seriesTitle}' 시리즈
                            </h2>
                            {this.props.series.owner == this.state.username && (
                                <div className="mb-3">
                                    <div className="btn btn-block btn-dark" onClick={() => this.onOpenModal('isSeriesModalOpen')}>
                                        시리즈 수정
                                    </div>
                                </div>
                            )}
                            <SpeechBubble
                                href={`/@${this.props.series.owner}`}
                                alt={this.props.series.owner}
                                src={getUserImage(this.props.series.ownerImage)}>
                                {this.state.seriesDescription ? this.state.seriesDescription : '이 시리즈에 대한 설명이 없습니다.'}
                            </SpeechBubble>
                            <div className="mt-5 mb-3 text-right">
                                <Button
                                    space="spare"
                                    onClick={() => configStore.set((prevState) => ({
                                        ...prevState,
                                        isSortOldFirst: !isSortOldFirst
                                    }))}>
                                    {isSortOldFirst ? (
                                        <>
                                            <i className="fas fa-sort-up"/> 과거부터
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-sort-down"/> 최근부터
                                        </>
                                    )}
                                </Button>
                            </div>
                            {isSortOldFirst ? seriesPosts.map((post, idx) => (
                                <SeriesArticleCard
                                    key={idx}
                                    idx={idx}
                                    author={this.props.series.owner}
                                    {...post}
                                />
                            )) : seriesPosts.map((post, idx) => (
                                <SeriesArticleCard
                                    key={idx}
                                    idx={idx}
                                    author={this.props.series.owner}
                                    {...post}
                                />
                            )).reverse()}
                        </div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }
}

export default Series;