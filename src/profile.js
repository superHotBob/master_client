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
export default my_profile