const cors = require('../cors');
const express = require('express');
const addPrivilegeRouter = express.Router();
addPrivilegeRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
});
module.exports = addPrivilegeRouter;