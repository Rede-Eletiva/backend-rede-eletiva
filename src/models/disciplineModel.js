import sql from "../config/db.js";

export class DiciplineModel {
  async findDiciplinesClasse(module) {
    const disciplinesClasse = await sql`
    SELECT 
      e.code_elective,
      e.name AS name_elective,
      e.name_teacher,
      e.number_vacancies AS total_vacancies,
      COUNT(s.ra) AS filled_vacancies,
      e.number_vacancies - COUNT(s.ra) AS available_vacancies,
      e.frame
    FROM 
      electives e
    LEFT JOIN 
      choice_electives AS ce
        ON ce.code_elective = e.code_elective
    LEFT JOIN
      students AS s
        ON s.ra = ce.ra
    WHERE 
      e.module = ${module}
    GROUP BY 
      e.code_elective, e.name, e.number_vacancies
    ORDER BY 
      CASE 
        WHEN e.frame = 'segunda-feira' THEN 1
        WHEN e.frame = 'terça-feira' THEN 2
        WHEN e.frame = 'quarta-feira' THEN 3
        WHEN e.frame = 'quinta-feira' THEN 4
        WHEN e.frame = 'sexta-feira' THEN 5
      END`;

    return disciplinesClasse;
  }

  async checkVacanciesDiscipline(code_elective, data) {
    
    const disciplines = await this.findDiciplinesClasse(data.module);

    const findDisciplineSelect = disciplines.find(
      (result) => result.code_elective === code_elective
    );

    if (findDisciplineSelect) {
      return findDisciplineSelect.available_vacancies > 0;
    } else {
      return false;
    }
  }
}
