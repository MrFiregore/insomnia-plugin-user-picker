const { listAllUsersActionMap } = require('../actions-map')
const saveUserAction = require('./save-user.action')
const deleteUserAction = require('./delete-user.action')
const editUserAction = require('./edit-user.action')

module.exports = (scope) => {
  return () => {
    scope.workspaceActions = [
      saveUserAction(scope),
      editUserAction(scope),
      ...listAllUsersActionMap(scope),
      deleteUserAction(scope)
    ]
  }
}
