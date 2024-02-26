import { StudentsModel } from "../models/studentsModel.js";
import { DiciplineModel } from "../models/disciplineModel.js";
import { authService } from "../middlewares/authService.js";

class StudentsController {
  constructor() {
    this.studentsModel = new StudentsModel();
    this.disciplineModel = new DiciplineModel();
  }

  async studentAuth(request, response) {
    const { ra, date_birth } = request.body;

    try {
      const student = await this.studentsModel.validateStudents(ra, date_birth);

      if (student.length > 0) {
        const token = await authService.generateToken({
          student_ra: student[0].ra,
          reference_classe: student[0].reference_classe,
          code_elective: student[0].code_elective,
        });

        response.status(200).send({
          success: true,
          message: "Aluno validado com sucesso.",
          data: student,
          token,
        });
      } else {
        response.status(401).send({
          success: false,
          message:
            "Credenciais inválidas. Verifique seu RA e data de nascimento.",
        });
      }
    } catch (error) {
      console.error("Erro ao validar aluno:", error);
      response.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  }

  async studenSelectionDiscipline(request, response, data) {
    try {
      const { code_elective } = request.body

      const checkVacancies =
      await this.disciplineModel.checkVacanciesDiscipline(code_elective, data);
      
      if (checkVacancies) {
        const selected = await this.studentsModel.registerDiscipline(
          data.student_ra,
          code_elective
          );
        response.status(200).send(selected);

      } else {
        response.status(401).send({
          success: false,
          message: 'Não há vagas disponíveis para a disciplina.',
        });
      }

    } catch (error) {
      console.error("Erro na rota:", error);
      response
        .status(500)
        .send({ success: false, message: "Erro interno do servidor." });
    }
  }

  async dataStudent(request, response, ra) {
    try {
      const student = await this.studentsModel.getStudent(ra);

      response.status(200).send(student);
    } catch(error) {
      console.log(error.message);
    }
  }
}

export default StudentsController;
