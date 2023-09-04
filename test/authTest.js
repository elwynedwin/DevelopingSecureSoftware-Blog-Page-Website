const chai = require('chai');
const chaiHttp = require('chai-http');
const routes = require('../routes/routes')

chai.use(chaiHttp);

describe('Authentication', function () {


    it('logged in', function(){

        const req = {email: 'example@gmial.com', password: 'password'}
        const result = routes.login()
        assert.equal(result, true)
    })



  describe('/POST login', () => {
    
    it('Login user', (done) => {
      let user = {
        email: 'example@example.com',
        password: 'password123',
      };

      chai.request('http://localhost:4020') 
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          done();
        });
    });
  });


  describe('/POST register', () => {
    
    it('Register user', (done) => {
      let user = {
        userName: 'example12343',
        email: 'example@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      chai.request('http://localhost:4020') 
        .post('/api/users/register')
        .send(user)
        .end((err, res) => {
          done();
        });
    });
  });


  describe('/POST signup', () => {
    
    it('Signup user', (done) => {
      let user = {
        userName: 'example12343',
        email: 'example@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      chai.request('http://localhost:4020') 
        .post('/api/users/signup')
        .send(user)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('/POST signup', () => {
    
    it('Signup user', (done) => {
      let user = {
        userName: 'example12343',
        email: 'example@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      chai.request('http://localhost:4020') 
        .post('/api/users/signup')
        .send(user)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('/POST signup', () => {
    
    it('Signup user', (done) => {
      let user = {
        userName: 'example12343',
        email: 'example@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      chai.request('http://localhost:4020') 
        .post('/api/users/signup')
        .send(user)
        .end((err, res) => {
          done();
        });
    });
  });




});



