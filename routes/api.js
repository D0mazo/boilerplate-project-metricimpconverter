'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

// in-memory issue storage
const issues = {};

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  // Metric–imperial converter route
  app.route('/api/convert')
    .get((req, res) => {
      const input = req.query.input;
      if (!input) {
        return res.json({ error: 'invalid input' });
      }
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);
      if (initNum === 'invalid number' && initUnit === 'invalid unit') {
        return res.json({ error: 'invalid number and unit' });
      }
      if (initNum === 'invalid number') {
        return res.json({ error: 'invalid number' });
      }
      if (initUnit === 'invalid unit') {
        return res.json({ error: 'invalid unit' });
      }
      const returnNum = convertHandler.convert(initNum, initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      res.json({ initNum, initUnit, returnNum, returnUnit, string });
    });

  // Issue tracker route
  app.route('/api/issues/:project')
    .get((req, res) => {
      const { project } = req.params;
      const filters = req.query;
      let projectIssues = issues[project] || [];
      Object.keys(filters).forEach(key => {
        projectIssues = projectIssues.filter(issue => issue[key] == filters[key]);
      });
      res.json(projectIssues);
    })
    .post((req, res) => {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      const _id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        _id
      };
      if (!issues[project]) issues[project] = [];
      issues[project].push(newIssue);
      res.json(newIssue);
    })
    .put((req, res) => {
      const { project } = req.params;
      const { _id, ...fields } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });
      if (Object.keys(fields).filter(k => fields[k]).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
      const projectIssues = issues[project] || [];
      const issue = projectIssues.find(i => i._id === _id);
      if (!issue) return res.json({ error: 'could not update', _id });
      Object.keys(fields).forEach(key => {
        if (fields[key]) issue[key] = fields[key];
      });
      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id });
    })
    .delete((req, res) => {
      const { project } = req.params;
      const { _id } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });
      const projectIssues = issues[project] || [];
      const index = projectIssues.findIndex(i => i._id === _id);
      if (index === -1) return res.json({ error: 'could not delete', _id });
      projectIssues.splice(index, 1);
      res.json({ result: 'successfully deleted', _id });
    });
};
