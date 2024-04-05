const { findUserByIdentifier } = require('../service')
const { Persistor } = require('../persistor')
const { USER_STORE_KEY } = require('../constants/persistor-keys.contants')
const updateUserByIdentifier = require('../service/update-user-by-identifier')

module.exports = (scope) => {
  return {
    label: 'Edit User',
    icon: 'fa-edit',
    action: async (context, data) => {
      // We obtain the list of stored users
      const users = Persistor.getItem(USER_STORE_KEY) || []

      /**
       * @param {{name,identifier,password}} user
       * @param {HTMLElement} modal
       */
      const handleUserClicked = async (user, modal) => {
        const closeDialog = () => modal.querySelector('.modal__header button').click()
        closeDialog()

        const userToEdit = findUserByIdentifier(user.identifier)

        // Edit the username
        const name = await context.app.prompt('Edit Username', {
          title: 'Edit User Name',
          defaultValue: userToEdit.name,
          label: 'Username',
          inputType: 'text'
        })

        // Edit the identifier
        const identifier = await context.app.prompt('Edit Identifier', {
          title: 'Edit Identifier',
          defaultValue: userToEdit.identifier,
          label: 'Identifier',
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
        await updateUserByIdentifier({
          name,
          identifier,
          password
        }, userToEdit.identifier)

        // We synchronize the status
        scope.sync()
      }

      const container = document.createElement('div')
      users.forEach((user) => {
        const userButton = document.createElement('button')
        userButton.className = 'btn btn--outlined btn--super-duper-compact margin-right-sm margin-top-sm inline-block'
        userButton.innerText = user.identifier
        userButton.onclick = (el) => {
          handleUserClicked(user, el.currentTarget.closest('.modal__content__wrapper'))
        }
        container.append(
          userButton
        )
      })
      context.app.dialog('Choose user to edit', container)
    }
  }
}
