import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Import StaticFiles

from app.api.v1.router import router as api_v1_router

logging.basicConfig(format='%(asctime)s:%(levelname)s:%(message)s', level=logging.DEBUG)  # NOSONAR

tags_metadata = [
    {
        'name': 'user',
        'description': 'Operations with users. ',
    },
    {
        'name': 'order',
        'description': 'Operations with orders.',
    },
    {
        'name': 'beverage',
        'description': 'Operations with beverages. ',
    },
    {
        'name': 'pizza_type',
        'description': 'Operations with pizza_types. ',
    },
    {
        'name': 'dough',
        'description': 'Operations with doughs. ',
    },
    {
        'name': 'topping',
        'description': 'Operations with toppings. ',
    },
    {
        'name': 'sauce',
        'description': 'Operations with sauces. ',
    },
]
app = FastAPI(openapi_tags=tags_metadata)

origins = [
    'http://localhost',
    'http://localhost:8000',
    'http://localhost:3030',  # This is needed for development
    # when running the preact web client
    # in npm run dev mode ...
    # only needed because of 303 Returns ...
    # which result in OPTION requests
    # these would be skipped by CORS Pre-Flight-Control ...
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=[],
)

# This function routes to version 1 of the REST API /v1/..
app.include_router(
    api_v1_router,
    prefix='/v1',
)

# Mount the static files directory to the root path
app.mount('/', StaticFiles(directory='/web/frontend', html=True), name='static')

if __name__ == '__main__':
    logging.info('App is up and running')
    uvicorn.run('app.main:app', host='0.0.0.0', port=8000)
