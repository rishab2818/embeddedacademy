import { Suspense, lazy } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ChapterResourcePanel from "../components/ChapterResourcePanel";
import LessonNavigator from "../components/LessonNavigator";
import LessonSectionMap from "../components/LessonSectionMap";
import LessonSupportPanel from "../components/LessonSupportPanel";
import RouteLoadingPanel from "../components/RouteLoadingPanel";
import { findLessonBySlug, flatLessons, phaseMeta } from "../data/courseStructure";
import { getLessonSupport } from "../data/lessonSupport";

const ChapterOne = lazy(() => import("../chapters/ChapterOne"));
const ChapterTwo = lazy(() => import("../chapters/ChapterTwo"));
const ChapterThree = lazy(() => import("../chapters/ChapterThree"));
const ChapterFour = lazy(() => import("../chapters/ChapterFour"));
const ChapterFive = lazy(() => import("../chapters/ChapterFive"));
const ChapterSix = lazy(() => import("../chapters/ChapterSix"));
const ChapterSeven = lazy(() => import("../chapters/ChapterSeven"));
const ChapterEight = lazy(() => import("../chapters/ChapterEight"));
const ChapterNine = lazy(() => import("../chapters/ChapterNine"));
const ChapterTen = lazy(() => import("../chapters/ChapterTen"));
const ChapterEleven = lazy(() => import("../chapters/ChapterEleven"));
const ChapterTwelve = lazy(() => import("../chapters/ChapterTwelve"));
const ChapterThirteen = lazy(() => import("../chapters/ChapterThirteen"));
const ChapterFourteen = lazy(() => import("../chapters/ChapterFourteen"));
const ChapterFifteen = lazy(() => import("../chapters/ChapterFifteen"));

const componentMap = {
  chapterOne: ChapterOne,
  chapterTwo: ChapterTwo,
  chapterThree: ChapterThree,
  chapterFour: ChapterFour,
  chapterFive: ChapterFive,
  chapterSix: ChapterSix,
  chapterSeven: ChapterSeven,
  chapterEight: ChapterEight,
  chapterNine: ChapterNine,
  chapterTen: ChapterTen,
  chapterEleven: ChapterEleven,
  chapterTwelve: ChapterTwelve,
  chapterThirteen: ChapterThirteen,
  chapterFourteen: ChapterFourteen,
  chapterFifteen: ChapterFifteen,
};

export default function LessonPage({ sharedChapterProps }) {
  const { lessonSlug } = useParams();
  const lesson = findLessonBySlug(lessonSlug);

  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  const ChapterComponent = componentMap[lesson.componentKey];
  const support = getLessonSupport(lesson.slug);
  const previousLesson = lesson.previousSlug
    ? flatLessons.find((item) => item.slug === lesson.previousSlug)
    : null;
  const nextLesson = lesson.nextSlug
    ? flatLessons.find((item) => item.slug === lesson.nextSlug)
    : null;
  const chapterIndex = flatLessons.findIndex((item) => item.slug === lesson.slug);
  const progressPercent =
    flatLessons.length > 1 ? Math.round((chapterIndex / (flatLessons.length - 1)) * 100) : 100;
  const sectionCount = lesson.sections.length;
  const phase = phaseMeta[lesson.phase];

  return (
    <div className={`lesson-page lesson-phase-${lesson.phase}`}>
      <header className="panel lesson-header">
        <div className="lesson-header-main">
          <div className="lesson-header-meta">
            <p className="eyebrow">{lesson.chapterLabel}</p>
            <span className={`chapter-phase-pill phase-${lesson.phase}`}>{phase.shortLabel}</span>
            <span className="lesson-meta-pill">{sectionCount} sections</span>
          </div>
          <h1>{lesson.title}</h1>
          <p className="hero-text">{lesson.summary}</p>
          <p className="lesson-phase-copy">{phase.blurb}</p>

          <div className="lesson-header-progress-block">
            <div className="lesson-header-progress-copy">
              <span>Course position</span>
              <strong>
                Lesson {chapterIndex + 1} of {flatLessons.length}
              </strong>
            </div>
            <div className="lesson-header-progress-bar" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="lesson-header-aside">
          <div className="lesson-header-stats">
            <article className="lesson-header-stat">
              <strong>{sectionCount}</strong>
              <span>guided stops</span>
            </article>
            <article className="lesson-header-stat">
              <strong>{nextLesson ? nextLesson.chapterLabel : "Finish line"}</strong>
              <span>{nextLesson ? nextLesson.title : "you are at the final chapter"}</span>
            </article>
          </div>

          <div className="button-row lesson-header-actions">
            <Link className="secondary-link" to="/">
              All chapters
            </Link>
            <Link className="secondary-link" to="/abbreviations">
              Glossary help
            </Link>
          </div>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="lesson-content">
          <LessonSupportPanel support={support} />
          <LessonSectionMap chapter={lesson} />
          <Suspense
            fallback={
              <RouteLoadingPanel
                title={`Loading ${lesson.title}`}
                body="Pulling in this chapter's interactive lesson so the main app stays faster and lighter."
              />
            }
          >
            <ChapterComponent
              {...sharedChapterProps[lesson.componentKey]}
              chapterLabel={lesson.chapterLabel}
              chapterNumber={lesson.number}
            />
          </Suspense>
          <ChapterResourcePanel chapter={lesson} />
          <LessonNavigator previousLesson={previousLesson} nextLesson={nextLesson} />
        </div>
      </div>
    </div>
  );
}
