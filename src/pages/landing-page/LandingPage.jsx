import { Link, useLoaderData } from 'react-router-dom';
import './LandingPage.css';
import mascotImage from '../../assets/Images/hero.png';
import mascotWorld from '../../assets/Images/jenkins-world.png';

export default function HeroSection() {
  const { stories } = useLoaderData();

  return (
    <>
      <section className="hero-section">
        <div className="hero-visual">
          <img
            src={mascotImage}
            alt="Jenkins Is The Way mascot"
            className="hero-mascot"
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Jenkins Is The Way</h1>

          <p className="hero-tagline">
            Explore the latest Jenkins user stories.
          </p>

          <p className="hero-description">
            <strong>&ldquo;Jenkins Is The Way&rdquo;</strong> showcases how
            developers use Jenkins to build, deploy, and automate projects,
            sharing real challenges and solutions.
          </p>

          <div className="hero-actions">
            <a
              href="https://github.com/jenkins-infra/stories/issues/new?template=success-story.yml"
              className="hero-btn"
            >
              Share your story
            </a>

            <a href="/all" className="hero-btn">
              Read all stories
            </a>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-left">
          <h2>Jenkins User Stories &amp; Case Studies</h2>

          <p>
            Learn how organizations use Jenkins to automate software delivery,
            improve developer productivity, and scale their CI/CD workflows.
          </p>
        </div>

        <div className="landing-features-right">
          <div className="feature-row">
            <span className="feature-number">01</span>

            <div className="feature-body">
              <div className="feature-title">
                <Link to="/all" className="feature-link">
                  User Stories
                  <span className="feature-arrow">↗</span>
                </Link>
              </div>

              <p>Browse real-world success stories from teams using Jenkins.</p>
            </div>
          </div>

          <div className="feature-row">
            <span className="feature-number">02</span>

            <div className="feature-body">
              <div className="feature-title">
                <Link to="/map" className="feature-link">
                  Explore Map
                  <span className="feature-arrow">↗</span>
                </Link>
              </div>

              <p>
                Discover Jenkins adoption around the world with an interactive
                map.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <span className="feature-number">03</span>

            <div className="feature-body">
              <div className="feature-title">
                <Link to="/case-studies" className="feature-link">
                  Case Studies
                  <span className="feature-arrow">↗</span>
                </Link>
              </div>

              <p>
                Read detailed case studies highlighting implementation and
                impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="latest-stories-section">
        <div className="latest-stories-header">
          <div>
            <h2 className="latest-stories-title">
              Latest Jenkins User Stories
            </h2>

            <p className="latest-stories-subtitle">
              Stories from all around the world by Jenkins users
            </p>
          </div>

          <Link to="/all" className="latest-stories-link">
            View all stories →
          </Link>
        </div>

        <div className="latest-stories-grid">
          {stories.slice(0, 5).map(story => (
            <Link
              key={story.slug}
              to={`/user-story/${story.slug}`}
              className="landing-story-card"
            >
              <div className="story-card-image-wrapper">
                <img
                  src={story.image}
                  alt={story.title}
                  className="story-card-image"
                />
              </div>

              <div className="landing-story-content">
                <h3>{story.title}</h3>

                {story.tag_line && (
                  <p className="landing-story-tagline">{story.tag_line}</p>
                )}

                <span className="landing-story-readmore">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="world-section">
        <div className="world-visual">
          <div className="world-map-bg" aria-hidden="true" />
          <img
            src={mascotWorld}
            alt="Jenkins mascot holding the globe"
            className="world-mascot"
          />
        </div>

        <div className="world-content">
          <h2 className="world-title">Jenkins Around the World</h2>

          <p className="world-description">
            <strong>&ldquo;Jenkins Is The Way&rdquo;</strong> is a global
            showcase of how developers and engineers are building, deploying,
            and automating great stuff with Jenkins. Share the story of your
            project&apos;s goals, technical challenges, and the unique solutions
            you encountered with Jenkins.
          </p>

          <Link to="/map" className="world-btn">
            Explore Map
          </Link>
        </div>
      </section>
    </>
  );
}
