<template>
    <!-- Make toolbar adjustable with varying heights -->
    <div class="editor-toolbar-container display-flex flex-center max-height flex-center">
        <div class="display-flex flex-row-nowrap max-height">
            <div class="display-flex flex-center max-height">
                <div class="divider"></div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="display-flex flex-column-nowrap max-height">
                    <div class="dropdown-wrapper max-height-49-5 display-flex flex-center" style="width: 160px;">
                        <div class="dropdown-selected-option-wrapper display-flex flex-center" @click="showDropdown('fontFamilySelection', 1, null)">
                            <div class="display-flex flex-row-nowrap">
                                <div class="dropdown-selected-option display-flex flex-center">{{ selectedFontFamily }}</div>
                                <div class="dropdown-icon display-flex flex-center" :class="{ 'dropdown-icon-active': fontFamilyDropdownVisibile }">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <transition name="expand-transition">
                            <div v-show="fontFamilyDropdownVisibile" class="dropdown-list display-flex flex-column-nowrap" style="top: 40px;">
                                <div
                                    v-for="(option, optionIndex) in toolbarFontFamilyOptions"
                                    :key="optionIndex"
                                    class="dropdown-list-option display-flex flex-center"
                                    @click="showDropdown('fontFamilySelection', 2, option.text)"
                                >{{ option.text }}</div>
                            </div>
                        </transition>
                    </div>
                    <div class="divider-vertical"></div>
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarFontStylingButtons" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="fontStylingButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="divider"></div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="display-flex flex-column-nowrap max-height">
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarFontAlignButtons" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="textAlignButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                    <div class="divider-vertical"></div>
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarToggleButtons" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="toggleButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="divider"></div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="display-flex flex-column-nowrap max-height">
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarFontExtraOptions" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="wrapButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                    <div class="divider-vertical"></div>
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarWrapbuttons" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="wrapButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="divider"></div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="display-flex flex-column-nowrap max-height">
                    <div class="max-height-49-5 display-flex flex-row-nowrap">
                        <div v-for="(button, order) in toolbarBlockbuttons" :id="button.value" :key="order" class="tooltip icon-button-wrapper display-flex flex-center" @click="blockContentButton(button.value)">
                            <span class="tooltiptext">{{ button.text }}</span>
                            <i class="button-icon" :class="button.icon"></i>
                        </div>
                    </div>
                    <div class="divider-vertical"></div>
                    <div class="dropdown-wrapper max-height-49-5 display-flex flex-center">
                        <div class="dropdown-selected-option-wrapper display-flex flex-center" @click="showDropdown('blockTypeSelection', 1, null)">
                            <div class="display-flex flex-row-nowrap">
                                <div class="dropdown-selected-option display-flex flex-center">{{ selectedBlockType }}</div>
                                <div class="dropdown-icon display-flex flex-center" :class="{ 'dropdown-icon-active': blockTypeDropdownVisibile }">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <transition name="expand-transition">
                            <div v-show="blockTypeDropdownVisibile" class="dropdown-list display-flex flex-column-nowrap">
                                <div
                                    v-for="(option, optionIndex) in toolbarBlockTypeOptions"
                                    :key="optionIndex"
                                    class="dropdown-list-option display-flex flex-center"
                                    @click="showDropdown('blockTypeSelection', 2, option.text)"
                                >{{ option.text }}</div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="display-flex flex-center max-height">
                <div class="divider"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "EditorToolBar",
    
    props: {
        type: { type: String, default: null },
        wrap: { type: String, default: null },
        toggles: { type: String, default: null },

        fontSize: { type: String, default: null },
        textAlign: { type: String, default: null },
        fontFamily: { type: String, default: null },
        fontStyling: { type: String, default: null },

        deleteBlock: { type: Boolean, default: false },
        moveBlockUp: { type: Boolean, default: false },
        moveBlockDown: { type: Boolean, default: false },
        createNewBlock: { type: Boolean, default: false },
    },

    emits: [
        'update:type',
        'update:wrap',
        'update:toogles',
        'update:fontSize',
        'update:textAlign',
        'update:fontFamily',
        'update:deleteBlock',
        'update:moveBlockUp',
        'update:fontStyling',
        'update:moveBlockDown',
        'update:createNewBlock',
    ],

    data() {
        return {
            selectedBlockType: "Paragraph",
            blockTypeDropdownVisibile: false,
            toolbarBlockTypeOptions: [
                { text: 'Paragraph', value: 'p' },
                { text: 'Heading 1', value: 'h1' },
                { text: 'Heading 2', value: 'h2' },
                { text: 'Heading 3', value: 'h3' },
                { text: 'Heading 4', value: 'h4' },
                { text: 'Heading 5', value: 'h5' },
                { text: 'Quote', value: 'blockquote' },
                { text: 'Preformatted', value: 'pre' },
                { text: 'Bullet List', value: 'ul' },
                { text: 'Number List', value: 'ol' }
            ],

            selectedFontFamily: "Arial",
            fontFamilyDropdownVisibile: false,

            toolbarFontFamilyOptions: [
                { text: 'Arial', value: 'arial' },
                { text: 'Oswald', value: 'oswald' },
                { text: 'Cambria', value: 'cambria' },
                { text: 'Lobster', value: 'lobster' },
                { text: 'Alegreya', value: 'alegreya' },
                { text: 'Abrial Fat Face', value: 'abrial-fat-face' },
                { text: 'Crimson Text', value: 'crimson-text' },
                { text: 'Titillium Web', value: 'titillium-web' },
                { text: 'Old Standard TT', value: 'old-standard-tt' },
            ],

            toolbarFontStylingButtons: [
                { icon: "fas fa-arrow-up", text: 'Increase Size', value: 'increase' },
                { icon: "fas fa-arrow-down", text: 'Decrease Size', value: 'decrease' },
                { icon: "fas fa-highlighter", text: 'Highlight', value: 'highlight' },
                { icon: "fas fa-paint-brush", text: 'Text Color', value: 'color' },
            ],

            toolbarFontAlignButtons: [
                { icon: "fas fa-align-left", text: 'Left', value: 'left' },
                { icon: "fas fa-align-center", text: 'Center', value: 'center' },
                { icon: "fas fa-align-right", text: 'Right', value: 'right' },
                { icon: "fas fa-align-justify", text: 'Justify', value: 'justify' },
            ],

            toolbarFontExtraOptions: [
                { icon: "fas fa-subscript", text: 'Sub-Script', value: 'subscript' },
                { icon: "fas fa-superscript", text: 'Super-Script', value: 'super-script' },
                { icon: "fas fa-highlighter", text: 'Highlight', value: 'highlight' },
                { icon: "fas fa-paint-brush", text: 'Text Color', value: 'color' },
            ],

            toolbarToggleButtons: [
                { icon: "fas fa-bold", text: 'Bold', value: 'b' },
                { icon: "fas fa-italic", text: 'Italic', value: 'i' },
                { icon: "fas fa-underline", text: 'Underline', value: 'u' },
                { icon: "fas fa-strikethrough", text: 'Strikethrough', value: 's' }
            ],

            toolbarBlockbuttons: [
                { icon: 'fas fa-plus-square', text: 'New Block', value: 1 },
                { icon: 'fas fa-arrow-alt-circle-up', text: 'Move Up', value: 2 },
                { icon: 'fas fa-arrow-alt-circle-down', text: 'Move Down', value: 3 },
                { icon: 'fas fa-trash', text: 'Delete Block', value: 4 },
            ],

            toolbarWrapbuttons: [
                { icon: 'fas fa-list-ul', text: 'Bullet List', value: 'ul' },
                { icon: 'fas fa-list-ol', text: 'Number List', value: 'ol' },
                { icon: 'fas fa-link', text: 'Link', value: 'a' },
                { icon: 'fas fa-paint-brush', text: 'Text Color', value: 'color' }
            ],
        }
    },

    watch: {
        selectedType: {
            handler(value) {
                this.toolbarBlockTypeOptions.forEach(blockType => {
                    if(blockType.text === value) {
                        this.$emit('update:type', blockType.value)
                    }
                })
            }
        },

        selectedFontFamily: {
            handler(value) {
                this.toolbarFontFamilyOptions.forEach(fontFamily => {
                    if(fontFamily.text === value) {
                        this.$emit('update:fontFamily', `font-family-${fontFamily.value}`)
                    }
                })
            }
        }
    },

    methods: {
        showDropdown(dropdown, action, buttonValue) {
            if(dropdown === 'blockTypeSelection') {
                if(action === 1) {
                    this.blockTypeDropdownVisibile = !this.blockTypeDropdownVisibile
                } else if(action === 2) {
                    this.blockTypeDropdownVisibile = false
                    this.selectedBlockType = buttonValue
                }
            } else if(dropdown === 'fontFamilySelection') {
                if(action === 1) {
                    this.fontFamilyDropdownVisibile = !this.fontFamilyDropdownVisibile
                } else if(action === 2) {
                    this.fontFamilyDropdownVisibile = false
                    this.selectedFontFamily = buttonValue
                }
            }
        },

        fontStylingButton(buttonValue) {
            if(buttonValue === "increase" || buttonValue === "decrease") {
                this.$emit('update:fontSize', buttonValue)
            } else if(buttonValue === "highlight" || buttonValue === "color") {
                this.$emit('update:fontStyling', buttonValue)
            }
        },

        toggleButton(buttonValue) {
            this.$emit('update:toggles', buttonValue)
        },

        textAlignButton(buttonValue) {
            this.$emit('update:textAlign', buttonValue)
        },

        blockContentButton(buttonValue) {
            if(buttonValue === 1) {
                this.$emit('update:createNewBlock', true)
            } else if(buttonValue === 2) {
                this.$emit('update:moveBlockUp', true)
            } else if(buttonValue === 3) {
                this.$emit('update:moveBlockDown', true)
            } else if (buttonValue === 4) {
                this.$emit('update:deleteBlock', true)
            }
        },

        wrapButton(index, button) {
            const wrapAction = this.toolbar[index].action = button.value
            this.$emit('update:wrap', wrapAction)
        },
    },
}
</script>

<style scoped>
.max-height {
    height: 100%;
}

.max-width {
    width: 100%;
}

.max-height-49-5 {
    height: 49.5%;
}

.divider {
    width: 1px;
    height: 100%;
}

.divider-vertical {
    height: 1%;
    width: 100%;
}

.divider, .divider-vertical{
    background-color: #E0E0E0;
}

.editor-toolbar-container {
    margin-top: 35px; /* User depfined paramter. */

    width: 90%;
    height: 80px;
    /* position: absolute; */
    display: flex;
    z-index: 1000;
    border-radius: 10px;
    border: 1px solid #E0E0E0;
    background-color: #FFFFFF;
}

.dropdown-wrapper {
    -khtml-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: 100ms all ease;
}

.dropdown-wrapper:hover, .icon-button-wrapper:hover, .view-HTML-wrapper:hover, .dropdown-list .dropdown-list-option:hover {
    background-color: #EEEEEE;
}

.dropdown-selected-option-wrapper {
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-weight: bold;
    font-family: var(--TitilliumWebFont);
}

.dropdown-selected-option-wrapper > div {
    width: 100%;
}

.dropdown-selected-option {
    width: 85%;
    font-size: 15px;
}

.dropdown-icon {
    width: 15%;
    font-size: 13px;
    transition: 100ms all ease;
}

.dropdown-icon-active {
    transform: rotate(180deg);
}

.dropdown-list {
    top: 80px;
    z-index: 2;
    width: 150px;
    opacity: 0.95;
    padding-top: 5px;
    padding-bottom: 5px;
    position: absolute;
    background-color: #FFFFFF;
    border: 0.5px solid #E0E0E0;
}

.dropdown-list .dropdown-list-option {
    width: 100%;
    cursor: pointer;
    font-size: 15px;
    padding: 2px 0px;
    font-family: var(--TitilliumWebFont);
}

.icon-button-wrapper {
    width: 40px;
    font-size: 15px;
    cursor: pointer;
    background-color: #FFFFFF;
    transition: 100ms all ease;
}

.button-icon {
    margin: 10px 15px;
}

.view-HTML-wrapper {
    height: 100%;
    width: 160px;
    font-size: 15px;
    transition: 100ms all ease;
    cursor: pointer;
    font-family:  var(--TitilliumWebFont);
}

.view-HTML-wrapper .view-HTML-icon {
    width: 25%;
}

.view-HTML-wrapper .view-HTML-label {
    width: 75%;
    font-weight: bold;
}

.tooltip {
    position: relative;
}

.tooltip .tooltiptext {
    width: 100px;
    z-index: 1;
    top: 120%;
    left: 80%;
    color: #fff;
    padding: 5px 0;
    opacity: 0.9;
    font-size: 13px;
    text-align: center;
    margin-left: -60px;
    position: absolute;
    border-radius: 6px;
    visibility: hidden;
    background-color: #424242;
    font-family: var(--TitilliumWebFont);
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #424242 transparent;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}

.expand-transition-enter-active {
    transition: all 1s ease;
}

.expand-transition-leave-active {
    /* transform: translateY(-100%); */
    /* transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
    transition: all 1s ease;
}

.expand-transition-enter, .expand-transition-leave-to {
    /* height: 0%; */
    transform: translateY(-50%);
}

</style>