<h1 align=center>InLinked</h1>
<h5 align=center>Connecting the world's leading professionals and experts to expansive industries.</h5>

## Deployment
#### Front-end
```
$ cd in-linked 
$ npm start
```

#### Back-end
```
$ cd in-linked-backend
$ tsc && npm start
```

## Built With
* :honeybee: [Angular](https://angular.io/) - one framework for mobile and desktop
* :nose: [Node.js](https://nodejs.org/en/) - JavaScript runtime to power our application.
* :dash: [Express](https://expressjs.com/) - minimal web framework for the web.
* :speak_no_evil: [knex](https://knexjs.org/) - query builder for interfacing with the database.
* :whale: [MySQL](https://www.mysql.com/) - the database management

## Pages [Remove Later]
* Log in page (done?)
* Sign Up page (one for both enterprises & candidates)
* Profile page for enterprises (done - pictures)
* Profile page for candidates (done - pictures)
* Search page (ALMOST done)
* View jobs posted page (no progress)
* View applicants for a job page (no progress) 

## Endpoint Tasks
* Add more endpoints for different types of data.
* Add middleware to verify `acctype` accesses (like prevent candidates from tampering with jobs).
* Work with services.
* Applies perform checks based on application params (check if candidateid is candidate, etc)
