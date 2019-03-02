const publisherDb = require('../repositories/PublisherDb');
const jwtHelper = require('../helpers/JwtHelper');
const logHelper = require('../helpers/LogHelper');


exports.getAll = async function (req, res, next) {
    let publishers = await publisherDb.getAll();
    res.json(publishers);
};

exports.getPublishers = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null) {
        let {email} = authData;
        let publishers = await publisherDb.getPublishers(email);
        await logHelper.createLog(req, email, "crud");
        res.json(publishers);
    } else {
        res.sendStatus(403);
    }
};

exports.getPublisher = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null) {
        let name = req.params.publishername;
        let {email} = authData;
        let publisher = await publisherDb.getPublisher(email, name);
        if(publisher === null) {
            await logHelper.createLog(req, email, "publisher");
        }
        res.json(publisher);
    } else {
        res.sendStatus(403);
    }
};

exports.getPublisherById = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null) {
        let id = req.params.id;
        let publisher = await publisherDb.getPublisherById(id);
        if(publisher === null) {
            await logHelper.createLog(req, authData.email, "publisher");
        }
        res.json(publisher);
    } else {
        res.sendStatus(403);
    }
};


exports.createPublisher = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null) {
        let {email} = authData;
        let newPublisher = await publisherDb.createPublisher(req.body, email);
        await logHelper.createLog(req, email, "crud");
        return res.status(200).send({message: newPublisher.name+' added'});
    } else {
        res.sendStatus(403);
    }
};

exports.deletePublisher = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null) {
        let {email} = authData;
        let name = req.params.publishername;
        await publisherDb.deletePublisher(email,name);
        await logHelper.createLog(req, email, "crud");
        res.sendStatus(200);
    }
    else {
        res.sendStatus(403);
    }
};

exports.deletePublisherById = async function (req, res, next) {
    const authData = await jwtHelper.decodeToken(req, res);
    if (authData !== null && authData.role === "admin") {
        let {email} = authData;
        let id = req.body.id;
        let deletedConsole = await publisherDb.deletePublisherById(id);
        await logHelper.createLog(req, email, "crud");
        res.sendStatus(200);
    }
    if (authData !== null &&  authData.role === "user") {
        let {email} = authData;
        let id = req.body.id;
        let hasConsoleWithEmail = await publisherDb.getPublisherByEmailandId(email, id);
        if(hasConsoleWithEmail) {
            await publisherDb.deletePublisherById(id);
            await logHelper.createLog(req,email, "crud");
            res.sendStatus(200);
        } else {
            res.sendStatus(200);
        }
    }
    else {
        res.sendStatus(403);
    }
};
