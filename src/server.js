import fastify from "fastify";
import { studentsRouter } from "./routes/studentsRouter.js";
import { discplineRoutes } from "./routes/disciplineRouter.js";

const app = fastify();

app.register(studentsRouter, { prefix: '/api/v1/students' });
app.register(discplineRoutes, { prefix: '/api/v1/discipline' });

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
