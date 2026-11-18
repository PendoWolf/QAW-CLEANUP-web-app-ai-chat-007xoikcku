import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { daysUntilStart, trackEvent, tripLengthDays, truncate } from "../analytics/pendo";
import { tripsApi, type NewTrip } from "../api/trips";
import { TripForm } from "../components/TripForm";

/** Plans a new trip, then goes back to the trip list. */
export function NewTripPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (trip: NewTrip) => {
    try {
      setError(null);
      const created = await tripsApi.create(trip);
      // The trip is saved. The "Add trip" click also fires for failed saves, so only this confirms one.
      trackEvent("trip_created", {
        tripId: created.id,
        destination: truncate(created.destination),
        travelers: created.travelers,
        startDate: created.startDate,
        endDate: created.endDate,
        tripLengthDays: tripLengthDays(created.startDate, created.endDate),
        daysUntilStart: daysUntilStart(created.startDate),
      });
      navigate("/trips");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <TripForm heading="Plan a trip" submitLabel="Add trip" onSubmit={createTrip} />
      {error && <p className="error">{error}</p>}
    </>
  );
}
