import sql from "../config/db.js";

export class DiciplineModel {
  async findDiciplinesClasse(reference_classe) {
    return await sql`
    SELECT 
      e.code_elective,
      e.name AS name_elective,
      e.number_vacancies AS total_vacancies,
      COUNT(s.ra) AS filled_vacancies,
      e.number_vacancies - COUNT(s.ra) AS available_vacancies
    FROM 
      electives e
    LEFT JOIN 
      students s 
        ON e.code_elective = s.code_elective
    WHERE 
      e.reference_classe = ${reference_classe}
    GROUP BY 
      e.code_elective, e.name, e.number_vacancies
    ORDER BY 
      e.code_elective`;
  }

  async checkVacanciesDiscipline(code_elective, data) {
    const disciplines = await this.findDiciplinesClasse(data.reference_classe);
    
  
    const findDisciplineSelect = disciplines.find((result) => result.code_elective === code_elective);

    if (findDisciplineSelect) {
      return findDisciplineSelect.available_vacancies > 0;
    } else {
      return false;
    }
  }
  
}
