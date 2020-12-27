import gameSocket from "./socket";
import { config as setupEnvVariables } from "dotenv";

setupEnvVariables();

const port = process.env.PORT;
gameSocket(port);
