import * as React from 'react';
import { Link } from 'gatsby';
import './index.css'; 

const NotFoundPage = () => {
  return (
    <main className="not-found-page">
      <title>Not found</title>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-text">
        Sorry{' '}
        <span role="img" aria-label="Pensive emoji">
          😔
        </span>{' '}
        we couldn't find what you were looking for.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <code className="not-found-code">src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/" className="btn-primary">Go home</Link>
      </p>
    </main>
  );
};

export default NotFoundPage;
