import { useState, useEffect } from "react";

export default function useMyLocation() {
  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const [position, setPosition] = useState(null); // {lat, lng, accuracy}
  const [error, setError] = useState(
    supported ? null : "Your browser does not support location."
  );

  useEffect(() => {
    if (!supported) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // in meters
        });
        setError(null);
      },
      (err) => {
        if (err.code === 1) {
          setError("Location permission denied. Please allow it in your browser settings.");
        } else if (err.code === 2) {
          setError("Location unavailable. Check your GPS or internet.");
        } else {
          setError("Location request timed out.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [supported]);

  return { position, error };
}