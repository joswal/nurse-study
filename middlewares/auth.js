const { User } = require("../models/users");
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  forwardAuthenticated: (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return next()
    }
  },
  ensureAuthenticated: (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, process.env.secret || config.get('secret'));
      req.user = decoded;
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }
  },
  ensurePostAuthenticated: (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, process.env.secret || config.get('secret'));
      req.user = decoded;
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }
  },
  ensureAuthorized: async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, process.env.secret || config.get('secret'));
      req.user = decoded;
      if (!req.user.isAdmin) return res.status(403).send('Access denied,Unauthorized to perform this action');
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }

  },
  ensurePostAuthorized: async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, process.env.secret || config.get('secret'));
      req.user = decoded;
      if (!req.user.isAdmin) return res.status(403).send('Access denied,Unauthorized to perform this action');
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }
  }
}