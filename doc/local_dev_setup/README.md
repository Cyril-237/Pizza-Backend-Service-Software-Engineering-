# Local Development Setup

## Requirements

- **Docker:** https://docs.docker.com/engine/install/
- **Docker Compose V2 (not docker-compose):** https://docs.docker.com/compose/install/

### ⚠️ Git & Path Compatibility Notice

To ensure compatibility with Git and Docker-based tools, **clone the project into a local folder** on your computer — **not into a synced or shared folder** like Microsoft OneDrive, Google Drive, or Dropbox. These services can interfere with file permissions and Git metadata.

Additionally, avoid using **whitespace** or **special characters** (like `ä`, `ß`, `&`, `!`, etc.) in folder or file paths, especially in parent directories. This prevents issues with:

- Docker volume mounting
- Git command-line tools
- Python virtual environments
- Terminal navigation and scripting

✅ Example of a good path:

```bash
# macOS
/Users/yourname/projects/pizza1337/
# Linux
/home/yourname/projects/pizza1337/
# Windows
C:\Users\yourname\projects\pizza1337\
```

❌ Avoid paths like:

```bash
# macOS
/Users/yourname/Google Drive/my projects/pizza project!
# Linux
/home/yourname/Dropbox/pizza project!
# Windows
C:\Users\yourname\OneDrive\projects\pizza project!
```

## Install Docker

Install docker (using the link above) on your computer.
Check, if docker (and docker compose) is working correctly.
  - Open a Terminal Window
  - Run the command `docker run -it hello-world`
  - If the text you see is "Hello from Docker!" and some more explanations, than everything is fine (for now).

## PyCharm environment setup

Start Pycharm and open the cloned project in PyCharm.

### Configure service container names

In order to customize the Docker Compose configuration file (**docker-compose.yml**) according to your Git repository
name (e.g. **Renz-Mo2-Red** or **Girschick-Do2-Red**) replace the placeholder `<git_repository_name>` with the specific repository name \`**Hahn-Do1-Red**\`
in both the **container_name** fields for the **web** and **db-dev** services. This ensures that the container names are distinct and identifiable based on your repository name.

```bash
services:
  web:
    container_name: Renz-Mo2-Red_1337_pizza_web_dev
    ...
    
  db-dev:
    container_name: Renz-Mo2-Red_1337_pizza_db_dev
    ... 
```

### Setup docker service in PyCharm

Open settings of PyCharm and go to *Build, Execution, Deployment->Docker* and press the add button to add a new docker service if not already present:

![Docker Service](docker-service.png "Docker Service")

Close the settings. Open the service tab in the bottom line of PyCharm. You should now see your new docker service, select it and run it by the the play button on the left side to see the service with Containers, Images etc.

![Docker Service](docker-service2.png "Docker Service")

### Configure docker compose file as python interpreter

Open the settings again and go to *Project: software-engin...->Python Interpreter*. Select *Add Interpreter* and choose *On
Docker Compose*.

Select *web* in the Service Checkbox and press the next button.

![Docker Compose](docker-compose1.png "Docker Compose")

This will download and build all the images that are required by the docker-compose file. When the process is done, press next again:

![Docker Compose](docker-compose2.png "Docker Compose")

PyCharm should now have automatically found a python interpreter in */web/.venv/bin/python3*:

![Docker Compose](docker-compose3.png "Docker Compose")

Finish the process with the create button and close the settings. After that, you should see the text "python interpreter" in the right corner of the bottom line of PyCharm:

![Docker Compose](docker-compose4.png "Docker Compose")

### Run/debug the app

Open *app/main.py* and run the main function by pressing the play/debug button:

![Run](run.png "Run")

You should now see something like in the picture. 

![Run](run2.png "Run")

Open http://localhost:8000/docs. If you see the API Backend your local setup is nearly done.

_You can also open http://localhost:8000/ to see a web application frontend for the pizza 1337 store._

![API](API.png "API Backend")

### Database migration

You just created a new database container that contains a database server and an _empty_ database, 
but not the database schema that your application needs. 
So, you need to set up the appropriate database using a migration.

To migrate the database in the PyCharm setup, you connect to the container and 
open a terminal window (of the container). In this window you execute
the alembic migration command. 

In the lower bar, open the Service tab to see the docker service. From the *web*-services select the container *1337_pizza_web_dev*
and choose *Create Terminal* in the context menu (see picture):

![Migrate database](migration-database-pycharm.png "Migrate database")

Type

```
cd /web
PYTHONPATH=. alembic upgrade head
```

to see the message "...Running upgrade...":

![Migrate database](migration-database-pycharm2.png "Migrate database")

**If your database migration has succeeded, you are done with setting up PyCharm!**

---

# Making changes to the Database Model

Sooner or later you will have to change the database model. 
If you change the database model in your code (see _models.py_), 
you have to change the model in your database, too. 
This is done with a so-called _database migration_ using the tool _alembic_.

Open the folder _app/database/migrations/versions_. 
There you can see all existing migrations. 
At start, you should only see a single file named _xyz_init.py_.

In the PyCharm services, open a terminal in your local web container (_1337_pizza_web_dev_) and 
execute the following command to generate a new migration file:

```bash
cd /web
# you may want to change 'my_new_feature' to something more appropriate
PYTHONPATH=. alembic revision --autogenerate -m "my_new_feature" 
```

This will create a new migration file in _app/database/migrations/versions_. 
Open the file and check whether your changes were correctly detected.

**When working with migrations always remember:**

- After you create a new migration file you have to run the database migration to apply the changes to your database.
  ```
  cd /web
  PYTHONPATH=. alembic upgrade head
  ```

- Do not delete any old migration files in your _app/database/migrations/versions_ folder. 
  The migration files depend on each other.
- Take care that your migration files are consistent in your Git repository. 
  Do not forget to add new migrations to your repo. 
  Watch out for branches with different migration files.

<!-- 
# Starting the app without PyCharm ???? todo - I do not understand this!  !!!

This is not working. After setting up pycharm this container name is in use! 
After removing the container it is starting but the sql container stops again.
/bin/sh: 1: ./scripts/docker-entrypoint.sh: not found


Just open a console windows in the root folder of your project and type

```
docker compose up
```

This will start a postgresql server and the app. Open http://localhost:8000/docs for launching the API Backend through Swagger.

<!--
## Database migration

Before you can really use the API Backend, you need to migrate the database model of the running database container. Open a new terminal window and open an console in the running container:

```
docker exec -it -e PYTHONPATH=. -e API_SERVER=localhost -e API_PORT=8000 1337_pizza_web_dev alembic upgrade head
```

This executes the alembic migration command in the docker container named *1337_pizza_web_dev* with appropriate
environment variables.
-->