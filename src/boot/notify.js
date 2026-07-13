import { defineBoot } from '#q-app/wrappers'
import { Notify } from 'quasar'

export default defineBoot(() => {
  Notify.setDefaults({
    position: 'top',
    timeout: 3600,
    textColor: 'white',
  })
})
