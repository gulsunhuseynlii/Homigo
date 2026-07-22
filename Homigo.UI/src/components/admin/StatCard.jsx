function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-lg">

      <p className="text-slate-500">
        {title}
      </p>

      <h2
        className="mt-4 text-5xl font-bold"
        style={{ color }}
      >
        {value}
      </h2>

    </div>
  );
}

export default StatCard;