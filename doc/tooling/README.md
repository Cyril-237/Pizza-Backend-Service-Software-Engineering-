# Tools used in the project
The following lists the tools and frameworks, that are used in the project. 
- [Docker](https://docs.docker.com/get-started/overview/) is an open-source platform that allows developers to create, deploy, and manage applications in isolated environments called containers. These containers package the application code along with its dependencies, ensuring consistent performance across different systems. Docker enables rapid application development, testing, and deployment by providing a lightweight alternative to traditional virtual machines. It supports various operating systems, including Linux, Windows, and macOS, making it versatile for different environments. By using Docker, developers can ensure that their applications run reliably and efficiently, regardless of the underlying infrastructure.
- [Kubernetes](https://kubernetes.io/docs/concepts/overview/), often abbreviated as K8s, is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications across various environments, including on-premises, public, private, and hybrid clouds. It simplifies the orchestration of complex tasks such as provisioning, deployment, networking, and load balancing. Kubernetes groups containers into logical units called pods for easier management and ensures high availability by automatically restarting failed containers. Originally developed by Google, Kubernetes is now maintained by the Cloud Native Computing Foundation and is widely used in industries for its scalability and efficiency. It supports a wide range of applications, from DevOps to machine learning, by abstracting away infrastructure complexities.
- [FastAPI](https://fastapi.tiangolo.com/tutorial/) is a modern, high-performance web framework for building APIs with Python 3.7+. It leverages Python type hints to provide automatic data validation, serialization, and documentation generation, making it easy to use and maintain. FastAPI is built on top of Starlette and uses Pydantic for data validation, offering features like asynchronous programming support and automatic interactive API documentation via OpenAPI. This framework is designed to be fast, scalable, and easy to learn, making it a popular choice for building web applications and APIs. FastAPI's performance is comparable to frameworks like Node.js and Go, making it a strong competitor in the Python ecosystem.
- [SQLAlchemy](https://docs.sqlalchemy.org/en/20/orm/quickstart.html) is a Python SQL toolkit and Object Relational Mapper (ORM) that allows developers to interact with databases using Pythonic syntax. It provides a flexible way to map Python classes to database tables, enabling developers to focus on application logic rather than database interfacing code. SQLAlchemy supports both the SQL Expression Language for raw SQL operations and an ORM for high-level, abstracted interactions. This toolkit is open-source and cross-platform, making it suitable for a wide range of database applications. By using SQLAlchemy, developers can write database-agnostic code that works with various database engines.
- [FastAPI with SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/) combines two powerful Python tools to build high-performance web applications. FastAPI is a modern web framework for creating APIs using Python type hints, known for its speed and ease of use. SQLAlchemy, on the other hand, is a SQL toolkit and Object-Relational Mapping (ORM) library that allows developers to interact with databases using Python objects instead of raw SQL queries. By integrating these tools, developers can create robust, scalable APIs with efficient database interactions. This integration supports various databases like PostgreSQL, SQLite, and more, and is often used for building CRUD (Create, Read, Update, Delete) applications.
- [Alembic](https://alembic.sqlalchemy.org/en/latest/tutorial.html) is a database migration tool designed to manage changes in database schema over time. It works seamlessly with SQLAlchemy, a Python library for interacting with relational databases, to track and apply schema changes in a version-controlled manner. Alembic allows developers to generate migration scripts automatically, ensuring that database schema updates are consistent across different environments. It supports transactional DDL operations and provides features like idempotent migrations and rollback support, making it a reliable choice for managing database schema evolution. By using Alembic, developers can automate the process of generating migration scripts, reducing manual SQL work and minimizing errors.
- [Swagger UI](https://swagger.io/tools/swagger-ui/) is a tool used to visualize and interact with API documentation. It generates interactive documentation from an OpenAPI (formerly Swagger) Specification, allowing users to explore and test API endpoints directly in their browser. This tool is part of the Swagger suite, which includes other tools like Swagger Editor for designing APIs and Swagger Codegen for generating client libraries. Swagger UI can be easily integrated into projects via a CDN or locally, providing a user-friendly interface for developers and consumers to understand and use APIs effectively. By providing an interactive view of API resources, Swagger UI enhances collaboration and simplifies API maintenance.

# GitLab CI/CD

The following is a collection of short hints on how to do the most essential things in a GitLab CI/CD pipeline:

- How to delay a job until another job is done:
```You can delay a job by setting up dependencies using the needs or stage keyword in the GitLab CI config file. This ensures one job runs only after the specified job is completed.```
- How to change the image used in a task: 
```To change the image, use the image: keyword at the top of the job definition in the .gitlab-ci.yml file. For example: image: python:3.9.```
- How do you start a task manually:
``Add when: manual to the job definition. This makes the job manual and you can start it through the GitLab UI.``
- The Script part of the config file - what is it good for?
``The script: section is where you define the shell commands that should be executed during the job, like testing code or deploying an app.``
- If I want a task to run for every branch I put it into the stage ??
``Yes, but you need to define it properly in only or rules to make sure it targets all branches.``
- If I want a task to run for every merge request I put it into the stage ??
``Yes, and you also need to include only: [merge_requests] or use rules to specify merge requests.``
- If I want a task to run for every commit to the main branch I put it into the stage ??
`` Yes, and also set only: [main] or appropriate rules for commits to the main branch.``
# Ruff

- What is the purpose of ruff?
`` Ruff is a tool for checking your Python code for syntax errors, formatting issues, and enforcing style rules.``
- What types of problems does it detect
`` It detects unused imports, incorrect formatting, unused variables, and other PEP8 violations.``
- Why should you use a tool like ruff in a serious project?
`` It helps keep your code clean, readable, and consistent, and catches bugs early before pushing code.``
## Run ruff on your local Computer

  It is very annoying (and takes a lot of time) to wait for the pipeline to check the syntax 
  of your code. To speed it up, you may run it locally like this:

### Configure PyCharm (only once)
- find out the name of your docker container containing ruff. Open the tab *services* in PyCharm and look at the container in the service called *web*. The the name should contain the string *1337_pizza_web_dev*.  
- select _Settings->Tools->External Tools_ 
- select the +-sign (new Tool)
- enter Name: *ruff-docker*
- enter Program: *docker*
- enter Arguments (replace the first parameter with the name of your container): 
    *exec -i NAMEOFYOURCONTAINER ruff check --exclude /opt/project/app/api/database/migrations/ /opt/project/app/api/ /opt/project/tests/*
- enter Working Directory: *\$ProjectFileDir\$*

If you like it convenient: Add a button for ruff to your toolbar!
- right click into the taskbar (e.g. on one of the git icons) and select *Customize ToolBar*
- select the +-sign and Add Action
- select External Tools->ruff-docker

### Run ruff on your project
  - Remember! You will always need to run the docker container called *1337_pizza_web_dev* of your project, to do this! 
    So start the docker container(s) locally by running your project
  - Now you may run ruff 
      - by clicking on the new icon in your toolbar or 
      - by selecting from the menu: Tools->External Tools->ruff-docker 

# GrayLog

- What is the purpose of GrayLog?
`` GrayLog is used to collect, store, and analyze logs from different systems and applications.``
- What logging levels are available?
`` Typical levels are: DEBUG, INFO, WARNING, ERROR, and CRITICAL.``
- What is the default logging level?
`` Usually, it is WARNING, but it can be configured.``
- Give 3-4 examples for logging commands in Python:
  ```python
  import logging

  logging.debug("This is a debug message")
  logging.info("This is an info message")
  logging.warning("This is a warning")
  logging.error("This is an error message")
  logging.critical("This is a critical error")

# SonarQube

- What is the purpose of SonarQube?
`` SonarQube checks your code quality and helps find bugs, vulnerabilities, and code smells.``
- What is the purpose of the quality rules of SonarQube?
`` Quality rules define what is considered good or bad code, based on coding standards and best practices.``
- What is the purpose of the quality gates of SonarQube?
`` Quality gates are conditions (like no critical bugs or less than 5% code duplication) that your code must meet before it can be merged or deployed.``

## Run SonarLint on your local Computer

It is very annoying (and takes a lot of time) to wait for the pipeline to run SonarQube. 
To speed it up, you may first run the linting part of SonarQube (SonarLint) locally like this:

### Configure PyCharm for SonarLint (only once)

- Open *Settings->Plugins*
- Choose *MarketPlace*
- Search for *SonarLint* and install the PlugIn

### Run SonarLint

- In the project view (usually to the left) you can run the SonarLint analysis by a right click on a file or a folder. 
  You will find the entry at the very bottom of the menu.
- To run it on all source code of your project select the folder called *app*

# VPN

The servers providing Graylog, SonarQube and your APIs are hidden behind the firewall of Hochschule Darmstadt.
From outside the university it can only be accessed when using a VPN.
https://its.h-da.io/stvpn-docs/de/ 