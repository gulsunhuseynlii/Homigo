import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressCard from "../components/address/AddressCard";
import AddressForm from "../components/address/AddressForm";

import {
  getAddresses,
  createAddress,
  deleteAddress,
} from "../services/addressService";

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch {
      toast.error("Failed to load addresses.");
    }
  };

  const handleCreate = async (data) => {
    try {
      await createAddress(data);

      toast.success("Address added.");

      setShowForm(false);

      loadAddresses();
    } catch {
      toast.error("Create failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);

      toast.success("Address deleted.");

      loadAddresses();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          My Addresses
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          + Add Address
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AddressForm
            onSubmit={handleCreate}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onDelete={() => handleDelete(address.id)}
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default Addresses;