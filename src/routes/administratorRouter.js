import { AdministratorController } from "../controllers/administratorController.js";
import { ElectivesController } from "../controllers/electivesController.js";
import StudentsController from "../controllers/studentsController.js";
import { authService } from "../middlewares/authService.js";
export async function administratorRouter(app) {
  const administratorController = new AdministratorController();
  const electivesController = new ElectivesController();
  const studentsController = new StudentsController();

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

  app.post(
    "/create-elective",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await electivesController.createElective(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.get(
    "/list-electives",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await electivesController.getAllElectives(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.put(
    "/update-elective/:code_elective",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await electivesController.updateElective(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.delete(
    "/delete-elective/:code_elective",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await electivesController.deleteElective(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.post(
    "/add-student",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.post(
    "/list-students",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await studentsController.getAllStudents(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.get(
    "/itens-students",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await studentsController.paramsFilterStudents(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.post(
    "/add-students",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await studentsController.addStudents(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.get(
    "/download-excel",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      try {
        await studentsController.downloadExcel(request, reply);
      } catch (error) {
        reply.status(500).send({
          success: false,
          message: "Erro interno do servidor.",
          log: error.message,
        });
      }
    }
  );

  app.post("/upload-csv", async (request, reply) => {
    try {
      await studentsController.uploadCSV(request, reply);
    } catch (error) {
      response.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.get("/process-file", async (request, reply) => {
    try {
      await studentsController.getStatusFile(request, reply);
    } catch (error) {
      response.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });
}
