function DashboardSection({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section>

      <div className="mb-5 flex items-end justify-between gap-4">

        <div>
          <h2 className="font-serif text-[27px] font-bold tracking-tight text-[#17233c]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1.5 text-sm text-[#7b8794]">
              {subtitle}
            </p>
          )}
        </div>

        {action}

      </div>

      {children}

    </section>
  )
}

export default DashboardSection
