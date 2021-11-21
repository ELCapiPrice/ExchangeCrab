export const navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-navbar ps-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="img/crab-logo.png" alt="crab-logo" width="73px" height="40px" class="d-inline-block align-text-top">
      <span class="title-text">Exchange Crabs</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active title-text" aria-current="page" href="inicio.html">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link dontShow" href="auth.html">Registrarse</a>
          </li>
          <li class="nav-item">
            <a class="nav-link dontShow" href="auth.html">Iniciar Sesión</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active title-text" href="description.html">Crear intercambio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active title-text" href="auth.html">Cerrar Sesión</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
`;