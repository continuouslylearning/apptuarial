const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const Policies = require('../models/policy');
const Claims = require('../models/claim');
const users = require('../seed/users');
const policies = require('../seed/policies');
const claims = require('../seed/claims');
const { JWT_SECRET } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const app = require('../index');
const expect = chai.expect;
const ObjectId = require('mongoose').Types.ObjectId;
chai.use(chaiHttp);

describe('Claims API', function(){
  let user;
  let userId;
  let token;

  before(function(){
    this.timeout(5000);
    return dbConnect()
      .then(() => {
        return Promise.all([Users.deleteMany(), Policies.deleteMany(), Claims.deleteMany()]);
      });
  });

  beforeEach(function(){
    this.timeout(5000);
    return Promise.all([Users.insertMany(users), Policies.insertMany(policies), Claims.insertMany(claims)])
      .then(([users]) => {
        user = users[0];
        userId = user.id;
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function(){
    return Promise.all([Users.deleteMany(), Policies.deleteMany(), Claims.deleteMany()]);
  });

  after(function(){
    return dbDisconnect();
  });

  describe('GET Claims', function(){

    it('should return an array of claims', function(){
      let res;
      return chai.request(app)
        .get('/api/claims')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          
          return Claims.find({ userId });
        })
        .then(claims => {
          expect(res.body.length).to.be.at.least(1);
          expect(claims.length).to.equal(res.body.length);
        });
    });

    it('should return 401 when JWT is not provided', function(){

      return chai.request(app)
        .get('/api/claims')
        .then(res => {
          expect(res).to.have.status(401);
        });

    });

  });

  describe('GET claim by ID', function(){

    it('should return the correct claim', function(){

      let claim;
      let id;
      return Claims.findOne({ userId })
        .then(_claim => {
          claim = _claim;
          id = claim.id;

          return chai.request(app)
            .get(`/api/claims/${id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(claim.id).to.deep.equal(id);
          expect(claim.accidentDate).to.deep.equal(new Date(res.body.accidentDate));
          expect(claim.caseReserve).to.equal(res.body.caseReserve);
          expect(claim.paidLoss).to.equal(res.body.paidLoss);
        });
    });

    it('should return 401 when JWT isnt provided', function(){

      let id;
      return Claims.findOne({ userId })
        .then(claim => {
          id = claim.id;
          return chai.request(app)
            .get(`/api/claims/${id}`);
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
    });

    it('should return 404 when ID is invalid', function(){
      const invalidId = 'DOESNOTEXIST';

      return chai.request(app)
        .get(`/api/claims/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('POST claim', function(){

    it('should insert claim into collection', function(){

      const newClaim = {
        accidentDate: new Date(),
        caseReserve: 1000
      };
      
      return Policies.findOne({ userId })
        .then(policy => {
          const policyId = policy.id;
          newClaim.policyId = policyId;
          
          return chai.request(app)
            .post('/api/claims')
            .send(newClaim)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.include.keys(['accidentDate', 'caseReserve', 'paidLoss']);
          expect(new Date(res.body.accidentDate)).to.deep.equal(newClaim.accidentDate);
          expect(res.body.caseReserve).to.equal(newClaim.caseReserve);
          
          return Claims.findOne({ _id: res.body.id, userId });
        })
        .then(claim => {
          expect(claim.userId).to.deep.equal(ObjectId(userId));
          expect(claim.policyId).to.deep.equal(ObjectId(newClaim.policyId));
          expect(claim.accidentDate).to.deep.equal(newClaim.accidentDate);
          expect(claim.caseReserve).to.equal(newClaim.caseReserve);
        });
    });
    
    it('should return 401 when JWT is missing', function(){
      
      const newClaim = {
        accidentDate: new Date(),
        caseReserve: 1000
      };
      
      return Policies.findOne({ userId })
        .then(policy => {
          const policyId = policy.id;
          newClaim.policyId = policyId;
          
          return chai.request(app)
            .post('/api/claims')
            .send(newClaim);
        })
        .then(res => {
          expect(res).to.have.status(401);
        });
    });

    it('should return 400 when policy id is missing', function(){

      const newClaim = {
        accidentDate: new Date(),
        caseReserve: 1000
      };

      return chai.request(app)
        .post('/api/claims')
        .send(newClaim)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should return 400 when accident date is missing', function(){

      const newClaim = {
        caseReserve: 1000
      };

      return Policies.findOne({ userId })
        .then(policy => {
          const policyId = policy.id;
          newClaim.policyId = policyId;
          
          return chai.request(app)
            .post('/api/claims')
            .set('Authorization', `Bearer ${token}`)
            .send(newClaim);
        })
        .then(res => {
          expect(res).to.have.status(400);
        });

    });

    it('should return 400 when case reserve is missing', function(){

      const newClaim = {
        accidentDate: new Date()
      };

      return Policies.findOne({ userId })
        .then(policy => {
          const policyId = policy.id;
          newClaim.policyId = policyId;
          
          return chai.request(app)
            .post('/api/claims')
            .set('Authorization', `Bearer ${token}`)
            .send(newClaim);
        })
        .then(res => {
          expect(res).to.have.status(400);
        });

    });

  });

  describe('PUT claim', function(){


  });

  describe('DELETE claim', function(){

    it('should remove claim from collection', function(){

      let id;
      return Claims.findOne({ userId })
        .then(claim => {
          id = claim.id;
          return chai.request(app)
            .delete(`/api/claims/${id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Claims.findOne({ _id: id, userId });
        })
        .then(claim => {
          expect(claim).to.be.null;
        });
    });

    it('should return 401 when JWT isnt provided', function(){

      return Claims.findOne({ userId })
        .then(claim => {
          const id = claim.id;
          return chai.request(app)
            .delete(`/api/claims/${id}`);
        })
        .then(res => {
          expect(res).to.have.status(401);
        });

    });

    it('should return 404 when id does not exist', function(){
      const invalidId = 'DOESNOTEXIST';

      return chai.request(app)
        .delete(`/api/claims/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });

    });

    it('should return 400 when id is not valid', function(){

      const invalidId = 'INVALIDID';

      return chai.request(app)
        .delete(`/api/claims/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
        });

    });
  });
});