import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import SEO from '../../../components/seo'

import API from '../../../modules/api'
import Profile from '../../../components/profile/Profile';
import Navigation from '../../../components/profile/Navigation';

export async function getServerSideProps(context) {
    const { author } = context.query;
    const { data } = await API.getUserProfile(author.replace('@', ''), [
        'profile',
        'social'
    ]);
    return {
        props: {
            profile: data
        }
    }
}

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Profile {...this.props.profile} {...this.props.social}/>
                <div className="container">
                    
                </div>
            </>
        )
    }
}

export default About