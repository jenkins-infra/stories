import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

// styles
const pageStyles = {
  color: '#ffffff',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 32,
};

const paragraphStyles = {
  marginBottom: 32,
  maxWidth: '600px',
};
const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
};
const imageStyles = {
  width: '300px',
  height: 'auto',
  marginBottom: 32,
  borderRadius: '8px',
};
const linkStyles = {
  color: '#ffffff',
  textDecoration: 'underline',
};

// markup
const NotFoundPage = () => {
  return (
    <main style={pageStyles}>
      <title>Not found</title>
      <StaticImage
            src="../images/fire-jenkins.svg"
            alt="Jenkins on fire logo"
            className={imageStyles}
          />
      <h1 style={headingStyles}>Page not found</h1>
      <p style={paragraphStyles}>
        Sorry{' '}
        <span role="img" aria-label="Pensive emoji">
          😔
        </span>{' '}
        we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <code style={codeStyles}>src/pages/</code>
            .
            <br />
          </>
        ) : null}
        <br />
        <Link to="/" style={linkStyles}>Go home</Link>.
      </p>
    </main>
  );
};

export default NotFoundPage;
