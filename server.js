"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var common_1 = import("@angular/common");
var ssr_1 = require("@angular/ssr");
var express = require("express");
var bodyParser = require("body-parser");
var path_1 = require("path");
var bootstrap = require('./src/main.server');
// The Express app is exported so that it can be used by serverless Functions.
function app() {
    var server = express();
    var serverDistFolder = path_1.dirname(__filename);
    var browserDistFolder = path_1.resolve(serverDistFolder, '../browser');
    var indexHtml = path_1.join(serverDistFolder, 'index.server.html');
    var commonEngine = new ssr_1.CommonEngine();
    server.set('view engine', 'html');
    server.set('views', browserDistFolder);
    server.use(bodyParser.json());
    // Serve static files from /browser
    server.get('*.*', express.static(browserDistFolder, {
        maxAge: '1y'
    }));
    // Endpoint to create a new order
    server.post('/api/create-order', function (req, res) {
        var _a = req.body, amount = _a.amount, currency = _a.currency, receipt = _a.receipt, notes = _a.notes;
        var options = {
            amount: amount, // amount in the smallest currency unit
            currency: currency,
            receipt: receipt,
            notes: notes,
        };
        // Create an order using Razorpay API
        (0, import('razorpay')).then(function (Razorpay) {
            var razorpayKey = 'YOUR_RAZORPAY_KEY'; // Replace with your actual Razorpay key
            var razorpaySecret = 'YOUR_RAZORPAY_SECRET'; // Replace with your actual Razorpay secret
            var razorpay = new Razorpay.default({
                key_id: razorpayKey,
                key_secret: razorpaySecret,
            });
            razorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to create order' });
                }
                else {
                    res.status(200).json(order);
                }
            });
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to initialize Razorpay' });
        });
    });
    // All regular routes use the Angular engine
    server.get('*', function (req, res, next) {
        var protocol = req.protocol, originalUrl = req.originalUrl, baseUrl = req.baseUrl, headers = req.headers;
        commonEngine
            .render({
            bootstrap: bootstrap,
            documentFilePath: indexHtml,
            url: protocol + "://" + headers.host + originalUrl,
            publicPath: browserDistFolder,
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: baseUrl }],
        })
            .then(function (html) { return res.send(html); })
            .catch(function (err) { return next(err); });
    });
    return server;
}
exports.app = app;
function run() {
    var port = process.env.PORT || 3000;
    // Start up the Node server
    var server = app();
    server.listen(port, function () {
        console.log("Node Express server listening on http://localhost:" + port);
    });
}
run();
