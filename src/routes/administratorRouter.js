import { AdministratorController } from "../controllers/administratorController.js";
import { ElectivesController } from "../controllers/electivesContrroller.js";

export async function administratorRouter(app) {
  const administratorController = new AdministratorController();
  const electivesController = new ElectivesController();

  app.post("/login", async (request, reply) => {
    try {
      await administratorController.adminitratoAuth(request, reply);
    } catch (error) {
      console.error("Erro durante a validação do aluno:", error);
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.post("/create-elective", async (request, reply) => {
    try {
      await electivesController.create(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.get("/list-electives", async (request, reply) => {
    try {
      await electivesController.getAllElectives(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.put("/update-electives/:code_elective", async (request, reply) => {
    try {
      await electivesController.updateElective(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.delete("/delete-electives/:code_elective", async (request, reply) => {
    try {
      await electivesController.deleteElective(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });
}
