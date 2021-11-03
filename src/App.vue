<template>
    <Editor />
</template>

<script lang="ts">
import Editor from './components/editor-edit/editor.vue'

export default {
    components: {
        Editor
    },

    data() {
        return {
            //
        }
    },
}

</script>

<style>

.display-flex {
    display: flex;
}

.flex-row {
    flex-direction: row;
}

.flex-row-nowrap {
    flex-flow: row nowrap;
}

.flex-row-wrap {
    flex-flow: row wrap;
}

.flex-column {
    flex-direction: column;
}

.flex-column-nowrap {
    flex-flow: column nowrap;
}

.flex-align-center {
    align-items: center;
}

.flex-justify-content-center {
    justify-content: center;
}

.flex-center {
    align-items: center;
    justify-content: center;
}

.input-label {
    width: 15%;
}
  
.input-content {
    width: 85%;
}

.field-heading {
    margin: 5px 0px;
    font-size: 17px;
    font-weight: bold;
    font-family: var(--Cambria);
}


/* light-heading class is used in update views in admin panel*/

.light-heading {
    color: #BDBDBD;
}
</style>