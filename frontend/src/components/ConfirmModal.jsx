import { AlertTriangle, X } from "lucide-react"

function ConfirmModal({
  isOpen,
  title = "Delete Trip",
  message = "Are you sure you want to delete this trip?",
  confirmText = "Delete Trip",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e4e9e6] bg-white shadow-2xl">
        <div className="p-6">

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#18212f]">
                  {title}
                </h2>

                <p className="mt-1 text-sm text-[#7b8794]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg p-2 text-[#8a96a3] transition hover:bg-[#f4f6f5] hover:text-[#26313f] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close confirmation modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-6 text-sm leading-6 text-[#637182]">
            {message}
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-[#dfe5e1] px-5 py-3 text-sm font-semibold text-[#637182] transition hover:bg-[#f5f7f6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
