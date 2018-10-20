const chai = require('chai');
const chaiHttp = require('chai-http');
const Policies = require('../models/policy');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const { JWT_SECRET } = require('../config');
const users = require('../seed/users');
const policies = require('../seed/policies');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Policies API', function(){

  let token;
  let user;
  let userId;

  before(function(){
    this.timeout(5000);
    return dbConnect()
      .then(() => Promise.all([Users.deleteMany(), Policies.deleteMany()]));
  });

  beforeEach(function(){
    this.timeout(5000);
    return Promise.all([Users.insertMany(users), Policies.insertMany(policies)])
      .then(([users]) => {
        user = users[0];
        userId = user.id;
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function(){
    return Promise.all([Users.deleteMany(), Policies.deleteMany()]);
  });

  after(function(){
    return dbDisconnect();
  });

  describe('GET Policies endpoint', function(){

    it('should return an array of policies', function(){

      let res;

      return chai.request(app)
        .get('/api/policies')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(policy => {
            expect(policy).to.include.keys(['id', 'effectiveDate', 'expirationDate', 'premium', 'exposures']);
          });

          return Policies.find({ userId });
        })
        .then(results => {
          expect(results.length).to.equal(res.body.length);
        });
    
    });
    
    it('should return 401 if JWT is not provided', function(){

      return chai.request(app)
        .get('/api/policies')
        .then(res => {
          expect(res).to.have.status(401);
        });
    });

    it('should return 401 if JWT is invalid', function(){

      return chai.request(app)
        .get('/api/policies')
        .set('Authorization', 'Bearer INVALIDTOKEN')
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
  });

  describe('GET Policy by ID', function(){

    it('should return correct policy', function(){

      let policy;

      return Policies.findOne({ userId })
        .then(_policy => {
          policy = _policy;
          const id = policy.id;
          
          return chai.request(app)
            .get(`/api/policies/${id}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(policy.id);
        });

    });

    it('should return 401 when Authorization header is missing', function(){

      let policy;

      return Policies.findOne({ userId })
        .then(_policy => {
          policy = _policy;
          const id = policy.id;
          
          return chai.request(app)
            .get(`/api/policies/${id}`);
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
        
    });

    it('should return 401 when JWT is invalid', function(){

      let policy;

      return Policies.findOne({ userId })
        .then(_policy => {
          policy = _policy;
          const id = policy.id;
          
          return chai.request(app)
            .get(`/api/policies/${id}`)
            .set('Authorization', 'Bearer INVALIDTOKEN');
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
        
    });

  });
});