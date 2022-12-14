const {
  addTagModel,
  getTagListModel,
} = require("../../model/tag/tag.model")

const addNewTag = async (tagList, uid) => {
  const tagResult = await getTagListModel(uid)
  if (tagResult === -1) {
    for (let i = 0; i < tagList.length; i++) {
      const newTag = tagList[i]
      addTagModel({
        uid: uid,
        name: newTag,
      })
    }
    return
  }

  for (let i = 0; i < tagList.length; i++) {
    const newTag = tagList[i]
    const isExist = tagResult.includes(newTag)
    if (isExist) {
      continue
    }
    addTagModel({
      uid: uid,
      name: newTag,
    })
  }
}

module.exports = {
  addNewTag,
}
