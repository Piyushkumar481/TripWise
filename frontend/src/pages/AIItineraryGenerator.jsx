import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  CalendarDays,
  Wallet,
  Users,
  Heart,
  LoaderCircle,
  Plane,
  History,
} from "lucide-react"

import aiItineraryService from "../services/aiItineraryService"
import { getApiErrorMessage } from "../utils/errorHandler"
import AIGenerationProgress from "../components/AIGenerationProgress"
import AIErrorMessage from "../components/AIErrorMessage"

const interestOptions = [
  "Adventure",
  "Nature",
  "History",
  "Culture",
  "Food",
  "Shopping",
  "Beaches",
  "Wildlife",
  "Photography",
  "Nightlife",
]

const travelStyles = [
  "Budget",
  "Balanced",
  "Luxury",
  "Adventure",
  "Family",
  "Solo",
  "Romantic",
]

function AIItineraryGenerator() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    destination: "",
    startingLocation: "",
    duration: "3",
    budget: "",
    travelers: "1",
    interests: ["Culture", "Food"],
    travelStyle: "Balanced",
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

  const toggleInterest = (interest) => {
    setFormData((previous) => {
      const selected = previous.interests.includes(interest)

      if (selected) {
        return {
          ...previous,
          interests: previous.interests.filter(
            (item) => item !== interest
          ),
        }
      }

      if (previous.interests.length >= 10) {
        setError("You can select a maximum of 10 interests.")
        return previous
      }

      setError("")

      return {
        ...previous,
        interests: [...previous.interests, interest],
      }
    })
  }

  const generationInProgress = useRef(false)

  const generateWithCurrentValues = async () => {
    if (generationInProgress.current || loading) return

    setError("")

    const destination = formData.destination.trim()
    const startingLocation = formData.startingLocation.trim()
    const budget = Number(formData.budget)
    const duration = Number(formData.duration)
    const travelers = Number(formData.travelers)

    if (!destination || !startingLocation) {
      setError("Destination and starting location are required.")
      return
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 30) {
      setError("Trip duration must be between 1 and 30 days.")
      return
    }

    if (!Number.isFinite(budget) || budget < 1) {
      setError("Please enter a valid budget greater than zero.")
      return
    }

    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
      setError("Travelers must be between 1 and 20.")
      return
    }

    if (formData.interests.length === 0) {
      setError("Select at least one interest.")
      return
    }

    generationInProgress.current = true
    setLoading(true)

    try {
      const request = {
        destination,
        startingLocation,
        duration,
        budget,
        travelers,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
      }

      const response = await aiItineraryService.generate(request)
      const savedItinerary = response.data

      if (!savedItinerary?.id) {
        throw new Error(
          "The itinerary was generated, but its saved ID was not returned."
        )
      }

      navigate(`/ai-itinerary/${savedItinerary.id}`)
    } catch (err) {
      console.error("AI itinerary generation failed:", err)

      const status = err?.response?.status

      if (!err.response && err.request) {
        setError(
          "Unable to connect to TripWise. Check your internet connection and backend server."
        )
      } else if (status === 401) {
        setError("Your session has expired. Please log in again.")
      } else if (status === 403) {
        setError("You don't have permission to generate this itinerary.")
      } else if (status === 429) {
        setError(
          "TripWise AI has reached its daily usage limit. Please try again later. Your trip details are still available in this form."
        )
      } else {
        setError(
          getApiErrorMessage(
            err,
            "Unable to generate your itinerary. Please try again."
          )
        )
      }
    } finally {
      generationInProgress.current = false
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await generateWithCurrentValues()
  }

  return (
    <main className="mx-auto max-w-[1100px] space-y-7 pb-10">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] transition hover:text-[#087f82]"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="relative overflow-hidden rounded-[30px] bg-[#17233c] px-7 py-9 text-white sm:px-10 sm:py-12">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-[#159b9b]/20 blur-3xl" />
        <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-[#159b9b]/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#a8e5dc]">
            <Sparkles size={15} />
            AI-powered travel planning
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Your next adventure,
            <span className="block text-[#75d4c5]">
              thoughtfully planned.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Tell TripWise where you want to go, what you enjoy, and your
            budget. Weâ€™ll create a personalized itinerary for your journey.
          </p>
        </div>

        <Plane
          size={90}
          className="absolute bottom-8 right-10 hidden rotate-[-12deg] text-white/10 sm:block"
        />
      </section>

            <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/ai/itinerary/history")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#0b8585]/20 bg-white px-5 py-3 text-sm font-semibold text-[#087f82] shadow-sm transition hover:bg-[#edf8f6]"
        >
          <History size={18} />
          My Saved AI Itineraries
        </button>
      </div>
      {loading ? (
        <AIGenerationProgress />
      ) : (
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-[28px] border border-[#dce8e4] bg-white shadow-[0_8px_28px_rgba(23,35,60,0.04)]"
      >
        <div className="border-b border-[#edf0ed] px-6 py-6 sm:px-9">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf8f6] text-[#087f82]">
              <MapPin size={21} />
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-[#17233c]">
                Plan your journey
              </h2>
              <p className="mt-1 text-sm text-[#89949d]">
                Share a few details to personalize your trip.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-7 px-6 py-7 sm:px-9">

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#17233c]">
                Where do you want to go?
              </label>
              <input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="e.g. Kyoto, Japan"
                className="w-full rounded-xl border border-[#dce5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none transition focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#17233c]">
                Starting location
              </label>
              <input
                name="startingLocation"
                value={formData.startingLocation}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="e.g. Bhubaneswar, India"
                className="w-full rounded-xl border border-[#dce5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none transition focus:border-[#159b9b] focus:bg-white focus:ring-4 focus:ring-[#159b9b]/10"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#17233c]">
                <CalendarDays size={16} className="text-[#087f82]" />
                Duration
              </label>
              <div className="relative">
                <input
                  name="duration"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#dce5e1] bg-[#fbfcfb] px-4 py-3.5 pr-14 text-sm outline-none focus:border-[#159b9b] focus:ring-4 focus:ring-[#159b9b]/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#89949d]">
                  days
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#17233c]">
                <Wallet size={16} className="text-[#087f82]" />
                Total budget
              </label>
              <input
                name="budget"
                type="number"
                min="1"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                required
                placeholder="e.g. 25000"
                className="w-full rounded-xl border border-[#dce5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none focus:border-[#159b9b] focus:ring-4 focus:ring-[#159b9b]/10"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#17233c]">
                <Users size={16} className="text-[#087f82]" />
                Travelers
              </label>
              <input
                name="travelers"
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#dce5e1] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none focus:border-[#159b9b] focus:ring-4 focus:ring-[#159b9b]/10"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Heart size={17} className="text-[#087f82]" />
              <label className="text-sm font-semibold text-[#17233c]">
                What are you interested in?
              </label>
            </div>

            <p className="mb-4 text-xs text-[#89949d]">
              Select at least one and up to 10 interests.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {interestOptions.map((interest) => {
                const selected = formData.interests.includes(interest)

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={selected}
                    className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                      selected
                        ? "border-[#159b9b] bg-[#edf8f6] text-[#087f82]"
                        : "border-[#dce5e1] bg-white text-[#64748b] hover:border-[#159b9b]"
                    }`}
                  >
                    {selected ? " " : ""}
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#17233c]">
              Choose your travel style
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {travelStyles.map((style) => {
                const selected = formData.travelStyle === style

                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        travelStyle: style,
                      }))
                    }
                    aria-pressed={selected}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      selected
                        ? "border-[#159b9b] bg-[#edf8f6] text-[#087f82]"
                        : "border-[#dce5e1] text-[#64748b] hover:border-[#159b9b]"
                    }`}
                  >
                    {style}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <AIErrorMessage
              message={error}
              onRetry={generateWithCurrentValues}
            />
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#edf0ed] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#89949d]">
              Your itinerary will be saved to your TripWise history.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087f82] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066b6e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Generating itinerary...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate my itinerary
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      )}
    </main>
  )
}

export default AIItineraryGenerator

