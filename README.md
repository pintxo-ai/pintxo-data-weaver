# Pintxo-Data-Weaver V1.0
Pintxo Data Weaver <strike>```will be```</strike>is a cutting-edge distributed middleware designed to orchestrate the seamless flow of data from sources (Substreams, Pyth, dedicated API's, etc) to our sink, Pintxo's Engine (a Vespa Vector DB). 


In its current state, the system is composed of four microservices (out of 7 containers):
* The Substreams Service 
* The Pyth Service
* The API Service
* The Engine Connector Service

## TODO:
* Enhance/Expand on Kafka + DS Architecture
* More Data sources - substreams, api endpoints
* 'TYPE' tf out of everything. All must have an interface, no ": any"
* Do Stress and Load Testing + other monitoring leveraging Prometheus, Grafana, and Jaeger
* CI/CD
* Optimize codebase

Use Kafdrop to view topic channels.

## Setup + Running
---
### Pre-reqs

1. Have docker + compose installed. 

### Instructions

1. To run all services defined in the compose, run:
```docker-compose up --build``` 

2. To run individual services, navigate within their root dir and run:
```pnpm run build```
```pnpm run start```

## Adding Data Sources
---
### Substreams Service
There are three steps involved in adding a substream:

1. Within the substreams-service folder, navigate to ```src/config/substreams.config.json```. This JSON contains entries for substreams we wish to read from. The entries have the following structure: 
```
{
  "substreamsConfig": [
    {
      "name": "Pintxo-Substreams",
      "manifestUrl": "https://github.com/pintxo-ai/pintxo-substreams/releases/download/v0.1.1/pintxo-stream-v0.1.0.spkg",
      "strategy": "SeaportStrategy",
      "outputModule": "metrics_out",
      "interface": "PintxoMetric"
    },
    ...
  ]
}
```
Where every JSON substream entry has the fields:
* ```name``` - Defines the Substream Name 
* ```manifestUrl``` - Defines the high-level outline for a Substreams module. The manifest file is used for defining properties specific to the Substreams module and identifying the dependencies between the inputs and outputs of modules.
* ```strategy``` - Defines the substream block processesing strategy that will be used to extract and format the information we desire. (Arbitrary name used in the next step.)
* ```outputModule``` - Defines the substream module to track within the manifestUrl for events.
* ```interface``` - Defines the interface type/structure that will be used for the substream when processing.

This is the first step in adding new substreams to the substreams service.

2. After defining the configurations for a new substream, a strategy must be defined to processing module output. First, within ```src/substreams/strategy-factory.ts``` write two lines of code adding new case for the strategy defined in step 1, and import this un-implemented strategy. Next implement the strategy; following the general syntax:  
```export class X implements MessageProcessingStrategy<Y>```, where X is the strategy name you defined, and Y is the respective interface. Define Y within ```src/interfaces/```.
Implement the substeam block processing in whatever way; however, the response must return an interface composition of ```Input<Y>[]``` where Y is the corresponding interface and the Input interface is 
``` 
export interface Input<T> extends Iterable<T>{
    fields: T;
    type: string;
}
```

3. Now leaving the substreams microservice, we must define a handler + some logic in the engine-connector service. View steps below.

### Realtime Service
Not much done here for architecture abstraction. Only have Pyth hooked up right now, but vision is this would just handle all real-time transport requests.
Ideally, hook it up in the initiailizer, then define a handler that pipes into a kafka topic. The kafka topic defined must be defined in the Pintxo-engine-connector to receive the messages.

### API Service
There are 3/4 steps involved in adding a new data source endpoint. 

1. Add API endpoint w/ corresponding dataType and responseType to ```src/config/endpoints.json``` with the following structure:
```
[
    {
        "endpoint": "https://api.coingecko.com/api/v3/coins/list",
        "dataType": "tokens",
        "responseType": "json"
    },
    { 
        "endpoint": "https://api.llama.fi/protocols", 
        "dataType": "protocols", 
        "responseType": "json" 
    },
    ...
]
```
Where each JSON endpoint entry has the fields:
* ```endpoint``` - Defines thes the api endpoint URL.
* ```dataType``` - Defines the corresponding Kafka topic name as well as pre-processor handler.
* ```responseType``` - Not used right now but useful for defining interfaces.

2. Now within ```src/handlers/```, define a new handler for the endpoint. The general structure for a handler follows:
```
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/data-type-handler.interface';

@Injectable()
export class <X>Handler implements DataTypeHandler {
    async fetchData(endpoint: string) {
        const response = await axios.get(endpoint);
        return response.data;
    }

    processData(data: any): any {
        return data;
    }
}
```
where X corresponds to the endpoints response data type.

3. Once pre-processing handler logic is defined, in ```src/api/api.service.ts```, first import the handler, then within the ```initializeHandlers()``` function, register the handler along with the respective dataType (the one used in the config).

4. Leaving the API service, we must define a handler + some logic in the engine-connector service. View steps below.

### Engine Connector Service
The engine connector is a kafka consumer and orchestrates all topic message consumption, as well as the respective handling + injection into the Pintxo Engine (Vespa DB).

1. To begin, an EventPattern endpoint must be defined to receive the kafka channel topics. Within ```src/engine-connector/pintxo-engine-connector.controller.ts```, define the receiver function under the respective service type with generic syntax:
```
@EventPattern('<X>-topic')
  async handle<X>Data(@Payload() message: any) {
    console.log("Weaving Data from <X>-topic...")

    if (message) {
      await this.pintxoEngineService.processData('<X>-topic', message);
    }
  }
```
* Where ```<X>``` is the Kafka topic name.

2. Next, within ```src/processors/processor-factory.ts```, define a new switch case for the new data topic, as well as pre-emptively define the processor class, and its import. Ex:
```
import { <X>Processor } from './<Y>/<X>-processor';

export class ProcessorFactory {
  ...
  static getProcessor(topic: string): DataProcessingProcessor {
      switch (topic) {
          case "pintxo-seaport-substreams-topic":
              return new PintxoSeaportMetricSubstreamProcessor();
          case "<X>-topic":
              return new <X>Processor();
          ...
          default:
              throw new Error(`Processor for Kafka Topic [${topic}] not found`);
      }
  }
}
```
* Where ```<X>``` is the Kafka topic name and ```<Y>``` is the data's source service.

3. Respective to each service, implement the processor which will have a generic structure as follows:
```
import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class <X>Processor implements DataProcessingProcessor {
    processData(message: any): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/<Y>/docid/${<Z>}?create=true`;
        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                <A>,
                <B>,
                <C>,
                ...
            },
            type: "<Y>",
        };
        return request
    };
}
```
* Where ```<X>``` is the data type.
* Where ```<Y>``` is Vespa schema / data type name.
* Where ```<Z>``` is the ID used for each vespa document injection. I.e `message.name` or `mesage.id`.
* Where ```<A>, <B>,``` and ```<C>``` are the fields in the message to be injected into the respective vespa schema. Example format ```name: { assign: message.name },```

* ALL GOOD TO GO

## Architecture
---
We embody a microservice archtecture. [1] To orchestrate this system, we will use the NestJS framework; a TypeScript-based framework built on top of Node.js. 

### Advatanges & Disadvantages with this approach

#### Advantages
1. Scalability: Microservices enable horizontal scaling, allowing you to scale individual services independently based on their resource needs. This flexibility ensures efficient resource utilization.

2. Maintainability: Smaller, focused services are easier to manage and maintain. Teams can work on individual services without impacting the entire application.

3. Flexibility: Microservices promote technology heterogeneity, meaning you can choose the right technology stack for each service. This flexibility enables you to use the best tool for each job.

4. Continuous Delivery: Independent services can be developed, tested, and deployed separately, enabling faster development cycles and continuous delivery.

5. Fault Isolation: If one service fails, it doesn’t necessarily bring down the entire application. Microservices can be designed to gracefully degrade when facing failures.

6. Polyglot Persistence: You can use different databases for different services, selecting the most suitable database for each service’s data requirements.

#### Disadvantages
1. Service Discovery: As the number of services grows, so does the complexity of discovering and communicating with them. Service discovery mechanisms are essential to locate services dynamically.

2. Inter-Service Communication: Effective communication between services is crucial. Implementing reliable and efficient communication patterns is essential for the success of microservices.

3. Data Management: Microservices often require data to be distributed across various services. Managing data consistency and synchronization can be challenging.

4. Complexity: The decomposition of a monolithic application into microservices introduces architectural complexity. It’s important to have strategies for managing this complexity.

5. Deployment and Orchestration: Coordinating the deployment of multiple services and managing their lifecycle can be complex. Containerization and orchestration tools like Docker and Kubernetes are often used to address these challenges.

#### Addressing Disadvantages
The system addresses the disadvantages—through the use of specific technologies and patterns, particularly Kafka and Docker.

1. Service Discovery: By leveraging Docker Compose, the system can define and run multi-container Docker applications. Within this ecosystem, services can be easily discovered and communicate with each other through Docker's internal networking capabilities. 

2. Inter-Service Communication: Kafka plays a crucial role in facilitating reliable and efficient communication between services. It enables decoupled communication patterns, allowing services to publish and subscribe to streams of records (events). This pattern enhances the system's ability to scale, provides fault tolerance, and ensures that the services can communicate asynchronously, which is crucial for the overall success of a microservices architecture.

3. Data Management: Kafka also assists in managing data across distributed services by acting as a central platform for data streams. It allows for the decoupling of data pipelines, ensuring that each service can independently manage its data while also subscribing to updates from other services. This helps in maintaining data consistency and synchronization across the microservices ecosystem.

4. Complexity: While the decomposition into microservices inherently introduces complexity, using Docker Compose for defining, running, and managing the lifecycle of all services in a coordinated manner helps manage this complexity.

5. Deployment and Orchestration: Docker Compose aids in the deployment process by allowing the definition of how services are built, connected, and stored. When more complex orchestration is needed, we will integrate with Kubernetes, which can manage the Docker containers at scale. 

### Choice of NestJS
---
NestJS was chosen for the following reasons:

1. Modular Architecture:

NestJS advocates for a modular approach to building applications. It is structured around **modules**, which encapsulate related functionality and dependencies. This modularity promotes code reusability, maintainability, and a clean separation of concerns. In the context of microservices, this modularity aligns perfectly with the idea of creating small, self-contained services.

2. Expressive Decorators:

NestJS leverages TypeScript’s decorators to make your codebase expressive and declarative. You can use decorators like `@Controller`, `@Module`, and `@Injectable` to define routes, modules, and services in a highly readable and organized manner.

3. Built-in Dependency Injection:

The framework offers built-in **dependency injection**, simplifying the management of service dependencies and facilitating testability. With NestJS, you can effortlessly inject services and components into other parts of your application.

4. Support for WebSockets and GraphQL:

Beyond its core HTTP capabilities, NestJS provides native support for WebSockets and GraphQL. This flexibility enables you to build real-time, interactive microservices or RESTful APIs, depending on your project’s requirements.

#### NestJS w.r.t Microservices
Lies in its adaptability and alignment with microservices principles:

- Scalability: NestJS’s modular architecture makes it straightforward to scale individual microservices independently. You can develop, test, and deploy microservices with ease.

- Resilience: NestJS’s built-in error handling and middleware support ensure that your microservices can gracefully handle faults and failures, contributing to overall system resilience.

- Interoperability: Microservices often communicate through various protocols and message queues. NestJS provides out-of-the-box support for protocols like HTTP, WebSockets, and AMQP (Advanced Message Queuing Protocol), which is crucial for seamless inter-service communication


### Kafka
----
Kafka a standout choice for building scalable and distributed systems.

1. Scalability: Kafka is horizontally scalable, which means you can handle massive volumes of data and high traffic loads by simply adding more machines to the cluster. This scalability is crucial when dealing with microservices that demand real-time communication and data synchronization.

2. Durability: Kafka provides durability by storing data reliably and ensuring that messages are never lost. This characteristic is essential for maintaining data integrity in distributed systems.

3. Fault Tolerance: Kafka is built to handle hardware failures gracefully. Even if some nodes in the Kafka cluster go down, the system continues to operate without data loss.

4. Real-time Processing: Kafka supports real-time processing and event-driven architectures, making it ideal for scenarios where timely data is critical.

#### Brief Overview of Kafka Architecture 
Some key architectural components:

##### Topics:

- In Kafka, data is organized into topics. Topics act as channels where data is published. Each topic represents a specific category of data, making it easy to categorize and distribute information.

##### Producers:

- Producers are responsible for publishing data to Kafka topics. They generate messages and send them to one or more topics. In a microservices context, producers can be microservices emitting events or changes in state.

##### Brokers:

- Kafka clusters consist of brokers, which are Kafka server instances. Brokers are responsible for storing data and serving clients’ requests. Multiple brokers form a Kafka cluster, providing scalability and redundancy.

##### Consumers:

- Consumers subscribe to Kafka topics and process the data. They can be microservices, analytics systems, or any component interested in the data published to a topic.

##### ZooKeeper (Optional but we using rn):

- Kafka traditionally relied on Apache ZooKeeper for distributed coordination tasks, such as leader election and cluster metadata management. However, recent Kafka versions have been moving away from this dependency, and it’s now optional in many deployments.


### Options for Scaling
---
The two main strategies for scaling microservices involves increasing the capacity and availability of your services to handle growing workloads. 

1. Horizontal Scaling:

- Pros: Horizontal scaling, also known as “scaling out,” involves adding more instances of a microservice to distribute the load. This approach offers high availability and improved performance.

- Cons: Coordinating state between instances can be complex, and not all services can be easily horizontally scaled. Additionally, managing a large number of microservice instances can be challenging.

2. Vertical Scaling:

- Pros: Vertical scaling, or “scaling up,” involves increasing the resources (CPU, memory, etc.) of an individual microservice instance. This approach can be simpler to implement and is suitable for services with high resource requirements.

- Cons: Vertical scaling has limits, and there comes a point where further resource upgrades are impractical or cost-prohibitive. It also doesn’t provide the same level of redundancy as horizontal scaling.



[1] Microservices is an architectural approach in which a complex application is decomposed into a collection of small, independently deployable services. Each service is responsible for a specific piece of functionality, operates in its own runtime environment, and communicates with other services through well-defined APIs
