import { DiciplineModel } from "../models/disciplineModel.js";

export class ElectivesController {
  constructor() {
    this.disciplineModel = new DiciplineModel();
  }

  async getAllElectives(request, response) {
    try {
      const allElectives = await this.disciplineModel.findDiciplinesClasse(
        null
      );
      response.status(200).send(allElectives);
    } catch (error) {
      console.log(error.message);
    }
  }

  async create(request, response) {
    try {
      const data = request.body;
      await this.disciplineModel.registerElectives(data);

      response.status(201);
    } catch (error) {
      response.status(500).send({
        message: error.message,
      });
    }
  }

  async updateElective(request, response) {
    try {
      const { code_elective } = request.params;
      const data = request.body;

      await this.disciplineModel.update(code_elective, data);

      response.status(204);
    } catch (error) {
      response.status(500).send({
        message: error.message,
      });
    }
  }

  async deleteElective(request, response) {
    try {
      const { code_elective } = request.params;
      console.log(code_elective);
      await this.disciplineModel.delete(code_elective);

      response.status(204).send(); 
    } catch (error) {
      response.status(500).send({
        message: error.message,
      });
    }
  }
}
