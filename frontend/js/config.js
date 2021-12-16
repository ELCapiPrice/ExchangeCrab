/* GLOBAL */
const protocol = 'http';
const host = 'localhost:7777';
const domain = `${protocol}://${host}`;
const baseURL = `${domain}/api`;

/* Revisamos que el API funcione correctamente */
( async () => {
  await fetch(`${baseURL}/helth-check`).catch( (e) => alert("El API no esta funcionando. La pagina no funcionara...") );
  document.getElementById('loader-wrapper').classList.add('dontShow');
})();

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

let owner = 2;
let email = "";
/* Obtenemos el archivo en el que se encuenta */
let ruta = location.href.split('/');
ruta = ruta[ruta.length - 1];

/* Verificamos la sesion del usuario */
const token = getCookie(); //Obtenemos los datos de la cookie
if(!token) { //Si existen esos datos

  /* Si no se encuentra en el auth, entonces debe iniciar sesión */
  if(ruta !== 'auth.html'){
    alert("¡Debes iniciar sesión!");
    location.href = "auth.html";
  }

} else { //Si si encontro el token

  /* Y se encuentra en la pagina de autentificación. */
  if(ruta === "auth.html") {
    alert("¡Ya has iniciado sesión!");
    location.href = "inicio.html";
  }

  const userInfo = parseJWT(token); //Obtenemos su informacion de el
  console.log(userInfo);
  email = userInfo.pk;
  owner = userInfo.pk; //Y guardamos su id del usuario en la variable owner para saber quien es.
}


function cerrarSesion() {
  document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}



class APIService {
  async getData(uri, method = 'get', headers = {}, body = {}) {
    let data;
    try {
      switch (method.toLowerCase()) {
        case 'get':
          data = await fetch(`${baseURL}${uri}`, { method: method, headers: headers });
          break;
        case 'post':
        case 'put':
        case 'delete':
          data = await fetch(`${baseURL}${uri}`, { method: method, headers: headers, body: JSON.stringify(body) });
          break;
        default:
          data = await fetch(`${baseURL}${uri}`, { method: method, headers: headers });
          break;
      }
      return data.json();
    } catch (e) {
      console.error(`Error al hacer fetch a ${baseURL}${uri} \nERROR: ${e.message}`);
    }
  }
}

/* Clase de nuestro servicio de nuestra api de intercambios */
const service = new APIService();