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
    formData.append(
      "YearsOfExperience",
      form.yearsOfExperience
    );
    formData.append("CategoryId", form.categoryId);

    if (form.profileImage) {
      formData.append(
        "ProfileImage",
        form.profileImage
      );
    }

    if (form.identityCard) {
      formData.append(
        "IdentityCard",
        form.identityCard
      );
    }

    if (form.cv) {
      formData.append("Cv", form.cv);
    }

    if (form.certificate) {
      formData.append(
        "Certificate",
        form.certificate
      );
    }

    try {
      await applyProvider(formData);

      toast.success(
        "Application submitted successfully."
      );

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
        .querySelectorAll('input[type="file"]')
        .forEach((input) => {
          input.value = "";
        });
    } catch (err) {
      toast.error(
        err.response?.data?.message ??
          "Application failed."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      {/* PAGE HEADER */}

      <div className="mx-auto max-w-3xl">


        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Become Provider
          </h1>

          <p className="mt-2 text-slate-500">
            Join Homigo and start offering your services
            to customers.
          </p>

        </div>


        {/* FORM CARD */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          {/* PHONE */}
<div>
  <label className="mb-2 block font-semibold">
    Phone Number
  </label>

  <div className="flex">
    <span className="flex items-center rounded-l-xl border border-r-0 bg-slate-50 px-4 text-slate-600">
      +994
    </span>

    <input
      type="text"
      name="phoneNumber"
      value={form.phoneNumber}
      onChange={handleChange}
      placeholder="XX XXX XX XX"
      maxLength={9}
      className="w-full rounded-r-xl border p-3"
      required
    />
  </div>
</div>


          {/* CATEGORY */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >

              <option value="">
                Select Category
              </option>

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


          {/* EXPERIENCE */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Years of Experience
            </label>

            <input
              type="number"
              name="yearsOfExperience"
              value={form.yearsOfExperience}
              onChange={handleChange}
              min="0"
              max="60"
              placeholder="Enter years of experience"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>


          {/* BIO */}

          <div className="mb-7">

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-semibold text-slate-700">
                Bio
              </label>

              <span
                className={`text-xs ${
                  form.bio.length >= 100
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {form.bio.length}/100
              </span>

            </div>

            <textarea
              name="bio"
              rows={5}
              value={form.bio}
              onChange={handleChange}
              maxLength={100}
              placeholder="Tell customers about yourself and your experience..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>


          {/* DOCUMENTS */}

          <div className="mb-7">

            <div className="mb-5 border-b border-slate-100 pb-4">

              <h2 className="text-lg font-semibold text-slate-900">
                Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload the required documents for your
                provider application.
              </p>

            </div>


            {/* PROFILE IMAGE */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profile Image
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <input
                  type="file"
                  name="profileImage"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleChange}
                  required
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, JPEG, PNG or WEBP
                </p>

              </div>

            </div>


            {/* IDENTITY CARD */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Identity Card
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <input
                  type="file"
                  name="identityCard"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleChange}
                  required
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, JPEG, PNG or PDF
                </p>

              </div>

            </div>


            {/* CV */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CV
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <p className="mt-2 text-xs text-slate-400">
                  PDF, DOC or DOCX
                </p>

              </div>

            </div>


            {/* CERTIFICATE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Certificate
                <span className="ml-2 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <input
                  type="file"
                  name="certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                />

                <p className="mt-2 text-xs text-slate-400">
                  PDF, JPG, JPEG or PNG
                </p>

              </div>

            </div>

          </div>


          {/* INFO */}

          <div className="mb-7 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

            <p className="text-sm leading-6 text-blue-700">
              Your application will be reviewed by the
              Homigo team after submission.
            </p>

          </div>


          {/* BUTTON */}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Submit Application
          </button>

        </form>


        {/* BOTTOM */}

        <p className="mt-5 text-center text-xs text-slate-400">
          Your information will be kept secure and used
          only for provider verification.
        </p>

      </div>

    </div>
  );
}

export default BecomeProvider;