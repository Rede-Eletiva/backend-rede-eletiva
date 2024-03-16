import { DiciplineModel } from '../models/disciplineModel.js'

export class ElectivesController {
    constructor() {
        this.disciplineModel = new DiciplineModel
    }

    async getAllElectives(request, response) {

        try {
            const allElectives = await this.disciplineModel.findDiciplinesClasse(null);

        response.status(200).send(allElectives);
        } catch (error) {
            console.log(error.message)
        }

        
    }
}