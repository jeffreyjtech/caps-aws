'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const crypto = require('crypto');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/packages.fifo',
  handleMessage: confirmPickup,
});

const producer = Producer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/delivered.fifo',
  region: 'us-west-2',
});

async function confirmPickup(message) {
  setTimeout(async ()=> {
    try {
      let body = JSON.parse(message.Body);
      let parsedOrder = JSON.stringify();
  
      // const payload = {
      //   id: crypto.randomUUID(),
      //   body: messageString,
      //   groupId: 'sqs-consumer',
      //   deduplicationId: crypto.createHash('sha256').update(messageString, 'utf8').digest('hex'),
      // };
    
      // let response = await producer.send(payload);
    
      // console.log(response);
    } catch (error) {
      console.error(error);
    }
  }, 2000);
}

app.start();

console.log('App has started');
