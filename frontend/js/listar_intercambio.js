class Exchanges {

    constructor (endpoint){
        this.endpoint=endpoint
    }

    async fetching (){

        try {
            let data = await fetch(this.endpoint, {
                method: 'GET'
            })
            data = await data.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log("ERROR EN FECTH ", error);
        }
       

    }

   async generarCards(){
        const data = await this.fetching()
        const  parent_div = document.querySelector('#root');
        
        console.log(data.length);
        for (let  i =0 ; i<data.length ; i++){
            
            let {comments , id_exchange , maxValue , limitDate , key}= data[i];
            console.log(data[i]);

            let  child_div = document.createElement('div');
            child_div.classList.add('col-5' , 'col-lg-3' , 'col-sm-8' , 'my-4')
            
            let  grandchild = document.createElement('div')
            grandchild.classList.add('card' , 'bg-card-1')
    
            let div_card_body = document.createElement('card-body')
            div_card_body.classList.add('card-body')
    
            let  card_body_child = document.createElement('div')
            card_body_child.classList.add('title-center')
    
            let img = document.createElement('img')
            img.setAttribute('src', '/frontend/img/crab-logo.png')
    
            let h1 = document.createElement('h1');
            h1.classList.add('card-title')
            h1.textContent= `ID: ${id_exchange}`
            
            let h5_monto = document.createElement('h5');
            h5_monto.classList.add('title-text')
            h5_monto.textContent=`Monto: $ ${maxValue}`

            let h5_comentarios = document.createElement('h5');
            h5_comentarios.classList.add('title-text')
            h5_comentarios.textContent=`Comentarios:  ${comments}`


            let h5_valido = document.createElement('h5');
            h5_valido.classList.add('title-text')
            h5_valido.textContent=`Termina: ${limitDate}`





            let btn = document.createElement('button')
            btn.classList.add('button', 'button-green', 'p-2')
            btn.textContent="Unirse al intercambio"
            btn.setAttribute("id", id_exchange)
            btn.setAttribute("key" , key)
            


            parent_div.appendChild(child_div)
            child_div.appendChild(grandchild)
            grandchild.appendChild(div_card_body)
            div_card_body.appendChild(card_body_child)
            card_body_child.appendChild(img)
            card_body_child.appendChild(h1)
            card_body_child.appendChild(h5_comentarios)
            card_body_child.appendChild(h5_monto)
            card_body_child.appendChild(h5_valido)


            card_body_child.appendChild(btn)


        }

        
    }

    async registrar(id , key, payload){
        console.log(id , key);
        
        try {
            let data = await fetch(`http://localhost:7777/api/exchange/getTopics?exchangeId=${id}`, {
                method: 'GET'
            })
            data = await data.json();
            //data[0].topic
            //let { key, topic, email, firstName, lastName, idUser } 
    

            let unirse =await fetch("http://localhost:7777/api/exchange/join", {
                method: 'POST',
                body: new URLSearchParams({
                    'key': key,
                    'topic': data[0].topic,
                    'email': payload.email,
                    'firstName': payload.firstName,
                    'lastName': payload.lastname,
                    'idUser': payload.pk,
                })
            })
            .then(response => response.json())
            .then((data => {
                console.log(data);
            if (data.error == 'Error, ya estas registrado en ese intercambio!'){
                alert("Ya estas en el intercambio")
            }else{
                alert("Te uniste al intercambio :)")
            }
            }));
        
        
        
        
        } catch (error) {
            console.log("ERROR EN FECTH ", error);
        }
    }

    getCookie() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; token=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    parseJWT(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }


}


window.onload = async function(){

console.log("Holaa");
const exchanges = new Exchanges("http://localhost:7777/api/list-exchanges");
await exchanges.generarCards()

const buttons = document.querySelectorAll(".button")
console.log(buttons);
for (let i = 0; i < buttons.length; i++) {
    console.log("ss");
    buttons[i].addEventListener("click" , ()=>{
        const key = buttons[i].getAttribute('key');
        const id = buttons[i].getAttribute('id');

        const data =exchanges.parseJWT(exchanges.getCookie());
        console.log(data);
        exchanges.registrar(id, key, data)
    })
}



}