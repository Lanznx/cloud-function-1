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
    phoneNumber: phoneNumber,
    email: email,
  }

  const staffMissedKey = checkColumn(staffDTO, [])
  if (staffMissedKey) {
    return res.status(400).send({
      success: false,
      message: `hey! please provide ${staffMissedKey}`,
    })
  } else if (!isString(phoneNumber)) {
    return res.status(400).send({
      success: false,
      message: "hey! phone number should be string",
    })
  }

  try {
    const sid = await addStaffModel(staffDTO)
    return res.status(200).send({
      success: true,
      message: "add staff successfully",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "add staff failed",
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
        message: "staff list is empty",
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
      message: "get staff list success",
      staffList: response,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "get staff list failed",
      err: error,
    })
  }
}

const update = async (req, res) => {
  const { uid } = req.middleware
  const { sid, name, phoneNumber, email } = req.body

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
      message: `hey! please provide ${staffMissedKey}`,
    })
  } else if (!isString(phoneNumber)) {
    return res.status(400).send({
      success: false,
      message: "hey! phone number should be string",
    })
  }

  try {
    const staff = await getStaffModel(sid)
    if (staff === -1) {
      return res.status(404).send({
        success: false,
        message: "staff not found",
      })
    } else if (staff["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "hey! you can't update this staff",
      })
    }
    updateStaffModel(sid, staffDTO)
    return res.status(200).send({
      success: true,
      message: "update staff successfully",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "update staff failed",
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
      message: "hey! please provide sid",
    })
  }
  try {
    const staff = await getStaffModel(sid)
    if (staff === -1) {
      return res.status(404).send({
        success: false,
        message: "staff not found",
      })
    } else if (staff["uid"] !== uid) {
      return res.status(400).send({
        success: false,
        message: "hey! you can't delete this staff",
      })
    }
    deleteStaffModel(sid)
    return res.status(200).send({
      success: true,
      message: "delete staff successfully",
      sid: sid,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "delete staff failed",
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
