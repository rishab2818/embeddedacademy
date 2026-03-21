import { Link } from "react-router-dom";

export default function LessonNavigator({ previousLesson, nextLesson }) {
  return (
    <div className="lesson-nav">
      {previousLesson ? (
        <Link className="panel lesson-nav-card" to={`/lesson/${previousLesson.slug}`}>
          <span>Previous</span>
          <strong>
            {previousLesson.chapterLabel} {previousLesson.title}
          </strong>
        </Link>
      ) : (
        <div className="panel lesson-nav-card empty">
          <span>Previous</span>
          <strong>This is the first lesson</strong>
        </div>
      )}

      {nextLesson ? (
        <Link className="panel lesson-nav-card" to={`/lesson/${nextLesson.slug}`}>
          <span>Next</span>
          <strong>
            {nextLesson.chapterLabel} {nextLesson.title}
          </strong>
        </Link>
      ) : (
        <div className="panel lesson-nav-card empty">
          <span>Next</span>
          <strong>You reached the end of the course so far</strong>
        </div>
      )}
    </div>
  );
}
