import CMS from 'netlify-cms-app';
import React from 'react';

import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import UserStory from '../components/UserStory';


const UserStoryPreview = ({entry, widgetFor, getAsset}) => {
    const props = {
        frontmatter: {
            title: entry.getIn(['data', 'title']),
            submitted_by: entry.getIn(['data', 'submitted_by']),
            date: entry.getIn(['data', 'date']),
            tag_line: entry.getIn(['data', 'tag_line']),
            image: getAsset(entry.getIn(['data', 'image'])).url,
            organization: entry.getIn(['data', 'organization']),
            industries: entry.getIn(['data', 'industries']),
            programming_languages: entry.getIn(['data', 'programming_languages']),
            platforms: entry.getIn(['data', 'platforms']),
            version_control_systems: entry.getIn(['data', 'version_control_systems']),
            community_supports: entry.getIn(['data', 'community_supports']),
            quotes: entry.getIn(['data', 'quotes']),
            name: entry.getIn(['data', 'name']),
            location: entry.getIn(['data', 'location']),
            latitude: entry.getIn(['data', 'latitude']),
            longitude: entry.getIn(['data', 'longitude']),
        },
    };
    console.log('props', props);
    console.log('image', getAsset('image'));
    return (<UserStory {...props}>{widgetFor('body')}</UserStory>);
};

UserStoryPreview.propTypes = {
    entry: ImmutablePropTypes.map.isRequired,
    widgetFor: PropTypes.func.isRequired,
    getAsset: PropTypes.func.isRequired,
};

CMS.registerPreviewTemplate('user-story', UserStoryPreview);

// CMS.registerRemarkPlugin(shortcodes);
