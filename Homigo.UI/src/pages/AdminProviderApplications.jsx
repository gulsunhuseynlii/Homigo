import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Pagination from "../components/common/Pagination";

import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../services/providerService";

function AdminProviderApplications() {
  const [applications, setApplications] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Confirmation modal
  const [modal, setModal] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [page]);

  const loadApplications = async () => {
    try {
      const data = await getPendingProviders({
        page,
        pageSize: 5,
      });

      setApplications(data.items);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load applications.");
    }
  };

  // Open approve modal
  const handleApproveClick = (userId, fullName) => {
    setModal({
      type: "approve",
      userId,
      fullName,
    });
  };

  // Open reject modal
  const handleRejectClick = (userId, fullName) => {
    setModal({
      type: "reject",
      userId,
      fullName,
    });
  };

  // Confirm action
  const handleConfirm = async () => {
    if (!modal) return;

    try {
      setProcessing(true);

      if (modal.type === "approve") {
        await approveProvider(modal.userId);

        toast.success(
          "Provider approved successfully."
        );
      }

      if (modal.type === "reject") {
        await rejectProvider(modal.userId);

        toast.success(
          "Provider application rejected."
        );
      }

      setModal(null);

      await loadApplications();
    } catch (err) {
      toast.error(
        err.response?.data?.message ??
          "Operation failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    if (processing) return;

    setModal(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-10 text-4xl font-bold">
        Provider Applications
      </h1>


      {applications.length === 0 ? (

        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No pending applications.
          </h2>

        </div>

      ) : (

        <div className="grid gap-6">

          {applications.map((application) => (

            <div
              key={application.userId}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow"
            >

              {/* Provider information */}

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {application.fullName}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    📞 {application.phoneNumber}
                  </p>

                  <p className="text-slate-600">
                    🛠 {application.categoryName}
                  </p>

                  <p className="text-slate-600">
                    ⭐ {application.yearsOfExperience} years
                  </p>

                </div>


                {application.profileImageUrl && (

                  <img
                    src={`https://localhost:7121${application.profileImageUrl}`}
                    alt="Profile"
                    className="h-28 w-28 rounded-xl object-cover"
                  />

                )}

              </div>


              {/* Bio */}

              <div className="mt-6">

                <h3 className="font-semibold">
                  Bio
                </h3>

                <p className="mt-2 text-slate-600">
                  {application.bio}
                </p>

              </div>


              {/* Documents */}

              <div className="mt-6 flex flex-wrap gap-3">

                {application.cvUrl && (

                  <a
                    href={`https://localhost:7121${application.cvUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    View CV
                  </a>

                )}


                {application.identityCardUrl && (

                  <a
                    href={`https://localhost:7121${application.identityCardUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    Identity Card
                  </a>

                )}


                {application.certificateUrl && (

                  <a
                    href={`https://localhost:7121${application.certificateUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Certificate
                  </a>

                )}

              </div>


              {/* Actions */}

              <div className="mt-8 flex justify-end gap-3">

                <button
                  onClick={() =>
                    handleApproveClick(
                      application.userId,
                      application.fullName
                    )
                  }
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Approve Provider
                </button>


                <button
                  onClick={() =>
                    handleRejectClick(
                      application.userId,
                      application.fullName
                    )
                  }
                  className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Pagination */}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />


      {/* Confirmation Modal */}

      {modal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Icon */}

            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                modal.type === "approve"
                  ? "bg-emerald-100"
                  : "bg-red-100"
              }`}
            >
              {modal.type === "approve"
                ? "✓"
                : "⚠️"}
            </div>


            {/* Title */}

            <h2 className="mt-5 text-center text-2xl font-bold text-slate-800">

              {modal.type === "approve"
                ? "Approve Provider?"
                : "Reject Application?"}

            </h2>


            {/* Description */}

            <p className="mt-3 text-center text-slate-500">

              {modal.type === "approve" ? (

                <>
                  Are you sure you want to approve{" "}
                  <strong className="text-slate-700">
                    {modal.fullName}
                  </strong>
                  ?
                </>

              ) : (

                <>
                  Are you sure you want to reject{" "}
                  <strong className="text-slate-700">
                    {modal.fullName}
                  </strong>
                  's provider application?
                </>

              )}

            </p>


            {/* Buttons */}

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={processing}
                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleConfirm}
                disabled={processing}
                className={`flex-1 rounded-xl px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  modal.type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing
                  ? "Processing..."
                  : modal.type === "approve"
                  ? "Yes, Approve"
                  : "Yes, Reject"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminProviderApplications;