import React, { useState } from 'react';

interface RideSelectorProps {
  totalRides: number;
  availableRides: number[];
  selectedRides: number[];
  onRideSelect: (rides: number[]) => void;
  noOfGuests: number;
}

const RideSelector: React.FC<RideSelectorProps> = ({
  totalRides,
  availableRides,
  selectedRides,
  onRideSelect,
  noOfGuests,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRideClick = (rideNumber: number) => {
    if (!availableRides.includes(rideNumber)) return;

    let newSelectedRides = [...selectedRides];
    
    // If ride is already selected, allow deselecting it
    if (selectedRides.includes(rideNumber)) {
      newSelectedRides = newSelectedRides.filter(ride => ride !== rideNumber);
      onRideSelect(newSelectedRides);
      setErrorMessage(null);
    } else {
      // Only allow selecting if we haven't reached the guest limit
      if (selectedRides.length < noOfGuests) {
        newSelectedRides.push(rideNumber);
        onRideSelect(newSelectedRides);
        setErrorMessage(null);
      } else {
        setErrorMessage(`You can only select ${noOfGuests} ${noOfGuests === 1 ? 'ride' : 'rides'}`);
      }
    }
  };

  return (
    <div className="py-4">
      {/* Header */}
      <h3 className="text-lg font-normal text-gray-900 mb-1">Select Rides</h3>
      <p className="text-sm text-gray-600 mb-3">
        Select {noOfGuests} {noOfGuests === 1 ? 'ride' : 'rides'} for your booking
      </p>

      {/* Rides in scrollable row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {Array.from({ length: totalRides }).map((_, index) => {
          const rideNumber = index + 1;
          const isAvailable = availableRides.includes(rideNumber);
          const isSelected = selectedRides.includes(rideNumber);
          const isSelectable = isAvailable && (isSelected || selectedRides.length < noOfGuests);
          
          return (
            <button
              key={rideNumber}
              onClick={() => handleRideClick(rideNumber)}
              disabled={!isSelectable && !isSelected}
              className={`
                min-w-[28px] h-7
                flex items-center justify-center
                text-sm border rounded-full
                ${isAvailable 
                  ? isSelected
                    ? 'bg-green-600 text-white border-green-600'
                    : isSelectable
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                }
              `}
            >
              {rideNumber}
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
      )}

      {/* Legend */}
      <div className="flex gap-10 text-sm text-black-600">
        <div className="flex gap-2 items-center">
          <span className="min-w-[28px] h-7
                flex items-center justify-center
                text-sm border rounded-full bg-gray-200 border-black-700"></span>
          <span>Booked</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="min-w-[28px] h-7
                flex items-center justify-center
                text-sm border rounded-full border-gray-300"></span>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default RideSelector;
