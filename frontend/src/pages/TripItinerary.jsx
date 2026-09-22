import { CalendarDays } from "lucide-react"

import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"

function TripItinerary() {
  return (
    <TripModulePage
      icon={CalendarDays}
      eyebrow="Planning"
      title="Itinerary"
      description="Organize your activities, plans and travel schedule day by day."
      actionLabel="Add activity"
      onAction={() => {}}
    >
      <TripEmptyState
        icon={CalendarDays}
        title="Your itinerary is empty"
        description="Start planning your trip by adding activities, places to visit, reservations and other important plans."
        actionLabel="Add your first activity"
        onAction={() => {}}
      />
    </TripModulePage>
  )
}

export default TripItinerary
