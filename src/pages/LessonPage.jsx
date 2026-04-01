import { Link, Navigate, useParams } from "react-router-dom";
import ChapterResourcePanel from "../components/ChapterResourcePanel";
import LessonNavigator from "../components/LessonNavigator";
import { findLessonBySlug, flatLessons } from "../data/courseStructure";
import ChapterFive from "../chapters/ChapterFive";
import ChapterFour from "../chapters/ChapterFour";
import ChapterOne from "../chapters/ChapterOne";
import ChapterEight from "../chapters/ChapterEight";
import ChapterEleven from "../chapters/ChapterEleven";
import ChapterNine from "../chapters/ChapterNine";
import ChapterSix from "../chapters/ChapterSix";
import ChapterTen from "../chapters/ChapterTen";
import ChapterTwelve from "../chapters/ChapterTwelve";
import ChapterThree from "../chapters/ChapterThree";
import ChapterTwo from "../chapters/ChapterTwo";

const componentMap = {
  chapterOne: ChapterOne,
  chapterTwo: ChapterTwo,
  chapterThree: ChapterThree,
  chapterFour: ChapterFour,
  chapterFive: ChapterFive,
  chapterSix: ChapterSix,
  chapterEight: ChapterEight,
  chapterNine: ChapterNine,
  chapterTen: ChapterTen,
  chapterEleven: ChapterEleven,
  chapterTwelve: ChapterTwelve,
};

export default function LessonPage({ sharedChapterProps }) {
  const { lessonSlug } = useParams();
  const lesson = findLessonBySlug(lessonSlug);

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  const ChapterComponent = componentMap[lesson.componentKey];
  const previousLesson = lesson.previousSlug
    ? flatLessons.find((item) => item.slug === lesson.previousSlug)
    : null;
  const nextLesson = lesson.nextSlug
    ? flatLessons.find((item) => item.slug === lesson.nextSlug)
    : null;

  return (
    <div className="lesson-page">
      <header className="panel lesson-header">
        <div>
          <p className="eyebrow">{lesson.chapterLabel}</p>
          <h1>{lesson.title}</h1>
          <p className="hero-text">{lesson.summary}</p>
        </div>

        <div className="button-row">
          <Link className="secondary-link" to="/">
            Back to chapters
          </Link>
          <a className="secondary-link" href={`#/lesson/${lesson.slug}`} target="_blank" rel="noreferrer">
            Open This Chapter In New Tab
          </a>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="lesson-content">
          <ChapterComponent
            {...sharedChapterProps[lesson.componentKey]}
            chapterLabel={lesson.chapterLabel}
            chapterNumber={lesson.number}
          />
          <LessonNavigator previousLesson={previousLesson} nextLesson={nextLesson} />
        </div>

        <aside className="lesson-sidebar">
          <ChapterResourcePanel chapter={lesson} />
        </aside>
      </div>
    </div>
  );
}
