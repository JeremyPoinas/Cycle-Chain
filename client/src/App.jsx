import { useEffect } from 'react';
import {
  Routes, Route, useLocation,
} from 'react-router-dom';
import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import MainView from "./components/Main-view";
import EquipmentsGrid from "./components/Equipments-grid";
import EquipmentDetail from "./components/Equipment-detail";
import Page404 from "./components/Page404";
import About from "./components/About";
import "./App.css";



function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">

            <Header />
            
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/my-portfolio" element={<EquipmentsGrid />} />
              <Route path="/update-equipment" element={<EquipmentDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
            
            <MainView />

        </div>
      </div>
    </EthProvider>
  );
}

export default App;
