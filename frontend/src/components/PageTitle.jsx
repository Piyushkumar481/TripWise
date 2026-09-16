function PageTitle({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageTitle
