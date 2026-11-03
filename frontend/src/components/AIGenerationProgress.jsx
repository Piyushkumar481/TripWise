import { useEffect, useState } from "react";
import {
  Brain,
  MapPin,
  CalendarDays,
  Sparkles,
  Compass,
} from "lucide-react";

import "./AIGenerationProgress.css";

const generationStages = [
  {
    title: "Understanding your travel preferences",
    description: "Reviewing your destination, duration, and interests.",
    icon: Brain,
  },
  {
    title: "Exploring your destination",
    description: "Preparing destination-specific travel suggestions.",
    icon: MapPin,
  },
  {
    title: "Planning your itinerary",
    description: "Organizing activities into a day-by-day journey.",
    icon: CalendarDays,
  },
  {
    title: "Finalizing your travel plan",
    description: "Putting the finishing touches on your itinerary.",
    icon: Sparkles,
  },
];

function AIGenerationProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((current) =>
        Math.min(current + 1, generationStages.length - 1)
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const currentStage = generationStages[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <section className="ai-generation-progress">
      <div className="generation-orb">
        <div className="generation-orb-inner">
          <Compass size={38} />
        </div>
      </div>

      <div className="generation-heading">
        <span className="generation-badge">
          <Sparkles size={14} />
          TRIPWISE AI PLANNER
        </span>

        <h2>Creating your journey</h2>

        <p>
          Your next adventure is taking shape. This may take a
          little while.
        </p>
      </div>

      <div className="generation-stage-card">
        <div className="generation-stage-icon">
          <StageIcon size={24} />
        </div>

        <div className="generation-stage-text">
          <h3>{currentStage.title}</h3>
          <p>{currentStage.description}</p>
        </div>

        <div className="generation-spinner" />
      </div>

      <div className="generation-stage-list">
        {generationStages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === stageIndex;
          const isCompleted = index < stageIndex;

          return (
            <div
              className={[
                "generation-stage-item",
                isActive ? "active" : "",
                isCompleted ? "completed" : "",
              ].join(" ")}
              key={stage.title}
            >
              <div className="generation-stage-dot">
                {isCompleted ? "✓" : <Icon size={16} />}
              </div>

              <span>{stage.title}</span>
            </div>
          );
        })}
      </div>

      <div className="generation-note">
        <Sparkles size={16} />
        <span>
          Generating your itinerary. Please keep this page open.
        </span>
      </div>
    </section>
  );
}

export default AIGenerationProgress;
