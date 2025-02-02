import Navbar from "../components/NavBar";
import AppRoutes from "../routes/AppRoutes";
import './index.css';

function App() {
  return (
    <div style={{ backgroundColor: 'hsl(176, 87.90%, 93.50%)', minHeight: '100vh' }}>
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;
