import React from 'react';
import PropTypes from 'prop-types';
import Seo from '@newrelic/gatsby-theme-newrelic/src/components/SEO';
import { useStaticQuery, graphql } from 'gatsby';
import quickstartsMetadata from '@data/quickstart-metadata';

/**
 * @param {string} siteMetadataDescription
 * @param {string} [summary]
 * @param {Object} [quickstartMetadata]
 * @param {string} [quickstartMetadata.description]
 * @returns {string}
 */
const getMetaDescription = (
  siteMetadataDescription,
  summary,
  quickstartMetadata
) => {
  // if we have a quickstart-specific description
  if (quickstartMetadata && quickstartMetadata.description) {
    return quickstartMetadata.description;
  }

  // if we have a summary
  if (summary) {
    return summary;
  }

  // default to site metadata description
  return siteMetadataDescription;
};

/**
 * @param {string} siteMetadataTitle
 * @param {string} [title]
 * @param {Object} [quickstartMetadata]
 * @param {string} [quickstartMetadata.title]
 * @returns {string}
 */
const getMetaTitle = (siteMetadataTitle, title, quickstartMetadata) => {
  // if we have custom metadata defined (with a title)
  if (quickstartMetadata && quickstartMetadata.title) {
    return quickstartMetadata.title;
  }

  // If we have a title prop
  if (title) {
    return title;
  }

  // default to site metadata title
  return siteMetadataTitle;
};

function IOSeo({ meta, name, title, tags, location, type, summary }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const crazyEgg = (location) => {
    const crazyEggPathnames = [
      '/',
      '/instant-observability/',
      '/instant-observability/node-js/01fdea36-5a15-44b4-a864-c4c99866735b/',
      '/instant-observability/php/475dec69-10c9-4bc6-8312-3caa266fb028/',
      '/instant-observability/apache/ad5affab-545a-4355-ad48-cfd66e2fbf00/',
      '/instant-observability/java/3ebfb315-d0a6-4b27-9f89-b16a9a1ada5f/',
      '/instant-observability/dotnet/2dff13b6-0fac-43a6-abc6-57f0a3299639/',
      '/instant-observability/codestream/29bd9a4a-1c19-4219-9694-0942f6411ce7/',
      '/instant-observability/ibmmq/924fd4b3-a6d1-4a6e-9e2c-b598f197f713/',
      '/instant-observability/symfony/ff0c7881-b5a5-4ccc-8596-b28a982b1586/',
      '/instant-observability/grpc/3473982b-d42a-4505-82be-9f3cda13bb8e/',
    ];

    if (crazyEggPathnames.includes(location.pathname))
      return (
        <script
          type="text/javascript"
          src="//script.crazyegg.com/pages/scripts/0045/9836.js"
          async="async"
        />
      );
  };

  const {
    description: siteMetadataDescription,
    title: siteMetadataTitle,
  } = site.siteMetadata;

  const quickstartMetadata = quickstartsMetadata[name];

  const metaDescription = getMetaDescription(
    siteMetadataDescription,
    summary,
    quickstartMetadata
  );

  const metaTitle = getMetaTitle(siteMetadataTitle, title, quickstartMetadata);

  const globalMetadata = [
    { name: 'description', content: metaDescription },
    { 'http-equiv': 'Content-Type', content: 'text/html', charset: 'utf-8' },

    {
      name: 'google-site-verification',
      content: 'He_vizRXYX_mUhwBe3BmyaMxNnVRAZbq_Jtm2A0e4WY',
    },
  ];

  const social = [
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: site.siteMetadata.author },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
  ];

  // if we decide we need this elsewhere, abstract into gatsby-theme-newrelic
  const swiftype = [
    {
      name: 'title',
      class: 'swiftype',
      'data-type': 'string',
      content: title,
    },
    {
      name: 'document_type',
      class: 'swiftype',
      'data-type': 'enum',
      content: 'page',
    },
    {
      name: 'info',
      class: 'swiftype',
      'data-type': 'string',
      content: metaDescription,
    },
    ...(tags ?? []).map((tag) => ({
      name: 'tags',
      class: 'swiftype',
      'data-type': 'string',
      content: tag,
    })),
  ];

  // only add metadata if we have content
  const validMetadata = [
    ...globalMetadata,
    ...social,
    ...meta,
    ...swiftype,
  ].filter((m) => m.content !== '');

  return (
    <Seo location={location} title={title} type={type}>
      {crazyEgg(location)}
      {validMetadata.map((data, index) => (
        <meta key={`${data.name}-${index}`} {...data} />
      ))}
    </Seo>
  );
}

IOSeo.defaultProps = {
  meta: [],
};

IOSeo.propTypes = {
  location: PropTypes.object.isRequired,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  quickStartName: PropTypes.string,
  summary: PropTypes.string,
  /**
   * The `slug` field in the quickstart configuration and the NerdGraph
   * API.
   *
   * @note that this is considered `name` in the Gatsby GraphQL.
   */
  name: PropTypes.string,
};

export default IOSeo;
