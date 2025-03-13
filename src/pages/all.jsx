import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/Seo';
import UserStoryCard from '../components/UserStoryCard';
import './all.css';

// Modal Component
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Contribute Your Story</h2>
        <p>
          To share your Jenkins story, submit a Pull Request to the following GitHub repository:
        </p>
        <a
          href="https://github.com/jenkins-infra/stories/compare/main...user-story?expand=1&template=user_story.md"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          Jenkins Stories GitHub Repo
        </a>
        <button onClick={onClose} className="close-btn">✖</button>
      </div>
    </div>
  );
};

// markup
const AllPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const title = 'Jenkins - User Story Library - All';
  const { stories } = useStaticQuery(graphql`
    query AllStories {
      stories: allUserStory(sort: { fields: date, order: DESC }) {
        edges {
          node {
            title
            date(formatString: "dddd DD MMMM YYYY")
            tag_line
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
            slug
          }
        }
      }
    }
  `);

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/all" />
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h1 className="textcolor">Jenkins Is The Way</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">

            <div className="tell-your-story textcolor">
              <h2>Tell Your Story</h2>
              <p>
                "Jenkins Is The Way" is a global showcase of how
                developers and engineers are building, deploying, and automating
                great stuff with Jenkins. Share the story of your project's goals, technical challenges, and the unique solutions you encountered with Jenkins.
              </p>
              <p>
              </p>
              <div className="tshirt-promo">
                <span className="tshirt-icon">👕</span>
                <span className="tshirt-text">
                Share your story and we'll send you a free Jenkins Is The Way
                T-shirt.
                  </span>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="share-story-btn">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <h2 className='userstories-heading'>Jenkins User Stories</h2>
          <div className="col cardsWrapper">
            {stories.edges.map(({ node: story }) => (
              <UserStoryCard
                key={story.slug}
                slug={story.slug}
                image={story.image}
                title={story.title}
                date={story.date}
                tag_line={story.tag_line}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};

export default AllPage;
