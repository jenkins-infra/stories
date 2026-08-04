import { Link, useLoaderData } from 'react-router-dom';
import './CaseStudyPage.css';

export default function CaseStudyPage() {
  const data = useLoaderData();
  const title = data?.title ?? 'Case Study';

  return (
    <>
      <main className="case-study-page">
        <div className="case-study-breadcrumb">
          <Link to="/case-studies">← Back to case studies</Link>
        </div>

        <article className="case-study-article">
          <header className="case-study-hero">
            <h1>{title}</h1>
            {data?.authored_by && (
              <p className="case-study-author">By {data.authored_by}</p>
            )}
          </header>

          {data?.image && (
            <div className="case-study-image-wrap">
              <img
                src={data.image}
                alt={title}
                loading="lazy"
                className="case-study-image"
              />
            </div>
          )}

          <section
            className="case-study-body"
            dangerouslySetInnerHTML={{ __html: data?.bodyHtml ?? '' }}
          />
        </article>
      </main>
    </>
  );
}
