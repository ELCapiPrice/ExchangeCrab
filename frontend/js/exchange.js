
/* Crear intercambio */
async function createExchange(event) {
  event.preventDefault(); //Evitamos que se envie el formulario.
  const key = document.getElementById('inputKey').value;
  const topics = document.getElementById('inputTopics').value;
  const maxValue = document.getElementById('inputMaxValue').value;
  const limitDate = document.getElementById('inputLimitDate').value;
  const date = document.getElementById('inputDate').value;
  let comments = document.getElementById('inputComments').value;
  const ownerParticipate = document.getElementById('inputOwnerParticipate').checked;

  if(!key || !topics || !maxValue || !limitDate || !date || !ownerParticipate || !owner) return alert('Error al leer los datos de los inputs');
  if(!comments) comments = "";
  const info = {
    key,
    topics,
    maxValue,
    limitDate,
    date,
    comments,
    ownerParticipate,
    owner
  };
  try {
    let data = await fetch(`${baseURL}/exchange`, {
      method: 'post',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      },
      body: JSON.stringify(info)
    });
    data = await data.json();
    console.log(data);
    alert(`${data.msg}`);
    location.reload();
  } catch (e) {
    console.log(e);
  }
}

window.onload = function () {
  getExchangesOfUser();
  const  input_add_friend = document.querySelector('#addFriend');
  const  btn_add_friend=document.querySelector('#btnAddFriend')

  btn_add_friend.addEventListener('click', ()=>{
    // addFriend(input_add_friend.value);
    console.log(parseJWT(getCookie()));
    // email del usuario autenticado
    const jsonjwt =parseJWT(getCookie());
    const email =  jsonjwt.email;
    const id = jsonjwt.pk
    console.log(email);
    addFriend(email , input_add_friend.value, id)

  })

}

/* Obtener la información de los intercambios del usuario */
async function getExchangesOfUser() {
  try {
    let data = await fetch(`${baseURL}/exchange/user/${owner}`, {
      method: 'get',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      }
    });
    data = await data.json();
    console.log(data);

    /* Cargamos los intercambios en los que participas */
    for(let i = 0; i < data.exchangesParticipate.length; i++) {
      const cardHTML = `
            <div class="col-12 my-1">
              <div class="row rectangle-text">
                <div class="col-6">#${data.exchangesParticipate[i].key}</div>
                <div class="col-3">${data.exchangesParticipate[i].limitDate}</div>
                <div class="col-3" style="font-size:0;">
                  <div class="row justify-content-center">
                    <div class="col-auto">
                      <button onclick="window.location.href='description.html?key=${data.exchangesParticipate[i].key}'" class="button button-info"><i class="fas fa-info-circle icon-medium info"></i></button>
                    </div>
                    <div class="col-auto">
                      <button href="#" class="button button-info" onclick="leaveExchangeById(${data.exchangesParticipate[i].id_exchange})"><i class="fas fa-minus-circle icon-medium leave"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
      const participing = document.getElementById('participing');
      const card = document.createElement('div');
      card.innerHTML = cardHTML;
      participing.appendChild(card);
    }
    if (data.exchangesParticipate.length > 0) document.getElementById('participing-none').classList.add('dontShow');

    /* Cargamos mis intercambios creados */
    for(let i = 0; i < data.exchange.length; i++) {
      const cardHTML = `
            <div class="col-12 my-1">
              <div class="row rectangle-text">
                <div class="col-6">#${data.exchange[i].key}</div>
                <div class="col-3">${data.exchange[i].limitDate}</div>
                <div class="col-3" style="font-size:0;">
                  <div class="row justify-content-center">
                    <div class="col-auto">
                      <button onclick="window.location.href='description.html?key=${data.exchange[i].key}'" class="button button-info"><i class="fas fa-info-circle icon-medium info"></i></button>
                    </div>
                    <div class="col-auto">
                      <button href="#" class="button button-info" onclick='editExchangeById(${JSON.stringify(data.exchange[i])})' data-bs-toggle="modal" data-bs-target="#editExchange" ><i class="far fa-edit icon-medium info"></i></button>
                    </div>
                    <div class="col-auto">
                      <button href="#" class="button button-info" onclick="deleteExchangeById(${data.exchange[i].id_exchange})"><i class="far fa-trash-alt icon-medium leave"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
      const myExchanges = document.getElementById('myExchanges');
      const card = document.createElement('div');
      card.innerHTML = cardHTML;
      myExchanges.appendChild(card);
    }
    if (data.exchange.length > 0) document.getElementById('myExchanges-none').classList.add('dontShow');

    /* Cargamos nuestras invitaciones */
    for(let i = 0; i < data.exchangeInvitations.length; i++) {
      const cardHTML = `
            <div class="col-12 my-1">
                  <div class="row rectangle-text">
                    <div class="col-6">#${data.exchangeInvitations[i].key}</div>
                    <div class="col-3">${data.exchangeInvitations[i].limitDate}</div>
                    <div class="col-3" style="font-size:0;">
                      <div class="row justify-content-center">
                        <div class="col-auto">
                          <button href="#" class="button button-info"><i class="fas fa-check-circle icon-medium info"></i></button>
                        </div>
                        <div class="col-auto">
                          <button href="#" class="button button-info"><i class="fas fa-times-circle icon-medium leave"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `;
      const myInvitations = document.getElementById('myInvitations');
      const card = document.createElement('div');
      card.innerHTML = cardHTML;
      myInvitations.appendChild(card);
    }
    if (data.exchangeInvitations.length > 0) document.getElementById('myInvitations-none').classList.add('dontShow');

  } catch (e) {
    console.log(e);
  }
}

async function getTopicFromExchange() {
  const key = document.getElementById('codeExchange').value;
  if(!key) {
    alert("Escribe el código del intercambio!");
    return location.reload();
  }
  if(key.startsWith('#') || key.startsWith('?')) {
    alert("Escribe el código sin el #");
    return location.reload();
  }

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
    if(data.error) {
      alert(data.error);
      return location.reload();
    }
    const selectTopic = document.getElementById('selectTopic');
    for (let i = 0; i < data.topics.length; i++) {
      const option = document.createElement('option');
      option.value = data.topics[i].topic;
      option.text = data.topics[i].topic;
      selectTopic.appendChild(option);
    }
    const valueProduct = document.getElementById('valueProduct').innerText = data.exchange.maxValue;

  } catch (e) {
    console.log(e);
  }
}

async function joinExchange(event) {
  event.preventDefault();
  const key = document.getElementById('codeExchange').value;
  const topic = document.getElementById('selectTopic').value;
  console.log(topic);
  if(!key) alert("Escribe el código del intercambio!");

  const info = {
    key,
    topic,
    idUser: owner
  }

  try {
    let data = await fetch(`${baseURL}/exchange/join`, {
      method: 'post',
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

async function editExchangeById(data) {
  const smite =
    {
      idExchange: data.id_exchange,
      maxValue: data.maxValue,
      limitDate: data.limitDate,
      date: data.date,
      comments: data.comments
    };
  document.getElementById('editIdExchange').value = smite.idExchange;
  document.getElementById('editMaxValue').value = smite.maxValue;
  document.getElementById('editLimitDate').value = `${smite.limitDate.substring(0,10)}`;
  document.getElementById('editDate').value = `${smite.date.substring(0,10)}`;
  document.getElementById('editComments').value = smite.comments;
}


async function editExchange(event){
  event.preventDefault();

  const idExchange = document.getElementById('editIdExchange').value;
  const maxValue = document.getElementById('editMaxValue').value;
  const limitDate = document.getElementById('editLimitDate').value;
  const date = document.getElementById('editDate').value;
  const comments = document.getElementById('editComments').value || "";

  const info = {
    idExchange,
    maxValue,
    limitDate,
    date,
    comments
  }
  try {
    let data = await fetch(`${baseURL}/exchange/edit`, {
      method: 'put',
      headers: {
        "Accept": "*/*",
        "Content-type": 'application/json',
      },
      body: JSON.stringify(info)
    });
    data = await data.json();
    console.log(data);
    alert(data.msg);
    location.reload();
  } catch (e) {
    console.log(e);
  }
}

async function deleteExchangeById(idExchange) {
  console.log("Borrando");

  const info = {
    idExchange,
    idUser: owner
  }

  try {
    let data = await fetch(`${baseURL}/exchange/delete`, {
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


async function addFriend (emailOrigen, emailDestino , id) {
  console.log(emailOrigen , emailDestino);
  if (emailOrigen == emailDestino) {
    console.log("No puedes agregarte a ti mismo");
    alerta(`No te puedes dar auto follow`, "error");
    return
  }

  await fetch(`http://localhost:7777/api/add-friend/${emailDestino}`, {
    method: 'POST',
    body: new URLSearchParams({
      'email_ori': emailOrigen,
      'id_user': id,
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data == "ya son amigos") {
        alerta(`Ya sigues a  ${emailDestino}, No puedes darle follow`, "error");
      } else {
        alerta(`Felicidades ya siigues a ${emailDestino}`);
      }
    })
    .catch(err => console.log(err));

}

function alerta(message, error) {
  const mensaje = document.createElement("div");
  mensaje.classList.add('alert');
  if (error === "error") {
    mensaje.classList.add('alert-danger');
  } else {
    mensaje.classList.add('alert-success');
  }
  mensaje.textContent = message;

  //agegar al dom
  //Agregar al dom
  const container = document.querySelector('#alertaDiv');
  container.appendChild(mensaje);

  //Quitar la laerta despues de 5 segundos
  setTimeout(() => {
    mensaje.remove();
  }, 2500);
}

function getCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJWT(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
