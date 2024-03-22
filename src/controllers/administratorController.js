import { authService } from "../middlewares/authService.js";
import { AdministratorModel } from "../models/administratorModel.js";

export class AdministratorController {
  constructor() {
    this.administratorModel = new AdministratorModel();
  }

  async adminitratoAuth(request, response) {
    const { email, password } = request.body;

    const validation = await this.administratorModel.validadteAdministrator(
      email,
      password
    );
    const token = await authService.generateToken({
      id: email
    });

    if (validation.length > 0) {
      response.status(200).send({
        success: true,
        message: "Validado com sucesso.",
        data: validation,
        token
      });
    } else {
      response.status(401).send({
        success: false,
        message:
          "Credenciais inválidas. Verifique se os campos informados estão corretos.",
      });
    }
  }
}
