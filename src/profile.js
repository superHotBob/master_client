const week = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
const months = ['декабрь', 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
const my_profile = {
  get: () => {
    const result = localStorage.getItem('profile')
    if (!result) return null
    try {
      return JSON.parse(result)
    } catch {
      return result
    }
  }

}
function Convert_Date(a,b,c) {  
  console.log(a,b,c)
  if (a) {
    const dt = new Date()
   
    const tm = a[1].split(':')

    if (tm[0] === '00') {
      const date_ord = new Date(c, b-1, a[0])
      const formattedDate = date_ord.toLocaleDateString('ru-RU', {
        month: 'long', day: 'numeric'
      })
      return formattedDate

    } else if (months === 0) {
      return null

    } else {
      const date_ord = new Date(c, b-1, a[0], tm[0], tm[1])
      const formattedDate = date_ord.toLocaleDateString('ru-RU', {
        month: 'long', day: 'numeric', hour: '2-digit',
        minute: '2-digit',
      })
      return formattedDate
    }

  } else {
    return
  }
}
function NewOrder(a, b, c) {
  let date_order = a
  const order_date = Date.parse(new Date(c,b - 1,date_order[0],date_order[1].split(':')[0],date_order[1].split(':')[1]))
  
  if (!a) {
    return;
  }

  if(+Date.now() > +order_date) {
    return false;
  } else {
    return true;
  }  
}

function EditLocalStorage(a, b) {
  let new_loc = my_profile.get()
  new_loc[a] = b
  localStorage.setItem('profile', JSON.stringify(new_loc))
}
const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

function My_Date(a) {
  const message_date = new Date(+a)
  const current_date = new Date()
  if (message_date.getDate() === current_date.getDate()) {
    return message_date.toLocaleDateString('ru-RU', options)
  }
  return message_date.toLocaleDateString('ru-RU', options)
}
export { Convert_Date, EditLocalStorage, NewOrder, My_Date, months, week }