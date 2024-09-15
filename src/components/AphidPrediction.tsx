import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon สำหรับแก้ปัญหาเรื่องไอคอนที่ไม่แสดง
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface Aphid {
  type: string;
  severity_percent: number;
  prevention: string;
}

interface WeatherData {
  district: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  aphids: Aphid[];
}

const AphidPrediction: React.FC = () => {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDistrictData, setSelectedDistrictData] = useState<WeatherData | null>(null); // เก็บข้อมูลอำเภอที่ถูกเลือก

  useEffect(() => {
    fetch("http://localhost:5000/outbreaks") // เปลี่ยน URL API ตามที่ใช้งานจริง
      .then((response) => response.json())
      .then((fetchedData: WeatherData[]) => {
        setData(fetchedData); // เก็บข้อมูลทั้งหมดที่ได้รับมา
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the outbreak data:", error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันจัดการคลิกที่แต่ละอำเภอบนแผนที่
  const handleMarkerClick = (districtData: WeatherData) => {
    setSelectedDistrictData(districtData); // บันทึกข้อมูลอำเภอที่ถูกเลือกเพื่อแสดงข้อมูลเพลี้ยทั้งหมด
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>

      <div style={{ display: 'flex', height: '100vh', flex: 1, zIndex: 1 }}>
        {/* แสดงแผนที่ทางด้านซ้าย */}
        <div style={{ width: "70%", height: "100%" }}>
          <MapContainer center={[15.0, 102.0]} zoom={8} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.map((districtData, index) => (
              <Marker
                key={index}
                position={[districtData.lat, districtData.lng] as LatLngExpression}
                eventHandlers={{
                  click: () => handleMarkerClick(districtData),
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* แสดงข้อมูลอำเภอที่ถูกเลือกทางด้านขวา */}
        <div style={{ width: "30%", padding: "20px", borderLeft: "1px solid #ccc", overflowY: "auto" }}>
          {selectedDistrictData ? (
            <div>
              <h2>{selectedDistrictData.district}</h2>
              <p>Temperature: {selectedDistrictData.temperature}°C</p>
              <p>Humidity: {selectedDistrictData.humidity}%</p>
              <p>Wind Speed: {selectedDistrictData.wind_speed} m/s</p>

              <h3>Aphids Information</h3>
              {selectedDistrictData.aphids.length > 0 ? (
                selectedDistrictData.aphids.map((aphid, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <p><strong>Aphid Type:</strong> {aphid.type}</p>
                    <p><strong>Severity:</strong> {aphid.severity_percent}%</p>
                    <p><strong>Prevention:</strong> {aphid.prevention}</p>
                  </div>
                ))
              ) : (
                <p>No aphids data available for this district.</p>
              )}
            </div>
          ) : (
            <p>Click on a district to view aphid information</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AphidPrediction;
