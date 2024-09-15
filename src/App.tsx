import React from "react";
import "./App.css";
import AphidPrediction from "./components/AphidPrediction";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header" style={{ position: "relative" }}>
        {/* ใส่รูปภาพเป็นพื้นหลัง โดยใช้ path ตรงจากโฟลเดอร์ public */}
        <img 
          src="/lol.jpg" // ใช้ path ตรงไปยังโฟลเดอร์ public
          alt="Background" 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: -1, 
            opacity: 0.5 
          }} 
        />
        {/* เพิ่มขนาดตัวหนังสือให้ใหญ่ขึ้น */}
        <h2 style={{ position: "relative", color: "#fff", zIndex: 1, fontSize: "80px", fontWeight: "bold" }}>
          พยากรณ์เพลี้ย
        </h2> 
      </header>
      <main>
        <AphidPrediction />
      </main>
    </div>
  );
};

export default App;
