import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './componentes/Menu';
import Produtores from './telas/Produtores';
import Cultivos from './telas/Cultivos';
import Safras from './telas/Safras';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Menu />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Bem-vindo ao Sistema de Produção Agrícola</h2>} />
          <Route path="/produtores" element={<Produtores />} />
          <Route path="/cultivos" element={<Cultivos />} />
          <Route path="/safras" element={<Safras />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
