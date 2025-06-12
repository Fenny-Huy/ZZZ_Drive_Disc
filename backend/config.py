from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    local_db_host: str = Field(..., env='LOCAL_DB_HOST')
    local_db_port: int = Field(..., env='LOCAL_DB_PORT')
    local_db_user: str = Field(..., env='LOCAL_DB_USER')
    local_db_password: str = Field(..., env='LOCAL_DB_PASSWORD')
    local_db_name: str = Field(..., env='LOCAL_DB_NAME')


    remote_db_host: str = Field(..., env='REMOTE_DB_HOST')
    remote_db_port: int = Field(..., env='REMOTE_DB_PORT')
    remote_db_user: str = Field(..., env='REMOTE_DB_USER')
    remote_db_password: str = Field(..., env='REMOTE_DB_PASSWORD')
    remote_db_name: str = Field(..., env='REMOTE_DB_NAME')

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

settings = Settings()