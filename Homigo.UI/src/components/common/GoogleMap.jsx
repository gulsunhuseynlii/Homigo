import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

function GoogleMap({
  latitude,
  longitude,
  onLocationSelect,
}) {
  const position = {
    lat: latitude,
    lng: longitude,
  };

  const handleMapClick = (event) => {
    if (!event.detail?.latLng) return;

    const lat = event.detail.latLng.lat();
    const lng = event.detail.latLng.lng();

    onLocationSelect({
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <div className="h-[400px] w-full overflow-hidden rounded-2xl">

        <Map
          defaultCenter={position}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="HOMIGO_MAP"
          onClick={handleMapClick}
        >

          <AdvancedMarker
            position={position}
          />

        </Map>

      </div>
    </APIProvider>
  );
}

export default GoogleMap;