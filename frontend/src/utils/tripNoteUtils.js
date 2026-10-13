export const validateTripNote = ({ title, content } = {}) => {
  const normalizedTitle = title?.trim() ?? ""
  const normalizedContent = content?.trim() ?? ""

  if (!normalizedTitle) {
    return "Please enter a note title."
  }

  if (normalizedTitle.length > 150) {
    return "The title cannot exceed 150 characters."
  }

  if (!normalizedContent) {
    return "Please enter some note content."
  }

  if (normalizedContent.length > 20000) {
    return "The content cannot exceed 20,000 characters."
  }

  return ""
}

export const sortTripNotes = (notes = []) => {
  return [...notes].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1
    }

    const aDate = new Date(
      a.updatedAt || a.createdAt || 0
    ).getTime()

    const bDate = new Date(
      b.updatedAt || b.createdAt || 0
    ).getTime()

    return bDate - aDate
  })
}

export const filterTripNotes = (
  notes = [],
  search = "",
  filter = "ALL"
) => {
  const query = search.trim().toLowerCase()

  return sortTripNotes(
    notes.filter((note) => {
      if (filter === "PINNED" && !note.pinned) {
        return false
      }

      if (filter === "UNPINNED" && note.pinned) {
        return false
      }

      if (!query) {
        return true
      }

      return (
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      )
    })
  )
}

export const getTripNoteCounts = (notes = []) => {
  const pinned = notes.filter((note) => note.pinned).length

  return {
    total: notes.length,
    pinned,
    unpinned: notes.length - pinned,
  }
}