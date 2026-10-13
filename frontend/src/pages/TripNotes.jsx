import { useCallback, useEffect, useMemo, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  FileText,
  LoaderCircle,
  Pin,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react"

import TripModulePage from "../components/trip/TripModulePage"
import ConfirmModal from "../components/ConfirmModal"
import {
  filterTripNotes,
  getTripNoteCounts,
  validateTripNote,
} from "../utils/tripNoteUtils"
import { getApiErrorMessage } from "../utils/errorHandler"
import {
  createTripNote,
  deleteTripNote,
  getTripNotes,
  updateTripNote,
  updateTripNotePinnedStatus,
} from "../services/tripNoteService"

const EMPTY_FORM = {
  title: "",
  content: "",
  pinned: false,
}

const formatDate = (value) => {
  if (!value) return "Recently updated"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Recently updated"
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function TripNotes() {
  const { trip } = useOutletContext()
  const { id } = useParams()
  const tripId = trip?.id ?? id

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState("")
  const [actionError, setActionError] = useState("")

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const [deletingNoteId, setDeletingNoteId] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [pinningNoteId, setPinningNoteId] = useState(null)

  const loadNotes = useCallback(async () => {
    if (!tripId) {
      setPageError("Trip information is unavailable.")
      setLoading(false)
      return
    }

    try {
      const result = await getTripNotes(tripId)
      setNotes(Array.isArray(result) ? result : [])
      setPageError("")
    } catch (error) {
      setPageError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    let active = true

    const fetchNotes = async () => {
      if (!tripId) {
        setPageError("Trip information is unavailable.")
        setLoading(false)
        return
      }

      try {
        const result = await getTripNotes(tripId)

        if (active) {
          setNotes(Array.isArray(result) ? result : [])
          setPageError("")
        }
      } catch (error) {
        if (active) {
          setPageError(getApiErrorMessage(error))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchNotes()

    return () => {
      active = false
    }
  }, [tripId])

  const noteCounts = useMemo(
    () => getTripNoteCounts(notes),
    [notes]
  )

  const filteredNotes = useMemo(
    () => filterTripNotes(notes, search, filter),
    [notes, search, filter]
  )

  const openCreateForm = () => {
    setEditingNote(null)
    setForm({ ...EMPTY_FORM })
    setFormError("")
    setActionError("")
    setIsFormOpen(true)
  }

  const openEditForm = (note) => {
    setEditingNote(note)
    setForm({
      title: note.title || "",
      content: note.content || "",
      pinned: Boolean(note.pinned),
    })
    setFormError("")
    setActionError("")
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (saving) return

    setIsFormOpen(false)
    setEditingNote(null)
    setForm({ ...EMPTY_FORM })
    setFormError("")
  }

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      saving ||
      deletingNoteId !== null ||
      pinningNoteId !== null
    ) {
      return
    }

    setFormError("")
    setActionError("")

    const validationError = validateTripNote(form)

    if (validationError) {
      setFormError(validationError)
      return
    }

    const title = form.title.trim()
    const content = form.content.trim()

    const noteData = {
      title,
      content,
      pinned: Boolean(form.pinned),
    }

    setSaving(true)

    try {
      if (editingNote) {
        const updatedNote = await updateTripNote(
          tripId,
          editingNote.id,
          noteData
        )

        setNotes((current) =>
          current.map((note) =>
            note.id === editingNote.id ? updatedNote : note
          )
        )
      } else {
        const createdNote = await createTripNote(tripId, noteData)
        setNotes((current) => [createdNote, ...current])
      }

      setIsFormOpen(false)
      setEditingNote(null)
      setForm({ ...EMPTY_FORM })
      setFormError("")
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePinned = async (note) => {
    if (
      pinningNoteId !== null ||
      deletingNoteId !== null ||
      saving
    ) {
      return
    }

    setPinningNoteId(note.id)
    setActionError("")

    try {
      const updatedNote = await updateTripNotePinnedStatus(
        tripId,
        note.id,
        !note.pinned
      )

      setNotes((current) =>
        current.map((item) =>
          item.id === note.id ? updatedNote : item
        )
      )
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    } finally {
      setPinningNoteId(null)
    }
  }

  const handleDelete = (note) => {
    if (
      saving ||
      deletingNoteId !== null ||
      pinningNoteId !== null
    ) {
      return
    }

    setActionError("")
    setNoteToDelete(note)
  }

  const confirmDelete = async () => {
    if (
      !noteToDelete ||
      saving ||
      deletingNoteId !== null ||
      pinningNoteId !== null
    ) {
      return
    }

    const note = noteToDelete

    setDeletingNoteId(note.id)
    setActionError("")

    try {
      await deleteTripNote(tripId, note.id)

      setNotes((current) =>
        current.filter((item) => item.id !== note.id)
      )

      if (editingNote?.id === note.id) {
        setIsFormOpen(false)
        setEditingNote(null)
        setForm({ ...EMPTY_FORM })
      }

      setNoteToDelete(null)
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    } finally {
      setDeletingNoteId(null)
    }
  }


  return (
    <TripModulePage
      icon={StickyNote}
      eyebrow="PERSONAL SPACE"
      title="Trip Notes"
      description="Keep important information, reminders, addresses, and travel details in one place."
      actionLabel="New note"
      onAction={openCreateForm}
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={FileText}
            label="Total notes"
            value={noteCounts.total}
          />
          <SummaryCard
            icon={Pin}
            label="Pinned notes"
            value={noteCounts.pinned}
          />
          <SummaryCard
            icon={StickyNote}
            label="Unpinned notes"
            value={noteCounts.unpinned}
          />
        </section>

        {isFormOpen && (
          <section
            className="rounded-3xl border border-[#dfe7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] sm:p-6"
            aria-labelledby="note-form-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087f82]">
                  {editingNote ? "EDIT NOTE" : "NEW NOTE"}
                </p>
                <h2
                  id="note-form-title"
                  className="mt-2 text-xl font-semibold text-[#17233c]"
                >
                  {editingNote
                    ? "Update your note"
                    : "Capture an important detail"}
                </h2>
                <p className="mt-1 text-sm text-[#71808d]">
                  Your changes will be saved to your trip.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close note form"
                className="rounded-lg p-2 text-[#71808d] transition hover:bg-[#f1f5f3] hover:text-[#17233c] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="note-title"
                  className="mb-2 block text-sm font-medium text-[#17233c]"
                >
                  Note title
                </label>
                <input
                  id="note-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  placeholder="e.g. Hotel check-in details"
                  className="w-full rounded-xl border border-[#dfe7e3] bg-white px-4 py-3 text-sm text-[#17233c] outline-none transition placeholder:text-[#a0aab1] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"
                />
                <p className="mt-1 text-right text-xs text-[#89959e]">
                  {form.title.length}/150
                </p>
              </div>

              <div>
                <label
                  htmlFor="note-content"
                  className="mb-2 block text-sm font-medium text-[#17233c]"
                >
                  Note content
                </label>
                <textarea
                  id="note-content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  maxLength={20000}
                  required
                  rows={6}
                  placeholder="Write addresses, reminders, booking references, or other useful information..."
                  className="w-full resize-y rounded-xl border border-[#dfe7e3] bg-white px-4 py-3 text-sm leading-6 text-[#17233c] outline-none transition placeholder:text-[#a0aab1] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"
                />
                <p className="mt-1 text-right text-xs text-[#89959e]">
                  {form.content.length.toLocaleString("en-IN")}/20,000
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dfe7e3] bg-[#f8fbfa] p-4">
                <input
                  type="checkbox"
                  name="pinned"
                  checked={form.pinned}
                  onChange={handleChange}
                  className="mt-1 size-4 accent-[#087f82]"
                />
                <span>
                  <span className="block text-sm font-medium text-[#17233c]">
                    Pin this note
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#71808d]">
                    Keep this note near the top of your notes list.
                  </span>
                </span>
              </label>

              {formError && (
                <ErrorMessage message={formError} />
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#dfe7e3] px-4 py-2.5 text-sm font-medium text-[#52616b] transition hover:bg-[#f5f8f7] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087f82] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingNote
                      ? "Save changes"
                      : "Create note"}
                </button>
              </div>
            </form>
          </section>
        )}

        {actionError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError("")}
              aria-label="Dismiss error"
              className="text-red-600 hover:text-red-800"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89959e]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notes by title or content..."
                aria-label="Search notes"
                className="w-full rounded-xl border border-[#dfe7e3] bg-white py-3 pl-11 pr-4 text-sm text-[#17233c] outline-none transition placeholder:text-[#a0aab1] focus:border-[#087f82]"
              />
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Filter notes">
              <FilterButton
                active={filter === "ALL"}
                onClick={() => setFilter("ALL")}
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === "PINNED"}
                onClick={() => setFilter("PINNED")}
              >
                <Pin size={14} />
                Pinned
              </FilterButton>
              <FilterButton
                active={filter === "UNPINNED"}
                onClick={() => setFilter("UNPINNED")}
              >
                Unpinned
              </FilterButton>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#71808d]">
              Showing{" "}
              <span className="font-medium text-[#17233c]">
                {filteredNotes.length}
              </span>{" "}
              of {notes.length} notes
            </p>

            <button
              type="button"
              onClick={loadNotes}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm text-[#71808d] transition hover:text-[#087f82] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {loading && (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-label="Loading notes"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[#e1e7e3] bg-white p-5"
              >
                <div className="h-4 w-1/3 rounded bg-[#e8eeeb]" />
                <div className="mt-5 h-5 w-3/4 rounded bg-[#e8eeeb]" />
                <div className="mt-3 h-4 w-full rounded bg-[#f1f5f3]" />
                <div className="mt-2 h-4 w-5/6 rounded bg-[#f1f5f3]" />
                <div className="mt-6 h-8 w-1/2 rounded bg-[#f1f5f3]" />
              </div>
            ))}
          </div>
        )}

        {!loading && pageError && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle size={30} className="mx-auto text-red-500" />
            <h2 className="mt-4 text-lg font-semibold text-[#17233c]">
              Couldn't load your notes
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71808d]">
              {pageError}
            </p>
            <button
              type="button"
              onClick={loadNotes}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#087f82] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72]"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!loading && !pageError && filteredNotes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d4e0db] bg-white px-5 py-14 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#d2eeea] bg-[#edf8f6]">
              {notes.length === 0 ? (
                <StickyNote size={28} className="text-[#087f82]" />
              ) : (
                <Search size={27} className="text-[#087f82]" />
              )}
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#17233c]">
              {notes.length === 0
                ? "Your trip notes start here"
                : "No matching notes"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71808d]">
              {notes.length === 0
                ? "Save important addresses, booking references, reminders, and travel information so everything stays organized."
                : "Try another search term or change your filter to find the note you're looking for."}
            </p>

            {notes.length === 0 ? (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#087f82] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72]"
              >
                <Plus size={17} />
                Create your first note
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setFilter("ALL")
                }}
                className="mt-5 rounded-xl border border-[#dfe7e3] px-4 py-2.5 text-sm font-medium text-[#52616b] transition hover:bg-[#f5f8f7]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !pageError && filteredNotes.length > 0 && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                className={`group flex min-w-0 flex-col rounded-2xl border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(23,35,60,0.06)] ${
                  note.pinned
                    ? "border-[#a9dcd5] shadow-sm"
                    : "border-[#e1e7e3]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                        note.pinned
                          ? "bg-[#e8f7f5] text-[#087f82]"
                          : "bg-[#f1f5f3] text-[#52616b]"
                      }`}
                    >
                      {note.pinned ? (
                        <Pin size={19} />
                      ) : (
                        <FileText size={19} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#89959e]">
                        {note.pinned ? "PINNED NOTE" : "TRIP NOTE"}
                      </p>
                      <h3 className="mt-1 break-words font-semibold leading-6 text-[#17233c]">
                        {note.title}
                      </h3>
                    </div>
                  </div>

                  {note.pinned && (
                    <span className="shrink-0 rounded-full border border-[#cce9e4] bg-[#edf8f6] px-2.5 py-1 text-xs font-medium text-[#087f82]">
                      Pinned
                    </span>
                  )}
                </div>

                <p className="mt-5 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-[#71808d] [overflow-wrap:anywhere]">
                  {note.content}
                </p>

                <div className="mt-5 border-t border-[#edf1ef] pt-4">
                  <p className="text-xs text-[#89959e]">
                    Updated {formatDate(note.updatedAt || note.createdAt)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(note)}
                      disabled={
                        saving ||
                        deletingNoteId !== null ||
                        pinningNoteId !== null
                      }
                      className="rounded-lg border border-[#dfe7e3] px-3 py-2 text-xs font-medium text-[#52616b] transition hover:border-[#a9dcd5] hover:bg-[#edf8f6] hover:text-[#087f82] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePinned(note)}
                      disabled={
                        pinningNoteId !== null ||
                        deletingNoteId !== null
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe7e3] px-3 py-2 text-xs font-medium text-[#52616b] transition hover:bg-[#f5f8f7] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pinningNoteId === note.id ? (
                        <LoaderCircle
                          size={14}
                          className="animate-spin"
                        />
                      ) : note.pinned ? (
                        <ArrowDown size={14} />
                      ) : (
                        <ArrowUp size={14} />
                      )}
                      {note.pinned ? "Unpin" : "Pin"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(note)}
                      disabled={
                        deletingNoteId !== null ||
                        pinningNoteId !== null
                      }
                      aria-label={`Delete ${note.title}`}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingNoteId === note.id ? (
                        <LoaderCircle
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(noteToDelete)}
        title="Delete note?"
        message={
          noteToDelete
            ? `Are you sure you want to delete "${noteToDelete.title}"?`
            : ""
        }
        confirmText="Delete note"
        onConfirm={confirmDelete}
        onCancel={() => {
          if (deletingNoteId === null) {
            setNoteToDelete(null)
          }
        }}
        loading={deletingNoteId !== null}
      />
    </TripModulePage>
  )
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#e1e7e3] bg-white p-5 transition hover:border-[#cce9e4]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#71808d]">{label}</p>
        <div className="flex size-10 items-center justify-center rounded-xl border border-[#d2eeea] bg-[#edf8f6] text-[#087f82]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#17233c]">
        {value}
      </p>
    </div>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "border-[#a9dcd5] bg-[#edf8f6] text-[#087f82]"
          : "border-[#dfe7e3] bg-white text-[#71808d] hover:border-[#c8d5cf] hover:text-[#17233c]"
      }`}
    >
      {children}
    </button>
  )
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export default TripNotes