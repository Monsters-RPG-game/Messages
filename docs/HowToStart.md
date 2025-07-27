# How to start - docs

This file will try to explain, how to start this project, setup configs and databases.

> [!IMPORTANT]
> Before setting up this app, you should have already prepared [Gateway service](https://github.com/Monsters-RPG-game/Gateway). This service is essential, for starting this app. Unless you are planning on testing this, gateway is not required.

TLDR;
1. [External connections](#1-external-connections)
2. [Configs](#2-configs)
3. [Preparing data](#3-preparing-data)

## 1. External connections

This application connects to:
- MongoDb
- RabbitMQ

MongoDB is used to store data related to messages. There are 3 types of data:
- Messages - collections, which include sender, receiver, dates and id for message details, saved in `MessageDetails`. This collection holds classic messages. 
- Chats - collection, saving the same data what `Messages`, but with type `Chats`. This collection holds live chat messages.
- MessageDetails - collection, managing what user send. This is separated from other messages, to take less space, for mass messages like system updates etc.

RabbitMq is used to send messages between other microservices

> [!TIP]
> In addition to 'connections', there are microservices, related to this project, which do not communicate directly with it, but might use it in other ways. If you want to set up whole infrastructure, please refer to [Head](https://github.com/Monsters-RPG-game/Head) project. Head will explain how to set up whole infrastructure.

## 2. Configs

This application uses 3 config files:
- devConfig.json
- prodConfig.json
- testConfig.json

DevConfig will be used, if you run your application with NODE_ENV=development. This config should be used while working on this application

ProdConfig will be used, if you run your application with NODE_ENV=production. This should be used in production env

TestConfig will be used, if you run your application on dev servers. This config only differs from production, that in code it will log debug logs and should connect to dev database.

Each config includes few elements:
```json
{
  "mongo": {
    "url": "mongodb://user:password@address:port",
    "db": "database",
    "testDb": "database-test"
  },
  "amqp": {
    "url": "amqp://user:password@address:port",
    "myQueue": "myQueue",
    "gatewayQueue": "gatewayQueue",
    "myService": "me",
    "gatewayService": "gateway"
  },
  "repository": "mongo"
}
```

- mongo is object containing settings for mongoDb connections
- repository is repository to be used. By default, mongoDB is only provider, but system is ready to accept another providers
- amqp is config for connecting with rabbitMQ

## 3. Preparing data

There is no need to prepare any data for this service. MongoDB will automatically set up everything you will need for this app to work. This might change in the future, but should be communicated. 