import Navbar from "../components/NavBar";
import AppRoutes from "../routes/AppRoutes";
import './index.css';

function App() {
  return (
    <div style={{ backgroundColor: 'hsla(60, 44.80%, 77.30%, 0.60)', minHeight: '100vh' }}>
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;
