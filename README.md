# ZZZ



pip install fastapi uvicorn pymysql sqlalchemy cryptography


LOCAL_DB_HOST=""
LOCAL_DB_PORT="3306"
LOCAL_DB_USER=""
LOCAL_DB_PASSWORD=""
LOCAL_DB_NAME=""


REMOTE_DB_HOST=""
REMOTE_DB_PORT="3307"
REMOTE_DB_USER=""
REMOTE_DB_PASSWORD=""
REMOTE_DB_NAME=""


add these in .env file in backend

run these to host the webpage on linux

uvicorn main:app --host 0.0.0.0 --port 8001

BROWSER=none PORT=3001 npm run start


in frontend folder, create .env file with this
REACT_APP_API_URL=http://127.0.0.1:8001