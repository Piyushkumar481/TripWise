import { ClipboardList } from "lucide-react"

import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"

function TripNotes() {
  return (
    <TripModulePage
      icon={ClipboardList}
      eyebrow="Personal space"
      title="Notes"
      description="Save reminders, ideas, places and anything else you want to remember about this trip."
      actionLabel="Create note"
      onAction={() => {}}
    >
      <TripEmptyState
        icon={ClipboardList}
        title="No notes yet"
        description="Create notes for restaurants, places, reminders, reservations or anything else related to your trip."
        actionLabel="Create your first note"
        onAction={() => {}}
      />
    </TripModulePage>
  )
}

export default TripNotes
