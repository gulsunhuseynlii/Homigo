import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { applyProvider } from "../services/providerService";
import { getCategories } from "../services/adminService";

function BecomeProvider() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    phoneNumber: "",
    bio: "",
    yearsOfExperience: "",
    categoryId: "",
    profileImage: null,
    identityCard: null,
    cv: null,
    certificate: null,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("PhoneNumber", form.phoneNumber);
    formData.append("Bio", form.bio);
    formData.append("YearsOfExperience", form.yearsOfExperience);
    formData.append("CategoryId", form.categoryId);

    if (form.profileImage)
      formData.append("ProfileImage", form.profileImage);

    if (form.identityCard)
      formData.append("IdentityCard", form.identityCard);

    if (form.cv)
      formData.append("Cv", form.cv);

    if (form.certificate)
      formData.append("Certificate", form.certificate);

    try {
      await applyProvider(formData);

      toast.success("Application submitted successfully.");

      setForm({
        phoneNumber: "",
        bio: "",
        yearsOfExperience: "",
        categoryId: "",
        profileImage: null,
        identityCard: null,
        cv: null,
        certificate: null,
      });

      document
        .querySelectorAll("input[type=file]")
        .forEach((x) => (x.value = ""));
    } catch (err) {
      toast.error(
        err.response?.data?.message ??
          "Application failed."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Become Provider
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-8 shadow"
      >
        <div>
          <label className="mb-2 block font-semibold">
            Phone Number
          </label>

          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Years of Experience
          </label>

         <input
  type="number"
  name="yearsOfExperience"
  value={form.yearsOfExperience}
  onChange={handleChange}
  min="0"
  max="60"
  className="w-full rounded-xl border p-3"
  required
/>
        </div>

      <div>
  <label className="mb-2 block font-semibold">
    Bio
  </label>

  <textarea
    name="bio"
    rows={5}
    value={form.bio}
    onChange={handleChange}
    maxLength={100}
    className="w-full rounded-xl border p-3"
    required
  />

  <div className="mt-1 flex justify-between text-sm">
    <span
      className={
        form.bio.length >= 100
          ? "text-red-600"
          : "text-slate-500"
      }
    >
      {form.bio.length >= 100
        ? "You have reached the maximum character limit."
        : ""}
    </span>

    <span className="text-slate-500">
      {form.bio.length}/100
    </span>
  </div>
</div>

        <div>
          <label className="mb-2 block font-semibold">
            Profile Image
          </label>

          <input
            type="file"
            name="profileImage"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Identity Card
          </label>

          <input
            type="file"
            name="identityCard"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            CV
          </label>

          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Certificate (Optional)
          </label>

          <input
            type="file"
            name="certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default BecomeProvider;