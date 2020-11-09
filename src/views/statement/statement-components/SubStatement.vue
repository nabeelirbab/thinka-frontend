<template>
  <div>
    <div
      :class="statementClass" 
      class="sub-statement statement-radius mb-1 c-pointer border-width border-dark"
      @click="selectedStatementId = selectedStatementId ===  statement['id'] ? 0 : statement['id']"
    >
      <div class="d-flex align-items-center px-2">
        <div v-if="showImpact || showScope">
          <div class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px; width:35px">
            <small v-if="showImpact">100%</small>
            <small v-if="showScope" style="line-height: 1">
              {{statement['id'] % 3 ? 'All But One' : (statement['id'] % 2 ? 'All ' : 'Some')}}
            </small>
          </div>
        </div>
        <div class="flex-fill pr-2 py-2 " :style="{'padding-left': ((level - 1) * 20)+ 'px'}">
          <!-- <div class="d-flex justify-content-between mb-1 ">
            <div>
              <small class="badge badge-pill badge-light mr-1 d-none d-md-inline-block"><fa icon="level-up-alt" rotation="90" /> {{level}}</small>
              <small class="badge badge-pill badge-primary mr-1 text-nowrap">By <strong>{{statement['user'] ? statement['user']['name'] : null}}</strong></small>
              <small class="badge badge-pill badge-warning text-nowrap font-weight-bold">Almost All</small>
            </div>
            <small class="text-nowrap d-none d-md-block">{{statement['created_at']}}</small>
            <CTPoints :points="statement['ct_points']" />
          </div> -->
          <div class="d-flex text-justify px-1" >
              <div class="text-danger font-weight-bold mr-1" style="font-size:1.5em">^</div>
              <div class="text-dark text-justify pr-2 mb-1">{{statement['text']}}</div>
              <!--  -->
          </div>
          <!-- <div class="d-flex justify-content-between">
            <div>
              <small class="badge badge-pill  text-nowrap"><strong>{{statement['subscribers'].length}}</strong> Subscribers</small>
            </div>
            <AddStatementOption size="compact" class="text-right" />
          </div> -->
        </div>
        <div>
          <div v-if="showOpinion || isActive || showCTOpinion" class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
            <small v-if="showOpinion">100%</small>
            <small v-else-if="showCTOpinion">-100%</small>
            <router-link v-else :to="'/statement/' + statement['id']" tag="div" ><fa icon="eye" /></router-link>
          </div>
        </div>
      </div>
    </div>
    <CreateSubStatement v-if="createSubStatementParentId === statement['id']" :is-positive-statement="isPositiveStatement" :level="level + 1"/>
    <template v-for="(children, index) in statement['children']" :key="'children' + index">
      <SubStatement :statement="children" :level="level + 1" />
    </template>
  </div>
</template>
<script>
// import CTPoints from '@/components/CTPoints'
import SubStatement from './SubStatement'
import GlobalData from '../global-data'
import CreateSubStatement from './CreateSubStatement'
// import AddStatementOption from './AddStatementOption'
export default {
  name: 'SubStatement',
  components: {
    // CTPoints,
    // AddStatementOption,
    CreateSubStatement,
    SubStatement
  },
  props: {
    level: Number,
    statement: {
      type: Object,
      required: true
    },
  },
  data(){
    const isPositiveStatement = typeof this.statement['relation'] === 'undefined' ||  this.statement['relation'] !== '-'
    return {
      isPositiveStatement: isPositiveStatement,
      ...GlobalData,
      statementClass: {
        'negative-statement': !isPositiveStatement,
        'positive-statement': isPositiveStatement,
        'border ': false
      }
    }
  },
  watch: {
    selectedStatementId(){
      this.statementClass['border'] = this.isActive
    }
  },
  computed: {
    parentStatement(){
      return typeof this.statement['statement'] !== 'undefined' && this.statement['statement'] ? this.statement['statement'] : null
    },
    isActive(){
      return this.statement['id'] === this.selectedStatementId
    }
  }
}
</script>
