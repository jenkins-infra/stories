import CMS from 'decap-cms-app';
import React from 'react';
import Layout from '../layout';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import UserStory from '../components/UserStory';

const UserStoryPreview = ({ entry, widgetsFor, getAsset }) => {
  const entryData = entry?.toJS();
  const data = entryData?.data;

  // Guard against missing data during initial load
  if (!data) return <div>Loading Preview...</div>;

  // Safe access to paragraphs
  const paragraphsWidget = widgetsFor('body_content');
  const paragraphs = paragraphsWidget?.getIn(['data', 'paragraphs']);

  if (data.body_content?.paragraphs && paragraphs) {
    for (let i = 0; i < data.body_content.paragraphs.length; i++) {
      const pContent = paragraphs.get(i);
      data.body_content.paragraphs[i] = {
        html: remark().use(remarkHtml).processSync(pContent || "").toString(),
      };
    }
  }

  // Safe access to quotes
  if (data.quotes && Array.isArray(data.quotes)) {
    data.quotes = data.quotes.map((quote, idx) => {
      const quoteImage = entry.getIn(['data', 'quotes', idx, 'image']);
      return {
        ...quote,
        image: quoteImage ? getAsset(quoteImage).url : "",
      };
    });
  }

  const mainImage = entry.getIn(['data', 'image']);
  const props = {
    ...data,
    image: mainImage ? getAsset(mainImage).url : "",
  };

  return (
    <Layout title={data.title || 'New User Story'}>
      <UserStory {...props} />
    </Layout>
  );
};

UserStoryPreview.propTypes = {
  entry: ImmutablePropTypes.map.isRequired,
  widgetsFor: PropTypes.func.isRequired,
  getAsset: PropTypes.func.isRequired,
};

CMS.registerPreviewTemplate('user-story', UserStoryPreview);