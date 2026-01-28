import { BrowserRouter, NavLink } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="root">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;