const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
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
function Convert_Date(a) {
  
  if (a) {
    const dt = new Date()
    let d = a.split(',')
    const tm = d[2].split(':')   
   
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
function NewOrder(a) {
  if(!a) {
      return;
  }
  let date_order = a.split(',')
  let mon = months.indexOf(date_order[1])
  let d = new Date();  
 
  if (mon > d.getMonth() )  {
     
      return true;
  } else if ( mon === d.getMonth() && +date_order[0] >=  d.getDate()) {
      if( +date_order[2].split(':')[0] > d.getHours()) {
         
          return true;
      } else {
         
           return true;
      }
     
  } else {
     
      return false;
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
export { Convert_Date, EditLocalStorage, NewOrder, My_Date }