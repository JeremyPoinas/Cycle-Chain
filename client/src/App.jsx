import { useEffect } from 'react';
import {
  Routes, Route, useLocation,
} from 'react-router-dom';
import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import Portfolio from "./components/Portfolio";
import EquipmentDetails from './components/Equipment-details';
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
              <Route path="/update-equipment" element={<EquipmentDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Page404 />} />
            </Routes>

        </div>
      </div>
    </EthProvider>
  );
}

export default App;
