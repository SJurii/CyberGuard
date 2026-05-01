import { BrowserRouter } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="root">
          <AnimatedRoutes />
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;