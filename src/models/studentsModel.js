import sql from "../config/db.js";

export class StudentsModel {
  async validateStudents(ra, date_birth) {
    try {
      const result = await sql`
                SELECT * FROM students WHERE ra = ${ra} AND date_birth = ${date_birth}
            `;

      return result;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async registerDiscipline(ra, code_elective) {
    try {
      console.log(ra, code_elective)
      const selectedDiscipline = await sql`UPDATE students SET code_elective = ${code_elective} WHERE ra = ${ra}`;
      console.log(selectedDiscipline)
      return selectedDiscipline;
    } catch (error) {
      console.log(error.message);
    }
  }
}
