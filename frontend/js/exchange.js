
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
                      <button href="#" class="button button-info"><i class="far fa-edit icon-medium info"></i></button>
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
