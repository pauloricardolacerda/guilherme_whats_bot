const venom = require('venom-bot');
const list = require('./list.json');
const moment = require('moment');
const cron = require('node-cron');

venom
  .create({
    session: 'session-name',
    multidevice: false
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
    cron.schedule('0 0 * * *', async () => {
        const now = moment().format('YYYY-MM-DD');

        for(let contact of list.contacts) {
            const { phone, day } = contact;

            const fullDay = `${moment().format('YYYY')}-${moment().format('MM')}-${day}`;

            const momentNow = moment(now);
            const momentFullDay = moment(fullDay);

            const daysLeft = momentFullDay.diff(momentNow, 'days')

            if (daysLeft > 0 && daysLeft <= 5) {
                await client
                    .sendText(`${phone}@c.us`, `Sua assinatura vai vencer em: ${daysLeft} dias!`)
                    .then((result) => {
                        console.log('Result: ', result);
                    })
                    .catch((error) => {
                        console.error('Error when sending: ', error);
                    });
            }
        }
    });
}