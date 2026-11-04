import { useState } from "react";

import {
  optimizeTravelBudget,
} from "../services/aiBudgetOptimizationService";

import "./AIBudgetOptimization.css";

function formatCurrency(value, currency) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toLocaleString("en-IN")}`;
  }
}

export default function AIBudgetOptimization({
  itineraryId,
  itinerary,
}) {
  const currency = itinerary?.currency || "INR";

  const originalCost = itinerary?.totalEstimatedCost;

  const [budget, setBudget] = useState("");

  const [dailyBudget, setDailyBudget] = useState("");

  const [priorities, setPriorities] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const totalBudget = Number(budget);

    const dailyLimit = dailyBudget.trim()
      ? Number(dailyBudget)
      : null;

    if (
      !Number.isInteger(totalBudget) ||
      totalBudget < 1 ||
      totalBudget > 10000000
    ) {
      setError("Enter a valid total budget.");
      return;
    }

    if (
      dailyLimit !== null &&
      (!Number.isInteger(dailyLimit) ||
        dailyLimit < 0 ||
        dailyLimit > 1000000)
    ) {
      setError("Enter a valid daily budget.");
      return;
    }

    try {
      setLoading(true);

      const response = await optimizeTravelBudget(
        itineraryId,
        {
          totalBudget,
          dailyBudget: dailyLimit,
          currency,
          priorities: priorities.trim(),
        }
      );

      setResult(response);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to optimize your travel budget. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-budget-panel">
      <div className="ai-budget-heading">
        <span className="ai-budget-eyebrow">
          TRIPWISE AI
        </span>

        <h2>Optimize your travel budget</h2>

        <p>
          Find practical ways to reduce expenses while keeping
          the experiences that matter to you.
        </p>
      </div>

      {originalCost != null && (
        <div className="ai-budget-current-cost">
          <span>Current estimated trip cost</span>

          <strong>
            {formatCurrency(originalCost, currency)}
          </strong>
        </div>
      )}

      <form
        className="ai-budget-form"
        onSubmit={handleSubmit}
      >
        <div className="ai-budget-field">
          <label htmlFor="total-trip-budget">
            Your total trip budget
          </label>

          <input
            id="total-trip-budget"
            type="number"
            min="1"
            max="10000000"
            step="1"
            value={budget}
            onChange={(event) =>
              setBudget(event.target.value)
            }
            placeholder="Example: 15000"
            required
          />
        </div>

        <div className="ai-budget-field">
          <label htmlFor="daily-trip-budget">
            Daily budget (optional)
          </label>

          <input
            id="daily-trip-budget"
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={dailyBudget}
            onChange={(event) =>
              setDailyBudget(event.target.value)
            }
            placeholder="Example: 3000"
          />
        </div>

        <div className="ai-budget-field">
          <label htmlFor="budget-currency">
            Currency
          </label>

          <input
            id="budget-currency"
            value={currency}
            readOnly
            aria-readonly="true"
          />

          <span className="ai-budget-hint">
            Uses the currency of your saved itinerary.
          </span>
        </div>

        <div className="ai-budget-field">
          <label htmlFor="budget-priorities">
            Your travel priorities
          </label>

          <textarea
            id="budget-priorities"
            value={priorities}
            onChange={(event) =>
              setPriorities(event.target.value)
            }
            placeholder="Keep historical attractions and local food. Avoid expensive hotels. Prefer public transportation."
            maxLength={500}
            rows={4}
          />

          <span className="ai-budget-hint">
            Maximum 500 characters.
          </span>
        </div>

        <button
          className="ai-budget-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Analyzing your expenses..."
            : "Optimize my budget"}
        </button>
      </form>

      {loading && (
        <div className="ai-budget-loading" role="status">
          TripWise AI is reviewing your saved expenses and
          comparing lower-cost alternatives.
        </div>
      )}

      {error && (
        <div className="ai-budget-error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="ai-budget-results">
          <div className="ai-budget-results-heading">
            <span className="ai-budget-eyebrow">
              BUDGET ANALYSIS
            </span>

            <h3>Your optimized trip estimate</h3>
          </div>

          <div className="ai-budget-summary-grid">
            <article className="ai-budget-summary-card">
              <span>Original estimate</span>

              <strong>
                {formatCurrency(
                  result.originalEstimatedCost,
                  currency
                )}
              </strong>
            </article>

            <article className="ai-budget-summary-card">
              <span>Optimized estimate</span>

              <strong>
                {formatCurrency(
                  result.optimizedEstimatedCost,
                  currency
                )}
              </strong>
            </article>

            <article className="ai-budget-summary-card ai-budget-savings-card">
              <span>Estimated savings</span>

              <strong>
                {formatCurrency(
                  result.estimatedSavings,
                  currency
                )}
              </strong>
            </article>
          </div>

          <div
            className={`ai-budget-status ${
              result.budgetStatus === "Within budget"
                ? "within-budget"
                : "above-budget"
            }`}
          >
            <span>Budget status</span>
            <strong>{result.budgetStatus}</strong>
          </div>

          <div className="ai-budget-suggestions-heading">
            <h3>Cost-saving suggestions</h3>
          </div>

          {result.suggestions.length === 0 ? (
            <p className="ai-budget-empty">
              No suitable lower-cost alternatives were identified.
            </p>
          ) : (
            <div className="ai-budget-suggestions">
              {result.suggestions.map((suggestion, index) => (
                <article
                  className="ai-budget-suggestion-card"
                  key={`${suggestion.category}-${index}`}
                >
                  <div className="ai-budget-suggestion-top">
                    <h4>{suggestion.category}</h4>

                    <span>Estimated saving</span>
                  </div>

                  <div className="ai-budget-expense-comparison">
                    <div>
                      <span>Current expense</span>

                      <strong>
                        {formatCurrency(
                          suggestion.estimatedOriginalCost,
                          currency
                        )}
                      </strong>

                      <p>{suggestion.currentExpense}</p>
                    </div>

                    <div>
                      <span>Proposed alternative</span>

                      <strong>
                        {formatCurrency(
                          suggestion.estimatedAlternativeCost,
                          currency
                        )}
                      </strong>

                      <p>{suggestion.proposedAlternative}</p>
                    </div>
                  </div>

                  <div className="ai-budget-suggestion-bottom">
                    <strong>
                      Estimated reduction:{" "}
                      {formatCurrency(
                        suggestion.estimatedSavings,
                        currency
                      )}
                    </strong>

                    <span>
                      {suggestion.confidence}
                    </span>
                  </div>

                  <p className="ai-budget-reason">
                    {suggestion.reason}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="ai-budget-summary-note">
            <h4>Optimization summary</h4>
            <p>{result.optimizationSummary}</p>
          </div>

          <p className="ai-budget-disclaimer">
            All costs and savings are estimates based on the
            saved itinerary. They are not verified prices or
            guaranteed savings. Verify actual prices before booking.
            These suggestions do not modify your saved itinerary.
          </p>
        </div>
      )}
    </section>
  );
}