import { useState } from "react"

import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Save,
  Wallet,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import api from "../services/api"
import { getApiErrorMessage } from "../utils/errorHandler"

function CreateTrip() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    destinationCountry: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
    budget: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    if (!formData.title.trim()) {
      setError("Trip title is required.")
      return
    }

    if (!formData.startDate) {
      setError("Start date is required.")
      return
    }

    if (!formData.endDate) {
      setError("End date is required.")
      return
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.")
      return
    }

    if (
      formData.budget !== "" &&
      Number(formData.budget) < 0
    ) {
      setError("Budget cannot be negative.")
      return
    }

    try {
      setLoading(true)

      await api.post("/api/trips", {
        title: formData.title.trim(),

        destinationCountry:
          formData.destinationCountry.trim() || null,

        destinationCity:
          formData.destinationCity.trim() || null,

        startDate: formData.startDate,

        endDate: formData.endDate,

        budget:
          formData.budget === ""
            ? null
            : Number(formData.budget),
      })

      navigate("/trips")
    } catch (error) {
      console.error("Failed to create trip:", error)

      setError(
        getApiErrorMessage(
          error,
          "Unable to create your trip."
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1050px] space-y-7">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#dce8e4] bg-[#edf8f6] px-7 py-8 shadow-[0_10px_30px_rgba(23,35,60,0.045)] sm:px-10">

        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d5eee9]" />

        <div className="relative z-10">

          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#687583] transition hover:text-[#087f82]"
          >
            <ArrowLeft size={17} />
            Back to My Trips
          </button>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#159b9b]">
            New journey
          </p>

          <h1 className="mt-3 font-serif text-[38px] font-bold tracking-[-0.035em] text-[#17233c] sm:text-[46px]">
            Create a New Trip
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687987] sm:text-[15px]">
            Add the essentials for your journey. You can
            organize the finer details later.
          </p>

        </div>

      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-[28px] border border-[#e1e7e3] bg-white shadow-[0_8px_28px_rgba(23,35,60,0.04)]"
      >

        {/* Form heading */}
        <div className="border-b border-[#edf0ed] px-6 py-6 sm:px-9">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f5] text-[#159b9b]">
              <MapPin
                size={21}
                strokeWidth={1.9}
              />
            </div>

            <div>

              <h2 className="font-serif text-[22px] font-bold text-[#17233c]">
                Trip Information
              </h2>

              <p className="mt-1 text-xs text-[#89949d]">
                Tell us about your destination and travel dates.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-7 px-6 py-7 sm:px-9 sm:py-9">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-[#f1cbc5] bg-[#fff1ef] px-4 py-3 text-sm text-[#c96556]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef7767] text-white">
                !
              </span>

              <p>{error}</p>
            </div>
          )}

          {/* Trip title */}
          <div>

            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold text-[#526271]"
            >
              Trip Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              placeholder="e.g. Goa Beach Escape"
              className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm text-[#17233c] outline-none transition placeholder:text-[#a3acb3] focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
            />

          </div>

          {/* Destination */}
          <div>

            <div className="mb-4 flex items-center gap-2">

              <MapPin
                size={17}
                className="text-[#159b9b]"
              />

              <h3 className="text-sm font-bold text-[#526271]">
                Destination
              </h3>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="destinationCountry"
                  className="mb-2 block text-xs font-semibold text-[#89949d]"
                >
                  Country
                </label>

                <input
                  id="destinationCountry"
                  name="destinationCountry"
                  type="text"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. India"
                  className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm text-[#17233c] outline-none transition placeholder:text-[#a3acb3] focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
                />

              </div>

              <div>

                <label
                  htmlFor="destinationCity"
                  className="mb-2 block text-xs font-semibold text-[#89949d]"
                >
                  City
                </label>

                <input
                  id="destinationCity"
                  name="destinationCity"
                  type="text"
                  value={formData.destinationCity}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Goa"
                  className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm text-[#17233c] outline-none transition placeholder:text-[#a3acb3] focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
                />

              </div>

            </div>

          </div>

          {/* Dates */}
          <div>

            <div className="mb-4 flex items-center gap-2">

              <CalendarDays
                size={17}
                className="text-[#159b9b]"
              />

              <h3 className="text-sm font-bold text-[#526271]">
                Travel Dates
              </h3>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="startDate"
                  className="mb-2 block text-xs font-semibold text-[#89949d]"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm text-[#17233c] outline-none transition focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
                />

              </div>

              <div>

                <label
                  htmlFor="endDate"
                  className="mb-2 block text-xs font-semibold text-[#89949d]"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm text-[#17233c] outline-none transition focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
                />

              </div>

            </div>

          </div>

          {/* Budget */}
          <div>

            <div className="mb-4 flex items-center gap-2">

              <Wallet
                size={17}
                className="text-[#159b9b]"
              />

              <h3 className="text-sm font-bold text-[#526271]">
                Trip Budget
              </h3>

            </div>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8d99a3]">
                ₹
              </span>

              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                placeholder="25000"
                className="w-full rounded-xl border border-[#dfe5e1] bg-[#fbfcfb] py-3.5 pl-9 pr-4 text-sm text-[#17233c] outline-none transition placeholder:text-[#a3acb3] focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
              />

            </div>

            <p className="mt-2 text-xs text-[#9aa4ac]">
              Optional. You can update your budget later.
            </p>

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#edf0ed] bg-[#fbfcfb] px-6 py-5 sm:flex-row sm:justify-end sm:px-9">

          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="rounded-xl border border-[#dfe5e1] px-5 py-3 text-sm font-bold text-[#687583] transition hover:bg-white hover:text-[#17233c]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#159b9b] px-5 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(21,155,155,0.18)] transition hover:-translate-y-0.5 hover:bg-[#087f82] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creating Trip...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Trip
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  )
}

export default CreateTrip