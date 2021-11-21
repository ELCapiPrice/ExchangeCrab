class Login {

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
        console.log(email.value);
        console.log(password.value);
        }else{
            console.log("Upps");
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

    


}