const { checkColumn } = require("../../helper/checkColumn")
const {
  addDiscountType,
} = require("../../model/discountType/discountType.model")

const addNewDiscountTypes = async (discountTypeList, discountTypes, uid)=>{
  if (discountTypeList === -1) {
    for (let i = 0; i < discountTypes.length; i++) {
      const discountType = discountTypes[i]
      const discountTypeDTO = {
        uid: uid,
        name: discountType["name"],
        discount: parseInt(discountType["discount"]),
        note: "",
      }
      await addDiscountType(discountTypeDTO)
    }
    return
  }
  for (let i = 0; i < discountTypes.length; i++) {
    const discountType = discountTypes[i]
    const discountTypeDTO = {
      uid: uid,
      name: discountType["name"],
      discount: parseInt(discountType["discount"]),
      note: "",
    }
    if (!discountTypeList.includes(discountTypeDTO["name"])) {
      await addDiscountType(discountTypeDTO)
    }
  }
}

const addNewNote = (note, discountTypes) => {
  let newNote = ""
  for (let i = 0; i < discountTypes.length; i++) {
    const discountType = discountTypes[i]
    newNote += `${discountType["name"]},$${discountType["discount"]}\n`
  }
  newNote += note
  return newNote
}

const isDiscountTypesValid = (discountTypes) => {
  for (let i = 0; i < discountTypes.length; i++) {
    const discountType = discountTypes[i]
    const discountTypeDTO = {
      discount: parseInt(discountType["discount"]),
      name: discountType["name"],
    }
    const discountTypeMissedKey = checkColumn(discountTypeDTO, [])
    if (discountTypeMissedKey) {
      return -1
    } else if (discountType["discount"] < 0) {
      return -2
    }
  }
  return true
}

module.exports = {
  addNewDiscountTypes,
  addNewNote,
  isDiscountTypesValid,
}
