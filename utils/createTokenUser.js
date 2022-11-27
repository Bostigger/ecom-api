

const createTokenUser = (user) => {
  return {userId:user.userId,email:user.email, name:user.name, role:user.role}
}

module.exports = createTokenUser