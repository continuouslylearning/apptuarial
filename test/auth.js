const chai = require('chai');
const chaiHttp  = require('chai-http');
const Users = require('../models/user');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const users = require('../seed/users');
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth API', function(){

  before(function(){
    this.timeout(5000);
    return dbConnect()
      .then(() => Users.deleteMany({}));
  });

  after(function(){
    return dbDisconnect();
  });

  beforeEach(function(){
    this.timeout(5000);
    return Users.insertMany(users);
  });

  afterEach(function(){
    return Users.deleteMany({});
  });

  describe('LOGIN endpoint', function(){

    it('should return a valid json web token', function(){
      const newUser = {
        username: 'testuser',
        password: 'testpassword'
      };

      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(201);
        
          return chai.request(app)
            .post('/auth/login')
            .send({ username: newUser.username, password: newUser.password });
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
          const authToken = res.body.authToken;

          return new Promise(resolve => {
            jwt.verify(authToken, JWT_SECRET, err => {
              if(err) {
                return resolve(false);
              } 
              resolve(true);
            });
          });
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it('should return 401 when the username is invalid', function(){

      const invalidInfo = {
        username: 'invalidusername',
        password: 'testpassword'
      };

      return chai.request(app)
        .post('/auth/login')
        .send(invalidInfo)
        .then(res => {
          expect(res).to.have.status(401);
        });
    });

    it('should return 401 when the password is invalid', function(){
      const newUser = {
        username: 'testusername',
        password: 'password'
      };

      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(() => {  
          return chai.request(app)
            .post('/auth/login')
            .send({ username: newUser.username, password: 'invalidusername'});
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
  });

  describe('REFRESH endpoint', function(){

    it('should return a valid JWT', function(){

      return Users.findOne({})
        .then(user => {
          const token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });

          return chai.request(app)
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
          
          const authToken = res.body.authToken;
          return new Promise( resolve => {

            jwt.verify(authToken, JWT_SECRET, err => {
              if(err){ 
                resolve(false);
              } else {
                resolve(true);
              }
            });
          })
            .then(isValid => {
              expect(isValid).to.be.true;
            });
        });
    });

    it('should return 401 when Authorization header is missing', function(){

      return chai.request(app)
        .post('/auth/refresh')
        .then(res => {
          expect(res).to.have.status(401);
        });
    });

    it('should return 401 when JWT is invalid', function(){
      return chai.request(app)
        .post('/auth/refresh')
        .set('Authorization', 'Bearer INVALIDTOKEN')
        .then(res => {
          expect(res).to.have.status(401);
        }); 
    });

    it('should return 401 when `Bearer` is missing', function(){
      return Users.findOne({})
        .then(user => {
          const token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });

          return chai.request(app)
            .post('/auth/refresh')
            .set('Authorization', `${token}`);
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
  });

});