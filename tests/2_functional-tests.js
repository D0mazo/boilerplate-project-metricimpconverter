const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let testProject = 'apitest';
  let createdId;

  // 1. Create an issue with every field
  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({
        issue_title: 'Test issue full',
        issue_text: 'Functional test full fields',
        created_by: 'Tester',
        assigned_to: 'Dev',
        status_text: 'In QA'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Test issue full');
        assert.equal(res.body.issue_text, 'Functional test full fields');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, 'Dev');
        assert.equal(res.body.status_text, 'In QA');
        assert.property(res.body, '_id');
        createdId = res.body._id;
        done();
      });
  });

  // 2. Create an issue with only required fields
  test('Create an issue with only required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({
        issue_title: 'Test required',
        issue_text: 'Only required fields',
        created_by: 'Tester'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Test required');
        assert.equal(res.body.issue_text, 'Only required fields');
        assert.equal(res.body.created_by, 'Tester');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.property(res.body, '_id');
        done();
      });
  });

  // 3. Create an issue with missing required fields
  test('Create an issue with missing required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({
        issue_title: 'Missing fields'
        // missing issue_text & created_by
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  // 4. View issues on a project
  test('View issues on a project', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}`)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        done();
      });
  });

  // 5. View issues on a project with one filter
  test('View issues on a project with one filter', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}`)
      .query({ created_by: 'Tester' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'Tester');
        });
        done();
      });
  });

  // 6. View issues on a project with multiple filters
  test('View issues on a project with multiple filters', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}`)
      .query({ created_by: 'Tester', assigned_to: 'Dev' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'Tester');
          assert.equal(issue.assigned_to, 'Dev');
        });
        done();
      });
  });

  // 7. Update one field on an issue
  test('Update one field on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({
        _id: createdId,
        issue_text: 'Updated text'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, createdId);
        done();
      });
  });

  // 8. Update multiple fields on an issue
  test('Update multiple fields on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({
        _id: createdId,
        issue_title: 'Updated title',
        status_text: 'Resolved'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
  });

  // 9. Update an issue with missing _id
  test('Update an issue with missing _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({
        issue_title: 'No ID'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  // 10. Update an issue with no fields to update
  test('Update an issue with no fields to update', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({
        _id: createdId
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });

  // 11. Update an issue with an invalid _id
  test('Update an issue with an invalid _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({
        _id: 'invalidid12345',
        issue_title: 'Should fail'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'could not update');
        done();
      });
  });

  // 12. Delete an issue
  test('Delete an issue', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({ _id: createdId })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, createdId);
        done();
      });
  });

  // 13. Delete an issue with an invalid _id
  test('Delete an issue with an invalid _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({ _id: 'invalidid12345' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
  });

  // 14. Delete an issue with missing _id
  test('Delete an issue with missing _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
});
