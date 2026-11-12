import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressCard from "../components/address/AddressCard";
import AddressForm from "../components/address/AddressForm";
import Spinner from "../components/common/Spinner";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";

function Addresses() {
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  // Delete olunacaq address
  const [deletingAddress, setDeletingAddress] =
    useState(null);

  // =========================
  // LOAD ADDRESSES
  // =========================

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const data = await getAddresses();

      setAddresses(data);
    } catch (error) {
      console.error(
        "LOAD ADDRESSES ERROR:",
        error
      );

      toast.error(
        "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE
  // =========================

  const handleCreate = async (data) => {
    try {
      await createAddress(data);

      toast.success("Address added.");

      setShowForm(false);
      setEditingAddress(null);

      await loadAddresses();
    } catch (error) {
      console.error(
        "CREATE ADDRESS ERROR:",
        error
      );

      toast.error("Create failed.");
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = async (data) => {
    try {
      await updateAddress(
        editingAddress.id,
        data
      );

      toast.success(
        "Address updated."
      );

      setShowForm(false);
      setEditingAddress(null);

      await loadAddresses();
    } catch (error) {
      console.error(
        "UPDATE ADDRESS ERROR:",
        error
      );

      toast.error(
        "Update failed."
      );
    }
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================

  const handleDelete = (address) => {
    setDeletingAddress(address);
  };

  // =========================
  // CLOSE DELETE MODAL
  // =========================

  const handleCancelDelete = () => {
    setDeletingAddress(null);
  };

  // =========================
  // CONFIRM DELETE
  // =========================

  const handleConfirmDelete = async () => {
    if (!deletingAddress) {
      return;
    }

    try {
      await deleteAddress(
        deletingAddress.id
      );

      toast.success(
        "Address deleted."
      );

      setDeletingAddress(null);

      await loadAddresses();
    } catch (error) {
      console.error(
        "DELETE ADDRESS ERROR:",
        error
      );

      toast.error(
        "Delete failed."
      );
    }
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          My Addresses
        </h1>

        <button
          onClick={() => {
            if (showForm) {
              handleCloseForm();
            } else {
              setEditingAddress(null);
              setShowForm(true);
            }
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          {showForm
            ? "Close"
            : "+ Add Address"}
        </button>

      </div>

      {/* FORM */}

      {showForm && (
        <div className="mb-8">

          <AddressForm
            key={
              editingAddress?.id ||
              "create"
            }
            initialData={
              editingAddress
            }
            onSubmit={
              editingAddress
                ? handleUpdate
                : handleCreate
            }
          />

        </div>
      )}

      {/* ADDRESSES */}

      <div className="grid gap-6 md:grid-cols-2">

        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <Spinner />
          </div>
        ) : addresses.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500">
            You don't have any addresses yet.
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}

              onEdit={() =>
                handleEdit(address)
              }

              onDelete={() =>
                handleDelete(address)
              }
            />
          ))
        )}

      </div>

      {/* =========================
          DELETE MODAL
          ========================= */}

      {deletingAddress && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={
            handleCancelDelete
          }
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ICON */}

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.1 12.28A2 2 0 004.92 19h14.16a2 2 0 001.73-2.86l-7.1-12.28a2 2 0 00-3.46 0z"
                />
              </svg>

            </div>

            {/* TITLE */}

            <h2 className="text-center text-xl font-bold text-gray-900">
              Delete Address?
            </h2>

            {/* MESSAGE */}

            <p className="mt-2 text-center text-gray-500">
              Are you sure you want to
              delete this address?
            </p>

            {/* ADDRESS NAME */}

            <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-center">

              <p className="font-semibold text-gray-800">
                {deletingAddress.title ||
                  "Address"}
              </p>

              {deletingAddress.city && (
                <p className="mt-1 text-sm text-gray-500">
                  {deletingAddress.city}
                  {deletingAddress.district
                    ? `, ${deletingAddress.district}`
                    : ""}
                </p>
              )}

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={
                  handleCancelDelete
                }
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Addresses;