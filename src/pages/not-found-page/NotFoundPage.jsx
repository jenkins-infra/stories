import './NotFoundPage.css';
import FireImage from '../../assets/Images/fire-jenkins.svg';

const NotFoundPage = () => {
  const title = 'Page not found';

  return (
    <>
      <title>{title}</title>

      <main className="page">
        <img src={FireImage} alt="Jenkins on fire logo" className="image" />

        <h1 className="heading">Page not found</h1>

        <p className="paragraph">
          Sorry{' '}
          <span role="img" aria-label="Pensive emoji">
            😔
          </span>{' '}
          we couldn’t find what you were looking for.
          <br />
          {import.meta.env.DEV && (
            <>
              <br />
              Try creating a page in <code className="code">src/pages/</code>.
              <br />
            </>
          )}
          <br />
          <a href="/" className="link">
            Go home
          </a>
          .
        </p>
      </main>
    </>
  );
};

export default NotFoundPage;
