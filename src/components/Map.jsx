import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useMyLocation from "../hooks/useMylocation";

// Fix for Leaflet's default marker icon not showing in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Moves the map to your location ONCE (so you can still drag the map freely after)
function CenterOnFirstFix({ position }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (position && !done.current) {
      map.setView([position.lat, position.lng], 16);
      done.current = true;
    }
  }, [position, map]);

  return null;
}

function Map() {
  const { position, error } = useMyLocation();
  const defaultCenter = [22.7196, 75.8577]; // Indore, used until we find you

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "#ffe5e5",
            color: "#900",
            padding: "8px 14px",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CenterOnFirstFix position={position} />

        {position && (
          <>
            <Marker position={[position.lat, position.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle
              center={[position.lat, position.lng]}
              radius={position.accuracy}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;