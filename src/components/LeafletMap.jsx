import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ children, ...props }) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return <MapContainer {...props}>{children}</MapContainer>;
};

export default LeafletMap;
