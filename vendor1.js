'use strict';

const crypto = require('crypto');
const Chance = require('chance');
const chance = new Chance();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2'});

const stringifiedOrder = JSON.stringify({
  orderId: crypto.randomUUID(),
  customer: chance.name(),
  queueArn: 'arn:aws:sqs:us-west-2:688409722565:vendor1-delivered',
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/688409722565/vendor1-delivered',
});

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:688409722565:pickup.fifo';

const payload = {
  Message: stringifiedOrder,
  TopicArn: topic,
  MessageDeduplicationId: crypto.createHash('sha256').update(stringifiedOrder, 'utf8').digest('hex'),
  MessageGroupId: 'vendor1',
};

let response = sns.publish(payload).promise()
  .then(console.log)
  .catch(console.error);

console.log(response);
