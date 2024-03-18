import { AdministratorController } from "../controllers/administratorController.js";
import { ElectivesController } from "../controllers/electivesContrroller.js";
import StudentsController from "../controllers/studentsController.js";

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

  app.put("/update-elective/:code_elective", async (request, reply) => {
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

  app.delete("/delete-elective/:code_elective", async (request, reply) => {
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

  app.post('/add-student', async(request, reply) => {
    try {
      
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  })

  app.post('/list-students',  async(request, reply) => {
    try {
      await studentsController.getAllStudents(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.post('/add-students',  async(request, reply) => {
    try {
      await studentsController.addStudents(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  });

  app.get('/download-excel', async(request, reply) => {
    try {
      await studentsController.downloadExcel(request, reply);
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  })

}
