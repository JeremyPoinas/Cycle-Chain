import { useEffect } from 'react';
import {
  Routes, Route, useLocation,
} from 'react-router-dom';
import useEth from "./contexts/EthContext/useEth";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import Portfolio from "./components/Portfolio";
import EquipmentDetails from './components/Equipment-details';
import EquipmentCreation from './components/Equipment-creation';
import PartDetails from './components/Part-details';
import PartsBuying from './components/Parts-buying';
import Page404 from "./components/Page404";
import About from "./components/About";
import Parts from "./components/Parts";
import ManageProfiles from "./components/ManageProfiles";
import "./App.css";




function App() {
  const { state: { isOwner } } = useEth();
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
            <Route path="/" element={<Portfolio />} />
            <Route path="/my-portfolio" element={<Portfolio />} />
            <Route path="/update-equipment" element={<EquipmentDetails equipmentId={"62038"}/>} />
            <Route path="/create-equipment" element={<EquipmentCreation/>} />
            <Route path="/equipment/:equipmentId" element={<EquipmentDetails/>} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/part/:partId" element={<PartDetails/>} />
            <Route path="/explore" element={<PartsBuying/>} />
            <Route path="/about" element={<About />} />
            {isOwner && <Route path="/manage-profiles" element={<ManageProfiles />} />}
            <Route path="*" element={<Page404 />} />
          </Routes>
      </div>
    </div>
  );
}

export default App;
