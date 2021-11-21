

/*
const section = document.getElementById('monto');


const data = fetch('http://localhost:7777/exchange')
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
 */



/* Create Exchange */

async function createExchange(event) {
    event.preventDefault();
    const key = document.getElementById('inputKey').value;
    const topics = document.getElementById('inputTopics').value;
    const maxValue = document.getElementById('inputMaxValue').value;
    const limitDate = document.getElementById('inputLimitDate').value;
    const date = document.getElementById('inputDate').value;
    let comments = document.getElementById('inputComments').value;
    const ownerParticipate = document.getElementById('inputOwnerParticipate').checked;
    console.log(document.getElementById('inputOwnerParticipate'));
    const owner = 2;
    if(!key || !topics || !maxValue || !limitDate || !date || !ownerParticipate || !owner) return alert('Error al leer los datos de los inputs');
    if(!comments) {
        comments = "";
    }
    const info = {
        key,
        topics,
        maxValue,
        limitDate,
        date,
        comments,
        ownerParticipate,
        owner
    }
    try {
        let data = await fetch('http://localhost:7777/api/exchange', {
            method: 'post',
            headers: {
                "Accept": "*/*",
                "Content-type": 'application/json',
            },
            body: JSON.stringify(info)
        });
        data = await data.json();

        console.log(data);
        alert(`Se envio`);

    } catch (e) {
        console.log(e);
    }

}