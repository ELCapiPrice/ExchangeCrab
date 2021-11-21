class Login {

    constructor (emaill  , password){
        this.email=emaill;
        this.password= password;
    }

    async login_user (){
        console.log(this.email , this.password);
        await fetch(`http://localhost:7777/api/login`, {
            method: 'POST',
            body: new URLSearchParams({
                'email': this.email,
                'password': this.password,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg=='OK'){
                this.createAltert("Iniciando Sesion.....","success")
                console.log("object");
            }else{
                this.createAltert("Usuario / Password erroneos","error")
            }
        })
        .catch(err => console.log(err));
    }

    createAltert(message , type){
        const  div_root = document.querySelector('#alerta');
        const alerta = document.createElement('div');
        
        if (type=="error"){
            alerta.classList.add('alert', 'alert-danger')
            alerta.setAttribute('roler', 'alert');
            alerta.textContent=message;
        }else{
            alerta.classList.add('alert', 'alert-success')
            alerta.setAttribute('roler', 'alert');
            alerta.textContent=message;
        }
        
    
        div_root.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }

}

class register {

}



window.onload = async function(){
    console.log("HOLII");
    //LOGIN
    const email = document.querySelector("#loginEmail")
    const password= document.querySelector("#loginPassword")
    const btn_submit_login = document.querySelector("#submit")
    

    //REGISTER
    const btn_submit_register = document.querySelector("#registersubmit")
    const email_register = document.querySelector('#registerEmail');
    const username_register = document.querySelector('#registerAlias');
    const name_register = document.querySelector('#registerName');
    const lastname_register= document.querySelector('#registerLastName')

   
   
    btn_submit_login.addEventListener('click' , function(e){
        e.preventDefault();
        if (validatedatalogin()){
            const login = new Login(email.value , password.value);
            login.login_user();
        }else{
            generaralert();
            return
        }
    
    })

    btn_submit_register.addEventListener('click', function(e){
        e.preventDefault();
        console.log(email_register.value);
    })


    function validatedatalogin(){
        return (email.value!=='' && password.value!=='') 
    }

    function validatedataregister(){

    }

    function generaralert (){
        const  div_root = document.querySelector('#alerta');
        const alerta = document.createElement('div');
        alerta.classList.add('alert', 'alert-danger')
        alerta.setAttribute('roler', 'alert');
        alerta.textContent="Hay un problema. Verifique los campos";
        div_root.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2500);

    }

    


}