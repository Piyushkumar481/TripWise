function TripWorkspaceSection({
  eyebrow,
  title,
  description,
  action,
  children,
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087f82]">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-1 text-lg font-semibold text-[#17233c]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-[#71808d]">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  )
}

export default TripWorkspaceSection
