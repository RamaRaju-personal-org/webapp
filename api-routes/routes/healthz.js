const express = require("express");
const router = express.Router();
const sequelize = require("../../models/sequelize");
const checkPayload = require("../../middleware/checkPayload");
const checkQueryParams = require("../../middleware/checkQueryParams");

router.head("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.get("/", checkQueryParams, checkPayload, async (req, res) => {
    try {
        await sequelize.authenticate();
        res.setHeader('cache-control', 'no-cache');
        res.status(200).end(); // Ends the response without sending any data
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(503).end(); // Ends the response without sending any data
    }
});

router.post("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.put("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.delete("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.patch("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.options("/", (req, res) => {
    res.status(405).end(); // Ends the response without sending any data
});

router.all('*', (req, res) => {
    res.status(404).end(); // Ends the response without sending any data
});

module.exports = router;
