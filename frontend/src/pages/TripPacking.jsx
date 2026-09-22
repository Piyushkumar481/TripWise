import { Package } from "lucide-react"

import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"

function TripPacking() {
  return (
    <TripModulePage
      icon={Package}
      eyebrow="Preparation"
      title="Packing"
      description="Create and manage your packing checklist so nothing important gets left behind."
      actionLabel="Add item"
      onAction={() => {}}
    >
      <TripEmptyState
        icon={Package}
        title="Your packing list is empty"
        description="Start creating your packing checklist with clothes, essentials, electronics and travel items."
        actionLabel="Add your first item"
        onAction={() => {}}
      />
    </TripModulePage>
  )
}

export default TripPacking
