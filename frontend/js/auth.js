class Login {

    constructor (emaill  , password){
        this.email=emaill;
        this.password= password;
    }


    async login_user (){
        console.log(this.email , this.password);
        const info = {
            email: this.email,
            password: this.password
        }

        await fetch('http://localhost:7777/api/login', {
            method: 'POST',
            headers: {
                "Accept": "*/*",
                "Content-type": 'application/json',
            },
            body: JSON.stringify(info),
            
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg=='OK'){
                this.createAltert("Iniciando Sesion.....","success")
                this.setCookie("token" , data.token , 10);
                console.log(data.token);
                console.log(this.parseJWT(this.getCookie()));
                window.location.href = '/frontend/inicio.html'; 

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

    setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
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

class Register {

    constructor(email  , username ,firstname , lastname , password){
        this.email=email;
        this.username=username;
        this.firstname=firstname;
        this.lastname=lastname;
        this.password=password;
    }

    async  register (){
        console.log(this.email , this.password);

        await fetch(`http://localhost:7777/api/create-user`, {
            method: 'POST',
            body: new URLSearchParams({
                'email': this.email,
                'password': this.password,
                'username': this.username,
                'firstname': this.firstname,
                'lastname':this.lastname,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message=='OK'){
                this.createAltert("Usuario Creado ","success")
                console.log("object");
            }else{
                this.createAltert("UPPS, Tenemos problemas al registraserse","error")
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
    const password_register = document.querySelector('#registerPassword');



    btn_submit_login.addEventListener('click' , function(e){
        e.preventDefault();
        if (validatedata("login")){
            const login = new Login(email.value , password.value);
            login.login_user();
        }else{
            generaralert();
            return
        }

    })

    btn_submit_register.addEventListener('click', function(e){
        e.preventDefault();
        if (validatedata("register")){
            console.log(email_register.value);
            const register= new Register(email_register.value , username_register.value , name_register.value , lastname_register.value , password_register.value);
            register.register();

        }else{
            generaralert();
            return
        }
    })


    function validatedata(type){
        if (type=="login"){
        return (email.value!=='' && password.value!=='')
        }
        else{
        return (email_register.value!=='' && username_register.value!=='' && name_register.value!=='' && lastname_register.value!=='' && password_register.value!=='' )
        }
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