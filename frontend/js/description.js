
window.onload = function () {
  getExhcnageById();
}

/* LISTO */
/* Obtiene y despliega en el HTML todos los datos necesarios */
async function getExhcnageById () {
  /* Obenemos la llave del intercambio desde la url */
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const key = urlParams.get('key');
  if(!key) return alert("Se necesita una clave del intercambio para mostrar información");
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json',
  }

  const data = await service.getData(`/exchange/key/${key}`, 'get', headers).catch( err => console.error("Error al obtener los intercambios por su ID" + err));
  console.log(data);

  /* Si es el dueño, activamos el boton forzar inicio del intercambio */
  if(data.exchange.owner === owner) {
    const forzar = document.getElementById('forzar');
    forzar.classList.remove('dontShow');
    forzar.addEventListener('click', () => {
      forceStart(data.exchange.id_exchange);
    });
  }

  /* desplegamos el id del intercambio, temas y otras cosas */
  document.getElementById('idExchange').innerHTML = data.exchange.id_exchange;
  const topics = document.getElementById('topics');
  for(let i = 0; i < data.topics.length; i++) {
    const topic = document.createElement('li');
    topic.textContent = data.topics[i].topic;
    topics.appendChild(topic);
  }
  const code = document.getElementById('codigo');
  code.innerText = '#' + data.exchange.key;
  const monto = document.getElementById('monto');
  monto.innerText = '$' + data.exchange.maxValue;
  const date = document.getElementById('date');
  date.innerText = data.exchange.date;
  const description = document.getElementById('description');
  description.innerText = data.exchange.comments;

  /* Desplegamos a los participantes */
  const participants = document.getElementById('participants');
  for(let i = 0; i < data.participants.length; i++) {
    const userInfo = await service.getData(`/user/${data.participants[i].email}`, 'get', headers).catch( err => console.error("Error al obtener el participante del intercambio"));
    console.log("userInfo:");
    console.log(userInfo);

    let status = `table-info`;
    let status2 = `Pendiente`;

    status = data.participants[i].status == 1 ? 'table-success' : data.participants[i].status == 2 ? 'table-danger' : 'table-secondary';
    status2 = data.participants[i].status == 1 ? 'Confirmado' : data.participants[i].status == 2 ? 'Rechazado' : 'Pendiente';

    const cardHTML = `
        <th scope="row">${userInfo.iduser || ''}<img src="./img/crab-logo.png" alt="crab logo" class="img-fluid"/></th>
        <td>${userInfo.firstname ||  data.participants[i].firstname || 'Sin especificar'}</td>
        <td>${userInfo.lastname || data.participants[i].lastname || 'Sin especificar'}</td>
        <td>${data.participants[i].email}</td>
        <td>${data.participants[i].topic || 'Sin especificar'}</td>
        <td class="${status}">${status2}</td>
        <td>${data.participants[i].userToGift || 'Sin definir'}</td>
        <td>
          <!--<button class="button pb-1 button-blue">
            <i class="fas fa-edit fa-sm"></i>
          </button>-->
          <button class="button pb-1 button-red" onclick="leaveExchangeById('${data.participants[i].email}')">
            <i class="far fa-trash-alt fa-sm"></i>
          </button>
        </td>
      `;
    const tr = document.createElement('tr');
    tr.innerHTML = cardHTML;
    participants.appendChild(tr);
  }
}

/* LISTO */
/* Borrar usuario del intercambio */
async function leaveExchangeById(email) {
  const idExchange = document.getElementById('idExchange').innerText;
  const info = {
    email,
    idExchange
  }
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json',
  }

  const data = await service.getData('/exchange/user/delete', 'delete', headers, info).catch( err => console.error("Error al eliminar al usuario: " + err));
  console.log(data);
  if(data.error) {
    alert(data.error);
    return location.reload();
  }
  alert(data.msg);
  location.reload();
}

/* LISTO */
/* Se forza el inicio del intercambio */
async function forceStart(idExchange) {
  console.log('Iniciando');
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json',
  }

  const data = await service.getData(`/exchange/force/${idExchange}`, 'get', headers).catch( err => console.error("Error al forzar el intercambio: " + err));
  console.log(data);
  if(data.error) return alert(data.error);
  location.reload();
}

/* LISTO */
/* Invitar a una persona por su correo electronico */
async function inviteParticipant (event) {
  event.preventDefault(); //Evitamos que se envie el formulario
  const email = document.getElementById('inputInvite').value;
  if(!email) return alert("Porfavor ingresa un email");

  /* Obtenemos la llave del intercambio */
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const key = urlParams.get('key');

  const info = {
    email,
    key
  }
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json'
  }

  const data = await service.getData('/exchange/invite', 'post', headers, info).catch( err => console.error("Error al invitar al usuario: " + err));
  console.log(data);
  if(data.error) return alert(data.error);
  alert(data.msg);
  location.reload();
}