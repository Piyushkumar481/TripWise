import { useEffect, useState } from "react"
import { X } from "lucide-react"

function AddItineraryItemModal({
  isOpen,
  onClose,
  onSubmit,
  trip,
  submitting = false,
  error = "",
}) {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    location: "",
    category: "",
  })

  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormData({
      date: trip?.startDate || "",
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      location: "",
      category: "",
    })

    setValidationError("")
  }, [isOpen, trip])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setValidationError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setValidationError("Activity title is required.")
      return
    }

    if (!formData.date) {
      setValidationError("Please select a date.")
      return
    }

    if (
      trip?.startDate &&
      trip?.endDate &&
      (formData.date < trip.startDate ||
        formData.date > trip.endDate)
    ) {
      setValidationError(
        "Activity date must be within your trip dates."
      )
      return
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      setValidationError(
        "End time must be after start time."
      )
      return
    }

    await onSubmit({
      activityDate: formData.date,
      startTime: formData.startTime || null,
      endTime: formData.endTime || null,
      title: formData.title.trim(),
      category: formData.category || null,
      location: formData.location.trim() || null,
      notes: formData.description.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        disabled={submitting}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e1e9e6] bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e8edeb] bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#087f82]">
              Itinerary
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#142c2a]">
              Add activity
            </h2>

            <p className="mt-1 text-sm text-[#71807e]">
              Add an activity to your itinerary.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-xl p-2 text-[#71807e] transition hover:bg-[#f1f5f3] hover:text-[#142c2a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {validationError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {validationError}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="itinerary-title"
              className="text-sm font-medium text-[#435653]"
            >
              Activity title
            </label>

            <input
              id="itinerary-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Visit Baga Beach"
              maxLength={150}
              disabled={submitting}
              className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none placeholder:text-[#9aa8a5] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="itinerary-date"
                className="text-sm font-medium text-[#435653]"
              >
                Date
              </label>

              <input
                id="itinerary-date"
                name="date"
                type="date"
                value={formData.date}
                min={trip?.startDate || undefined}
                max={trip?.endDate || undefined}
                onChange={handleChange}
                disabled={submitting}
                className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="itinerary-category"
                className="text-sm font-medium text-[#435653]"
              >
                Category
              </label>

              <select
                id="itinerary-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
                className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
              >
                <option value="">Select category</option>
                <option value="TRANSPORT">Transport</option>
                <option value="HOTEL">Hotel</option>
                <option value="FOOD">Food</option>
                <option value="ACTIVITY">Activity</option>
                <option value="SIGHTSEEING">Sightseeing</option>
                <option value="SHOPPING">Shopping</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="itinerary-start-time"
                className="text-sm font-medium text-[#435653]"
              >
                Start time
              </label>

              <input
                id="itinerary-start-time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                disabled={submitting}
                className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="itinerary-end-time"
                className="text-sm font-medium text-[#435653]"
              >
                End time
              </label>

              <input
                id="itinerary-end-time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                disabled={submitting}
                className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="itinerary-location"
              className="text-sm font-medium text-[#435653]"
            >
              Location
            </label>

            <input
              id="itinerary-location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Baga Beach"
              maxLength={200}
              disabled={submitting}
              className="mt-2 w-full rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none placeholder:text-[#9aa8a5] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="itinerary-description"
              className="text-sm font-medium text-[#435653]"
            >
              Description
            </label>

            <textarea
              id="itinerary-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any useful details..."
              maxLength={1000}
              rows={4}
              disabled={submitting}
              className="mt-2 w-full resize-none rounded-xl border border-[#dce6e3] bg-[#fbfcfb] px-4 py-3 text-sm text-[#142c2a] outline-none placeholder:text-[#9aa8a5] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#e8edeb] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-[#dce6e3] px-4 py-2.5 text-sm font-medium text-[#536562] transition hover:bg-[#f4f7f6] hover:text-[#142c2a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#087f82] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066d70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItineraryItemModal