import express from "express";
import {
    createValueTrackingClient,
    LogEvents,
} from "../../value-tracking/lib/index.mjs";

let tracker = createValueTrackingClient({
    apiKey: "KBq6q8rdE3G3aUK87t2HgJlFn60cMyYhRfiYOd9Gc08=",
    apiURL: "https://apis.konso.io",
    bucketId: "2559079c",
    appName: "test",
});

tracker.on(LogEvents.onError, (error) => console.log(error));
tracker.on(LogEvents.onSuccessful, (message) => console.log(message));

function trackerMiddleware(client) {
    if (!client) {
        throw new Error("you should provide client for value-tracking");
    }

    return function (req, res, next) {
        client.track(10, { ip: req.ip, browser: req.headers["user-agent"] });
        next();
    };
}

const app = express();
const port = 3000;

app.use(trackerMiddleware(tracker));

app.get("/", async (req, res) => {
    // await sleep(1200);
    res.send("Hello World!");
});

app.get("/get-data", async (req, res) => {
    // await sleep(Math.ceil(Math.random() + 1 * 1000))
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
