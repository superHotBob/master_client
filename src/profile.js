const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
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
function Convert_Date(a = "1,'Июнь',10:00") {
  if (a) {
    const dt = new Date()
    let d = a.split(',')
    const tm = d[2].split(':')
    console.log(d)
    if (tm[0] === '00') {
      const date_ord = new Date(dt.getFullYear(), months.indexOf(d[1]), d[0])
      const formattedDate = date_ord.toLocaleDateString('ru-RU', {
        month: 'long', day: 'numeric'
      })
      return formattedDate

    } else if (months ===  0) {
      return null

    } else {
      const date_ord = new Date(dt.getFullYear(), months.indexOf(d[1]), d[0], tm[0], tm[1])
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
function EditLocalStorage(a, b) {
  let new_loc = my_profile.get()
  new_loc[a] = b
  localStorage.setItem('profile', JSON.stringify(new_loc))
}
export { Convert_Date, EditLocalStorage }