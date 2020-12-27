import { createServer } from "http";
import { config as setupEnvVariables } from "dotenv";

import gameSocket from "./socket";

setupEnvVariables();

const server = createServer();
const port = process.env.PORT || 5000;

gameSocket(server, port);

server.listen(port, "0.0.0.0");
