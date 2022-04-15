'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const crypto = require('crypto');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/packages.fifo',
  handleMessage: confirmPickup,
});

async function confirmPickup(message) {
  console.log('Picked up package');
  setTimeout(async ()=> {
    try {
      console.log('Package delivered');
      const body = JSON.parse(message.Body);
      const order = JSON.parse(body.Message);

      const producer = Producer.create({
        queueUrl: order.queueUrl,
        region: 'us-west-2',
      });

      const stringifiedMessage = JSON.stringify({
        ...order,
        deliveredMessage: `${order.orderId} has been delivered`,
        deliveredBool: true,
      });
  
      const payload = {
        id: crypto.randomUUID(),
        body: stringifiedMessage,
      };
    
      let response = await producer.send(payload);
    
      console.log('Payload sent to SQS:\n ', response);
    } catch (error) {
      console.error(error);
    }
  }, 2000);
}

app.start();

console.log('App has started');
