<template>
  <div class="statement-container">
    <div v-if="isLoading">
      <Loader style="padding-top: 30vh" />
      <!-- Please wait... <fa icon="spinner" spin /> -->
    </div>
    <div v-else-if="mainRelationData === null" class="text-center mt-4">
      <fa icon="exclamation-triangle" /> Statement Not Found or is Private
      dsfsdfsdf <br />
      <LogInModal
        v-if="authenticationStatus === 'unauthenticated'"
        :has-button="true"
      />
      <router-link v-else class="btn btn btn-outline-dark" to="/search"
        ><fa icon="search" /> Find Statements</router-link
      >
    </div>
    <div
      v-show="!isLoading && mainRelationData"
      class="statement-container-body"
    >
      <TopToolbar
        ref="topToolbar"
        v-show="!isReadingMode"
        :main-relation="mainRelationData ? mainRelationData : {}"
        :statement-id="statementId"
        :parent-relation-id="parentRelationId"
      />
      <div
        ref="treeContainer"
        :class="isReadingMode ? 'readingMode' : ''"
        class="container-fluid px-0"
      >
        <div
          ref="mainStatementContainer"
          class="px-1 border mb-1 main-statement-container shadow-sm bg-white"
        >
          <MainStatementProfile class="px-2" />
          <div v-if="isReadingMode" class="text-center">
            <button
              @click="isReadingMode = false"
              class="shadow-none btn-primary btn py-0 px-1"
              title="Reading Mode."
            >
              <fa icon="glasses" />
            </button>
          </div>
          <MainStatement
            v-if="mainRelationData"
            ref="mainStatement"
            @updated="mainStatementUpdated"
            @height-changed="mainStatementHeight = $event"
            :relation="mainRelationData"
            :logic-tree-id="logicTreeId"
            class="c-pointer px-2"
          />
        </div>

        <div
          v-if="mainRelationData"
          class="toolbar-bottom-space"
          style="margin-left:-4px;s margin-right: -4px;"
        >
          <div
            @click="setSeparatorWindowSupports"
            class="text-center text-light"
            style="cursor: pointer"
          >
            -
            <span class="mx-1 text-uppercase">{{
              supportCounterLabels["support"]
            }}</span>
            -
          </div>
          <div
            ref="positiveWindow"
            class="statement-window"
            :style="{
              height: positiveStatementHeight + 'px',
              'max-height': totaRelevanceWindowHeight - 50 + 'px',
              'min-height': 20 + 'px',
            }"
          >
            <draggable
              @start="startDragging(true)"
              @end="endDragging"
              @change="listChanged"
              :relation-id="mainRelationData['id']"
              :list="mainRelationData['relations']"
              :disable="true"
              :class="isDraggingStatement === 1 ? 'isDragging' : ''"
              :group="{ name: 'g1' }"
              class="dragArea"
              item-key="id"
              handle=".isRelationSelected.enableDragging"
            >
              <template #item="{ element, index }">
                <div v-if="element['relevance_window'] === 0">
                  <!-- {{index}} - {{element['id']}} - {{logicTreeId}} - {{element}} -->
                  <SubStatement
                    @save="addNewSubStatement($event, element['id'])"
                    @update="updateNewSubStatement($event, index)"
                    :relation-id="element['id']"
                    :relation="element"
                    :level="1"
                    :logic-tree-id="logicTreeId"
                    :is-positive-statement="true"
                  />
                </div>
              </template>
            </draggable>
            <CreateSubStatement
              v-if="
                activeCreateWindow === 'support' &&
                authenticationStatus === 'authenticated'
              "
              @save="addNewSubStatement"
              @cancel="activeCreateWindow = false"
              :is-positive-statement="true"
              :logic-tree-id="logicTreeId"
              :parent-relation-id="mainRelationData['id']"
              :parent-relation="mainRelationData"
              :statement-id="statementId"
              class="mt-1"
            />
            <div v-else class="text-center pt-3 add-statement-container">
              <button
                v-if="
                  authenticationStatus === 'authenticated' &&
                  (!selectedStatementId ||
                    selectedStatementId === mainRelationId)
                "
                @click="activeCreateWindow = 'support'"
                class="btn btn-outline-secondary"
              >
                Add Supporting Statement
              </button>
            </div>
            <div class="text-center text-secondary">
              <small>{{
                positiveStatements.length
                  ? "- End of Line -"
                  : "No supporting statements"
              }}</small>
            </div>
          </div>
          <WindowSeparator
            ref="separator"
            :y-range="totaRelevanceWindowHeight - 50"
            @move="resizePositiveStatement"
          />
          <div
            @click="setSeparatorWindowCounters"
            class="text-center text-light"
            style="cursor: pointer"
          >
            -
            <span class="mx-1 text-uppercase">{{
              supportCounterLabels["counter"]
            }}</span>
            -
          </div>
          <div
            ref="negativeWindow"
            class="statement-window"
            :style="{
              height:
                totaRelevanceWindowHeight - positiveStatementHeight + 'px',
              'max-height': totaRelevanceWindowHeight - 50 + 'px',
              'min-height': 50 + 'px',
            }"
          >
            <draggable
              :relation-id="mainRelationData['id']"
              :list="mainRelationData['relations']"
              :disable="true"
              class="dragArea"
              :class="!isDraggingStatement === 2 ? 'isDragging' : ''"
              item-key="id"
              handle=".isRelationSelected.enableDragging"
              :group="{ name: 'g2' }"
              @start="startDragging(false)"
              @end="endDragging"
              @change="listChanged"
            >
              <template #item="{ element, index }">
                <div v-if="element['relevance_window'] * 1 === 1">
                  <SubStatement
                    @save="addNewSubStatement($event, element['id'])"
                    @update="updateNewSubStatement($event, index)"
                    :relation-id="element['id']"
                    :relation="element"
                    :level="1"
                    :logic-tree-id="logicTreeId"
                    :is-positive-statement="false"
                    group-name="g2"
                  />
                </div>
              </template>
            </draggable>
            <CreateSubStatement
              v-if="
                activeCreateWindow === 'counter' &&
                authenticationStatus === 'authenticated'
              "
              @save="addNewSubStatement"
              @cancel="activeCreateWindow = false"
              :is-positive-statement="false"
              :logic-tree-id="logicTreeId"
              :parent-relation-id="mainRelationData['id']"
              :parent-relation="mainRelationData"
              :statement-id="statementId"
              class="mt-1"
            />
            <div v-else class="text-center pt-3 add-statement-container">
              <button
                v-if="
                  authenticationStatus === 'authenticated' &&
                  (!selectedStatementId ||
                    selectedStatementId === mainRelationId)
                "
                @click="activeCreateWindow = 'counter'"
                class="btn btn-outline-secondary"
              >
                Add Counter Statement
              </button>
            </div>
            <div class="text-center text-secondary">
              <small>{{
                negativeStatements.length
                  ? "- End of Line -"
                  : "No counter statements"
              }}</small>
            </div>
          </div>
        </div>
      </div>
      <VirtualRelationLinkage />
      <Toolbar class="fixed toolbar" />
    </div>
  </div>
</template>
<script>
// import VueResizable from 'vue-resizable'
import WindowSeparator from "./statement-components/WindowSeperator.vue";
// import StatementAPI from '@/api/statement.js'
import RelationAPI from "@/api/relation.js";
import StatementTypeAPI from "@/api/statement-type.js";
import MainStatement from "./statement-components/MainStatement";
import MainStatementProfile from "./statement-components/MainStatementProfile";
import SubStatement from "./statement-components/SubStatement";
import CreateSubStatement from "./statement-components/CreateSubStatement";
// import AddStatementOption from './statement-components/AddStatementOption'
import Toolbar from "./statement-components/Toolbar";
import TopToolbar from "./statement-components/TopToolBar";
import GlobalData from "./global-data";
import LogInModal from "@/components/login/LogInModal";
import Auth from "@/core/auth";
import draggable from "vuedraggable";
import Loader from "@/components/Loader";
import VirtualRelationLinkage from "./statement-components/VirtualRelationLinkage";
export default {
  components: {
    // VueResizable,
    WindowSeparator,
    MainStatement,
    SubStatement,
    CreateSubStatement,
    // AddStatementOption,
    TopToolbar,
    Toolbar,
    LogInModal,
    MainStatementProfile,
    draggable,
    Loader,
    VirtualRelationLinkage,
  },
  mounted() {
    window.addEventListener("click", this.clickedOutside);
    const splitHash = location.hash.split("#");
    if (splitHash.length > 2 && !isNaN(splitHash[splitHash.length - 1])) {
      // has second hash
      this.hashRelationId = splitHash[splitHash.length - 1] * 1;
    } else {
      this.hashRelationId = 0;
    }
  },
  unmounted() {
    window.removeEventListener("click", this.clickedOutside);
  },
  setup() {
    return {
      ...GlobalData,
    };
  },
  data() {
    return {
      isLoading: false,
      mainStatementHeight: 0,
      positiveStatementHeight: 100,
      authenticationStatus: Auth.status(),
      user: Auth.user(),
      activeCreateWindow: false,
      startScroll: false,
      hashedRelationId: null,
    };
  },
  methods: {
    readingModeStyle() {
      // if (this.$refs.topToolbar){
      //   if (this.$refs.topToolbar.isReadingMode){
      //     return "position:fixed;top:0;min-height:20%;min-width:100%;z-index:1030;"
      //   } else {
      //     return ""
      //   }
      // }
    },
    clickedOutside(event) {
      //deselect bubble when clicking outside
      const whiteListClass = [
        "statement-window",
        "statement-container-body",
        "add-statement-container",
      ];
      const classList = event.target.classList;
      for (let x = 0; x < whiteListClass.length; x++) {
        if (classList.contains(whiteListClass[x])) {
          this.selectedStatementId = 0;
          break;
        }
      }
    },
    selectMainStatement($e) {
      if (
        $e.target === this.$refs.positiveWindow ||
        $e.target === this.$refs.negativeWindow
      ) {
        this.$refs.mainStatement._statementClicked();
      }
    },
    initialize(relationId) {
      // this.retrieveRecursiveTree(statementId)
      this.retrieveRelation(relationId);
      this.selectedStatementId = 0;
      this.statementTextFilter = "";
    },
    retrieveRelation(relationId) {
      this.isLoading = true;
      this.statement = null;
      this.mainRelationData = null;
      // const preFormattedSelect = RelationAPI.getPreFormattedSelect('recursive_relation_tree')
      // const recursiveRelation = this.generateRecursiveRelationsSelect(1, 1)
      const param = {
        for_tree: true,
        relation_id: relationId * 1,
      };
      RelationAPI.post("/retrieve-tree", param)
        .then((result) => {
          console.log('Relation Tree', result['data'])
          if (result["data"] && result["data"].length) {
            this.mainRelationData = result["data"][0];
            this.setMainRelation(this.mainRelationData);
          } else {
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
        });
    },
    setMainRelation(statement) {
      this.statement = statement;
      this.isLoading = true;
      setTimeout(() => {
        this.windowContainers = [
          this.$refs.positiveWindow,
          this.$refs.negativeWindow,
        ];
      }, 200);
      setTimeout(() => {
        this.resizePositiveStatement();
        if (this.mainRelationId) {
          if (this.$refs.negativeWindow) {
            this.setDefaultSeparator();
          } else {
            setTimeout(() => {
              this.setDefaultSeparator();
            }, 1000);
          }
        }
      }, 1000);
      this.isLoading = false;
    },
    setDefaultSeparator() {
      const negativeChildren = this.$refs.negativeWindow
        ? this.$refs.negativeWindow.children
        : [];
      let negativeInnerHeight = 0;
      for (let x = 0; x < negativeChildren.length; x++) {
        negativeInnerHeight += negativeChildren[x].offsetHeight;
      }
      const positiveChildren = this.$refs.positiveWindow
        ? this.$refs.positiveWindow.children
        : [];
      let positiveInnerHeight = 0;
      for (let x = 0; x < positiveChildren.length; x++) {
        positiveInnerHeight += positiveChildren[x].offsetHeight;
      }
      if (this.$refs.separator) {
        if (positiveInnerHeight < this.totaRelevanceWindowHeight / 2) {
          this.$refs.separator._setOffset(
            (this.totaRelevanceWindowHeight / 2 - positiveInnerHeight - 100) *
              -1
          );
        } else if (negativeInnerHeight < this.totaRelevanceWindowHeight / 2) {
          this.$refs.separator._setOffset(
            this.totaRelevanceWindowHeight / 2 - negativeInnerHeight
          );
        }
      }
    },

    setSeparatorWindowSupports() {
      this.$refs.separator._setOffset(this.totaRelevanceWindowHeight);
    },
    setSeparatorWindowCounters() {
      this.$refs.separator._setOffset(
        (this.totaRelevanceWindowHeight / 2) * -1
      );
    },
    generateRecursiveRelationsSelect(currentDeep, deep = 20) {
      let selectParam = {
        user_relation_context_locks: {
          select: ["id", "user_id", "relation_id", "root_relation_id"],
          condition: [
            {
              column: "user_id",
              value: this.user ? this.user["id"] : null,
            },
          ],
        },
        ...RelationAPI.getPreFormattedSelect("recursive_relation_tree"),
      };
      if (currentDeep <= deep) {
        ++currentDeep;
        const generateRecursiveRelationsSelect =
          this.generateRecursiveRelationsSelect(currentDeep, deep);
        selectParam["relations"] = {
          select: generateRecursiveRelationsSelect,
          sort: [{ column: "relevance_row", order: "asc" }],
        };
        selectParam["virtual_relation"] = {
          select: {
            relations: selectParam["relations"],
            ...generateRecursiveRelationsSelect,
          },
        };
      }
      return selectParam;
    },
    updateNewSubStatement(newSubStatement, firstLevelIndex) {
      let currentStatement =
        this.mainRelationData["relations"][firstLevelIndex];
      let updatedStatement = newSubStatement;
      if (typeof newSubStatement["mappingIndex"] !== "undefined") {
        updatedStatement = newSubStatement["event"];
        const mappingIndex = newSubStatement["mappingIndex"];
        for (let index = mappingIndex.length - 1; index >= 0; index--) {
          currentStatement = currentStatement["relations"][mappingIndex[index]];
        }
      }
      currentStatement["statement"]["text"] = updatedStatement["text"];
      currentStatement["statement"]["statement_type_id"] =
        updatedStatement["statement_type_id"];
      currentStatement["statement"]["id"] = updatedStatement["id"];
      currentStatement["parent_relation_id"] =
        updatedStatement["relation"]["parent_relation_id"];
      currentStatement["logic_tree_id"] =
        updatedStatement["relation"]["logic_tree_id"];
      currentStatement["relation_type_id"] =
        updatedStatement["relation"]["relation_type_id"];
      currentStatement["relevance_row"] =
        updatedStatement["relation"]["relevance_row"];
      currentStatement["relevance_window"] =
        updatedStatement["relation"]["relevance_window"];
    },
    mainStatementUpdated(updatedMainStatement) {
      this.mainRelationData["statement"]["text"] = updatedMainStatement["text"];
      this.mainRelationData["statement"]["statement_type_id"] =
        updatedMainStatement["statement_type_id"];
      this.mainRelationData["statement"]["context_id"] =
        updatedMainStatement["context_id"];
      this.mainRelationData["statement"]["id"] = updatedMainStatement["id"];
      this.mainRelationData["relation_type_id"] =
        updatedMainStatement["relation"]["relation_type_id"];
    },
    resizePositiveStatement() {
      if (this.$refs.separator) {
        this.positiveStatementHeight =
          this.totaRelevanceWindowHeight / 2 +
          this.$refs.separator._getYOffset();
      }
    },
    startDragging(isPositiveStatement) {
      this.isDraggingStatement = isPositiveStatement === true ? 1 : 2;
    },
    endDragging() {
      this.isDraggingStatement = 0;
    },
    listChanged(event) {
      if (
        typeof event["added"] !== "undefined" &&
        this.mainRelationData["relations"]
      ) {
        this.isUpdating = true;
        this.mainRelationData["relations"][event["added"]["newIndex"]][
          "parent_relation_id"
        ] = this.mainRelationData["id"];
        RelationAPI.update({
          id: this.mainRelationData["relations"][event["added"]["newIndex"]][
            "id"
          ],
          parent_relation_id:
            this.mainRelationData["relations"][event["added"]["newIndex"]][
              "parent_relation_id"
            ],
        }).finally(() => {
          this.mapRelations();
          this.isUpdating = false;
        });
      }
    },
  },
  watch: {
    statementId: {
      handler(statementId) {
        if (statementId) {
          const lastViewRelationId = localStorage.getItem(
            "last_viewed_relation_id"
          );
          if (
            lastViewRelationId !== statementId + "" ||
            this.mainRelationData === null
          ) {
            localStorage.removeItem("last_viewed_relation_id");
            this.initialize(statementId);
          } else {
            this.setMainRelation(this.mainRelationData);
          }
          localStorage.setItem("last_viewed_relation_id", this.statementId);
        }
      },
      immediate: true,
    },
    mainStatementHeight() {
      setTimeout(() => {
        this.resizePositiveStatement();
      }, 5);
    },
    selectedStatementId(selectedStatementId) {
      if (selectedStatementId) {
        this.activeCreateWindow = false;
      }
    },
    deletedRelationId(deletedRelationId) {
      if (deletedRelationId) {
        const map = this.subRelationMap[deletedRelationId];
        let currentRelation = this.mainRelationData;
        for (let x = 0; x < map.length - 1; x++) {
          const index = map[x];
          currentRelation = currentRelation["relations"][index];
        }
        currentRelation["relations"].splice(map[map.length - 1], 1);
        this.mapRelations();
      }
    },
    activeCreateWindow(activeCreateWindow) {
      if (activeCreateWindow !== false) {
        this.selectedStatementId = 0;
      }
    },
  },
  computed: {
    totaRelevanceWindowHeight() {
      let headerHeight = 96; // px
      let topToolbarHeight = 41;
      const separatorHeight = 18 + 48 + 10; // px, 48 is  the Support and Counter label height
      const windowHeight = window.innerHeight; // px
      const mainStatement = this.mainStatementHeight + 4; // 4px for mainstatement border when active
      const mainStatementProfile =
        (typeof this.$refs.mainStatementContainer !== "undefined"
          ? this.$refs.mainStatementContainer.offsetHeight
          : 0) -
        mainStatement +
        mainStatement; // just to trigger this commputed value everytime the main statement text is changed
      if (this.isReadingMode) {
        headerHeight = 0;
        topToolbarHeight = 25;
      }
      const totaRelevanceWindowHeight =
        windowHeight -
        headerHeight -
        separatorHeight -
        mainStatementProfile -
        topToolbarHeight;
      return totaRelevanceWindowHeight;
    },
    parentRelationId() {
      return this.mainRelationData
        ? this.mainRelationData["parent_relation_id"]
        : null;
    },
    relationId() {
      return this.$route.params.relationId * 1;
    },

    statementId() {
      return this.$route.params.relationId * 1;
    },
    logicTreeId() {
      return this.mainRelationData
        ? this.mainRelationData["logic_tree_id"]
        : null; // this.$route.params.logicTreeId * 1
    },
    positiveStatements() {
      if (
        this.mainRelationData &&
        typeof this.mainRelationData["relations"] !== "undefined"
      ) {
        return this.mainRelationData["relations"].filter((childStatement) => {
          return childStatement["relevance_window"] * 1 === 0;
        });
      } else {
        return [];
      }
    },
    negativeStatements() {
      if (
        this.mainRelationData &&
        typeof this.mainRelationData["relations"] !== "undefined"
      ) {
        return this.mainRelationData["relations"].filter((childStatement) => {
          return childStatement["relevance_window"] * 1 === 1;
        });
      } else {
        return [];
      }
    },
    statementIdIndexLookUp() {
      if (
        this.mainRelationData &&
        typeof this.mainRelationData["relations"] !== "undefined"
      ) {
        let IdIndexLookUp = {};
        this.mainRelationData["relations"].forEach((childStatement, index) => {
          if (childStatement["statement"]) {
            IdIndexLookUp[childStatement["statement"]["id"]] = index;
          }
        });
        return IdIndexLookUp;
      } else {
        return {};
      }
    },
    supportCounterLabels() {
      let labels = {
        support: "Support",
        counter: "Counter",
      };
      const statementTypes = StatementTypeAPI.cachedData.value
        ? StatementTypeAPI.cachedData.value["data"]
        : null;
      if (this.mainRelationData && statementTypes) {
        const statementTypeId =
          this.mainRelationData["statement"]["statement_type_id"];
        const statementType =
          StatementTypeAPI.cachedDataLookUpById.value[statementTypeId];
        labels["support"] = statementType["support_label"];
        labels["counter"] = statementType["counter_label"];
      }
      return labels;
    },
  },
};
</script>
<style scoped>
.toolbar-bottom-space {
  padding-bottom: 0px;
}
.statement-window {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0px 5px;
}
.dragArea.isDragging {
  min-height: 20px;
  border: 1px dashed;
  padding: 10px;
}
.main-statement-container {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.readingMode {
  z-index: 1030;
  position: absolute;
  margin-top: -95px;
}
</style>
