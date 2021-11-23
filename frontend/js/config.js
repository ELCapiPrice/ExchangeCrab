/* GLOBAL */
const protocol = 'http';
const host = 'localhost:7777';
const domain = `${protocol}://${host}`;
const baseURL = `${domain}/api`;

/* TODO Cambiar este número por el id del usuario real. (Hasta que se implemente el sistema de logeo) */
/* Obtenemos el id del usuario de las cookies */


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

const userInfo = parseJWT(getCookie());
console.log(userInfo);

const owner = userInfo.pk;