const chai = require('chai');
const chaiHttp = require('chai-http');
const Policies = require('../models/policy');
const Claims = require('../models/claim');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const { JWT_SECRET } = require('../config');
const users = require('../seed/users');
const policies = require('../seed/policies');
const claims = require('../seed/claims');
const app = require('../index');
const expect = chai.expect;
const ObjectId = require('mongoose').Types.ObjectId;

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
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(policy.id);
        });

    });

    it('should return 404 if id is non-existent', function(){
      const nonexistentId = 'DOESNOTEXIST';

      return chai.request(app)
        .get(`/api/policies/${nonexistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
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

  describe('POST Policy', function(){

    it('should insert new policy into collection', function(){

      const newPolicy = {
        effectiveDate: new Date(),
        expirationDate: new Date(10, 0, 1),
        premium: 1000,
        exposures: 1
      };

      let id;
      let userId;
      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.include.keys('id', 'effectiveDate', 'expirationDate', 'premium', 'exposures');
          expect(new Date(res.body.effectiveDate)).to.deep.equal(newPolicy.effectiveDate);
          expect(new Date(res.body.expirationDate)).to.deep.equal(newPolicy.expirationDate);
          expect(res.body.premium).to.equal(newPolicy.premium);
          expect(res.body.exposures).to.equal(newPolicy.exposures);

          id = res.body.id;
          userId = res.body.userId;
          return Policies.findOne({ _id: id, userId });
        })
        .then(policy => {
          // expect(policy).to.contain.keys(['id', 'effectiveDate', 'expirationDate', 'premium', 'exposures']);
          expect(policy.effectiveDate).to.deep.equal(newPolicy.effectiveDate);
          expect(policy.expirationDate).to.deep.equal(newPolicy.expirationDate);
          expect(policy.premium).to.equal(newPolicy.premium);
          expect(policy.exposures).to.equal(newPolicy.exposures);
          expect(policy.userId).to.deep.equal(ObjectId(userId));
          expect(policy.id).to.equal(id);
        });

    });

    it('should return 422 when premium is too low', function(){

      const newPolicy = {
        effectiveDate: new Date(),
        expirationDate: new Date(10, 0, 1),
        premium: -1000,
        exposures: 1
      };
      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(422);
        });

    });

    it('should return 400 when effective date is missing', function(){

      const newPolicy = {
        expirationDate: new Date(10, 0, 10),
        premium: 1000,
        exposures: 1
      };

      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        });

    });

    it('should return 400 when expiration date is missing', function(){
      const newPolicy = {
        effectiveDate: new Date(),
        premium: 1000,
        exposures: 1
      };

      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should return 400 when premium field is missing', function(){
      const newPolicy = {
        effectiveDate: new Date(),
        expirationDate: new Date(10, 0, 1),
        exposures: 1
      };

      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should return 401 when JWT is not provided', function(){
      const newPolicy = {
        expirationDate: new Date(10, 0, 10),
        premium: 1000,
        exposures: 1
      };

      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .then(res => {
          expect(res).to.have.status(401);
        });

    });

    it('should set exposure to 1 if exposure is not provided', function(){

      const newPolicy = {
        effectiveDate: new Date(),
        expirationDate: new Date(10, 0, 1),
        premium: 1000
      };

      return chai.request(app)
        .post('/api/policies')
        .send(newPolicy)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.exposures).to.equal(1);
        });

    });
  });

  describe('DELETE policy', function(){

    beforeEach(function(){
      return Claims.insertMany(claims);
    });

    it('should remove document from collection', function(){

      let id;
      return Policies.findOne({ userId })
        .then(policy => {
          id = policy.id;

          return chai.request(app)
            .delete(`/api/policies/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
              expect(res).to.have.status(204);

              return Promise.all([Policies.findOne({ _id: id, userId }), Claims.find({ policyId: id})]);
            })
            .then(([policy, claims]) => {
              expect(policy).to.be.null;
              expect(claims).to.have.length(0);
            });
        });
    });

    it('should return 404 if id does not exist', function(){
      const nonexistentId = 'DOESNOTEXIST';

      return chai.request(app)
        .delete(`/api/policies/${nonexistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });

    });

    it('should return 401 if JWT is not provided', function(){

      let id;
      return Policies.findOne({ userId })
        .then(policy => {
          id = policy.id;

          return chai.request(app)
            .delete(`/api/policies/${id}`)
            .then(res => {
              expect(res).to.have.status(401);
            });
        });

    });

  });
});