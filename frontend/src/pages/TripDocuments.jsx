import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileImage,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { useOutletContext, useParams } from "react-router-dom"

import ConfirmModal from "../components/ConfirmModal"
import TripEmptyState from "../components/trip/TripEmptyState"
import TripModulePage from "../components/trip/TripModulePage"
import {
  deleteTripDocument,
  downloadTripDocument,
  getTripDocuments,
  uploadTripDocument,
} from "../services/documentService"
import { getApiErrorMessage } from "../utils/errorHandler"

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
}

const CATEGORIES = [
  { value: "FLIGHTS", label: "Flights" },
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "IDENTIFICATION", label: "Identification" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "ACTIVITIES", label: "Activities" },
  { value: "OTHER", label: "Other" },
]

const EMPTY_FORM = {
  title: "",
  category: "OTHER",
  description: "",
}

const formatFileSize = (bytes) => {
  if (bytes == null || Number.isNaN(Number(bytes))) return "Unknown size"
  const size = Number(bytes)

  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`

  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const formatDate = (value) => {
  if (!value) return "Date unavailable"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

const getFileTypeLabel = (contentType) => {
  if (contentType === "application/pdf") return "PDF"
  if (contentType === "image/png") return "PNG"
  if (contentType === "image/jpeg") return "JPEG"
  return "Document"
}

const getCategoryLabel = (category) => {
  return CATEGORIES.find((item) => item.value === category)?.label ?? "Other"
}

const validateFile = (file) => {
  if (!file) return "Please select a document."

  if (file.size === 0) return "The selected file is empty."

  if (file.size > MAX_FILE_SIZE) {
    return "The file must be 10 MB or smaller."
  }

  const extension = file.name.split(".").pop()?.toLowerCase()
  const allowedExtensions = Object.values(ACCEPTED_TYPES).flat()

  if (!allowedExtensions.includes(`.${extension}`)) {
    return "Only PDF, JPG, JPEG, and PNG files are allowed."
  }

  if (!Object.hasOwn(ACCEPTED_TYPES, file.type)) {
    return "Please select a valid PDF, JPG, or PNG file."
  }

  return ""
}

function TripDocuments() {
  const { trip } = useOutletContext()
  const { id } = useParams()
  const tripId = trip?.id ?? id
  const fileInputRef = useRef(null)

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [actionError, setActionError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formError, setFormError] = useState("")
  const [uploading, setUploading] = useState(false)

  const [downloadingId, setDownloadingId] = useState(null)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadDocuments = useCallback(async () => {
    if (!tripId) {
      setPageError("Trip information is unavailable.")
      setLoading(false)
      return
    }

    try {
      const result = await getTripDocuments(tripId)
      setDocuments(Array.isArray(result) ? result : [])
      setPageError("")
    } catch (error) {
      setPageError(
        getApiErrorMessage(error, "Unable to load travel documents.")
      )
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    let active = true

    const fetchDocuments = async () => {
      if (!tripId) {
        setPageError("Trip information is unavailable.")
        setLoading(false)
        return
      }

      try {
        const result = await getTripDocuments(tripId)

        if (active) {
          setDocuments(Array.isArray(result) ? result : [])
          setPageError("")
        }
      } catch (error) {
        if (active) {
          setPageError(
            getApiErrorMessage(error, "Unable to load travel documents.")
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchDocuments()

    return () => {
      active = false
    }
  }, [tripId])

  const openUploadForm = () => {
    setForm({ ...EMPTY_FORM })
    setSelectedFile(null)
    setFormError("")
    setActionError("")
    setSuccessMessage("")
    setFormOpen(true)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const closeUploadForm = () => {
    if (uploading) return

    setFormOpen(false)
    setSelectedFile(null)
    setForm({ ...EMPTY_FORM })
    setFormError("")

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null

    setSelectedFile(file)
    setFormError(file ? validateFile(file) : "")
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    setFormError("")
    setActionError("")
    setSuccessMessage("")

    const fileError = validateFile(selectedFile)

    if (fileError) {
      setFormError(fileError)
      return
    }

    const title = form.title.trim()
    const description = form.description.trim()

    if (!title) {
      setFormError("Please enter a document title.")
      return
    }

    if (title.length > 150) {
      setFormError("The title cannot exceed 150 characters.")
      return
    }

    if (description.length > 500) {
      setFormError("The description cannot exceed 500 characters.")
      return
    }

    try {
      setUploading(true)

      await uploadTripDocument(tripId, selectedFile, {
        title,
        category: form.category,
        description,
      })

      setFormOpen(false)
      setForm({ ...EMPTY_FORM })
      setSelectedFile(null)
      setSuccessMessage("Document uploaded successfully.")

      if (fileInputRef.current) fileInputRef.current.value = ""

      await loadDocuments()
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to upload the document.")
      )
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (document) => {
    setActionError("")
    setSuccessMessage("")

    try {
      setDownloadingId(document.id)

      const response = await downloadTripDocument(tripId, document.id)
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], {
          type: document.contentType || "application/octet-stream",
        })
      )

      const anchor = window.document.createElement("a")
      anchor.href = blobUrl
      anchor.download = document.originalFileName || document.title || "document"
      anchor.style.display = "none"

      window.document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()

      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "Unable to download the document.")
      )
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = async () => {
    if (!documentToDelete) return

    setActionError("")
    setSuccessMessage("")

    try {
      setDeleting(true)

      await deleteTripDocument(tripId, documentToDelete.id)

      setDocuments((current) =>
        current.filter((item) => item.id !== documentToDelete.id)
      )

      setDocumentToDelete(null)
      setSuccessMessage("Document deleted successfully.")
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "Unable to delete the document.")
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <TripModulePage
      icon={FileText}
      eyebrow="Travel essentials"
      title="Documents"
      description="Keep passports, tickets, bookings and other important travel documents organized."
      actionLabel="Upload document"
      onAction={openUploadForm}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#17233c]">
              Your documents
            </h2>
            <p className="mt-1 text-sm text-[#71808d]">
              {documents.length} {documents.length === 1 ? "document" : "documents"} stored for this trip
            </p>
          </div>

          <div className="rounded-xl border border-[#dcebe6] bg-[#f0faf7] px-3 py-2 text-xs font-semibold text-[#087f82]">
            PDF, JPG, PNG Â· Max 10 MB
          </div>
        </div>

        {pageError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {pageError}
            </span>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                loadDocuments()
              }}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {formOpen && (
          <form
            onSubmit={handleUpload}
            className="rounded-2xl border border-[#dcebe6] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#17233c]">
                  Upload a document
                </h3>
                <p className="mt-1 text-sm text-[#71808d]">
                  Add a file and organize it with a title and category.
                </p>
              </div>

              <button
                type="button"
                onClick={closeUploadForm}
                disabled={uploading}
                aria-label="Close upload form"
                className="rounded-lg p-2 text-[#71808d] transition hover:bg-[#f1f5f3] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#344054]">
                Document title *
                <input
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Return flight ticket"
                  className="mt-2 w-full rounded-xl border border-[#dfe7e2] bg-white px-3.5 py-3 font-normal outline-none transition focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"
                />
              </label>

              <label className="block text-sm font-semibold text-[#344054]">
                Category *
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#dfe7e2] bg-white px-3.5 py-3 font-normal outline-none transition focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#344054] sm:col-span-2">
                Description
                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Optional details about this document"
                  className="mt-2 w-full resize-y rounded-xl border border-[#dfe7e2] bg-white px-3.5 py-3 font-normal outline-none transition focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"
                />
                <span className="mt-1 block text-right text-xs font-normal text-[#8a96a3]">
                  {form.description.length}/500
                </span>
              </label>

              <div className="sm:col-span-2">
                <label
                  htmlFor="trip-document-file"
                  className="block text-sm font-semibold text-[#344054]"
                >
                  Choose file *
                </label>

                <input
                  ref={fileInputRef}
                  id="trip-document-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-[#cddbd5] bg-[#f8fbf9] p-3 text-sm text-[#526170] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e8f7f5] file:px-3 file:py-2 file:font-semibold file:text-[#087f82]"
                />

                {selectedFile && !formError && (
                  <p className="mt-2 text-xs text-[#71808d]">
                    {selectedFile.name} Â· {formatFileSize(selectedFile.size)}
                  </p>
                )}
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeUploadForm}
                disabled={uploading}
                className="rounded-xl border border-[#dfe5e1] px-5 py-3 text-sm font-semibold text-[#637182] transition hover:bg-[#f5f7f6] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087f82] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#076f72] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Upload document"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#e1e7e3] bg-white p-12 text-sm text-[#71808d]">
            <LoaderCircle className="h-5 w-5 animate-spin text-[#087f82]" />
            Loading your documents...
          </div>
        ) : documents.length === 0 ? (
          <TripEmptyState
            icon={FileText}
            title="No documents uploaded"
            description="Your important travel documents will appear here once you upload them."
            actionLabel="Upload your first document"
            onAction={openUploadForm}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <article
                key={document.id}
                className="rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(23,35,60,0.07)]"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-[#e8f7f5] p-3">
                    {document.contentType?.startsWith("image/") ? (
                      <FileImage className="h-5 w-5 text-[#087f82]" />
                    ) : (
                      <FileText className="h-5 w-5 text-[#087f82]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="break-words font-semibold text-[#17233c]"
                      title={document.title}
                    >
                      {document.title || document.originalFileName || "Untitled document"}
                    </h3>

                    <p className="mt-1 break-all text-xs text-[#71808d]">
                      {document.originalFileName || "File name unavailable"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-[#e8f7f5] px-2.5 py-1 text-xs font-semibold text-[#087f82]">
                        {getCategoryLabel(document.category)}
                      </span>
                      <span className="rounded-lg bg-[#f2f5f3] px-2.5 py-1 text-xs font-semibold text-[#637182]">
                        {getFileTypeLabel(document.contentType)}
                      </span>
                    </div>
                  </div>
                </div>

                {document.description && (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#637182]">
                    {document.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0ee] pt-4 text-xs text-[#8a96a3]">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>{formatDate(document.uploadedAt)}</span>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownload(document)}
                    disabled={downloadingId === document.id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#087f82] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingId === document.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {downloadingId === document.id ? "Downloading..." : "Download"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocumentToDelete(document)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    aria-label={`Delete ${document.title || "document"}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!formOpen && documents.length > 0 && (
          <button
            type="button"
            onClick={openUploadForm}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#b9d8d0] bg-white px-4 py-3 text-sm font-semibold text-[#087f82] transition hover:bg-[#f0faf7]"
          >
            <Plus className="h-4 w-4" />
            Add another document
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(documentToDelete)}
        title="Delete document"
        message={`Are you sure you want to delete "${documentToDelete?.title || documentToDelete?.originalFileName || "this document"}"? The stored file will also be removed.`}
        confirmText="Delete document"
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setDocumentToDelete(null)
        }}
        loading={deleting}
      />
    </TripModulePage>
  )
}

export default TripDocuments