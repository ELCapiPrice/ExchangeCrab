const nodemailer = require('nodemailer');

 const emailConfirmacion = async(email , codigo) => {
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
             subject: "GRACIAS POR TU INTERCAMBIO",
             text: `Tu Intercambio  sala de intercambios es ${codigo} `,
             html: `<p>Gracias por participar </p>`,
          
         });

     } catch (e) {
         console.log("Problema en el envio ");
         console.log(e);
     }

 }

 module.exports = {
     emailConfirmacion
 }