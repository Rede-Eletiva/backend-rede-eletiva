import sql from "../config/db.js";

export class AdministratorModel {
  async validadteAdministrator(email, password) {
    try {
      return await sql`
            SELECT 
                id, email 
            FROM 
                administrators 
            WHERE 
                email = ${email} AND password = ${password}`;
    } catch (error) {
        console.log(error.message);
    }
  }
}
