# **1337 Pizza** - Pizza Delivery for Your *Nerdy* Needs

**1337 Pizza** is a pizza delivery company, that has specialized on the needs of nerds.
The unique selling propositions of **1337 Pizza** compared with their competitors are: 
- 24/7 pizza delivery; ***you need it; we deliver it***
- Any exotic pizza composition is possible; ***anything goes***
- Pizza can be ordered hot or cold; ***we don't judge***
- Orders can be placed through an API; ***talk API to us, baby***


## Project Overview
This repository contains all development artifacts related to the backend service of the **1337 Pizza**-delivery. It exposes an API endpoints that can be used by front-end applications. For this repository, however, front-end applications are out of scope. They may be developed by other teams.


## Folder Structure of this Repository
The following is a brief description of the folder structure of this project:
- **app** - service's source code
- **doc** - all documentation of the project - [entrypoint](doc/README.md)
- **infra** - all infrastructure artifacts
- **test** - all tests

Docker is an open-source platform designed to automate the deployment, scaling, and management of applications using containerization. By packaging applications in isolated containers, Docker enables consistent execution across different environments, making development, testing, and deployment more efficient. Containers are lightweight, portable, and provide all the necessary components, including code, libraries, and dependencies, to run applications consistently. Docker simplifies the creation, deployment, and management of distributed applications and helps streamline workflows for developers and DevOps teams.

Kubernetes Kubernetes, also known as K8s, is an open-source platform for automating the deployment, scaling, and management of containerized applications. Developed by Google, Kubernetes allows for the orchestration of complex, distributed systems and provides tools for managing containerized workloads across a cluster of machines. It offers features like automatic scaling, load balancing, and self-healing to ensure applications run reliably. Kubernetes is widely used to manage microservices architectures and supports DevOps practices through its ability to handle CI/CD and infrastructure automation.

FastAPI FastAPI is a modern, fast (high-performance) web framework for building APIs with Python, based on standard Python type hints. It is designed to provide an easy-to-use and intuitive framework for creating APIs quickly, with built-in support for asynchronous requests, validation, and JSON serialization. FastAPI is built on top of Starlette and Pydantic, allowing it to achieve high performance similar to Node.js or Go and making it an ideal choice for handling large amounts of data in real time. The framework also includes interactive API documentation with Swagger UI and ReDoc.

SQLAlchemy SQLAlchemy is a Python SQL toolkit and Object-Relational Mapping (ORM) library that provides a full suite of well-known enterprise-level persistence patterns. It offers a high-level ORM, allowing developers to map Python classes to database tables and manage database interactions through object-oriented code. SQLAlchemy abstracts away database-specific SQL, enabling developers to write code that works with various databases (such as SQLite, PostgreSQL, MySQL, etc.) without needing to alter the codebase. SQLAlchemy is well-suited for complex applications requiring flexibility and efficiency in database management.

FastAPI with SQLAlchemy Using SQLAlchemy with FastAPI provides developers with a powerful toolkit for creating APIs that interact with databases. By integrating SQLAlchemy with FastAPI, you can create RESTful endpoints with robust database connections, manage schemas, and leverage SQLAlchemy's ORM capabilities. This combination enables the development of highly performant applications that can interact with databases using asynchronous requests. Together, FastAPI and SQLAlchemy are popular for projects that need quick response times, efficient database handling, and scalable API endpoints.

Alembic Alembic is a lightweight database migration tool for use with SQLAlchemy that allows developers to manage schema changes to their database in a version-controlled way. It provides tools to generate and apply migrations (schema changes), keeping track of database versions as an application evolves. Alembic is essential for managing changes to the database structure without losing data, enabling developers to handle database schema changes seamlessly and consistently across development, testing, and production environments.

Swagger UI Swagger UI is an open-source tool that provides a user-friendly interface for exploring and interacting with APIs. It auto-generates documentation from the API’s specification, enabling developers to test endpoints and view responses directly in the browser. Swagger UI is commonly used with OpenAPI specifications and provides real-time, interactive API documentation that helps both developers and stakeholders understand the API's capabilities and constraints. It’s widely used in conjunction with frameworks like FastAPI to enhance API documentation and testing capabilities.
