

/* Obtenemos los parámetros de la URL */
const input_string = window.location.href
const url = new URL(input_string);

let keyExchange = url.searchParams.get("key");
let emailUser = url.searchParams.get("email");

console.log(keyExchange, emailUser);

if(!keyExchange || !emailUser) {
  document.getElementById("unirse").disabled = true;
  alert("Faltan parametros en la URL, asi no funciono");
}

cargarTopics();




async function cargarTopics() {
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json',
  }
  const data = await service.getData(`/exchange/key/${keyExchange}`, 'get', headers).catch( err => console.error("Error al obtener la informacion del intercambio por su llave: " + err));

  const select = document.getElementById('topics');

  console.log(data);

  data.topics.forEach( topic => {
    const option = document.createElement('option');
    option.value = topic.topic;
    option.innerHTML = topic.topic;
    select.appendChild(option);
  });


}



async function joinExchangeByInvitation (e) {
  e.preventDefault();
  const headers = {
    "Accept": "*/*",
    "Content-type": 'application/json',
  }
  const fistName = document.getElementById('nombre').value;
  const lastName = document.getElementById('apellido').value;
  const topic = document.getElementById('topics').value;

  let info = {
    firstName: fistName,
    lastName: lastName,
    topic: topic,
    key: keyExchange,
    email: emailUser
  }

  let join = await service.getData('/exchange/join', 'post', headers, info);
  console.log(join);
  if(join.error) {
    return alert(join.error);
  }
  alert(join.msg);
}