<template>
  <div>
    <div :class="size === 'compact' ? '' : 'd-block d-sm-block d-md-none'">
      <div class="btn-group">
        <button type="button" :class="size === 'compact' ? 'btn-sm btn-info' : 'btn-outline-secondary'" class="btn  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Add Statement
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <template v-for="(relation, index) in relations" :key="'rel1' + index">
            <a class="dropdown-item" href="#"><strong>{{relation['symbol']}}</strong> {{relation['text']}}</a>
          </template>
        </div>
      </div>
    </div>
    <div :class="size === 'compact' ? 'd-none' : 'd-none d-md-block'">
      <template v-for="(relation, index) in relations" :key="'rel2' + index">
        <button class="btn btn-outline-secondary mx-1 mb-1"><strong>{{relation['symbol']}}</strong> {{relation['text']}}</button>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      relations: [{
        text: 'Add',
        symbol: '+'
      }, {
        text: 'Minus',
        symbol: '-'
      }, {
        text: 'And',
        symbol: '&'
      }, {
        text: 'Or',
        symbol: '^'
      }, {
        text: 'Note',
        symbol: '*'
      }]
    }
  }
}
</script>
