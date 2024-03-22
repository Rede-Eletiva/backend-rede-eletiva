import { DisciplineControllers } from "../controllers/disciplineController.js";
import { authService } from "../middlewares/authService.js";

export async function discplineRoutes(app) {
  const disciplineControllers = new DisciplineControllers();

  app.get(
    "/list-electives",
    { preHandler: authService.authenticateRequest },
    async (request, response) => {
      try {
        await disciplineControllers.index(request, response, request.data);
      } catch (error) {
        console.error("Erro na rota:", error);
        response
          .status(500)
          .send({ success: false, message: "Erro interno do servidor." });
      }
    }
  );
}
