const chai = require('chai');
const chaiHttp = require('chai-http');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const Users = require('../models/user');
const users = require('../seed/users');
const expect = chai.expect;
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);
const app = require('../index');

describe('POST User endpoint', function(){

  before(function(){
    return dbConnect();
  });

  beforeEach(function(){
    return Users.insertMany(users);
  });

  afterEach(function(){
    return Users.deleteMany({});
  });

  after(function(){
    return dbDisconnect();
  });

  it('should create a new user', function(){
    const newUser = {
      username: 'testusername',
      password: 'testpassword'
    };

    return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(res => {
        expect(res).to.have.status(201);
        const id = res.body.id;

        return Users.findOne({ _id: id });
      })
      .then(user => {
        expect(user.username).to.equal(newUser.username);
        return bcrypt.compare(newUser.password, user.password);
      })
      .then(isValid => {
        expect(isValid).to.be.true;
      });
  });

  it('should return 422 when username has whitespace', function(){

    const newUser = {
      username: ' testusername',
      password: 'testpassword'
    };

    return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(res => {
        expect(res).to.have.status(422);
      });
  });

  it('should return 422 when password is less than 6 characters', function(){

    const newUser = {
      username: 'testusername',
      password: 'testpa'
    };

    return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(res => {
        expect(res).to.have.status(422);
      });
  });

  it('should return 422 when password is missing', function(){
    const newUser = {
      username: 'testusername'
    };

    return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(res => {
        expect(res).have.status(422);
      });
  });

  it('should return 422 when username is missing', function(){
    const newUser = {
      password: 'testpassword'
    };

    return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(res => {
        expect(res).have.status(422);
      });
  });

});