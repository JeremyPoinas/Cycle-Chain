import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Header />
          <div>main</div>
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
