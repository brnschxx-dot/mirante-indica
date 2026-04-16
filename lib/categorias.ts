export const EIXOS_CATEGORIAS: Record<string, string[]> = {
  "Gastronomia": [
    "Pizza", "Hambúrgueres e Lanches", "Pastel", "Comida Japonesa", 
    "Marmitas e Congelados", "Bolos e Confeitaria", "Padaria", 
    "Pães Artesanais", "Cervejas Artesanais e Adegas"
  ],
  "Manutenção e Reformas": [
    "Instalação de Ar-Condicionado", "Montador de Móveis", 
    "Marido de Aluguel", "Limpeza de Estofados e Tapetes", 
    "Redes de Proteção", "Serralheria", "Vidraçaria"
  ],
  "Pet": ["Pet Sitter", "Banho e Tosa", "Veterinários"],
  "Bem-Estar e Estética": [
    "Personal Trainer", "Massagem e Drenagem", "Depilação", 
    "Estética Facial", "Maquiadoras", "Cabeleireiro Masculino", 
    "Cabeleireira Feminina", "Manicure"
  ],
  "Automotivo": ["Estética Automotiva", "Mecânica e Borracharia", "Manutenção de Motos"],
  "Educação e Apoio Familiar": ["Aulas Particulares", "Babás", "Transporte Escolar"],
  "Profissional": ["Contabilidade / IRPF", "Advocacia", "Seguros"]
};

export const EIXOS = Object.keys(EIXOS_CATEGORIAS);