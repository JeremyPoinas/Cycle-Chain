import { useEffect } from 'react';
import {
  Routes, Route, useLocation,
} from 'react-router-dom';
import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import Portfolio from "./components/Portfolio";
import EquipmentDetails from './components/Equipment-details';
import EquipmentCreation from './components/Equipment-creation';
import PartDetails from './components/Part-details';
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
              <Route path="/" element={<Portfolio />} />
              <Route path="/my-portfolio" element={<Portfolio />} />
              <Route path="/update-equipment" element={<EquipmentDetails equipmentId={"62038"}/>} />
              <Route path="/create-equipment" element={<EquipmentCreation/>} />
              <Route path="/part-details" element={<PartDetails partId={"19385"}/>} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Page404 />} />
            </Routes>

        </div>
      </div>
    </EthProvider>
  );
}

export default App;
