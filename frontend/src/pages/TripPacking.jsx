import { useCallback, useEffect, useMemo, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react"

import TripModulePage from "../components/trip/TripModulePage"
import { getApiErrorMessage } from "../utils/errorHandler"
import {
  createPackingItem,
  deletePackingItem,
  getPackingItems,
  updatePackingItem,
  updatePackingStatus,
} from "../services/packingService"

const CATEGORIES = [
  { value: "CLOTHING", label: "Clothing" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "DOCUMENTS", label: "Documents" },
  { value: "TOILETRIES", label: "Toiletries" },
  { value: "MEDICINES", label: "Medicines" },
  { value: "TRAVEL_ESSENTIALS", label: "Travel essentials" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "OTHER", label: "Other" },
]

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "TRAVEL_ESSENTIALS",
  quantity: 1,
  packed: false,
}

const inputClass =
  "w-full rounded-xl border border-[#dce5e4] bg-white px-3.5 py-3 text-sm text-[#17233c] outline-none transition placeholder:text-[#98a5ae] focus:border-[#087f82] focus:ring-2 focus:ring-[#087f82]/10"

function TripPacking() {
  const { trip } = useOutletContext()
  const { id: tripId } = useParams()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")
  const [formError, setFormError] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ ...INITIAL_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [busyItemId, setBusyItemId] = useState(null)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const result = await getPackingItems(tripId)

      if (!Array.isArray(result)) {
        throw new Error("The packing list response was invalid.")
      }

      setItems(result)
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Unable to load your packing list.")
      )
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    let cancelled = false

    const fetchItems = async () => {
      try {
        setLoading(true)
        setError("")
        const result = await getPackingItems(tripId)
        if (!cancelled) {
          setItems(Array.isArray(result) ? result : [])
        }
      } catch (error) {
        if (!cancelled) {
          setError(getApiErrorMessage(error, "Unable to load packing items."))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchItems()

    return () => {
      cancelled = true
    }
  }, [tripId])

  const totalItems = items.length
  const packedItems = items.filter((item) => item.packed).length
  const unpackedItems = totalItems - packedItems
  const progress = totalItems
    ? Math.round((packedItems / totalItems) * 100)
    : 0

  const categoryCounts = useMemo(
    () =>
      items.reduce((counts, item) => {
        const category = item.category || "OTHER"
        counts[category] = (counts[category] || 0) + 1
        return counts
      }, {}),
    [items]
  )

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)

        const matchesCategory =
          categoryFilter === "ALL" ||
          item.category === categoryFilter

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "PACKED" && item.packed) ||
          (statusFilter === "UNPACKED" && !item.packed)

        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        if (a.packed !== b.packed) {
          return Number(a.packed) - Number(b.packed)
        }
        return (a.name || "").localeCompare(b.name || "")
      })
  }, [items, search, categoryFilter, statusFilter])

  const openCreateForm = () => {
    setEditingItem(null)
    setFormData({ ...INITIAL_FORM })
    setFormError("")
    setActionError("")
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "OTHER",
      quantity: item.quantity || 1,
      packed: Boolean(item.packed),
    })
    setFormError("")
    setActionError("")
    setShowForm(true)
  }

  const closeForm = () => {
    if (submitting) return
    setShowForm(false)
    setEditingItem(null)
    setFormData({ ...INITIAL_FORM })
    setFormError("")
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    const name = formData.name.trim()
    const quantity = Number(formData.quantity)
    const description = formData.description.trim()

    if (!name) {
      setFormError("Enter an item name.")
      return
    }

    if (name.length > 150) {
      setFormError("Item name must not exceed 150 characters.")
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setFormError("Quantity must be a whole number greater than zero.")
      return
    }

    if (description.length > 500) {
      setFormError("Description must not exceed 500 characters.")
      return
    }

    const payload = {
      name,
      description,
      category: formData.category,
      quantity,
      packed: Boolean(formData.packed),
    }

    setSubmitting(true)

    try {
      if (editingItem) {
        const updated = await updatePackingItem(
          tripId,
          editingItem.id,
          payload
        )

        setItems((current) =>
          current.map((item) =>
            item.id === editingItem.id ? updated : item
          )
        )
      } else {
        const created = await createPackingItem(tripId, payload)
        setItems((current) => [...current, created])
      }

      setShowForm(false)
      setEditingItem(null)
      setFormData({ ...INITIAL_FORM })
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "Unable to save the packing item.")
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleTogglePacked = async (item) => {
    setBusyItemId(item.id)
    setActionError("")

    try {
      const updated = await updatePackingStatus(
        tripId,
        item.id,
        !item.packed
      )

      setItems((current) =>
        current.map((existing) =>
          existing.id === item.id ? updated : existing
        )
      )
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Unable to update packing status.")
      )
    } finally {
      setBusyItemId(null)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from your packing list?`)) {
      return
    }

    setBusyItemId(item.id)
    setActionError("")

    try {
      await deletePackingItem(tripId, item.id)
      setItems((current) =>
        current.filter((existing) => existing.id !== item.id)
      )

      if (editingItem?.id === item.id) {
        setShowForm(false)
        setEditingItem(null)
      }
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, "Unable to delete the packing item.")
      )
    } finally {
      setBusyItemId(null)
    }
  }

  const categoryLabel = (value) =>
    CATEGORIES.find((category) => category.value === value)?.label || "Other"

  return (
    <TripModulePage
      icon={Package}
      eyebrow="Trip essentials"
      title="Packing list"
      description={`Organize your essentials${trip?.title ? ` for ${trip.title}` : ""}, check off packed items, and get ready for your trip.`}
      actionLabel="Add item"
      onAction={openCreateForm}
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-[#dcebe8] bg-gradient-to-br from-white via-white to-[#eaf8f5] p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#e1f5f1] p-3 text-[#087f82]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#087f82]">
                Pack smarter. Travel lighter.
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#17233c] sm:text-2xl">
                Your trip, organized.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#71808d]">
                Keep track of everything you need before departure.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total items" value={totalItems} icon={ClipboardList} />
            <StatCard label="Packed" value={packedItems} icon={CheckCircle2} />
            <StatCard label="Still to pack" value={unpackedItems} icon={ShoppingBag} />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#17233c]">
                  Packing progress
                </p>
                <p className="mt-1 text-xs text-[#71808d]">
                  {packedItems} of {totalItems} items packed
                </p>
              </div>
              <span className="text-lg font-bold text-[#087f82]">
                {progress}%
              </span>
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-[#dcebe8]"
              role="progressbar"
              aria-label="Packing progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#087f82] to-[#55b99c] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {showForm && (
          <section className="rounded-2xl border border-[#dce5e4] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#087f82]">
                  {editingItem ? "Edit item" : "New packing item"}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#17233c]">
                  {editingItem ? "Update your item" : "Add to your list"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                aria-label="Close packing form"
                className="rounded-lg p-2 text-[#71808d] hover:bg-[#f0f6f5] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Item name" required>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={150}
                    required
                    placeholder="e.g. Phone charger"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Category" required>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Quantity" required>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Description">
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="Optional details"
                    className={inputClass}
                  />
                </FormField>
              </div>

              {editingItem && (
                <label className="flex items-center gap-2 text-sm text-[#526471]">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.packed)}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        packed: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#087f82]"
                  />
                  Mark this item as packed
                </label>
              )}

              {formError && <ErrorMessage message={formError} />}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-xl border border-[#dce5e4] px-4 py-2.5 text-sm font-semibold text-[#526471] hover:bg-[#f6f9f8] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087f82] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72] disabled:opacity-60"
                >
                  {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {submitting ? "Saving..." : editingItem ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <section className="space-y-3" aria-label="Loading packing list">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-[#e1e7e3] bg-white"
              />
            ))}
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-[#17233c]">
              We couldn't load your packing list.
            </p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadItems}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17233c]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </section>
        ) : (
          <>
            {actionError && <ErrorMessage message={actionError} />}

            <section className="grid gap-3 rounded-2xl border border-[#e1e7e3] bg-white p-4 shadow-sm md:grid-cols-[1fr_200px_170px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a5ae]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search packing items..."
                  aria-label="Search packing items"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
                className={inputClass}
              >
                <option value="ALL">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by packing status"
                className={inputClass}
              >
                <option value="ALL">All items</option>
                <option value="UNPACKED">Not packed</option>
                <option value="PACKED">Packed</option>
              </select>
            </section>

            {totalItems > 0 && (
              <section>
                <h3 className="mb-3 text-lg font-bold text-[#17233c]">
                  Your categories
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CATEGORIES.filter((category) => categoryCounts[category.value]).map(
                    (category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() =>
                          setCategoryFilter((current) =>
                            current === category.value ? "ALL" : category.value
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                          categoryFilter === category.value
                            ? "border-[#087f82] bg-[#eaf8f5]"
                            : "border-[#e1e7e3] bg-white hover:border-[#a8d7ce]"
                        }`}
                      >
                        <p className="text-xs text-[#71808d]">{category.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[#17233c]">
                          {categoryCounts[category.value]}
                        </p>
                        <p className="mt-1 text-xs text-[#71808d]">
                          {categoryCounts[category.value] === 1 ? "item" : "items"}
                        </p>
                      </button>
                    )
                  )}
                </div>
              </section>
            )}

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#17233c]">
                    Packing checklist
                  </h3>
                  <p className="mt-1 text-sm text-[#71808d]">
                    Check off each item as you pack.
                  </p>
                </div>
                <span className="text-sm text-[#71808d]">
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {totalItems === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#cddbd8] bg-white px-5 py-12 text-center">
                  <Package className="mx-auto h-10 w-10 text-[#087f82]" />
                  <h4 className="mt-4 text-lg font-bold text-[#17233c]">
                    Your packing list starts here
                  </h4>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71808d]">
                    Add clothes, electronics, travel documents, and other essentials.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#087f82] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#076f72]"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first item
                  </button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#cddbd8] bg-white px-5 py-10 text-center">
                  <Search className="mx-auto h-7 w-7 text-[#98a5ae]" />
                  <p className="mt-3 font-semibold text-[#17233c]">
                    No matching items
                  </p>
                  <p className="mt-1 text-sm text-[#71808d]">
                    Try changing your search or filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("")
                      setCategoryFilter("ALL")
                      setStatusFilter("ALL")
                    }}
                    className="mt-4 text-sm font-semibold text-[#087f82]"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => {
                    const isBusy = busyItemId === item.id

                    return (
                      <article
                        key={item.id}
                        className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                          item.packed
                            ? "border-emerald-200 bg-emerald-50/40"
                            : "border-[#e1e7e3] hover:border-[#b8d8d1]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleTogglePacked(item)}
                            disabled={isBusy}
                            aria-label={
                              item.packed
                                ? `Mark ${item.name} as unpacked`
                                : `Mark ${item.name} as packed`
                            }
                            className="mt-0.5 shrink-0 text-[#087f82] disabled:opacity-50"
                          >
                            {isBusy ? (
                              <LoaderCircle className="h-6 w-6 animate-spin" />
                            ) : item.packed ? (
                              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <Circle className="h-6 w-6 text-[#98a5ae]" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4
                                className={`break-words font-semibold ${
                                  item.packed
                                    ? "text-[#71808d] line-through"
                                    : "text-[#17233c]"
                                }`}
                              >
                                {item.name}
                              </h4>
                              {item.packed && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                  Packed
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="mt-1 break-words text-sm text-[#71808d]">
                                {item.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-lg bg-[#eaf8f5] px-2.5 py-1 text-xs font-medium text-[#087f82]">
                                {categoryLabel(item.category)}
                              </span>
                              <span className="rounded-lg bg-[#f2f5f5] px-2.5 py-1 text-xs text-[#526471]">
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditForm(item)}
                              disabled={isBusy || submitting}
                              aria-label={`Edit ${item.name}`}
                              className="rounded-lg p-2 text-[#71808d] hover:bg-[#eaf8f5] hover:text-[#087f82] disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={isBusy || submitting}
                              aria-label={`Delete ${item.name}`}
                              className="rounded-lg p-2 text-[#71808d] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </TripModulePage>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#e1e7e3] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#71808d]">{label}</p>
        <Icon className="h-4 w-4 text-[#087f82]" />
      </div>
      <p className="mt-3 text-2xl font-bold text-[#17233c]">{value}</p>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#526471]">
        {label}
        {required && <span className="ml-1 text-[#087f82]">*</span>}
      </label>
      {children}
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  )
}

export default TripPacking