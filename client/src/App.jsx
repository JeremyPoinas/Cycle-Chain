import { useEffect } from 'react';
import {
  Routes, Route, useLocation,
} from 'react-router-dom';
import useEth from "./contexts/EthContext/useEth";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import EquipmentsGrid from "./components/Equipments-grid";
import EquipmentDetail from "./components/Equipment-detail";
import Page404 from "./components/Page404";
import About from "./components/About";
import ManageProfiles from "./components/ManageProfiles";
import "./App.css";


function App() {
  const { state: { isOwner, isProducer } } = useEth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (
    <div id="App" >
      <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/my-portfolio" element={<EquipmentsGrid />} />
            <Route path="/update-equipment" element={<EquipmentDetail />} />
            <Route path="/about" element={<About />} />
            {isOwner && <Route path="/manage-profiles" element={<ManageProfiles />} />}
            <Route path="*" element={<Page404 />} />
          </Routes>
      </div>
    </div>
  );
}

export default App;
