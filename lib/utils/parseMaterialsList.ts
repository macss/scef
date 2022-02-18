/**
 * Function that parses a material list string into an array of objects 
 * 
 * @param materialList is the list of materials, valid inputs are: 1x Material or 1 Material
 */
export default function parseMaterialsList(materialList: string) {
  const materials = materialList.split(/\r?\n/).map(material => {
    const values = material.match(/(?<qty>\d+)x?\s(?<material>.+)/i)

    return values?.groups ?? material
  })

  const errors = materials.filter(material => typeof material === 'string')

  if (errors.length > 0) {
    throw new Error(`Não foi possível identificar os seguintes materiais: ${errors.join(', ')}. Confira se o material está no formato correto [1x Material ou 1 Material]`)
  }

  return materials
}