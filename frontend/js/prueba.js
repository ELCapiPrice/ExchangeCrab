
const section = document.getElementById('monto');

const data = fetch('http://localhost:3000/exchange')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const info = `
    <h2>${data[0].owner}</h2>
    <p>${data[0].tema}</p>`;

    const num = 854854;


    section.innerHTML = `$${num}`;
    section.innerHTML = '$' + num;
  });