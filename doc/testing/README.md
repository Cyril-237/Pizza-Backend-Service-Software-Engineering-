# Testing

## Flakehell checking

As always, open a terminal in the web container and run:

```
cd /web
flakeheaven lint app/ tests/
```


## Run unit tests

As in several sections in the doc *local_dev_setup* described, open a terminal in the web container and type following command to run the unit tests:

```
cd /web
PYTHONPATH=. pytest -x --junitxml=report_unit_tests.xml tests/unit/
```

## Run service tests

As in the previous two sections, open again a terminal in the web container. Following command changes the directory as usual and then sets the API_SERVER and API_PORT environment variables, so the service tests can find the API Backend:

```
cd /web
export API_SERVER=localhost
export API_PORT=8000
PYTHONPATH=. pytest -x --junitxml=report_service_tests.xml --cov=app --cov-config=.coveragerc --cov-report=xml:service_coverage.xml tests/service/
```

## Clean the database

Open a terminal in the **db** container and connect via psql to the database:

```
psql -U postgres
```

You can store a function to iterate over all tables and truncate them:

```sql
CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
DECLARE
    statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE tableowner = username AND schemaname = 'public';
BEGIN
    FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

```

Call the function:

```sql
SELECT truncate_tables('postgres');

```

([StackOverflow](https://stackoverflow.com/questions/2829158/truncating-all-tables-in-a-postgres-database))
