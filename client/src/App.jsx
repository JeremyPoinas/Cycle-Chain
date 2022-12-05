import { EthProvider } from "./contexts/EthContext";
//import Header from "./components/Header";
//import Footer from "./components/Footer";
import EquipmentsGrid from "./components/Equipments-grid";
import OperationsList from "./components/Operations-list";
import "./App.css";


function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
            <EquipmentsGrid />
            <OperationsList />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
