import { EthProvider } from "./contexts/EthContext";
//import Header from "./components/Header";
//import Footer from "./components/Footer";
import EquipmentsGrid from "./components/Equipments-grid";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
            <EquipmentsGrid />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
