let entries = [{
  id: 1,
  name: 'John Doe'
}, {
  id: 2,
  name: 'Mary Hill'
}, {
  id: 3,
  name: 'Dave Davidson'
}]
let idIndexLookUp = {}
entries.forEach((entry, index) => {
  idIndexLookUp[entry['id']] = index
})
export default {
  entries: entries,
  getById: (id) => {
    return typeof idIndexLookUp[id] !== 'undefined' ? entries[idIndexLookUp[id]] : null
  }
}
