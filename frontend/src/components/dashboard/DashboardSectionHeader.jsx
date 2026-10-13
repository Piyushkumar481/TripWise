function DashboardSectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087f82]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 break-words text-lg font-semibold tracking-tight text-[#17233c] sm:text-xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#71808d]">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

export default DashboardSectionHeader