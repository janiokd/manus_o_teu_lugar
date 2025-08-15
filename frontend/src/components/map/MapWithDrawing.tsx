import React, { useState, useEffect, useRef } from 'react';
import {
  Marker,
  GoogleMap,
  LoadScript,
  DrawingManager,
} from '@react-google-maps/api';
// @mui
import { Box, Stack } from '@mui/material';
// config-global
import { MAP_API } from 'src/config-global';
// assets
import MapIcon from 'src/assets/icons/MapIcon';
import RoundButton from '../customs/RoundButton';

export const center = {
  lat: 40.7128, // Example: New York
  lng: -74.006,
};

export const getAddressFromLatLng = (lat: number, lng: number) => {
  const geocoder = new google.maps.Geocoder();
  const latLng = { lat, lng };

  return new Promise<string>((resolve, reject) => {
    geocoder.geocode(
      { location: latLng },
      (results: google.maps.GeocoderResult[] | null, status: string) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } /*  else {
          reject('Geocoder failed: ' + status);
        } */
      }
    );
  });
};
interface MapProps {
  text?: string;
  height?: string;
  location?: google.maps.places.PlaceResult | null;
  setAddress: (address: string) => void;
  setAddresses: (addresses: string[]) => void;
}

const mapOptions = {
  fullscreenControl: false, // Disable fullscreen control
  mapTypeControl: false, // Disable map type selector
  streetViewControl: false, // Disable Street View
  zoomControl: false, // Keep zoom control (optional)
  disableDefaultUI: true,
};

export default function MapWithDrawing({
  text,
  height = '460px',
  setAddress,
  setAddresses,
  location: defaultLocation,
}: MapProps) {
  const defaultColor = '#000000';
  const selectedColor = '#FF0000';

  const mapRef = useRef<google.maps.Map | null>(null);

  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  const [zoomLevel, setZoomLevel] = useState(8);

  const [shapes, setShapes] = useState<any[]>([]);

  const [location, setLocation] = useState<{ lat: number; lng: number }>(center);

  const [selectedTool, setSelectedTool] = useState<google.maps.drawing.OverlayType | null>(null);

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (defaultLocation && defaultLocation?.geometry?.location) {
      setLocation({
        lat: defaultLocation.geometry.location.lat(),
        lng: defaultLocation.geometry.location.lng(),
      })
      setMarkerPosition({
        lat: defaultLocation.geometry.location.lat(),
        lng: defaultLocation.geometry.location.lng(),
      })
    }
  }, [defaultLocation])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          // setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        polygonOptions: {
          fillColor: selectedTool === 'polygon' ? selectedColor : defaultColor,
          strokeColor: selectedTool === 'polygon' ? selectedColor : defaultColor,
          fillOpacity: 0.5,
          strokeWeight: 2,
        },
        polylineOptions: {
          strokeColor: selectedTool === 'polyline' ? selectedColor : defaultColor,
          strokeWeight: 3,
        },
        rectangleOptions: {
          fillColor: selectedTool === 'rectangle' ? selectedColor : defaultColor,
          strokeColor: selectedTool === 'rectangle' ? selectedColor : defaultColor,
          fillOpacity: 0.5,
          strokeWeight: 2,
        },
        circleOptions: {
          fillColor: selectedTool === 'circle' ? selectedColor : defaultColor,
          strokeColor: selectedTool === 'circle' ? selectedColor : defaultColor,
          fillOpacity: 0.5,
          strokeWeight: 2,
        },
      });
    }
  }, [selectedTool]);

  // const addCustomVertex = (
  //   polygon: google.maps.Polygon,
  //   latLng: google.maps.LatLng,
  //   index: number
  // ) => {
  //   const marker = new google.maps.Marker({
  //     position: latLng,
  //     map: polygon.getMap(),
  //     icon: {
  //       path: google.maps.SymbolPath.CIRCLE,
  //       scale: 8, // Size of the vertex
  //       strokeColor: '#FF0000',
  //       strokeWeight: 2,
  //       fillColor: '#FFFFFF',
  //       fillOpacity: 1,
  //     },
  //     draggable: true, // Allow moving the vertex
  //   });

  //   // Move the vertex when dragged
  //   marker.addListener('drag', () => {
  //     polygon.getPath().setAt(index, marker.getPosition() as google.maps.LatLng);
  //   });
  // };

  const addDeleteIcon = (
    polygon: google.maps.Polygon,
    latLng: google.maps.LatLng,
    index: number
  ) => {
    const deleteMarker = new google.maps.Marker({
      position: latLng,
      map: polygon.getMap(),
      icon: {
        url: 'https://cdn-icons-png.flaticon.com/512/61/61155.png', // Replace with your custom delete icon
        scaledSize: new google.maps.Size(16, 16), // Adjust icon size
        anchor: new google.maps.Point(8, 8),
      },
    });

    // Click event to remove the polygon
    deleteMarker.addListener('click', () => {
      polygon.setMap(null); // Remove the polygon
      deleteMarker.setMap(null); // Remove the delete button
    });
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Decrease zoom level when clicking (max is typically 12)
      setZoomLevel((prevZoom) => Math.min(prevZoom - 1, 12)); // Prevent exceeding min zoom
      setLocation({ lat, lng }); // Center map on clicked location
    }
  };

  const handleMapRightClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // setMarkerPosition({ lat, lng });
      const address = await getAddressFromLatLng(lat, lng);
      setAddress(address);

      // Increase zoom level when clicking (max is typically 21)
      setZoomLevel((prevZoom) => Math.min(prevZoom + 1, 21)); // Prevent exceeding max zoom
      setLocation({ lat, lng }); // Center map on clicked location
    }
  };

  const onOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
    const newShape = event.overlay;
    const shapeType = event.type;

    // Store the drawn shape
    setShapes((prevShapes) => [...prevShapes, { type: shapeType, shape: newShape }]);
    console.log('shapes:', shapes);

    console.log('Shape Drawn:', shapeType, newShape);
  };

  const onShapeComplete = async (
    shape:
      | google.maps.Polygon
      | google.maps.Rectangle
      | google.maps.Circle
      | google.maps.Polyline
      | google.maps.Marker
  ) => {
    drawingManagerRef.current?.setDrawingMode(null);

    let locations: google.maps.LatLng[] = [];

    if (shape instanceof google.maps.Polygon) {
      locations = shape.getPath().getArray();
      drawingManagerRef.current?.setDrawingMode(null);

      const path = shape.getPath();
      let topVertexIndex = 0;
      let topVertex = path.getAt(0);

      path.forEach((vertex, index) => {
        if (vertex.lat() > topVertex.lat()) {
          topVertex = vertex;
          topVertexIndex = index;
        }

        // addCustomVertex(shape, vertex, index);
      });

      addDeleteIcon(shape, topVertex, topVertexIndex);

      // google.maps.event.addListener(path, 'set_at', (index: number) => {
      //   addCustomVertex(shape, path.getAt(index), index);
      // });

      // google.maps.event.addListener(path, 'insert_at', (index: number) => {
      //   addCustomVertex(shape, path.getAt(index), index);
      // });
    } else if (shape instanceof google.maps.Rectangle) {
      const bounds = shape.getBounds();
      if (bounds) {
        locations = [bounds.getNorthEast(), bounds.getSouthWest()];
      }
    } else if (shape instanceof google.maps.Circle) {
      const latLng = shape.getCenter();
      if (latLng) {
        locations = [latLng];
      }
    } else if (shape instanceof google.maps.Polyline) {
      locations = shape.getPath().getArray();
    } else if (shape instanceof google.maps.Marker) {
      const position = shape.getPosition();
      if (position) {
        locations = [position];
        setMarkerPosition({ lat: position.lat(), lng: position.lng() }); // Store marker position
      }
    }

    // Fetch addresses for drawn locations
    try {
      const addressResults = await Promise.all(
        locations.map((item) => getAddressFromLatLng(item.lat(), item.lng()))
      );
      setAddresses(addressResults);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrawingModeChanged = () => {
    if (drawingManagerRef.current) {
      const mode = drawingManagerRef.current.getDrawingMode();

      setSelectedTool(mode);
    }
  };

  const handleDrawingMode = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng }); // Update the marker position
      getAddressFromLatLng(lat, lng).then(setAddress); // Optionally update the address
    }
  };


  return (
    <LoadScript googleMapsApiKey={MAP_API || ''} libraries={['drawing', 'places']}>
      <Box
        sx={{
          bgcolor: 'white',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '30px',
        }}
      >
        <GoogleMap
          zoom={zoomLevel}
          center={location}
          options={mapOptions}
          mapContainerStyle={{ width: '100%', height }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={handleMapClick}
          onRightClick={handleMapRightClick}
        >
          <DrawingManager
            onLoad={(dm) => {
              drawingManagerRef.current = dm;
              dm.addListener('drawingmode_changed', handleDrawingModeChanged);
            }}
            onOverlayComplete={onOverlayComplete}
            onRectangleComplete={onShapeComplete}
            onCircleComplete={onShapeComplete}
            onPolygonComplete={onShapeComplete}
            onPolylineComplete={onShapeComplete}
            onMarkerComplete={onShapeComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                // position: google.maps.ControlPosition.TOP_CENTER,
              },
            }}
          />
          {/* <Marker position={location} /> */}
          {markerPosition ? <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} /> : null}
        </GoogleMap>
        {text && (
          <Stack
            alignItems="center"
            justifyContent="flex-end"
            sx={{
              top: '30px',
              right: '30px',
              borderRadius: '40px',
              position: 'absolute',
            }}
          >
            <RoundButton
              size="large"
              color="secondary"
              variant="contained"
              startIcon={<MapIcon />}
              onClick={handleDrawingMode}
            >
              {text}
            </RoundButton>
          </Stack>
        )}
      </Box>
    </LoadScript>
  );
}
