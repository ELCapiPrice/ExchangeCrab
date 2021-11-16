const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("837884679976-qh8oc61flqj3h4u3t72ckjnrovj2m8gp.apps.googleusercontent.com");
const googleVerify = async(id_token = '') => {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: '837884679976-qh8oc61flqj3h4u3t72ckjnrovj2m8gp.apps.googleusercontent.com',
    });
    const { name: nombre, picture: img, email: correo } = ticket.getPayload();

    return { nombre, img, correo };
}

module.exports = {
    googleVerify
}