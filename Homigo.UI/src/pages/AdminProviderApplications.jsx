import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../services/providerService";

function AdminProviderApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getPendingProviders();
      setApplications(data);
    } catch {
      toast.error("Failed to load applications.");
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Approve this provider?")) return;

    try {
      await approveProvider(userId);

      toast.success("Provider approved successfully.");

      loadApplications();
    } catch (err) {
      toast.error(
        err.response?.data?.message ??
          "Failed to approve provider."
      );
    }
  };
const handleReject = async (userId) => {
  if (!window.confirm("Reject this provider application?")) return;

  try {
    await rejectProvider(userId);

    toast.success("Provider application rejected.");

    loadApplications();
  } catch (err) {
    toast.error(
      err.response?.data?.message ??
      "Failed to reject provider."
    );
  }
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

              <div className="mt-6">

                <h3 className="font-semibold">
                  Bio
                </h3>

                <p className="mt-2 text-slate-600">
                  {application.bio}
                </p>

              </div>

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

            <div className="mt-8 flex justify-end gap-3">

  <button
    onClick={() => handleApprove(application.userId)}
    className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
  >
    Approve Provider
  </button>

  <button
    onClick={() => handleReject(application.userId)}
    className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
  >
    Reject
  </button>

</div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminProviderApplications;