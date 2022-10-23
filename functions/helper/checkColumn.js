const checkColumn = (dto) => {
    const dtoKeys = Object.keys(dto)
    for (let i = 0; i < dtoKeys.length; i++) {
        if (!dto[dtoKeys[i]]) {
            return dtoKeys[i]
        }
    }
}
module.exports = checkColumn
