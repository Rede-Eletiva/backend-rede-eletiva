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

      const student = await sql`SELECT * FROM students  WHERE ra = ${ra}`;

      const { module } = student[0]

      const electives = await sql`SELECT DISTINCT frame, code_elective FROM electives WHERE module = ${module}`;
  
      student[0].electives = {};
  
      if (electives && electives.length > 0) {
        electives.forEach((e) => {
          student[0].electives[e.frame] = e.code_elective;
        });
      } else {
        student.forEach((e) => {
          student[0].electives  = false;
        });
      }

      return student;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllStudents() {
    try {
      const allStudents = await sql`
        SELECT 
          s.ra,
          s.name,
          s.reference_classe,
          s.module,
          e.name AS name_elective,
          CASE 
                WHEN ce.ra IS NOT NULL THEN TRUE
                ELSE FALSE
            END AS is_registered
        FROM students AS s
        LEFT JOIN choice_electives AS ce
          ON ce.ra = s.ra
        LEFT JOIN electives AS e
          ON e.code_elective = ce.code_elective
        ORDER BY s."name"
        `;

      return allStudents;

    } catch (error) {
      console.log(error.message);
    }
  }

  async create(data) {
    try {
      const { ra, name, date_birth, reference_classe, module } = data;

      return await sql`
        INSERT INTO students (ra, name, date_birth, reference_classe, module)
        VALUES (${ra}, ${name}, ${date_birth}, ${reference_classe}, ${module})
      `;
      
    } catch (error) {
      console.log(error.message);
    }
  }
  
}
