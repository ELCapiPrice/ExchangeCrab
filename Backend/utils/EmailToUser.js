const nodemailer = require('nodemailer');

 const emailGift = async(email , persona="Jane Doe") => {
     try {
         console.log("Email: ", email);
         let testAccount = await nodemailer.createTestAccount();
         let transporter = nodemailer.createTransport({
             host: "smtp.ionos.mx",
             port: 587,
             secure: false,
             auth: {
                 user: 'chuz.regis@proyectocifrado.com',
                 pass: 'ProyectoCifrado007',
             },
             tls: {
                 // do not fail on invalid certs
                 rejectUnauthorized: false
             },
         });
         let info = await transporter.sendMail({
             from: '"Exchange Crab" <chuz.regis@proyectocifrado.com>', // sender address
             to: email, // list of receivers
             subject: "TU INTERCAMBIO ESTA LIESTO :)",
             text: `La persona que te toca dar tu regalo es ${persona} `,
             html: `<h1>Felicidades todos estan emocionados en recibir su regalo</h1> 
                    <br>
                    La persona que te toca dar tu regalo es ${persona}
             `,
          
         });

     } catch (e) {
         console.log("Problema en el envio ");
         console.log(e);
     }

 }

 module.exports = {
     emailGift
 }