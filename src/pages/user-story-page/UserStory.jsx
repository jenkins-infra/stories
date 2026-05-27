import { Link, useLoaderData } from 'react-router-dom';
import './UserStory.css';

export default function UserStory() {
  const data = useLoaderData();

  const story = data?.story ?? data;

  return (
    <>
      <jio-navbar />

      <div className="story-navigation">
        {data?.prev ? (
          <Link to={`/user-story/${data.prev.slug}`} className="story-link">
            ← {data.prev.title || 'Previous story'}
          </Link>
        ) : (
          <div />
        )}

        {data?.next ? (
          <Link
            to={`/user-story/${data.next.slug}`}
            className="story-link next-link"
          >
            {data.next.title || 'Next story'} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      <main className="story-container">
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            padding: '20px',
          }}
        >
          {JSON.stringify(story, null, 2)}
        </pre>
      </main>

      <jio-footer />
    </>
  );
}