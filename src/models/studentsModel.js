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
    
      const [{ frame }] = await sql`SELECT frame from electives WHERE code_elective = ${code_elective}`;

     const verifySelection = await this.isEnrolledInElective(ra, frame);

     if(!verifySelection) {
        await sql`INSERT INTO choice_electives (ra, code_elective, frame) VALUES (${ra}, ${code_elective}, ${frame})`
     } else {
        await sql`UPDATE choice_electives SET code_elective = ${code_elective} WHERE ra = ${ra} AND frame = ${frame}`; 
     }
    } catch (error) {
      console.log(error.message);
    }
  }
  async isEnrolledInElective(ra, frame) {
    const verifyStudent = await sql`
    SELECT COUNT(*) AS count
    FROM choice_electives AS ce 
    INNER JOIN electives AS e ON ce.code_elective = e.code_elective
    WHERE ce.ra = ${ra} AND
    e.frame = ${frame};
  `;

  return verifyStudent[0].count > 0;
  }

  async getStudent(ra) {
    try {

      const student = await sql`SELECT * FROM students WHERE ra = ${ra}`;

      const { module } = student[0]

      const electives = await sql`SELECT DISTINCT frame, code_elective FROM electives WHERE module = ${module}`;
  
      student[0].electives = {};
  
      if (electives && electives.length > 0) {
        electives.forEach((e) => {
          student[0].electives[e.frame] = e.code_elective;
        });
      } else {
        electives.forEach((e) => {
          student[0].electives[e.frame] = "";
        });
      }

      return student;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  
}
