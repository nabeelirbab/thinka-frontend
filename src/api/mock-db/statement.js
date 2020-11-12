import helper from './helper'
import UserDB from './user'
let entries = [{
  id: 1,
  statement_id: null,
  text: 'Tree needs water to grow.',
  user_id: 1,
  created_at: '10/1/2020 1:30',
  ct_points: 60,
  subscribers: [1, 2, 3]
}, {
  id: 2,
  statement_id: 1,
  text: 'Fusce sollicitudin nunc arcu, a malesuada mi auctor id. Curabitur venenatis, odio ac maximus auctor, odio lacus sollicitudin diam, vel volutpat sem arcu vitae ipsum. Aliquam sodales nec neque sed porttitor. Sed pharetra, massa nec mattis facilisis, nisl risus vehicula nibh, sit amet malesuada sem elit nec nisi. Morbi dictum tincidunt condimentum. Sed tempor lorem augue, in pellentesque odio tristique eget. Vivamus non nisl mi',
  user_id: 2,
  created_at: '10/2/2020 3:30',
  ct_points: 40,
  subscribers: [1, 2, 3, 4],
  children: [{
    id: 6,
    statement_id: 2,
    text: 'Etiam fringilla odio sit amet enim bibendum, vel eleifend dolor malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    user_id: 3,
        user: {
      id: 3,
      name: 'Dave Davidson'
    },
    created_at: '10/1/2020 2:30',
    ct_points: 70,
    subscribers: [1, 2, 3],
    children: [{
      id: 7,
      statement_id: 2,
      
      text: 'Curabitur venenatis, odio ac maximus auctor, odio lacus sollicitudin diam, vel volutpat sem arcu vitae ipsum. Aliquam sodales nec neque sed porttitor. Sed pharetra, massa nec mattis facilisis, nisl risus vehicula nibh, sit amet malesuada.',
      user_id: 3,
          user: {
        id: 3,
        name: 'Dave Davidson'
      },
      created_at: '10/1/2020 3:30',
      ct_points: 30,
      subscribers: [1, 3]
    }]
  }, {
    id: 8,
    statement_id: 2,
    text: 'Nullam bibendum, nulla eget bibendum vehicula, risus risus bibendum orci, eu blandit eros sapien in sem. Mauris scelerisque nisi non enim laoreet, ac pulvinar libero iaculis.',
    user_id: 3,
        user: {
      id: 3,
      name: 'Dave Davidson'
    },
    created_at: '10/1/2020 3:30',
    ct_points: 30,
    subscribers: [1, 3],
    children: [{
      id: 4,
      statement_id: 2,
      
      text: 'Colutpat venenatis, odio ac maximus auctor, odio lacus sollicitudin diam, vel volutpat sem arcu vitae ipsum. Aliquam sodales nec neque sed porttitor. Sed pharetra, massa nec mattis facilisis, nisl risus vehicula nibh, sit amet malesuada.',
      user_id: 3,
          user: {
        id: 3,
        name: 'Dave Davidson'
      },
      created_at: '10/1/2020 3:30',
      ct_points: 30,
      subscribers: [1, 3],
      children: [{
        id: 5,
        statement_id: 2,
        text: 'Aliquam sodales nec neque sed porttitor. Sed pharetra, massa nec mattis facilisis, nisl risus vehicula nibh, sit amet malesuada. Colutpat venenatis, odio ac maximus auctor, odio lacus sollicitudin diam, vel volutpat sem arcu vitae ipsum. Aliquam sodales nec neque sed porttitor.',
        user_id: 3,
            user: {
          id: 3,
          name: 'Dave Davidson'
        },
        created_at: '10/1/2020 3:30',
        ct_points: 30,
        subscribers: [1, 3]
      }]
    }]
  }]
}, {
  id: 3,
  statement_id: 1,
  text: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos',
  user_id: 2,
  relation: '-',
  created_at: '10/2/2020 3:30',
  ct_points: 40,
  subscribers: [1, 2]
}]
let idIndexLookUp = {}
entries.forEach((entry, index) => {
  idIndexLookUp[entry['id']] = index
})
entries.map(entry => {
  if(typeof entry['children'] === 'undefined'){
    entry['children'] = []
  }
  let entryWithJoinedTable = entry
  entryWithJoinedTable['statement'] = null
  /* getting parent */
  if(entryWithJoinedTable['statement_id'] && typeof idIndexLookUp[entryWithJoinedTable['statement_id']] !== 'undefined'){
    const parentIndex = idIndexLookUp[entryWithJoinedTable['statement_id']]
    if(typeof entries[parentIndex]['children'] === 'undefined'){
      entries[parentIndex]['children'] = []
    }
    entryWithJoinedTable['statement'] = entries[parentIndex]
    /* Adding entries to parent's children*/
    if(typeof entries[parentIndex]['children'] === 'undefined'){
      entries[parentIndex]['children'] = []
    }
    entries[parentIndex]['children'].push(entry)
  }
  entryWithJoinedTable['user'] = helper.getParent(entryWithJoinedTable['user_id'], UserDB)
  
  return entryWithJoinedTable
})
/* Level 2 Chilren */
export default {
  entries: entries,
  getById: (id) => {
    return typeof idIndexLookUp[id] !== 'undefined' ? entries[idIndexLookUp[id]] : null
  }
}
