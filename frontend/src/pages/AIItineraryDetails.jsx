import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  RefreshCw,
  Trash2,
  Wallet,
  Lightbulb,
  LoaderCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import {
  getItineraryById,
  regenerateItinerary,
  deleteItinerary,
} from "../services/aiItineraryService";

import "./AIItineraryDetails.css";
import AIItineraryModification from "./AIItineraryModification";

function formatCurrency(value, currency = "INR") {
  if (value == null || Number.isNaN(Number(value))) {
    return "Not specified";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${currency || "INR"} ${Number(value).toLocaleString("en-IN")}`;
  }
}

function AIItineraryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [savedItinerary, setSavedItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [error, setError] = useState("");

  const loadItinerary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getItineraryById(id);
      setSavedItinerary(response.data ?? response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load this itinerary. It may have been deleted or you may not have access."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  async function handleRegenerate() {
    if (
      !window.confirm(
        "Regenerate this itinerary? The saved itinerary may be replaced with a new AI-generated version."
      )
    ) {
      return;
    }

    try {
      setRegenerating(true);
      setError("");

      const response = await regenerateItinerary(id);
      setSavedItinerary(response.data ?? response);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to regenerate itinerary. Please try again."
      );
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this itinerary?"
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteItinerary(id);
      navigate("/ai/itinerary/history");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete itinerary. Please try again."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="itinerary-details-state">
        <LoaderCircle className="loading-spinner" size={36} />
        <p>Loading your travel plan...</p>
      </div>
    );
  }

  if (error && !savedItinerary) {
    return (
      <div className="itinerary-details-state">
        <AlertCircle size={36} />
        <h2>Unable to open itinerary</h2>
        <p>{error}</p>

        <Link
          to="/ai/itinerary/history"
          className="details-back-button"
        >
          <ArrowLeft size={18} />
          Back to history
        </Link>
      </div>
    );
  }

  const itinerary =
    savedItinerary?.itinerary ?? savedItinerary?.response ?? savedItinerary;

  const days = Array.isArray(itinerary?.itinerary)
    ? itinerary.itinerary
    : [];

  const destination = itinerary?.destination || "Your destination";
  const title = itinerary?.title || `Trip to ${destination}`;
  const duration = itinerary?.duration ?? days.length;
  const currency = itinerary?.currency || "INR";
  const totalCost = itinerary?.totalEstimatedCost;
  const costBreakdown = itinerary?.costBreakdown;
  const travelTips = Array.isArray(itinerary?.travelTips)
    ? itinerary.travelTips
    : [];

  return (
    <main className="itinerary-details-page">
      <div className="itinerary-details-container">
        <Link
          to="/ai/itinerary/history"
          className="details-back-link"
        >
          <ArrowLeft size={18} />
          Back to itinerary history
        </Link>

        {error && (
          <div className="details-error-banner">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <section className="itinerary-details-hero">
          <div className="details-hero-content">
            <span className="details-eyebrow">
              YOUR AI-POWERED TRAVEL PLAN
            </span>

            <h1>{title}</h1>

            {itinerary?.summary && (
              <p className="details-summary">{itinerary.summary}</p>
            )}

            <div className="details-meta">
              <span>
                <MapPin size={17} />
                {destination}
              </span>

              <span>
                <CalendarDays size={17} />
                {duration} {Number(duration) === 1 ? "day" : "days"}
              </span>

              <span>
                <Wallet size={17} />
                {formatCurrency(totalCost, currency)}
              </span>
            </div>
          </div>

          <div className="details-hero-actions">
            <button
              type="button"
              className="details-action-button regenerate-button"
              onClick={() => setShowModification((previous) => !previous)}
              disabled={regenerating || deleting}
            >
              <Sparkles size={17} />
              {showModification ? "Close AI modification" : "Modify with AI"}
            </button>

            <button
              className="details-action-button regenerate-button"
              onClick={handleRegenerate}
              disabled={regenerating || deleting}
            >
              {regenerating ? (
                <LoaderCircle className="loading-spinner" size={17} />
              ) : (
                <RefreshCw size={17} />
              )}

              {regenerating ? "Regenerating..." : "Regenerate"}
            </button>

            <button
              className="details-action-button delete-button"
              onClick={handleDelete}
              disabled={deleting || regenerating}
            >
              {deleting ? (
                <LoaderCircle className="loading-spinner" size={17} />
              ) : (
                <Trash2 size={17} />
              )}

              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </section>

        {showModification && (
          <AIItineraryModification
            itineraryId={id}
            onClose={() => setShowModification(false)}
            onSaved={async () => {
              await loadItinerary();
              setShowModification(false);
            }}
          />
        )}

        <section className="itinerary-section">
          <div className="section-heading">
            <span className="section-label">THE JOURNEY</span>
            <h2>Your day-by-day itinerary</h2>
            <p>Explore the activities planned for your trip.</p>
          </div>

          {days.length === 0 ? (
            <div className="details-empty-state">
              <CalendarDays size={28} />
              <h3>No daily itinerary found</h3>
              <p>
                This saved itinerary does not contain daily plans.
              </p>
            </div>
          ) : (
            <div className="itinerary-days">
              {days.map((day, index) => {
                const activities = Array.isArray(day.activities)
                  ? day.activities
                  : [];

                return (
                  <article
                    className="itinerary-day-card"
                    key={`${day.day ?? index}-${index}`}
                  >
                    <div className="day-card-header">
                      <div className="day-number">
                        DAY {day.day ?? index + 1}
                      </div>

                      <div>
                        <h3>{day.title || `Day ${day.day ?? index + 1}`}</h3>
                      </div>
                    </div>

                    {day.description && (
                      <p className="day-description">
                        {day.description}
                      </p>
                    )}

                    {activities.length > 0 ? (
                      <div className="activity-timeline">
                        {activities.map((activity, activityIndex) => (
                          <div
                            className="activity-item"
                            key={activityIndex}
                          >
                            <div className="activity-timeline-marker">
                              <span />
                            </div>

                            <div className="activity-content">
                              <div className="activity-time">
                                <Clock size={15} />
                                {activity.time || "Flexible timing"}
                              </div>

                              <h4>{activity.name || "Travel activity"}</h4>

                              {activity.description && (
                                <p>{activity.description}</p>
                              )}

                              {activity.location && (
                                <div className="activity-location">
                                  <MapPin size={14} />
                                  {activity.location}
                                </div>
                              )}

                              {activity.estimatedCost != null && (
                                <div className="activity-cost">
                                  Estimated cost:{" "}
                                  {formatCurrency(
                                    activity.estimatedCost,
                                    currency
                                  )}
                                </div>
                              )}

                              {activity.transportSuggestion && (
                                <div className="activity-transport">
                                  <strong>Transportation:</strong>{" "}
                                  {activity.transportSuggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="day-description">
                        No individual activities are available for this day.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {costBreakdown && (
          <section className="details-info-section">
            <div className="section-heading">
              <span className="section-label">TRIP BUDGET</span>
              <h2>Cost breakdown</h2>
            </div>

            <div className="expense-breakdown">
              {[
                ["Transportation", costBreakdown.transportation],
                ["Accommodation", costBreakdown.accommodation],
                ["Food", costBreakdown.food],
                ["Activities", costBreakdown.activities],
                ["Miscellaneous", costBreakdown.miscellaneous],
              ].map(([label, amount]) => (
                <div className="expense-row" key={label}>
                  <span>{label}</span>
                  <strong>{formatCurrency(amount, currency)}</strong>
                </div>
              ))}

              <div className="expense-total">
                <span>Estimated total</span>
                <strong>{formatCurrency(totalCost, currency)}</strong>
              </div>
            </div>
          </section>
        )}

        {travelTips.length > 0 && (
          <section className="details-info-section">
            <div className="section-heading">
              <span className="section-label">BE PREPARED</span>
              <h2>Travel tips</h2>
            </div>

            <div className="travel-tips-list">
              {travelTips.map((tip, index) => (
                <div className="travel-tip" key={index}>
                  <Lightbulb size={20} />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="details-bottom-navigation">
          <Link
            to="/ai/itinerary/history"
            className="details-back-button"
          >
            <ArrowLeft size={18} />
            Back to history
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AIItineraryDetails;