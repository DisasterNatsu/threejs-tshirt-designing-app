import Canvas from "./canvas";
import Custiomizer from "./pages/Custiomizer";
import Home from "./pages/Home";

const App = () => {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Custiomizer />
    </main>
  );
};

export default App;
