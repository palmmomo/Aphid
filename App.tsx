'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Dynamically import the Map component with no SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function AphidOutbreakMonitor() {
  const [outbreakData, setOutbreakData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/outbreaks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setOutbreakData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message);
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (district) => {
    setSelectedDistrict(district);
  };

  if (loading) {
    return <div className="container mx-auto p-4">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ระบบติดตามการระบาดของเพลี้ยในจังหวัดนครราชสีมา</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">แผนที่การระบาด</h2>
          <MapContainer center={[14.9706, 102.1019]} zoom={9} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {outbreakData.map((district, index) => (
              <Marker
                key={index}
                position={[district.lat, district.lng]}
                ico
                eventHandlers={{
                  click: () => handleMarkerClick(district),
                }}
              >
                <Popup>{district.district}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selectedDistrict && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{selectedDistrict.district}</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Thermometer className="mr-2" />
                <span>{selectedDistrict.temperature}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="mr-2" />
                <span>{selectedDistrict.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="mr-2" />
                <span>{selectedDistrict.wind_speed} m/s</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">ชนิดของเพลี้ยที่ระบาด</h3>
            {selectedDistrict.aphids.map((aphid, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-bold">{aphid.type}</h4>
                <p>ความรุนแรง: {aphid.severity_percent}%</p>
                <p>วิธีป้องกัน: {aphid.prevention}</p>
              </div>
            ))}

            <h3 className="text-xl font-semibold mt-4 mb-2">กราฟแสดงความรุนแรงของการระบาด</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedDistrict.aphids}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="severity_percent" fill="#8884d8" name="ความรุนแรง (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

