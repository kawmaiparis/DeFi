import express from "express";
import bodyParser from "body-parser";
import cdp from "./cdp";

// Set up the express app
const app = express();

const PORT = 5000;

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all todos
app.get("/api/open", cdp.open);
app.get("/api/deposit", cdp.deposit);
app.get("/api/withdraw", cdp.withdraw);
app.get("/api/payback", cdp.payback);
app.get("/api/borrow", cdp.borrow);
app.get("/api/exit", cdp.open);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
