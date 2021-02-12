const { Tail } = require("tail");
const path = require("path");
const LiveSplitClient = require("livesplit-client");
require("dotenv").config();

const file = path.resolve(process.env.FILE_PATH);

(async () => {
	try {
		// Initialize client with LiveSplit Server's IP:PORT
		const client = new LiveSplitClient("127.0.0.1:16834");
		const tail = new Tail(file);

		// Connected event
		client.on("connected", () => {
			console.log("Connected!");
		});

		// Disconnected event
		client.on("disconnected", () => {
			console.log("Disconnected!");
		});

		// Raw data reciever
		client.on("data", (data) => {
			console.log("Debug data:", data);
		});

		// Some async sleep sugar for this example
		// const sleep = ((time) => new Promise((r) => {
		// 	setTimeout(() => r(), time);
		// }));

		await client.connect();

		tail.watch();

		tail.on("line", async (data) => {
			console.log(data);
			await client.startOrSplit();
		});

		tail.on("error", (error) => {
			console.error(error);
		});

		// Job done, now we can close this connection
		// client.disconnect();
	} catch (err) {
		console.error(err); // Something went wrong
	}
})();
