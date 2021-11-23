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
            <a class="nav-link active title-text" type="button" data-bs-toggle="modal" data-bs-target="#createExchange">Crear intercambio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active title-text" href="auth.html">Cerrar Sesión</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>

<!-- Modal -->
<div class="modal fade" id="createExchange" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="createExchangeLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form name="createExchangeForm" onsubmit="return createExchange(event);">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Crear intercambio</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="inputKey">Clave del intercambio.</label>
          <div class="input-group mb-3">
            <input type="text" class="form-control" id="inputKey" name="key" placeholder="Clave del intercambio. Ejemplo: Jorge007" required />
          </div>
          <label class="form-label" for="inputTopics">Temas del intercambio (máx 3).</label>
          <div class="input-group mb-3">
            <input type="text" class="form-control" id="inputTopics" name="topics" placeholder="Temas separados por coma. Ejemplo: Celulares,Ropa,Calculadoras" required />
          </div>
          <label class="form-label" for="inputMaxValue">Monto máximo del valor del intercambio.</label>
          <div class="input-group mb-3">
            <input type="number" class="form-control" id="inputMaxValue" name="maxValue" placeholder="Monto máximo para el valor del intercambio" required />
          </div>
          <label class="form-label" for="inputLimitDate">Fecha límite para que puedan registrarse.</label>
          <div class="input-group mb-3">
            <input type="date" class="form-control" id="inputLimitDate" name="limitDate" placeholder="Fecha límite" required />
          </div>
          <label class="form-label" for="inputDate">Fecha del intercambio.</label>
          <div class="input-group mb-3">
            <input type="date" class="form-control" id="inputDate" name="date" placeholder="Fecha del intercambio" required />
          </div>
          <label class="form-label" for="inputComments">Comentarios adicionales.</label>
          <div class="input-group mb-3">
            <textarea  class="form-control" id="inputComments" name="comments" placeholder="Comentarios adicionales"></textarea>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="inputOwnerParticipate" name="ownerParticipate">
            <label class="form-check-label" for="inputOwnerParticipate">¿Deseas participar en el intercambio?</label>
          </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-success">Crear</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="joinExchange" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="joinExchangeLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form name="createExchangeForm" onsubmit="return joinExchange(event);">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Unirse a un intercambio</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <label class="form-label" for="selectTopic">Escoge el tema para participar.</label>
          <div class="input-group mb-3">
            <select class="form-select" aria-label="Seleccionar tema" required="" id="selectTopic">
            </select>
          </div>
          <p class="text-muted">Recuerda que el valor del producto debe ser $<span id="valueProduct">00.0</span></p>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-success">Unirse</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
`;