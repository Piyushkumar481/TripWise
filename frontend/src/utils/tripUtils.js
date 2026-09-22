export const getTripStatus = (trip) => {
  if (!trip?.startDate || !trip?.endDate) {
    return "UNKNOWN"
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(`${trip.startDate}T00:00:00`)
  const endDate = new Date(`${trip.endDate}T23:59:59`)

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return "UNKNOWN"
  }

  if (today < startDate) {
    return "UPCOMING"
  }

  if (today >= startDate && today <= endDate) {
    return "ACTIVE"
  }

  return "COMPLETED"
}

export const getTripStatusStyles = (status) => {
  switch (status) {
    case "UPCOMING":
      return {
        badge:
          "border-[#b9dfda] bg-[#eaf8f6] text-[#087f82]",
        label: "Upcoming",
      }

    case "ACTIVE":
      return {
        badge:
          "border-[#b9dfc8] bg-[#edf9f1] text-[#198154]",
        label: "Active",
      }

    case "COMPLETED":
      return {
        badge:
          "border-[#cbd4f1] bg-[#eef1ff] text-[#5369b7]",
        label: "Completed",
      }

    default:
      return {
        badge:
          "border-[#dce3df] bg-[#f4f6f4] text-[#687583]",
        label: "Unknown",
      }
  }
}

