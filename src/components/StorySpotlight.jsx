import React, { useMemo, useState, useEffect } from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import "./StorySpotlight.css";

const ONE_DAY = 24 * 60 * 60 * 1000;

export default function StorySpotlight() {
  const data = useStaticQuery(graphql`
    query StorySpotlightQuery {
      allUserStory(sort: { date: DESC }) {
        nodes {
          id
          slug
          title
          tag_line
          authored_by
          date(formatString: "dddd DD MMMM YYYY")
          image {
            childImageSharp {
              gatsbyImageData(width: 140, height: 140, layout: CONSTRAINED)
            }
          }
          metadata {
            organization
          }
        }
      }
    }
  `);

  const stories = data.allUserStory.nodes;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const story = useMemo(() => {
    if (!stories.length || !isClient) return null;
    const index = Math.floor(Date.now() / ONE_DAY);
    return stories[index % stories.length];
  }, [stories, isClient]);

  if (!story) return null;

  const logo = getImage(story.image);

  return (
    <section className="story-spotlight">
      <div className="story-spotlight__outer">
        <div className="story-spotlight__mascot">
          <StaticImage
            src="../images/jenkins-original.png"
            alt="Jenkins Mascot"
            width={181}
            height={250}
            placeholder="none"
            loading="lazy"
          />
        </div>

        <div className="story-spotlight__card">
          {logo && (
            <div className="story-spotlight__logo">
              <GatsbyImage image={logo} alt={story.title} loading="lazy" placeholder="blurred" />
            </div>
          )}

          <div className="story-spotlight__content">
            <h3>{story.title}</h3>

            <p className="story-spotlight__date">{story.date}</p>

            <p className="story-spotlight__excerpt">{story.tag_line}</p>

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
