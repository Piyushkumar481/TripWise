import { FileText } from "lucide-react"

import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"

function TripDocuments() {
  return (
    <TripModulePage
      icon={FileText}
      eyebrow="Travel essentials"
      title="Documents"
      description="Keep passports, tickets, bookings and other important travel documents organized."
      actionLabel="Upload document"
      onAction={() => {}}
    >
      <TripEmptyState
        icon={FileText}
        title="No documents uploaded"
        description="Your important travel documents will appear here once you upload them."
        actionLabel="Upload your first document"
        onAction={() => {}}
      />
    </TripModulePage>
  )
}

export default TripDocuments
