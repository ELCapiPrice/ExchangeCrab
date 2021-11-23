

window.onload = function () {
  getExhcnageById();
}

async function getExhcnageById () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const key = urlParams.get('key');

  try {
    let data = await fetch(`${baseURL}/exchange/key/${key}`, {
      method: 'get',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      }
    });
    data = await data.json();
    console.log(data);
    /* Mostrar boton de forzar inicio */
    if(data.exchange.owner == owner){
      const forzar = document.getElementById('forzar');
      forzar.classList.remove('dontShow');
      forzar.addEventListener('click', () => {
        forceStart(data.exchange.id_exchange);
      });
    }

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

    const participants = document.getElementById('participants');
    for(let i = 0; i < data.participants.length; i++) {
      let status = `table-info`;
      let status2 = `Pendiente`;
      status = data.participants[i].status == 1 ? 'table-success' : data.participants[i].status == 2 ? 'table-danger' : 'table-secondary';
      status2 = data.participants[i].status == 1 ? 'Confirmado' : data.participants[i].status == 2 ? 'Rechazado' : 'Pendiente';
      const cardHTML = `
        <th scope="row"><img src="./img/crab-logo.png" alt="crab logo" class="img-fluid"/></th>
        <td>Jose Praxedes</td>
        <td>Dominguez Acosta</td>
        <td class="${status}">${status2}</td>
        <td>josepraxedes11@gmail.com</td>
        <td>
          <!--<button class="button pb-1 button-blue">
            <i class="fas fa-edit fa-sm"></i>
          </button>-->
          <button class="button pb-1 button-red" onclick="leaveExchangeById(${data.participants[i].id_user})">
            <i class="far fa-trash-alt fa-sm"></i>
          </button>
        </td>
      `;
      const tr = document.createElement('tr');
      tr.innerHTML = cardHTML;
      participants.appendChild(tr);
    }

  } catch (e) {
    console.log(e);
  }
}

async function inviteParticipant (event) {
  event.preventDefault();
  const email = document.getElementById('inputInvite').value;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const key = urlParams.get('key');

  const info = {
    email,
    key
  }
  try {
    let data = await fetch(`${baseURL}/exchange/invite`, {
      method: 'post',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      },
      body: JSON.stringify(info)
    });
    data = await data.json();
    console.log(data);
    if(data.error) return alert(data.error);
    alert(data.msg);
    location.reload();
  } catch (e) {
    console.log(e);
  }
}


async function leaveExchangeById(idUser) {
  console.log("Saliendo");
  const idExchange = document.getElementById('idExchange').innerText;
  console.log(idExchange);
  const info = {
    idUser,
    idExchange
  }

  try {
    let data = await fetch(`${baseURL}/exchange/user/delete`, {
      method: 'delete',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      },
      body: JSON.stringify(info)
    });
    data = await data.json();
    console.log(data);
    location.reload();
  } catch (e) {
    console.log(e);
  }
}


async function forceStart(idExchange) {
  console.log('Iniciando');

  try {
    let data = await fetch(`${baseURL}/exchange/force/${idExchange}`, {
      method: 'get',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      }
    });
    data = await data.json();
    console.log(data);
    if(data.error) return alert(data.error);

    location.reload();
  } catch (e) {
    console.log(e);
  }

}