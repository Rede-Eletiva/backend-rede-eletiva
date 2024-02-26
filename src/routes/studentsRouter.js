import { authService } from "../middlewares/authService.js";
import StudentsController from "../controllers/studentsController.js";
import { StudentsModel } from "../models/studentsModel.js";

export async function studentsRouter(app) {
  const studentsController = new StudentsController();
  const studentsModel = new StudentsModel();
  app.post("/login", async (request, reply) => {
    try {
      await studentsController.studentAuth(request, reply);
    } catch (error) {
      console.error("Erro durante a validação do aluno:", error);
      reply
        .status(500)
        .send({ success: false, message: "Erro interno do servidor." });
    }
  });

  app.post(
    "/register",
    { preHandler: authService.authenticateRequest },
    async (request, reply) => {
      await studentsController.studenSelectionDiscipline(request, reply, request.student);
    }
  );
  
  app.get("/dataStudent", { preHandler: authService.authenticateRequest }, 
  async (request, reply) => {
    await studentsController.dataStudent(request, reply, request.student.student_ra);
  })
}
