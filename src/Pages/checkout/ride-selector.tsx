import React from 'react';

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
  noOfGuests
}) => {
  const handleRideClick = (rideNumber: number) => {
    if (!availableRides.includes(rideNumber)) return;

    let newSelectedRides = [...selectedRides];
    
    if (selectedRides.includes(rideNumber)) {
      newSelectedRides = newSelectedRides.filter(ride => ride !== rideNumber);
    } else if (selectedRides.length < noOfGuests) {
      newSelectedRides.push(rideNumber);
    } else {
      newSelectedRides.shift();
      newSelectedRides.push(rideNumber);
    }

    onRideSelect(newSelectedRides);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <h3 className="text-lg font-normal text-gray-900 mb-1">Select Rides</h3>
      <p className="text-sm text-gray-600 mb-3">
        Select {noOfGuests} {noOfGuests === 1 ? 'ride' : 'rides'} for your booking
      </p>

      {/* Rides in scrollable row */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-3">
        {Array.from({ length: totalRides }).map((_, index) => {
          const rideNumber = index + 1;
          const isAvailable = availableRides.includes(rideNumber);
          const isSelected = selectedRides.includes(rideNumber);
          
          return (
            <button
              key={rideNumber}
              onClick={() => handleRideClick(rideNumber)}
              disabled={!isAvailable}
              className={`
                min-w-[28px] h-7
                flex items-center justify-center
                text-sm border rounded
                ${isAvailable 
                  ? isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 text-gray-700'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
                }
              `}
            >
              {rideNumber}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="text-sm text-gray-600">
        <div className="flex items-center">
          <span className="mr-1">1</span>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">2</span>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default RideSelector;
