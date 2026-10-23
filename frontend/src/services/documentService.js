import api from "./api"

const unwrapResponse = (response) => {
  return response.data?.data ?? response.data
}

const getDocumentBasePath = (tripId) => {
  if (!tripId) {
    throw new Error("A valid trip ID is required.")
  }

  return `/api/trips/${tripId}/document-metadata`
}

export const getTripDocuments = async (tripId) => {
  const response = await api.get(getDocumentBasePath(tripId))
  return unwrapResponse(response)
}

export const uploadTripDocument = async (tripId, file, metadata) => {
  if (!file) {
    throw new Error("Please select a document to upload.")
  }

  const formData = new FormData()

  formData.append("file", file)
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    })
  )

  const response = await api.post(
    getDocumentBasePath(tripId),
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
      timeout: 60000,
    }
  )

  return unwrapResponse(response)
}

export const downloadTripDocument = async (tripId, documentId) => {
  const response = await api.get(
    `${getDocumentBasePath(tripId)}/${documentId}/download`,
    {
      responseType: "blob",
      timeout: 60000,
    }
  )

  return response
}

export const deleteTripDocument = async (tripId, documentId) => {
  return api.delete(
    `${getDocumentBasePath(tripId)}/${documentId}`
  )
}