import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EquipmentPreview from "./components/Equipment-preview";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Header />
          <div>
            <EquipmentPreview />
          </div>
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
