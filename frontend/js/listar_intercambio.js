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
            
            let {comments , id_exchange , maxValue , limitDate}= data[i];
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
        


        /* 
        
                    <div class="col-5 col-lg-3 col-sm-8 my-4">
                <div class="card bg-card-1">
                    <div class="card-body">
                    <div class="title-center">

					<img src="/frontend/img/crab-logo.png" alt="p1"/>
					<h1 class="card-title">Robeto Cortes</h1>
					<h5 class="title-text" >Mexico</h5>
					<h5 class="title-text" >Estudiante</h5>
					<h5 class="title-text">ESCOM</h5>
					<div class="center-button mt-3">
                        <button class="button button-green p-2">
                          Añadir amigo
                        </button>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        
        */


    }


}


window.onload = async function(){

console.log("Holaa");
const exchanges = new Exchanges("http://localhost:7777/api/list-exchanges");
exchanges.generarCards()



}