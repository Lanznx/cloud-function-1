const checkColumn = (dto, optionalKeys) => {
  const dtoKeys = Object.keys(dto)
  for (let i = 0; i < dtoKeys.length; i++) {
    if (dto[dtoKeys[i]] === undefined && !optionalKeys.includes(dtoKeys[i])) {
      return dtoKeys[i]
    } else if (!optionalKeys.includes(dtoKeys[i]) && dto[dtoKeys[i]] === "") {
      return dtoKeys[i]
    }
  }
}

const removeUndefine = (dto) => {
  const dtoKeys = Object.keys(dto)
  for (let i = 0; i < dtoKeys.length; i++) {
    if (dto[dtoKeys[i]] === undefined) {
      delete dto[dtoKeys[i]]
    }
  }
  return dto
}

const isNumber = (value) => {
  return typeof value === "number"
}

const isString = (value) => {
  return typeof value === "string"
}


module.exports = { checkColumn, isNumber, isString, removeUndefine }
