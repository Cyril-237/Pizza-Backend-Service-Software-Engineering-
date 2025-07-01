import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = 'postgresql+psycopg://' \
               + os.environ['DATABASE_USERNAME'] + ':' \
               + os.environ['DATABASE_PASSWORD'] + '@' \
               + os.environ['DATABASE_HOST'] + '/' \
               + os.environ['DATABASE_NAME']
db_engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
