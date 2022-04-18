'use strict';

const crypto = require('crypto');
const Chance = require('chance');
const chance = new Chance();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2'});
const { Consumer } = require('sqs-consumer');

const stringifiedOrder = JSON.stringify({
  orderId: crypto.randomUUID(),
  customer: chance.name(),
  queueArn: 'arn:aws:sqs:us-west-2:688409722565:vendor1-delivered',
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/vendor1-delivered',
});

const sns = new AWS.SNS();

const payload = {
  Message: stringifiedOrder,
  TopicArn: 'arn:aws:sns:us-west-2:688409722565:pickup.fifo',
  MessageDeduplicationId: crypto.createHash('sha256').update(stringifiedOrder, 'utf8').digest('hex'),
  MessageGroupId: 'vendor1',
};

function publishPickup() {
  sns.publish(payload).promise()
    .then((response) => {
      console.log('Payload sent to SNS');
    })
    .catch(console.error);
}

publishPickup();

setInterval(publishPickup, 5000);



const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/vendor1-delivered',
  handleMessage: handleDelivered,
});

function handleDelivered(message) {
  try {
    const order = JSON.parse(message.Body);
    console.log(`Thank you ${order.customer} for order ${order.orderId}`);   
  } catch (error) {
    console.error(error);
  }
}

app.start();

console.log('App has started');
