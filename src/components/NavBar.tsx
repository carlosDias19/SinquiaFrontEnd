import "bootstrap/dist/css/bootstrap.min.css";

function BasicExample() {
  return (
    <>
      <nav className="border-bottom shadow-sm" style={{ backgroundColor: "hsl(61, 32.50%, 67.50%)" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center p-3">
          <a href="/" className="d-flex align-items-center text-decoration-none">
            <img src="/Logo_Ponto_SF.png" className="me-2" alt="Ponto Turistico Logo" style={{ height: "40px" }} />
            <span className="fw-semibold fs-5 text-dark">Ponto Turístico</span>
          </a>

          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-dark" href="/">Página Inicial</a>
            </li>
          </ul>

          <div>
            <a href="mailto:carloseduardotupa19@gmail.com" className="text-dark text-decoration-none">
              Email: carloseduardotupa19@gmail.com
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default BasicExample;
