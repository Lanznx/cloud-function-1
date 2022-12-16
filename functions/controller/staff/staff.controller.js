const { checkColumn, isString } = require("../../helper/checkColumn")
const {
  addStaffModel,
  getAllStaffModel,
  updateStaffModel,
  getStaffModel,
  deleteStaffModel,
} = require("../../model/staff/staff.model")

const add = async (req, res) => {
  const { uid } = req.middleware
  const { name, phoneNumber, email } = req.body

  const staffDTO = {
    uid: uid,
    name: name,
    phoneNumber: phoneNumber.toString(),
    email: email,
  }

  const staffMissedKey = checkColumn(staffDTO, [])
  if (staffMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${staffMissedKey}`,
    })
  }

  try {
    const allStaff = await getAllStaffModel(uid)
    allStaff.forEach((s) => {
      if (s["name"] === name) {
        return res.status(400).send({
          success: false,
          message: "員工已存在",
        })
      }
    })
    const sid = await addStaffModel(staffDTO)
    return res.status(200).send({
      success: true,
      message: "加入員工成功",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "加入員工失敗，請聯絡客服",
      err: error,
    })
  }
}

const getAll = async (req, res) => {
  const { uid } = req.middleware
  try {
    const staffList = await getAllStaffModel(uid)
    if (staffList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "員工列表為空",
      })
    }
    const response = staffList.map((staff) => {
      return {
        sid: staff.sid,
        name: staff.name,
        phoneNumber: staff.phoneNumber,
        email: staff.email,
      }
    })

    return res.status(200).send({
      success: true,
      message: "成功取得員工列表",
      staffList: response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "取得員工列表失敗，請聯絡客服",
      err: error,
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { sid } = req.query
  const { name, phoneNumber, email } = req.body

  const staffDTO = {
    uid: uid,
    name: name,
    phoneNumber: phoneNumber,
    email: email,
  }

  const staffMissedKey = checkColumn(staffDTO, [])
  if (staffMissedKey) {
    return res.status(400).send({
      success: false,
      message: `麻煩提供 ${staffMissedKey}`,
    })
  } else if (!isString(phoneNumber)) {
    return res.status(400).send({
      success: false,
      message: "電話號碼的型別應為字串",
    })
  }

  try {
    const staff = await getStaffModel(sid)
    if (staff === -1) {
      return res.status(404).send({
        success: false,
        message: "找不到該員工",
      })
    } else if (staff["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "無權限修改該員工",
      })
    }
    updateStaffModel(sid, staffDTO)
    return res.status(200).send({
      success: true,
      message: "成功更新員工資料",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "更新員工資料失敗，請聯絡客服",
      err: error,
    })
  }
}

const remove = async (req, res) => {
  const { uid } = req.middleware
  const { sid } = req.query
  if (!sid) {
    return res.status(400).send({
      success: false,
      message: "麻煩提供 sid",
    })
  }
  try {
    const staff = await getStaffModel(sid)
    if (staff === -1) {
      return res.status(404).send({
        success: false,
        message: "找不到該員工",
      })
    } else if (staff["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "無權限刪除該員工",
      })
    }
    deleteStaffModel(sid)
    return res.status(200).send({
      success: true,
      message: "成功刪除員工",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "刪除員工失敗，請聯絡客服",
      err: error,
    })
  }
}


module.exports = {
  add,
  getAll,
  update,
  remove,
}
