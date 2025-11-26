// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailjs = require('@emailjs/nodejs');

exports.sendMsg = async (to, subject, html) => {
    try {
        // const msg = {
        //     to: to,
        //     from: 'no-reply@playzelo.com',
        //     subject: subject,
        //     html: html
        // };
        // const response = await sgMail.send(msg);
        const msg = {
            message: html,
            to_email: to,
        }

        emailjs
            .send('service_e11codc', 'template_c0sj1nw', msg, {
                publicKey: 'rYBKywq0hlACo5yYV',
                privateKey: 'Y8JotNhzfmM-QWMn7dLWS',
            })
            .then(
                function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                },
                function (err) {
                    console.log('FAILED...', err);
                },
            );

        console.log('Email Successfully Sent!');
        return { status: true };
    }
    catch (err) {
        console.error({ title: 'emailHelper => sendMsg', message: err.message });
        return { status: false };
    }
};

exports.authenticationEmail = (code) => {
    return `${code}`;
}