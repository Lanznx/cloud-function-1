const checkColumn = (dto) => {
  const dtoKeys = Object.keys(dto)
  for (let i = 0; i < dtoKeys.length; i++) {
    if (!dto[dtoKeys[i]]) {
      return dtoKeys[i]
    }
  }
}

const isNumber = (value) => {
  return typeof value === "number"
}

const isString = (value) => {
  return typeof value === "string"
}


module.exports = { checkColumn, isNumber, isString }
