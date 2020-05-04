# ML Explorer

## Intro

Welcome to the ML Explorer project!

ML Explorer is an open-source meta machine learning application that makes it easier for machine learning practioners 
and data scientists to collaborate and track the performance of their experiments. It was inspired by the likes of
[Kubeflow](https://www.kubeflow.org/) and [Comet.ml](https://www.comet.ml/site/). The application consists of two
components: API Server and Dashboard. The API Server is responsible for aquiring live data (hyperparameters,
validation and accuracy data, other metadata, etc.) from an active machine learning project, 
storing the data in a Mongo NoSQL database, and dispatching the data to the Dashboard for all 
authorized users to see. The Dashboard is responsible for organizing and visualizing the the data.

The application was created using the MEAN stack: Mongo, Express, Angular, and NodeJS.
As such, it can be hosted on any web hosting service (i.e. Amazon AWS EC2 server).

To ensure data protection and privacy, best practice security measures were taken during the 
construction of the application. The application uses the [JWT internet standard](https://en.wikipedia.org/wiki/JSON_Web_Token) to securely
communicate between the Dashboard (client) and API Server (host).

An ML developer/data scientist does not need to know anything about the MEAN Stack to use this application.
Outside of installing the application, an ML developer will call the appropriate end points from
their ML project to deliver data to the application. A python-based Tensorflow-Keras wrapper is provided
to make calling the API effortless from a python ML project effortless. However, it is relatively
straightforward to call the API using any ML framework (in any programming language).

The application makes heavy use of [Docker](https://www.docker.com/why-docker) and [Docker-Compose](https://docs.docker.com/compose/).
This is because Docker makes ensures portability; an application buit using Docker can be deployed to any machine
that runs Docker. Docker Compose is simply a "wrapper" for Docker that allows multiple Docker containers to be spun
up at once.

As this project is still in active development, there are likely to be bugs. If you find one, please open an issue.

A special thank you to [Professor Jason Kuruzovich](https://lallyschool.rpi.edu/faculty/jason-nicholas-kuruzovich) of Rensselaer Polytechnic Institute who advised this project!

## Installation

## Screenshots

![Alt text](/images/path/to/img.jpg?raw=true "Optional Title")


