import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyAvailability,
  updateAvailability,
} from "../services/providerAvailabilityService";

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
            field === "startTime" ? value : "09:00:00",
          endTime:
            field === "endTime" ? value : "18:00:00",
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
        prev.filter((x) => x.dayOfWeek !== dayIndex)
      );
    }
  };

  const handleSave = async () => {
    try {
      await updateAvailability({
        availabilities: availability,
      });

      toast.success("Availability updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Provider Availability
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow">

        <div className="space-y-5">

          {days.map((day, index) => {

            const item = availability.find(
              (x) => x.dayOfWeek === index
            );

            const enabled = !!item;

            return (
              <div
                key={index}
                className="flex items-center gap-6 rounded-xl border p-5"
              >

                <div className="w-36 font-semibold">
                  {day}
                </div>

                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) =>
                    handleEnabled(
                      index,
                      e.target.checked
                    )
                  }
                />

                <input
                  type="time"
                  disabled={!enabled}
                  value={
                    item?.startTime?.substring(0, 5) || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "startTime",
                      e.target.value + ":00"
                    )
                  }
                  className="rounded-lg border p-2 disabled:bg-slate-100"
                />

                <span>-</span>

                <input
                  type="time"
                  disabled={!enabled}
                  value={
                    item?.endTime?.substring(0, 5) || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      index,
                      "endTime",
                      e.target.value + ":00"
                    )
                  }
                  className="rounded-lg border p-2 disabled:bg-slate-100"
                />

              </div>
            );

          })}

        </div>

        <button
          onClick={handleSave}
          className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          Save Availability
        </button>

      </div>
    </div>
  );
}

export default ProviderAvailability;