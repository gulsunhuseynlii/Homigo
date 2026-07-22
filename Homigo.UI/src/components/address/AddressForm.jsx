import { useState } from "react";

function AddressForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      city: "",
      district: "",
      street: "",
      building: "",
      apartment: "",
      notes: "",
      isDefault: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow"
    >
      <input
        className="w-full rounded-lg border p-3"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        className="w-full rounded-lg border p-3"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />

      <input
        className="w-full rounded-lg border p-3"
        name="district"
        placeholder="District"
        value={form.district}
        onChange={handleChange}
      />

      <input
        className="w-full rounded-lg border p-3"
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
      />

      <input
        className="w-full rounded-lg border p-3"
        name="building"
        placeholder="Building"
        value={form.building}
        onChange={handleChange}
      />

      <input
        className="w-full rounded-lg border p-3"
        name="apartment"
        placeholder="Apartment"
        value={form.apartment}
        onChange={handleChange}
      />

      <textarea
        className="w-full rounded-lg border p-3"
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />

        Default Address
      </label>

      <button className="w-full rounded-xl bg-blue-600 py-3 text-white">
        Save Address
      </button>
    </form>
  );
}

export default AddressForm;