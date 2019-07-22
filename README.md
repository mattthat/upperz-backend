# upperz-backend

### setup

```
$ git clone https://github.com/tadalabs/upperz-backend
$ cd upperz-backend
$ npm install
$ npm run build:api
$ npm run run:api

```

### testing

```
$ curl -s http://localhost:8080/ | jq
  {
    "status": "OK"
  }
```

### use

Import the Postman collection in resources/postman:

![upperz-backend Demo](postman.png?raw=true "upperz-backend")