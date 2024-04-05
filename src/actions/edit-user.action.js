const { findUserByIdentifier, saveUser } = require('../service')
const { Persistor } = require('../persistor')
const { USER_STORE_KEY } = require('../constants/persistor-keys.contants')

module.exports = (scope) => {
  return {
    label: 'Edit User',
    icon: 'fa-edit',
    action: async (context, data) => {
      // We obtain the list of stored users
      const users = Persistor.getItem(USER_STORE_KEY) || []
      console.log('Users:', users)

      // We display a prompt with hints to select the user to edit.
      const identifier = await context.app.prompt('Choose user to edit', {
        title: 'Select a user to edit',
        label: 'Available Users',
        // The options available for selection
        hints: users.map(user => user.identifier),
        inputType: 'hidden',
        placeholder: 'Type or select the identifier'
      })

      const userToEdit = findUserByIdentifier(identifier.trim())
      if (!userToEdit) {
        alert('User not found. Please select a valid user.')
        return
      }

      // Edit the username
      const name = await context.app.prompt('Edit Username', {
        title: 'Edit User Name',
        defaultValue: userToEdit.name,
        label: 'Username',
        inputType: 'text'
      })

      // Edit the user's password
      const password = await context.app.prompt('Edit User Password', {
        title: 'Edit User Password',
        defaultValue: userToEdit.password,
        label: 'Password',
        inputType: 'text'
      })

      // Here we proceed to save the edited user
      // We assume that the identifier does not change.
      await saveUser({
        name,
        identifier: userToEdit.identifier,
        password
      })

      // We synchronize the status
      scope.sync()
    }
  }
}