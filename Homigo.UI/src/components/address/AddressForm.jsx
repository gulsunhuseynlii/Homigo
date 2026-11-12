import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = {
  lat: 40.4093,
  lng: 49.8671,
};

// ======================================================
// REVERSE GEOCODING
// ======================================================

async function getAddressFromCoordinates(
  lat,
  lng
) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    console.log(
      "NOMINATIM DATA:",
      data
    );

    const address =
      data.address || {};

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      "";

    const district =
      address.suburb ||
      address.city_district ||
      address.district ||
      address.county ||
      "";

    const street =
      address.road ||
      address.pedestrian ||
      address.footway ||
      "";

    const building =
      address.house_number || "";

    console.log(
      "PARSED ADDRESS:",
      {
        city,
        district,
        street,
        building,
      }
    );

    return {
      city,
      district,
      street,
      building,
    };
  } catch (error) {
    console.error(
      "REVERSE GEOCODING ERROR:",
      error
    );

    return {
      city: "",
      district: "",
      street: "",
      building: "",
    };
  }
}

// ======================================================
// LOCATION PICKER
// ======================================================

function LocationPicker({
  position,
  onLocationSelect,
}) {
  const [loadingLocation, setLoadingLocation] =
    useState(false);

  // ====================================================
  // CURRENT LOCATION
  // ====================================================

  useEffect(() => {
    // Edit zamanı saxlanmış location varsa,
    // həmin location istifadə olunur.
    if (position) {
      return;
    }

    if (!navigator.geolocation) {
      console.warn(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (currentPosition) => {
        const lat =
          currentPosition.coords.latitude;

        const lng =
          currentPosition.coords.longitude;

        console.log(
          "CURRENT LOCATION:",
          lat,
          lng
        );

        // Current location üçün
        // reverse geocoding et
        const address =
          await getAddressFromCoordinates(
            lat,
            lng
          );

        // Marker + address məlumatlarını göndər
        onLocationSelect({
          lat,
          lng,

          city:
            address.city,

          district:
            address.district,

          street:
            address.street,

          building:
            address.building,
        });

        setLoadingLocation(false);
      },

      (error) => {
        console.error(
          "CURRENT LOCATION ERROR:",
          error
        );

        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [position, onLocationSelect]);

  // ====================================================
  // MAP CLICK
  // ====================================================

  const handleMapClick = async (
    event
  ) => {
    if (!event.detail.latLng) {
      return;
    }

    const lat =
      event.detail.latLng.lat;

    const lng =
      event.detail.latLng.lng;

    console.log(
      "CLICKED LOCATION:",
      lat,
      lng
    );

    // Kliklənən yerin address məlumatlarını tap
    const address =
      await getAddressFromCoordinates(
        lat,
        lng
      );

    // Marker + address
    onLocationSelect({
      lat,
      lng,

      city:
        address.city,

      district:
        address.district,

      street:
        address.street,

      building:
        address.building,
    });
  };

  // ====================================================
  // MAP
  // ====================================================

  return (
    <div className="overflow-hidden rounded-xl border">

      {loadingLocation && (
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
          Detecting your location...
        </div>
      )}

      <Map
        defaultCenter={
          DEFAULT_CENTER
        }
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{
          width: "100%",
          height: "400px",
        }}
        onClick={handleMapClick}
      >
        {position && (
          <Marker
            position={position}
          />
        )}
      </Map>

    </div>
  );
}

// ======================================================
// ADDRESS FORM
// ======================================================

function AddressForm({
  onSubmit,
  initialData,
}) {
  // ====================================================
  // EMPTY FORM
  // ====================================================

  const emptyForm = {
    title: "",
    city: "",
    district: "",
    street: "",
    building: "",
    apartment: "",
    notes: "",
    isDefault: false,
    latitude: null,
    longitude: null,
  };

  // ====================================================
  // FORM STATE
  // ====================================================

  const [form, setForm] =
    useState(
      initialData
        ? {
            ...emptyForm,
            ...initialData,
          }
        : emptyForm
    );

  // ====================================================
  // LOCATION STATE
  // ====================================================

  const [location, setLocation] =
    useState(
      initialData?.latitude != null &&
      initialData?.longitude != null
        ? {
            lat: Number(
              initialData.latitude
            ),
            lng: Number(
              initialData.longitude
            ),
          }
        : null
    );

  // ====================================================
  // EDIT DATA
  // ====================================================

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setForm({
      title:
        initialData.title || "",

      city:
        initialData.city || "",

      district:
        initialData.district || "",

      street:
        initialData.street || "",

      building:
        initialData.building || "",

      apartment:
        initialData.apartment || "",

      notes:
        initialData.notes || "",

      isDefault:
        initialData.isDefault || false,

      latitude:
        initialData.latitude ??
        null,

      longitude:
        initialData.longitude ??
        null,
    });

    if (
      initialData.latitude != null &&
      initialData.longitude != null
    ) {
      setLocation({
        lat: Number(
          initialData.latitude
        ),

        lng: Number(
          initialData.longitude
        ),
      });
    }
  }, [initialData]);

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ====================================================
  // LOCATION SELECT
  // ====================================================

  const handleLocationSelect = (
    data
  ) => {
    // Marker location
    setLocation({
      lat: data.lat,
      lng: data.lng,
    });

    // Form məlumatları
    setForm((prev) => ({
      ...prev,

      latitude:
        data.lat,

      longitude:
        data.lng,

      city:
        data.city !== undefined
          ? data.city
          : prev.city,

      district:
        data.district !== undefined
          ? data.district
          : prev.district,

      street:
        data.street !== undefined
          ? data.street
          : prev.street,

      building:
        data.building !== undefined
          ? data.building
          : prev.building,
    }));
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.latitude == null ||
      form.longitude == null
    ) {
      toast.error(
        "Please select your location on the map."
      );

      return;
    }

    console.log(
      "ADDRESS FORM SUBMIT:",
      form
    );

    onSubmit(form);
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow"
    >

      {/* TITLE */}

      <input
        className="w-full rounded-lg border p-3"
        name="title"
        placeholder="Title (Home, Work...)"
        value={form.title}
        onChange={handleChange}
      />

      {/* CITY */}

      <input
        className="w-full rounded-lg border p-3"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />

      {/* DISTRICT */}

      <input
        className="w-full rounded-lg border p-3"
        name="district"
        placeholder="District"
        value={form.district}
        onChange={handleChange}
      />

      {/* STREET */}

      <input
        className="w-full rounded-lg border p-3"
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
      />

      {/* BUILDING */}

      <input
        className="w-full rounded-lg border p-3"
        name="building"
        placeholder="Building"
        value={form.building}
        onChange={handleChange}
      />

      {/* APARTMENT */}

      <input
        className="w-full rounded-lg border p-3"
        name="apartment"
        placeholder="Apartment"
        value={form.apartment}
        onChange={handleChange}
      />

      {/* NOTES */}

      <textarea
        className="w-full rounded-lg border p-3"
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      {/* DEFAULT ADDRESS */}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={
            form.isDefault
          }
          onChange={handleChange}
        />

        Default Address
      </label>

      {/* MAP */}

      <div className="pt-4">

        <h3 className="mb-2 text-lg font-semibold">
          Select your location
        </h3>

        <p className="mb-3 text-sm text-gray-500">
          Your current location
          will be detected
          automatically. You can
          also click on the map
          to select another
          location.
        </p>

        <APIProvider
          apiKey={
            GOOGLE_MAPS_API_KEY
          }
        >
          <LocationPicker
            position={location}
            onLocationSelect={
              handleLocationSelect
            }
          />
        </APIProvider>

      </div>

      {/* SELECTED LOCATION INFO */}

      {location && (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">

          <div className="mb-2 font-semibold text-gray-800">
            Selected location
          </div>

          {form.city && (
            <div>
              <strong>
                City:
              </strong>{" "}
              {form.city}
            </div>
          )}

          {form.district && (
            <div>
              <strong>
                District:
              </strong>{" "}
              {form.district}
            </div>
          )}

          {form.street && (
            <div>
              <strong>
                Street:
              </strong>{" "}
              {form.street}
            </div>
          )}

          {form.building && (
            <div>
              <strong>
                Building:
              </strong>{" "}
              {form.building}
            </div>
          )}

          <div className="mt-3 border-t pt-2">

            <div>
              <strong>
                Latitude:
              </strong>{" "}
              {location.lat.toFixed(
                6
              )}
            </div>

            <div>
              <strong>
                Longitude:
              </strong>{" "}
              {location.lng.toFixed(
                6
              )}
            </div>

          </div>

        </div>
      )}

      {/* SAVE */}

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
      >
        Save Address
      </button>

    </form>
  );
}

export default AddressForm;