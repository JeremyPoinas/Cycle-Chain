import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import MainView from "./components/Main-view";


function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
            <MainView />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
