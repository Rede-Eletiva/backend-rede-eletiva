import { DiciplineModel } from "../models/disciplineModel.js";

export class DisciplineControllers {
  constructor() {
    this.disciplineModel = new DiciplineModel();
  }
  async index(request, response, studentData) {
    try {
      const discplineClasse = await this.disciplineModel.findDiciplinesClasse(
        studentData.module
      );
      response.status(200).send(discplineClasse);
    } catch (error) {
      console.log(error.message);
    }
  }
}
