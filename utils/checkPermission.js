
const checkPermission = (requestUser,resourceId) => {
    return (requestUser.role === 'admin' || requestUser.userId === resourceId.toString())
}

module.exports = checkPermission