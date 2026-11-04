import { useState } from "react";

import {
  getTravelRecommendations,
} from "../services/aiTravelRecommendationService";

import "./AITravelRecommendations.css";

const CATEGORY_OPTIONS = [
  "Attractions",
  "Food",
  "Activities",
  "Shopping",
];

export default function AITravelRecommendations({
  itineraryId,
  itinerary,
}) {
  const [interests, setInterests] = useState("");

  const [budget, setBudget] = useState("");

  const [categories, setCategories] = useState([
    "Attractions",
    "Food",
    "Activities",
  ]);

  const [recommendations, setRecommendations] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleCategoryChange = (category) => {
    setCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setRecommendations(null);

    const numericBudget = budget.trim()
      ? Number(budget)
      : null;

    if (
      numericBudget !== null &&
      (!Number.isFinite(numericBudget) ||
        numericBudget < 0 ||
        numericBudget > 1000000)
    ) {
      setError("Enter a valid budget between 0 and 1,000,000.");
      return;
    }

    try {
      setLoading(true);

      const result = await getTravelRecommendations(
        itineraryId,
        {
          interests: interests.trim(),
          budget: numericBudget,
          categories,
          numberOfRecommendations: 5,
        }
      );

      setRecommendations(result);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to generate recommendations. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const destination =
    itinerary?.destination || "your destination";

  return (
    <section className="ai-recommendations-panel">
      <div className="ai-recommendations-heading">
        <span className="ai-recommendations-eyebrow">
          TRIPWISE AI
        </span>

        <h2>Discover places with AI</h2>

        <p>
          Get personalized attractions, restaurants and activities
          for {destination}.
        </p>
      </div>

      <form
        className="recommendation-form"
        onSubmit={handleSubmit}
      >
        <div className="recommendation-field">
          <label htmlFor="recommendation-interests">
            What do you enjoy?
          </label>

          <textarea
            id="recommendation-interests"
            value={interests}
            onChange={(event) =>
              setInterests(event.target.value)
            }
            placeholder="Historical places, photography, local food, nature..."
            maxLength={500}
            rows={3}
          />

          <span className="recommendation-field-hint">
            Maximum 500 characters.
          </span>
        </div>

        <div className="recommendation-field">
          <label htmlFor="recommendation-budget">
            Your budget
          </label>

          <input
            id="recommendation-budget"
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={budget}
            onChange={(event) =>
              setBudget(event.target.value)
            }
            placeholder="Optional — defaults to saved trip budget"
          />
        </div>

        <div className="recommendation-field">
          <span className="recommendation-label">
            What would you like to discover?
          </span>

          <div className="recommendation-category-options">
            {CATEGORY_OPTIONS.map((category) => (
              <label
                className="recommendation-category-option"
                key={category}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() =>
                    handleCategoryChange(category)
                  }
                />

                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="recommendation-submit-button"
          disabled={loading}
        >
          {loading
            ? "Finding recommendations..."
            : "Find personalized recommendations"}
        </button>
      </form>

      {loading && (
        <div className="recommendation-loading" role="status">
          TripWise AI is analyzing your itinerary and preferences.
        </div>
      )}

      {error && (
        <div
          className="recommendation-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {recommendations && (
        <div className="recommendation-results">
          <div className="recommendation-results-heading">
            <span className="ai-recommendations-eyebrow">
              PERSONALIZED FOR YOUR TRIP
            </span>

            <h3>Your recommendations</h3>
          </div>

          <div className="recommendation-card-grid">
            {recommendations.recommendations.map(
              (item, index) => (
                <article
                  className="recommendation-card"
                  key={`${item.name}-${index}`}
                >
                  <div className="recommendation-card-top">
                    <span className="recommendation-card-category">
                      {item.category}
                    </span>

                    <span className="recommendation-day">
                      {item.suggestedDay}
                    </span>
                  </div>

                  <h4>{item.name}</h4>

                  <p className="recommendation-description">
                    {item.description}
                  </p>

                  <div className="recommendation-reason">
                    <strong>Why this matches you</strong>
                    <p>{item.reason}</p>
                  </div>

                  <div className="recommendation-card-details">
                    <div>
                      <span>Estimated cost</span>
                      <strong>{item.estimatedCost}</strong>
                    </div>

                    <div>
                      <span>Cost confidence</span>
                      <strong>{item.priceConfidence}</strong>
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>{item.location}</strong>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          {recommendations.generalAdvice && (
            <div className="recommendation-general-advice">
              <h3>TripWise travel advice</h3>
              <p>{recommendations.generalAdvice}</p>
            </div>
          )}

          <p className="recommendation-disclaimer">
            These are AI-generated suggestions, not verified
            real-time listings. Check current prices, opening
            hours, addresses and availability before visiting.
          </p>
        </div>
      )}
    </section>
  );
}