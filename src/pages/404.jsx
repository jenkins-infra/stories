import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import './NotFound.css';

const NotFoundPage = () => {
  return (
    <main className="page">
      <title>Not found</title>
      <StaticImage
        src="../images/fire-jenkins.svg"
        alt="Jenkins on fire logo"
        className="image"
      />
      <h1 className="heading">Page not found</h1>
      <p className="paragraph">
        Sorry{' '}
        <span role="img" aria-label="Pensive emoji">
          😔
        </span>{' '}
        we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <code className="code">src/pages/</code>
            .
            <br />
          </>
        ) : null}
        <br />
        <Link to="/" className="link">Go home</Link>.
      </p>
    </main>
  );
};

export default NotFoundPage;
