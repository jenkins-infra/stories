import { Link, useLoaderData } from 'react-router-dom';
import './CaseStudiesPage.css';

const BASE_PATH = '/case-studies';

export default function CaseStudiesPage() {
  const caseStudies = useLoaderData() ?? [];

  return (
    <>
      <main className="case-studies-page">
        <div className="case-studies-header">
          <h1>Case Studies</h1>
          <p>
            Explore real-world Jenkins deployments, technology wins, and the
            teams behind them.
          </p>
        </div>

        <div className="case-studies-grid">
          {caseStudies.map(study => (
            <article key={study.slug} className="case-study-card">
              <Link
                to={`${BASE_PATH}/${study.slug}`}
                className="case-study-link"
              >
                {study.image && (
                  <div className="case-study-card-image-wrap">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="case-study-card-image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="case-study-card-body">
                  <h2>{study.title}</h2>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
