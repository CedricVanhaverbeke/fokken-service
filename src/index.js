import gameSocket from "./socket";

require("dotenv").config();

const port = process.env.PORT;
gameSocket(port);
