import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyAvailability,
  updateAvailability,
} from "../services/providerAvailabilityService";

import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function ProviderAvailability() {
  const [availability, setAvailability] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const data = await getMyAvailability();
      setAvailability(data);
    } catch {
      toast.error("Failed to load availability.");
    }
  };

  const handleChange = (dayIndex, field, value) => {
    setAvailability((prev) => {
      const copy = [...prev];

      const existing = copy.find(
        (x) => x.dayOfWeek === dayIndex
      );

      if (existing) {
        existing[field] = value;
      } else {
        copy.push({
          dayOfWeek: dayIndex,
          startTime:
            field === "startTime"
              ? value
              : "09:00:00",
          endTime:
            field === "endTime"
              ? value
              : "18:00:00",
        });
      }

      return copy;
    });
  };

  const handleEnabled = (dayIndex, checked) => {
    if (checked) {
      setAvailability((prev) => [
        ...prev,
        {
          dayOfWeek: dayIndex,
          startTime: "09:00:00",
          endTime: "18:00:00",
        },
      ]);
    } else {
      setAvailability((prev) =>
        prev.filter(
          (x) => x.dayOfWeek !== dayIndex
        )
      );
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateAvailability({
        availabilities: availability,
      });

      toast.success("Availability updated successfully.");
    } catch {
      toast.error("Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  const enabledDays = availability.length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">

        <div className="mx-auto max-w-5xl px-6 py-12">

          <div className="flex items-center gap-5 text-white">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
              <FaCalendarAlt />
            </div>

            <div>

              <h1 className="text-4xl font-extrabold">
                Availability
              </h1>

              <p className="mt-2 text-blue-100">
                Set the days and hours when customers can book your services.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* SUMMARY */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FaCalendarAlt />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Working Days
                </p>

                <p className="text-2xl font-extrabold text-slate-900">
                  {enabledDays} / 7
                </p>

              </div>

            </div>

          </div>


          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaClock />
              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="text-lg font-bold text-slate-900">
                  {enabledDays > 0
                    ? "Availability configured"
                    : "No working days set"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* AVAILABILITY CARD */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

          {/* CARD HEADER */}

          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Weekly Schedule
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Turn a day on and choose your working hours.
                </p>

              </div>

              <div className="hidden rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 sm:block">
                {enabledDays} active
              </div>

            </div>

          </div>


          {/* DAYS */}

          <div className="divide-y divide-slate-100">

            {days.map((day, index) => {

              const item = availability.find(
                (x) => x.dayOfWeek === index
              );

              const enabled = !!item;

              return (
                <div
                  key={index}
                  className={`p-5 transition sm:px-8 ${
                    enabled
                      ? "bg-white"
                      : "bg-slate-50/60"
                  }`}
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* DAY */}

                    <div className="flex items-center gap-4">

                      <label className="relative inline-flex cursor-pointer items-center">

                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) =>
                            handleEnabled(
                              index,
                              e.target.checked
                            )
                          }
                          className="peer sr-only"
                        />

                        <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-100 peer-checked:after:translate-x-5 after:absolute after:left-[3px] after:top-[3px] after:h-[22px] after:w-[22px] after:rounded-full after:bg-white after:shadow-sm after:transition-all" />

                      </label>


                      <div>

                        <h3
                          className={`font-bold ${
                            enabled
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {day}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {enabled
                            ? "Available for bookings"
                            : "Day off"}
                        </p>

                      </div>

                    </div>


                    {/* TIME */}

                    {enabled ? (

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <div className="flex items-center gap-2">

                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            From
                          </span>

                          <div className="relative">

                            <FaClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blue-500" />

                            <input
                              type="time"
                              value={
                                item?.startTime?.substring(
                                  0,
                                  5
                                ) || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "startTime",
                                  e.target.value + ":00"
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />

                          </div>

                        </div>


                        <span className="hidden text-slate-300 sm:block">
                          →
                        </span>


                        <div className="flex items-center gap-2">

                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            To
                          </span>

                          <div className="relative">

                            <FaClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blue-500" />

                            <input
                              type="time"
                              value={
                                item?.endTime?.substring(
                                  0,
                                  5
                                ) || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "endTime",
                                  e.target.value + ":00"
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400">
                        Not available
                      </div>

                    )}

                  </div>

                </div>
              );
            })}

          </div>


          {/* FOOTER */}

          <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

            <div className="flex items-center gap-3 text-sm text-slate-500">

              <FaCheckCircle className="text-green-500" />

              <span>
                Changes will apply to future bookings.
              </span>

            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Availability"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProviderAvailability;