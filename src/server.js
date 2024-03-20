import fastify from "fastify";
import fileUpload from "fastify-file-upload";
import { studentsRouter } from "./routes/studentsRouter.js";
import { discplineRoutes } from "./routes/disciplineRouter.js";
import { administratorRouter } from "./routes/administratorRouter.js";
import cors from "@fastify/cors";


const app = fastify();

app.register(fileUpload);
app.register(studentsRouter, { prefix: '/api/v1/students' });
app.register(discplineRoutes, { prefix: '/api/v1/discipline' });
app.register(administratorRouter, { prefix: '/api/v1/administrator' });

app.register(cors, { origin: "*" });

app.listen(
  { port: process.env.PORT || 3000, host: process.env.HOST || "0.0.0.0" },
  (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log(
      `server listening on http://localhost:${app.server.address().port}`
    );
  }
);
