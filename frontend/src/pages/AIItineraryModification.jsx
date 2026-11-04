import { useState } from "react";
import {
  Sparkles,
  LoaderCircle,
  WandSparkles,
  CalendarDays,
  MapPin,
  Wallet,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";

import {
  previewItineraryModification,
  confirmItineraryModification,
} from "../services/aiItineraryModificationService";

import "./AIItineraryModification.css";

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
    return `${currency} ${Number(value).toLocaleString("en-IN")}`;
  }
}

function AIItineraryModification({ itineraryId, onClose, onSaved }) {
  const [modificationRequest, setModificationRequest] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handlePreview(event) {
    event.preventDefault();

    const request = modificationRequest.trim();

    if (!request) {
      setError("Describe what you want to change.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPreview(null);

      const result = await previewItineraryModification(
        itineraryId,
        request
      );

      if (!result?.modifiedItinerary || !result?.modificationSummary) {
        throw new Error("The AI returned an incomplete modification preview.");
      }

      setPreview(result);

    } catch (err) {
      console.error("Itinerary modification preview failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to generate the modification preview."
      );

    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSave() {
    if (!preview?.originalItinerary || !preview?.modifiedItinerary) {
      setError("Generate a valid preview before saving.");
      return;
    }

    const confirmed = window.confirm(
      "Save these changes to your existing itinerary? Your current saved itinerary will be replaced with the previewed version."
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveSuccess(false);

      await confirmItineraryModification(
        itineraryId,
        preview.originalItinerary,
        preview.modifiedItinerary
      );

      setSaveSuccess(true);

      if (onSaved) {
        await onSaved();
      }

    } catch (err) {
      console.error("Saving modified itinerary failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save the modified itinerary."
      );

    } finally {
      setSaving(false);
    }
  }
  let modifiedItinerary = null;

  if (preview?.modifiedItinerary) {
    try {
      modifiedItinerary = JSON.parse(preview.modifiedItinerary);
    } catch {
      modifiedItinerary = null;
    }
  }

  const days = Array.isArray(modifiedItinerary?.itinerary)
    ? modifiedItinerary.itinerary
    : [];

  return (
    <section className="aimod-container">

      <header className="aimod-header">
        <div className="aimod-heading">
          <div className="aimod-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <span className="aimod-eyebrow">
              TRIPWISE AI
            </span>

            <h2>Modify your itinerary</h2>

            <p>
              Describe the changes you want. Your saved plan stays safe.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="aimod-close"
            onClick={onClose}
            aria-label="Close modification panel"
          >
            <X size={19} />
          </button>
        )}
      </header>

      <form className="aimod-form" onSubmit={handlePreview}>

        <label htmlFor="aimod-request">
          What would you like to change?
        </label>

        <textarea
          id="aimod-request"
          value={modificationRequest}
          onChange={(event) => setModificationRequest(event.target.value)}
          placeholder="Example: Replace museums on Day 2 with outdoor adventure activities. Keep my hotel and travel plans unchanged."
          maxLength={2000}
          rows={4}
          disabled={loading}
        />

        <div className="aimod-form-footer">
          <span>{modificationRequest.length}/2000</span>

          <button
            type="submit"
            disabled={loading || !modificationRequest.trim()}
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="aimod-spinner" />
                Generating preview...
              </>
            ) : (
              <>
                <WandSparkles size={17} />
                Preview changes
              </>
            )}
          </button>
        </div>

      </form>

      {error && (
        <div className="aimod-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {preview && modifiedItinerary && (
        <div className="aimod-preview">

          <div className="aimod-preview-success">
            <CheckCircle2 size={20} />

            <div>
              <strong>Modification preview generated</strong>
              <span>Your original saved itinerary is unchanged.</span>
            </div>
          </div>

          <div className="aimod-summary">
            <span className="aimod-section-label">
              WHAT CHANGED
            </span>

            <h3>Modification summary</h3>

            <p>{preview.modificationSummary}</p>
          </div>

          <div className="aimod-preview-heading">
            <div>
              <span className="aimod-section-label">
                PROPOSED VERSION
              </span>

              <h3>{modifiedItinerary.title || "Updated itinerary"}</h3>

              <p>{modifiedItinerary.summary}</p>
            </div>

            <span className="aimod-preview-badge">
              PREVIEW
            </span>
          </div>

          <div className="aimod-meta">

            <div>
              <MapPin size={17} />
              <span>{modifiedItinerary.destination}</span>
            </div>

            <div>
              <CalendarDays size={17} />
              <span>{modifiedItinerary.duration} days</span>
            </div>

            <div>
              <Wallet size={17} />
              <span>
                {formatCurrency(
                  modifiedItinerary.totalEstimatedCost,
                  modifiedItinerary.currency
                )}
              </span>
            </div>

          </div>

          <div className="aimod-days">

            {days.map((day, index) => (

              <article className="aimod-day" key={`${day.day}-${index}`}>

                <div className="aimod-day-header">
                  <span>DAY {day.day ?? index + 1}</span>
                  <h4>{day.title}</h4>
                </div>

                {day.description && (
                  <p className="aimod-day-description">
                    {day.description}
                  </p>
                )}

                <div className="aimod-activities">

                  {(Array.isArray(day.activities) ? day.activities : [])
                    .map((activity, activityIndex) => (

                    <div
                      className="aimod-activity"
                      key={`${activity.name}-${activityIndex}`}
                    >
                      <div className="aimod-activity-time">
                        {activity.time || "Flexible"}
                      </div>

                      <div className="aimod-activity-content">
                        <strong>{activity.name}</strong>

                        {activity.location && (
                          <span>{activity.location}</span>
                        )}

                        {activity.description && (
                          <p>{activity.description}</p>
                        )}

                        {activity.estimatedCost != null && (
                          <small>
                            Estimated cost:{" "}
                            {formatCurrency(
                              activity.estimatedCost,
                              modifiedItinerary.currency
                            )}
                          </small>
                        )}
                      </div>
                    </div>

                  ))}

                </div>

              </article>

            ))}

          </div>

          {modifiedItinerary.costBreakdown && (
            <div className="aimod-costs">

              <span className="aimod-section-label">
                UPDATED ESTIMATES
              </span>

              <h3>Cost breakdown</h3>

              {[
                ["Transportation", "transportation"],
                ["Accommodation", "accommodation"],
                ["Food", "food"],
                ["Activities", "activities"],
                ["Miscellaneous", "miscellaneous"],
              ].map(([label, key]) => (

                <div className="aimod-cost-row" key={key}>
                  <span>{label}</span>

                  <strong>
                    {formatCurrency(
                      modifiedItinerary.costBreakdown[key],
                      modifiedItinerary.currency
                    )}
                  </strong>
                </div>

              ))}

            </div>
          )}

          {Array.isArray(modifiedItinerary.travelTips) &&
            modifiedItinerary.travelTips.length > 0 && (
              <div className="aimod-tips">
                <h3>Travel tips</h3>

                {modifiedItinerary.travelTips.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>
            )}

          <div className="aimod-safe-notice">
            <CheckCircle2 size={19} />

            <div>
              <strong>Your original itinerary is safe.</strong>
              <p>
                This is a preview only. No changes have been saved
                to your existing itinerary.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="aimod-save-button"
            onClick={handleConfirmSave}
            disabled={saving || !preview}
          >
            {saving ? (
              <>
                <LoaderCircle size={17} className="aimod-spinner" />
                Saving itinerary...
              </>
            ) : (
              <>
                <Save size={17} />
                Confirm & Save Changes
              </>
            )}
          </button>

          {saveSuccess && (
            <div className="aimod-saved-success" role="status">
              <CheckCircle2 size={18} />
              Itinerary successfully saved and updated.
            </div>
          )}

          <button
            type="button"
            className="aimod-new-request"
            onClick={() => {
              setPreview(null);
              setError("");
            }}
          >
            <RotateCcw size={16} />
            Try another modification
          </button>

        </div>
      )}

    </section>
  );
}

export default AIItineraryModification;