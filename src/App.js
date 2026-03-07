import { BrowserRouter, NavLink } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="root">
        <AnimatedRoutes />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;