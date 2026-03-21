import { useState } from "react";
import GpioControllerLesson from "../components/GpioControllerLesson";
import SectionHeading from "../components/SectionHeading";
import { advancedCViews, gpioTeachingControllers } from "../data/chapterSeven";

function AdvancedCPanel() {
  const [activeView, setActiveView] = useState(advancedCViews[0].id);
  const view = advancedCViews.find((item) => item.id === activeView) ?? advancedCViews[0];

  return (
    <div className="chapter-grid chapter-grid-wide">
      <div className="panel gpio-teaching-panel">
        <p className="eyebrow">Advanced C view</p>
        <h3>Later, one hardware register can be described in more than one C style</h3>

        <div className="button-row">
          {advancedCViews.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip-button ${item.id === activeView ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="callout">
          <strong>{view.title}</strong>
          <span>{view.explain}</span>
        </div>

        <div className="source-card pipeline-stage-card">
          {view.code.map((line) => (
            <div key={`${view.id}-${line}`} className="source-line">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="panel gpio-teaching-panel">
        <p className="eyebrow">When to learn this</p>
        <h3>These are useful, but they are not the first step</h3>

        <div className="teaching-step-grid compact">
          <div className="teaching-step-card">
            <span>First</span>
            <p>Learn that hardware registers are just memory locations with specific meanings.</p>
          </div>
          <div className="teaching-step-card">
            <span>Then</span>
            <p>Learn to set, clear, read, and test bits with simple masks in plain C.</p>
          </div>
          <div className="teaching-step-card">
            <span>Finally</span>
            <p>Use bitfields, packed structs, and unions when you understand why they help.</p>
          </div>
        </div>

        <div className="callout">
          <strong>Important beginner note</strong>
          <span>
            `#pragma pack`, bitfields, and unions are powerful, but they also depend on layout and
            compiler rules. That is why the main lesson above stays with direct memory access first.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChapterSeven({ chapterLabel = "Chapter 1.1" }) {
  return (
    <section className="chapter" id="chapter-7">
      <div className="chapter-header">
        <p className="chapter-kicker">{chapterLabel}</p>
        <h2>Programming GPIO on the RO uController</h2>
        <p>
          This chapter slows GPIO programming down for complete beginners. We start with one
          simple 16-bit microcontroller, explain what a GPIO pin is, show which memory location is
          read or written, and then translate the same idea from plain English to C, assembly,
          opcodes, and machine code. After that, the same story is repeated on a wider 32-bit
          controller.
        </p>
      </div>

      <section className="chapter-section" id="chapter-7-intro">
        <SectionHeading
          eyebrow="Big picture first"
          title="A GPIO pin is a tiny digital doorway between software and the outside world"
          description="If you write to the right GPIO memory, an output pin can turn an LED on. If you read from the right GPIO memory, your program can learn whether a button or sensor is HIGH or LOW."
        />

        <div className="chapter-grid chapter-grid-wide">
          <div className="panel gpio-teaching-panel">
            <div className="teaching-step-grid compact">
              <div className="teaching-step-card">
                <span>1. Choose direction</span>
                <p>
                  The `DIR` register answers one question: is this pin an INPUT or an OUTPUT?
                </p>
              </div>
              <div className="teaching-step-card">
                <span>2. Read or write data</span>
                <p>
                  The `DATA` register writes output levels. The `INPUT` register tells you what
                  came in from outside.
                </p>
              </div>
              <div className="teaching-step-card">
                <span>3. Watch hardware react</span>
                <p>
                  That one bit change in memory becomes a real electrical HIGH or LOW on a pin.
                </p>
              </div>
            </div>
          </div>

          <div className="panel gpio-teaching-panel">
            <div className="translation-legend">
              <div className="translation-legend-card">
                <strong>Microcontroller</strong>
                <p>
                  A microcontroller is a small computer built to control real hardware directly.
                </p>
              </div>
              <div className="translation-legend-card">
                <strong>GPIO</strong>
                <p>GPIO means General Purpose Input Output, a pin you can read or drive.</p>
              </div>
              <div className="translation-legend-card">
                <strong>Opcode</strong>
                <p>
                  An opcode is the tiny machine-level instruction number that tells the CPU what
                  action to perform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chapter-section" id="chapter-7-ro16">
        <SectionHeading
          eyebrow="Part 1"
          title="Start with RO uController 16"
          description="This is the first controller to learn because it stays small: 16-bit registers and 8 GPIO pins. Focus only on one pin story at a time."
        />
        <GpioControllerLesson controller={gpioTeachingControllers[0]} />
      </section>

      <section className="chapter-section" id="chapter-7-ro32">
        <SectionHeading
          eyebrow="Part 2"
          title="Now repeat the same idea on RO uController 32"
          description="Nothing magical changes here. The controller becomes wider, the GPIO block now has 16 pins, and the register addresses become 32-bit sized, but the same memory idea still works."
        />
        <GpioControllerLesson controller={gpioTeachingControllers[1]} />
      </section>

      <section className="chapter-section" id="chapter-7-advanced-c">
        <SectionHeading
          eyebrow="Part 3"
          title="More advanced C ways to describe the same hardware"
          description="Once the plain memory model feels comfortable, you can start looking at bitfields, packed structs, and unions as alternate C views over the same bytes."
        />
        <AdvancedCPanel />
      </section>
    </section>
  );
}
