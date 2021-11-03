<template>
    <div class="editor">
        <div class="editor-toolbar-wrapper display-flex flex-justify-content-center">
            <EditorToolBar
                :type.sync="selectedType"
                :wrap.sync="selectedWrap"
                :toggles.sync="selectedToggles"
                :deleteBlock.sync="deleteBlock"
                :moveBlockUp.sync="moveBlockUp"
                :fontSize.sync="selectedFontSize"
                :textAlign.sync="selectedTextAlign"
                :moveBlockDown.sync="moveBlockDown"
                :createNewBlock.sync="createNewBlock"
                :fontStyling.sync="selectedFontStyle"
                :fontFamily.sync="selectedFontFamily"
            />
        </div>
        <div class="editor-content-wrapper">
            <EditorContent
                :type="selectedType"
                :currentDocument="document"
                :toggles.sync="selectedToggles"
                :deleteBlock.sync="deleteBlock"
                :moveBlockUp.sync="moveBlockUp"
                :fontFamily="selectedFontFamily"
                :fontSize.sync="selectedFontSize"
                :textAlign.sync="selectedTextAlign"
                :moveBlockDown.sync="moveBlockDown"
                :createNewBlock.sync="createNewBlock"
                :fontStyling.sync="selectedFontStyle"
            />
        </div>
    </div>
</template>

<script>
import documentModel from "../../assets/document-model.js"

import EditorToolBar from "./edit-components/toolbar.vue"
import EditorContent from "./edit-components/contentArea.vue"

export default {
    name: "Editor",
    components: { EditorToolBar, EditorContent },

    data() {
        return {
            document: [],

            selectedType: 'p',
            selectedWrap: '',
            selectedToggles: null,
            selectedFontSize: null,
            selectedTextAlign: null,
            selectedFontStyle: null,
            selectedFontFamily: 'arial',
            
            deleteBlock: false,
            moveBlockUp: false,
            moveBlockDown: false,
            createNewBlock: false,
        }
    },

    created() {
        if(this.document.length <= 0) {
            this.getDocumentModel().then(res => {
                if(res.length === 0) {
                    console.log("EMPTY => HANDLE THIS!!!!!!")
                } else {
                    this.document = res
                }
            })
        }
    },

    methods: {
        async getDocumentModel() {
            return await documentModel()
        },
    },
}
</script>

<style scoped>
.editor {
    margin: 10px;
}

.editor-toolbar-wrapper {
    margin: auto;
    height: 100px;
    display: flex;
    justify-content: center;
    background-color: red;
}

.editor-content-wrapper {
    border-radius: 5px;
    padding: 20px 10px 10px 10px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(0, 0, 0, 0.23) 0px 1px 4px;
}
</style>