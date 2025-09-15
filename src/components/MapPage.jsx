import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L ,{ latLng } from 'leaflet'
import { useNavigate } from "react-router-dom";
import ReportForm from "../pages/report-form";

// Fix for default marker icons in Leaflet
// Leaflet(map library) will not work without this in place DO NOT REMOVE!!!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapPage() {
    // this instantiates the map initial state for reference as a mutable variable
    const mapRef = useRef();
    const navigate = useNavigate()
    const [position, setPosition] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [locationData, setLocationData] = useState({latitude:'', longitude:'',})
    const [mapReady, setMapReady] = useState(false);


    //we need to create a function to trigger location finding
    const handleLocate = () => {
        console.log('Starting location detection...');
        setIsLocating(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser");
            setIsLocating(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation success:', position.coords);
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                    setLocationError("Invalid coordinates received from geolocation");
                    setIsLocating(false);
                    return;
                }

                const newPos = { lat: latitude, lng: longitude };
                setPosition(newPos);
                setLocationData({
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                });
                setLocationSelected(true);
                setIsLocating(false);
                console.log('Location set successfully:', newPos);
            },
            (err) => {
                console.error('Geolocation error:', err);
                let errorMessage = "Failed to get location. ";
                switch(err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage += "Please allow location access in your browser.";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage += "Location information is unavailable.";
                        break;
                    case err.TIMEOUT:
                        errorMessage += "Location request timed out.";
                        break;
                    default:
                        errorMessage += "An unknown error occurred.";
                        break;
                }
                setLocationError(errorMessage);
                setIsLocating(false);
            },
            options
        );
    };

    const handleLocationFound = (e) => {
        try {
            // Handle different event structures consistently
            let latLng;
            if (e.latlng) {
                latLng = e.latlng; // From DetectClick
            } else if (e.latLng) {
                latLng = e.latLng; // From LocationEvents
            } else if (e.lat && e.lng) {
                latLng = e; // Direct coordinates
            }

            if (!latLng || typeof latLng.lat !== 'number' || typeof latLng.lng !== 'number') {
                console.error('Invalid location data!', latLng);
                setLocationError('Coordinates received are invalid');
                return;
            }

            // Validate coordinate ranges
            if (latLng.lat < -90 || latLng.lat > 90 || latLng.lng < -180 || latLng.lng > 180) {
                console.error('Coordinates out of valid range:', latLng);
                setLocationError('Coordinates are outside valid range');
                return;
            }

            // Create a position object
            const newPosition = {
                lat: latLng.lat,
                lng: latLng.lng
            };

            // Update state
            setPosition(newPosition);
            setLocationData({
                latitude: newPosition.lat.toString(),
                longitude: newPosition.lng.toString(),
            });
            setLocationSelected(true);
            setIsLocating(false);
            setLocationError(null); // Clear any previous errors

            // Fly to location with better error handling
            const flyToLocation = () => {
                if (mapRef.current && typeof mapRef.current.flyTo === 'function') {
                    try {
                        mapRef.current.flyTo([newPosition.lat, newPosition.lng], 16);
                        console.log('Successfully flew to location:', newPosition);
                    } catch (mapError) {
                        console.warn('Map flyTo failed:', mapError);
                        // Try alternative method
                        if (typeof mapRef.current.setView === 'function') {
                            try {
                                mapRef.current.setView([newPosition.lat, newPosition.lng], 16);
                                console.log('Used setView as fallback');
                            } catch (setViewError) {
                                console.error('Both flyTo and setView failed:', setViewError);
                            }
                        }
                    }
                } else {
                    console.warn('Map reference not available for flyTo');
                }
            };

            if (mapReady) {
                flyToLocation();
            } else {
                // Wait for map to be ready
                const checkMapReady = setInterval(() => {
                    if (mapReady && mapRef.current) {
                        clearInterval(checkMapReady);
                        flyToLocation();
                    }
                }, 100);

                // Timeout after 5 seconds
                setTimeout(() => {
                    clearInterval(checkMapReady);
                    if (!mapReady) {
                        console.warn('Map failed to initialize within timeout');
                    }
                }, 5000);
            }

        } catch (error) {
            console.error('Error in handleLocationFound:', error);
            setLocationError('Failed to process location data');
            setIsLocating(false);
        }
    };

    const handleButtonClick = () => {
        if (!locationSelected) {
            handleLocate();
        } else {
            navigate(`/report?lat=${position.lat}&lng=${position.lng}`)
        }
     };

    return (
        //first fragment is a container for the entire page
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 flex flex-col font-inter text-white overflow-hidden relative">
                {/*conditional render for loading/error states  will do here*/}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
                    <div className="absolute w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-10 left-1/4"></div>
                    <div className="absolute w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-1/2 right-1/4"></div>
                </div>
                <main className="flex-1 flex items-center justify-center p-4">
                    {/* The giant floating card container for the map and its controls */}
                    <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col w-[95vw] h-[95vh] overflow-y-auto">

                        {/* Header/Control Panel - Glassy and prominent, now inside the card */}
                        <div className="p-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md flex flex-shrink-0 justify-between items-center mb-2"> {/* Added margin-bottom */}
                            <h1 className="text-2xl font-extrabold text-blue-300 drop-shadow-lg">Select emergency location</h1>
                            {/* Find My Location Button - Glassy and interactive */}
                            <button
                                onClick={handleButtonClick}
                                disabled={isLocating}
                                title="Find my location"
                                className={`relative bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg transition-all duration-300 flex items-center gap-2
                                   ${isLocating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/40 transform hover:scale-105'}
                                   border border-blue-500/50 hover:border-blue-400/70`}
                            >
                                {isLocating ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isLocating ? 'Locating...' : 'Find My Location'}
                            </button>
                        </div>

                        {/* Map Container - now takes full height/width of its parent card */}
                        <div className="flex flex-row gap-4 w-full">
                            <MapContainer
                                center={position || [0, 0]} // Default to 0,0 if no position, LocationMarker will try to find user's
                                zoom={2} // Start with a lower zoom to show more of the world
                                // Fill parent card
                                whenCreated={(map) => {
                                    mapRef.current = map;
                                    setMapReady(true);
                                    console.log('Map created and ready');
                                }}
                                whenReady={() => {
                                    setMapReady(true);
                                    console.log('Map is ready');
                                }}
                                className="z-0 flex flex-auto rounded-lg overflow-hidden min-h-[500px] w-full md:w-2/3 lg:w-3/4" // Added rounded-lg to map itself
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                < DetectClick onLocationClick={handleLocationFound} />
                                <LocationEvents
                                    onLocationFound={handleLocationFound}
                                    onLocationError={(e) => {
                                        setLocationError(e.message);
                                        setIsLocating(false);
                                    }}
                                />
                                {position && (
                                    <Marker position={position}>
                                        <Popup className="font-semibold text-gray-800 text-base">
                                            {locationSelected ? "Selected location" : "Your current location"}
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>

                            <ReportForm locationData={locationData} setLocationData={setLocationData} className="w-full md:w-1/3 lg:w-1/4"/>
                        </div>
                        {/* Coordinate Display Box - Glassy and subtle, now inside the card */}
                        {locationError && (
                            <div className="p-4 mt-4 bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-xl text-red-300">
                                Error: {locationError}
                            </div>
                        )}
                        {position && (
                            <div className="p-4 flex-shrink-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md mt-4"> {/* Added margin-top */}
                                <div className="font-semibold text-blue-300">Current Coordinates:</div>
                                <div className="text-lg text-white/90">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</div>
                            </div>
                        )}
                    </div>
                </main>

                {/*to add a fixed button at page bottom*/}
                {/* <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 z-20">
                    <button
                        onClick={handleButtonClick}
                        disabled={isLocating}
                        className={`relative ${locationSelected ? 'bg-red-600 hover:bg-red-700' : 'bg-red-700 hover:bg-red-800'} 
                              text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all duration-300
                              flex items-center gap-2 border border-red-500/50 hover:border-red-400/70
                              min-w-[300px] justify-center ${isLocating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-red-500/30'}`}
                    >{locationSelected ? (
                            <>
                                <span>Submit Report</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Select Location</span>
                                </>  
                    )}</button>
                </div> */}
                
            </div>
        </>
    )
}

// the location marker component will allow us to use mapEvents from leaflet to get the locatio
function LocationEvents({onLocationFound, onLocationError }) {

    //const mapRef = useRef();
    
    const map = useMapEvents({
        locationfound(e) {
            console.log('Location found event:', e);
            onLocationFound(e)
        },
        //add error handlingn in case map load fails
        locationerror(e) {
            console.error('Location error event:', e);
            if (onLocationError) {
                onLocationError(e);
            } else {
                alert('Could not find your location. Ensure device location is on')
            }
        },
        click(e) {
            console.log('Map click event:', e);
            onLocationFound({
                latlng: e.latlng, // Use lowercase to match DetectClick
                bounds: e.bounds
            });
        },
    });

    return null;
    
};

function DetectClick({ onLocationClick }) {
    useMapEvents({
        click: (e) => {
            console.log('DetectClick event:', e);
            onLocationClick({
                latlng: e.latlng,
                bounds: e.bounds
            });
        }
    })
}