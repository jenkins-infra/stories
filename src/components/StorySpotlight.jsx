import { Link } from 'react-router-dom';

import './StorySpotlight.css';

const ONE_DAY = 24 * 60 * 60 * 1000;

/*
  Calculated once when the module loads.
  No impure calls during render.
*/
const DAY_INDEX = Math.floor(
  new Date().getTime() / ONE_DAY
);

export default function StorySpotlight({
  stories = [],
}) {
  if (!stories.length) return null;

  const story =
    stories[DAY_INDEX % stories.length];

  return (
    <section className="story-spotlight">
      <div className="story-spotlight__outer">
        <div className="story-spotlight__mascot">
          <img
            src="/images/jenkins-original.png"
            alt="Jenkins Mascot"
            width={181}
            height={250}
            loading="lazy"
          />
        </div>

        <div className="story-spotlight__card">
          {story.image && (
            <div className="story-spotlight__logo">
              <img
                src={story.image}
                alt={story.title}
                loading="lazy"
              />
            </div>
          )}

          <div className="story-spotlight__content">
            <h3>{story.title}</h3>

            <p className="story-spotlight__date">
              {story.date}
            </p>

            <p className="story-spotlight__excerpt">
              {story.tag_line}
            </p>

            <Link
              to={`/user-story/${story.slug}`}
              className="story-spotlight__button"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}