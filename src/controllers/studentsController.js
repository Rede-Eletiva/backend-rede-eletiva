import { StudentsModel } from "../models/studentsModel.js";
import { DiciplineModel } from "../models/disciplineModel.js";
import { authService } from "../middlewares/authService.js";

import XLSX from "xlsx";
import csv from "csvtojson";
import upload from "../services/uploadCSV.js";

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
          id: student[0].ra,
          reference_classe: student[0].reference_classe,
          module: student[0].module,
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
      console.log("Request body data:", data);
      const { code_elective } = request.body;

      if (!code_elective) {
        throw new Error("Elective code is not defined");
      }

      const checkVacancies =
        await this.disciplineModel.checkVacanciesDiscipline(
          code_elective,
          data
        );

      if (checkVacancies) {
        const selected = await this.studentsModel.registerDiscipline(
          data.id,
          code_elective,
          data.module
        );
        response.status(201).send(selected);
      } else {
        response.status(401).send({
          success: false,
          message: "Não há vagas disponíveis para a disciplina.",
        });
      }
    } catch (error) {
      console.error("Erro no controlador:", error);
      response
        .status(500)
        .send({ success: false, message: "Erro interno do servidor." });
    }
  }

  async dataStudent(request, response, ra) {
    try {
      const student = await this.studentsModel.getStudent(ra);

      response.status(200).send(student);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllStudents(request, response) {
    try {
      const allStudents = await this.studentsModel.getAllStudents();

      const filteredStudents = allStudents.filter((student) => {
        if (request.body.reference_classe[student.reference_classe]) {
          return true;
        }
        if (request.body.module[student.module]) {
          return true;
        }
        return false;
      });

      const registeredStudents = filteredStudents.filter(
        (student) => student.is_registered
      );
      const noRegisteredStudents = filteredStudents.filter(
        (student) => !student.is_registered
      );

      const registeredCount = registeredStudents.length;
      const noRegisteredCount = noRegisteredStudents.length;

      const totalStudents = filteredStudents.length;
      const registeredPercentage = (
        (registeredCount / totalStudents) *
        100
      ).toFixed(2);
      const noRegisteredPercentage = (
        (noRegisteredCount / totalStudents) *
        100
      ).toFixed(2);

      const progress = {
        registered: parseFloat(registeredPercentage),
        no_registered: parseFloat(noRegisteredPercentage),
      };

      response
        .status(200)
        .send({ progress, registeredStudents, noRegisteredStudents });
    } catch (error) {
      response.status(500).send({
        message: error.message,
      });
    }
  }

  async addStudents(request, response) {
    try {
      const data = request.body;
      await this.studentsModel.create(data);

      response.status(201);
    } catch (error) {
      response.status(500).send({
        message: error.message,
      });
    }
  }

  async downloadExcel(request, reply) {
    try {
      const data = await this.studentsModel.getAllStudents();

      const studentsData = data.map((student) => ({
        matrícula: student.ra,
        nome: student.name,
        turma: student.reference_classe,
        ano: student.module,
        eletiva: student.name_elective,
        is_registered: student.is_registered,
      }));

      const registeredStudents = studentsData
        .filter((student) => student.is_registered)
        .map(({ is_registered, ...student }) => student);

      const unregisteredStudents = studentsData
        .filter((student) => !student.is_registered)
        .map(({ is_registered, eletiva, ...student }) => student);

      const registeredWorksheet = XLSX.utils.json_to_sheet(registeredStudents);
      const unregisteredWorksheet =
        XLSX.utils.json_to_sheet(unregisteredStudents);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        registeredWorksheet,
        "Alunos Registrados"
      );

      XLSX.utils.book_append_sheet(
        workbook,
        unregisteredWorksheet,
        "Alunos Não Registrados"
      );

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      const now = new Date();
      const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      const fileName = `relatorio_rede_eletiva_${formattedDate}`;

      reply.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      reply.header(
        "Content-Disposition",
        `attachment; filename=${fileName}.xlsx`
      );

      reply.send(buffer);
    } catch (error) {
      console.error("Erro ao gerar o arquivo Excel:", error);
      reply.status(500).send({
        success: false,
        message: "Erro interno do servidor ao gerar o arquivo Excel.",
        log: error.message,
      });
    }
  }
  async uploadCSV(request, response) {
    try {
      console.log(request);
      const file = await upload(request.body.file._buf);

      const onError = (error) => {
        console.error("Erro durante a leitura do CSV:", error);
        response.status(500).send({
          success: false,
          message: "Erro durante a leitura do CSV.",
          log: error.message,
        });
      };

      const onComplete = (jsonDataArray) => {
        response.status(200).send({
          success: true,
          message: "Conversão CSV para JSON concluída com sucesso.",
          data: jsonDataArray,
        });
      };

      const processRow = async (json, jsonDataArray) => {
        const data = {
          ...json,
          module: request.body.module.value,
          reference_classe: request.body.reference_classe.value,
        };
        jsonDataArray.push(data);

        try {
          await this.studentsModel.create(data);
        } catch (error) {
          console.error(`Erro ao inserir no banco de dados: ${error.message}`);
          // Continue a execução mesmo se houver erro de inserção
        }
      };

      const jsonDataArray = [];

      await csv()
        .fromFile(file)
        .subscribe(
          (json) => processRow(json, jsonDataArray),
          onError,
          () => onComplete(jsonDataArray)
        );
    } catch (error) {
      console.error("Erro interno do servidor:", error);
      response.status(500).send({
        success: false,
        message: "Erro interno do servidor.",
        log: error.message,
      });
    }
  }

  async paramsFilterStudents(request, response) {
    const itens = await this.studentsModel.itemFilterStudents();

    response.status(200).send(itens);
  }
}
export default StudentsController;
