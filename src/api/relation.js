import API from '@/core/api'
class Relation extends API {
  apiName = 'relation'
  preFormattedSelect = {
    recursive_relation_tree: {
      // statement: {
      //   select: ['id', 'text', 'synopsis', 'comment', 'scope', 'scope_id', 'statement_type_id']
      // },
      // user: {
      //   select: {
      //     ...(['id', 'username']),
      //     user_basic_information: {
      //       select: ['user_id', 'first_name', 'last_name']
      //     }
      //   }
      // },
      // user_opinion: {
      //   select: {
      //     opinion_calculated_column: {  
      //       select: ['id', 'score_relation', 'score_statement']
      //     },
      //     ...(['id', 'user_id', 'relation_id', 'confidence', 'type'])
      //   }
      // },
      // ...(['parent_relation_id', 'logic_tree_id', 'statement_id', 'relation_type_id', 'relevance_window', 'user_id', 'published_at', 'logic_tree_id', 'impact', 'impact_amount', 'created_at', 'virtual_relation_id'])
    }
  }
}
const statement = new Relation()
export default statement
