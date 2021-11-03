<script>
/* eslint-disable */ // Do not remove this comment => Being used to stop linting.

export default {
    name: "EditorContent",
    props: {
        type: { type: String, default: null },
        toggles: { type: String, default: null },
        currentDocument: { type: Array, default: () => ([]) },

        fontStyling: { type: String, default: null },
        fontSize: { type: String, default: null },
        fontFamily: { type: String, default: null },
        textAlign: { type: String, default: null },

        deleteBlock: { type: Boolean, default: false },
        moveBlockUp: { type: Boolean, default: false },
        moveBlockDown: { type: Boolean, default: false },
        createNewBlock: { type: Boolean, default: false },
    },

    emits: [
        'update:fontSize',
        'update:fontFamily',
        'update:fontStyling',
        'update:toggles',
        'update:document',
        'update:moveBlockUp',
        'update:deleteBlock',
        'update:moveBlockDown',
        'update:createNewBlock',
        'update:textAlign',
    ],

    data() {
        return {
            ranges: {},
            document: [],
            currentFontSize: 15,
            selectedElementIndex: null,
            editorAttributes: [
                { class: 'text-left', key: 'left', value: true },
                { class: 'text-right', key: 'right', value: true },
                { class: 'text-center', key: 'center', value: true },
                { class: 'text-justify', key: 'justify', value: true },
                { class: 'text-bold', key: 'bold', value: true },
                { class: 'text-italic', key: 'italic', value: true },
                { class: 'text-underline', key: 'underline', value: true },
                { class: 'text-strikethrough', key: 'strikethrough', value: true },
                { class: 'font-size', key: 'fontSize', regx: /^font-size-[1-2][0-9]$/, prefix: 'font-size-' },
                { class: 'font-family', key: 'fontFamily', regx: /^font-family-(.*)/, prefix: 'font-family-' },
            ],
        }
    },

    watch: {
        toggles: {
            handler(value) {
                if(value !== null && value !== undefined && Object.entries(this.ranges).length >= 1) {

                    for(const [key, val] of Object.entries(this.ranges)) {
                        this.modifyDOMElement(key, val, value, this.document)
                    }

                    this.$emit('update:toggles', null)
                }
            },

            deep: true
        },

        fontStyling: {
            handler(value) {
                if(value !== null && value !== undefined) {
                    if(value === "highlight") {
                        console.log('Highlight')
                    } else if(value === "color") {
                        console.log('Color')
                    }

                    this.$emit('update:fontStyling', null)
                }
            }
        },

        fontSize: {
            handler(value) {
                if(value !== null && value !== undefined && Object.entries(this.ranges).length >= 1) {
                    for(const [key, val] of Object.entries(this.ranges)) {
                        this.modifyDOMElement(key, val, value, this.document)
                    }

                    this.$emit('update:fontSize', null)
                }
            }
        },

        fontFamily: {
            handler(value) {
                if(value !== null && value !== undefined && Object.entries(this.ranges).length >= 1) {
                    for(const [key, val] of Object.entries(this.ranges)) {
                        this.modifyDOMElement(key, val, value, this.document)
                    }
                }
            }
        },

        textAlign: {
            handler(value) {
                if(value !== null && value !== undefined && this.selectedElementIndex !== null) {
                    if(this.document[this.selectedElementIndex].attrs === null || this.document[this.selectedElementIndex].attrs === undefined) {
                        this.$set(this.document[this.selectedElementIndex], 'attrs', {})
                    }

                    this.$set(this.document[this.selectedElementIndex].attrs, 'align', value)
                }
            }
        },

        createNewBlock: {
            handler(value) {
                if(value) {
                    this.enterNewBlock()
                    this.$emit('update:createNewBlock', false)
                }
            }
        },

        moveBlockUp: {
            handler(value) {
                if(value) {
                    this.moveSelectedBlockUp()
                    this.$emit('update:moveBlockUp', false)
                }
            }
        },

        moveBlockDown: {
            handler(value) {
                if(value) {
                    this.moveSelectedBlockDown()
                    this.$emit('update:moveBlockDown', false)
                }
            }
        },

        deleteBlock: {
            handler(value) {
                if(value) {
                    this.deleteSelectedBlock()
                    this.$emit('update:deleteBlock', false)
                }
            }
        }
    },

    mounted() {
        this.$nextTick(() => {
            function editorArea(selection) {
                let contentNode = selection.focusNode.parentElement
                while(contentNode !== null) {
                    const contentNodeID = contentNode.getAttribute('id')
                    if(contentNodeID !== null && contentNodeID !== 'editor-content') {
                        contentNode = document.getElementById(contentNodeID).parentNode
                    } else if(contentNodeID !== null && contentNodeID === 'editor-content') {
                        return true
                    } else if(contentNodeID === null) {
                        return false
                    }
                }

                return false
            }

            document.onselectionchange = () => {
                const selection = document.getSelection()

                if(editorArea(selection)) {
                    this.ranges = {}

                    for(let i=0; i<selection.rangeCount; ++i) {
                        const selectionObject = selection.getRangeAt(i)

                        const startContainerID = selectionObject.startContainer.parentElement.getAttribute('id')
                        const selectionStartIndex = selectionObject.startOffset

                        const endContainerID = selectionObject.endContainer.parentElement.getAttribute('id')
                        const selectionEndIndex = selectionObject.endOffset

                        let parentID = startContainerID
                        
                        // Find id of main container.
                        while(document.getElementById(parentID).tagName.toLowerCase() === 'span') {
                            parentID = document.getElementById(parentID).parentElement.id
                        }

                        // Get all span tags which are inside the main container
                        const spanTags = document.getElementById(parentID).getElementsByTagName('span')
                        
                        const rangeArray = []
                        
                        if(spanTags.length > 0) {
                            // If we had applied some styling to the content earlier.
                            let foundSelectionStartContainer = false
                            let foundSelectionEndContainer = false
                            
                            if(startContainerID !== endContainerID) {
                                for(var m=0; m<spanTags.length; ++m) {
                                    const spanID = spanTags[m].getAttribute('id')

                                    let containerPartitions = null
                                    if(spanID === startContainerID) {
                                        containerPartitions = this.splitContainerIn2Halves(spanID, selectionStartIndex, parentID, false)
                                        foundSelectionStartContainer = true
                                    }

                                    if(spanID === endContainerID) {
                                        containerPartitions = this.splitContainerIn2Halves(spanID, selectionEndIndex, parentID, true)
                                        foundSelectionEndContainer = true
                                    }
                                    
                                    if(containerPartitions !== null && containerPartitions !== undefined) {
                                        // push both the halves in the array
                                        rangeArray.push(containerPartitions.firstHalf)
                                        if(containerPartitions.secondHalf !== null) {
                                            rangeArray.push(containerPartitions.secondHalf)
                                        }
                                    } else {
                                        // Push the span without splitting.
                                        const spanAttributes = (document.getElementById(spanID).classList.length !== 0) ? this.getAttributesFromClasses(document.getElementById(spanID).classList) : {}
                                        rangeArray.push(this.makeSpanElement("convert", spanID, spanTags[m].innerText, parentID, spanAttributes, (foundSelectionStartContainer^foundSelectionEndContainer)))
                                    }    
                                }
                            } else {
                                for(var n=0; n<spanTags.length; ++n) {
                                    const spanID = spanTags[n].getAttribute('id')

                                    if(spanID === startContainerID) {
                                        const containerPartitions = this.splitContainerIn3Halves(spanID, selectionStartIndex, selectionEndIndex, parentID)
                                        if(containerPartitions !== null && containerPartitions !== undefined) {
                                            rangeArray.push(containerPartitions.firstHalf)
                                            if(containerPartitions.secondHalf !== null) {
                                                rangeArray.push(containerPartitions.secondHalf)
                                            }

                                            if(containerPartitions.thirdHalf !== null) {
                                                rangeArray.push(containerPartitions.thirdHalf)
                                            }
                                        }
                                    } else {
                                        const spanAttributes = (document.getElementById(spanID).classList.length !== 0) ? this.getAttributesFromClasses(document.getElementById(spanID).classList) : {}
                                        rangeArray.push(this.makeSpanElement("convert", spanID, spanTags[n].innerText, parentID, spanAttributes, false))
                                    }
                                }
                            }
                        } else {
                            const containerPartitions = this.splitContainerIn3Halves(parentID, selectionStartIndex, selectionEndIndex, parentID)
                            if(containerPartitions !== null && containerPartitions !== undefined) {
                                rangeArray.push(containerPartitions.firstHalf)
                                if(containerPartitions.secondHalf !== null) {
                                    rangeArray.push(containerPartitions.secondHalf)
                                }

                                if(containerPartitions.thirdHalf !== null) {
                                    rangeArray.push(containerPartitions.thirdHalf)
                                }
                            }
                        }

                        if(parentID !== null && parentID !== 'app') {
                            this.ranges[parentID] = rangeArray
                        }
                    }
                }
            }
        })
    },

    methods: {
        generateID(length) {
            var result = ''
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            var charactersLength = characters.length
        
            for (var i=0; i<length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
        
            return `${result}`
        },

        makeSpanElement(type, spanID, spanContent, spanParentID, spanAttributes, selectedSpan = false) {
            const spanElement = {
                insert: 'span',
                content: spanContent,
                parent: spanParentID,
                selected: selectedSpan,
                attrs: spanAttributes
            }

            if(/^new$/.test(type)) {
                spanElement.id = `inline-${ this.generateID(11) }`
            } else if(/^convert$/.test(type)) {
                spanElement.id = spanID
            }

            return spanElement
        },

        getAttributesFromClasses(elementClasses) {
            const attributes = {}

            for(var i=0; i<elementClasses.length; ++i) {
                for(var j=0; j<this.editorAttributes.length; ++j) {
                    if(elementClasses[i] === this.editorAttributes[j].class && this.editorAttributes[j].key !== 'fontSize' && this.editorAttributes[j].key !== 'fontFamily') {
                        attributes[this.editorAttributes[j].key] = this.editorAttributes[j].value
                    } else if(this.editorAttributes[j].key === 'fontSize') {
                        if(this.editorAttributes[j].regx.test(elementClasses[i])) {
                            attributes[this.editorAttributes[j].key] = parseInt(elementClasses[i].replace(this.editorAttributes[j].prefix, ''))
                        }
                    } else if(this.editorAttributes[j].key === 'fontFamily') {
                        if(this.editorAttributes[j].regx.test(elementClasses[i])) {
                            attributes[this.editorAttributes[j].key] = elementClasses[i].replace(this.editorAttributes[j].prefix, '')
                        }
                    }
                }
            }

            return attributes
        },

        splitContainerIn2Halves(containerID, splitIndex, parentID, firstHaflSelected) {
            // Make span for both Halves
            let firstHalfSpan = null
            let secondHalfSpan = null

            const containerContent = document.getElementById(containerID).innerText
            const containerAttributes = (document.getElementById(containerID).classList.length !== 0) ? this.getAttributesFromClasses(document.getElementById(containerID).classList) : {}

            if(splitIndex > 0) {
                firstHalfSpan = this.makeSpanElement("new", null, containerContent.substring(0, splitIndex), parentID, containerAttributes, firstHaflSelected)
                secondHalfSpan = this.makeSpanElement("new", null, containerContent.substring(splitIndex), parentID, containerAttributes, !firstHaflSelected)
            } else {
                // If whole container is selected
                firstHalfSpan = this.makeSpanElement("new", null, containerContent, parentID, containerAttributes, true)
            }

            return { firstHalf: firstHalfSpan, secondHalf: secondHalfSpan }
        },

        splitContainerIn3Halves(containerID, splitStartIndex, splitEndIndex, parentID) {
            // Make span for partitions
            let firstHalfSpan = null
            let secondHalfSpan = null
            let thirdHalfSpan = null

            const containerContent = document.getElementById(containerID).innerText
            const containerAttributes = (document.getElementById(containerID).classList.length !== 0) ? this.getAttributesFromClasses(document.getElementById(containerID).classList) : {}

            if(splitStartIndex > 0 && splitEndIndex < containerContent.length) {
                // Make 3 partitions

                firstHalfSpan = this.makeSpanElement("new", null, containerContent.substring(0, splitStartIndex), parentID, containerAttributes, false)
                secondHalfSpan = this.makeSpanElement("new", null, containerContent.substring(splitStartIndex, splitEndIndex), parentID, containerAttributes, true)
                thirdHalfSpan = this.makeSpanElement("new", null, containerContent.substring(splitEndIndex), parentID, containerAttributes, false)
            } else if(splitStartIndex === 0 && splitEndIndex < containerContent.length) {
                // Make 2 partitions

                firstHalfSpan = this.makeSpanElement("new", null, containerContent.substring(0, splitEndIndex), parentID, containerAttributes, true)
                secondHalfSpan = this.makeSpanElement("new", null, containerContent.substring(splitEndIndex), parentID, containerAttributes, false)
            } else if(splitStartIndex > 0 && splitEndIndex === containerContent.length) {
                // Make 2 partitions

                firstHalfSpan = this.makeSpanElement("new", null, containerContent.substring(0, splitStartIndex), parentID, containerAttributes, false)
                secondHalfSpan = this.makeSpanElement("new", null, containerContent.substring(splitStartIndex), parentID, containerAttributes, true)
            } else {
                // Make 1 partition

                firstHalfSpan = this.makeSpanElement("new", null, containerContent, parentID, containerAttributes, true)
            }

            return { firstHalf: firstHalfSpan, secondHalf: secondHalfSpan, thirdHalf: thirdHalfSpan }
        },

        modifyDOMElement(parentElementID, elementContent, elementAttr, rootElement) {
            if(rootElement !== null && rootElement !== undefined) {
                if(typeof rootElement === 'object' && Array.isArray(rootElement)) {
                    for(var k=0; k<rootElement.length; ++k) {
                        this.modifyDOMElement(parentElementID, elementContent, elementAttr, rootElement[k])
                    }
                } else if(typeof rootElement === 'object' && !Array.isArray(rootElement)) {
                    if(rootElement.id === parentElementID) {
                        this.$set(rootElement, 'content', elementContent)
                        
                        for(var k=0; k<rootElement.content.length; ++k) {
                            if(rootElement.content[k].selected) {
                                this.initializeDOMElemetAttributes(rootElement.content[k], rootElement.content[k].attrs)
                                this.addNewAttributeToDOMElement(rootElement.content[k], elementAttr)
                            }

                            this.$delete(rootElement.content[k], 'selected')
                        }
                    } else {
                        this.modifyDOMElement(parentElementID, elementContent, elementAttr, rootElement.content)
                    }
                }
            }
        },

        initializeDOMElemetAttributes(element, attributes) {
            this.$set(element, 'attrs', {})

            var attributeKeys = Object.keys(attributes)

            for(var i=0; i<attributeKeys.length; ++i) {
                if(attributeKeys[i] === 'bold') {
                    this.$set(element.attrs, 'bold', true)
                } else if(attributeKeys[i] === 'italic') {
                    this.$set(element.attrs, 'italic', true)
                } else if(attributeKeys[i] === 'underline') {
                    this.$set(element.attrs, 'underline', true)
                } else if(attributeKeys[i] === 'strikethrough') {
                    this.$set(element.attrs, 'strikethrough', true)
                } else if(attributeKeys[i] === 'fontSize') {
                    this.$set(element.attrs, 'fontSize', attributes[attributeKeys[i]])
                } else if(attributeKeys[i] === 'fontFamily') {
                    this.$set(element.attrs, 'fontFamily', attributes[attributeKeys[i]])
                }
            }
        },

        addNewAttributeToDOMElement(element, attribute) {
            if(/^b$/.test(attribute)) {
                if('bold' in element.attrs) {
                    this.$set(element.attrs, 'bold', !element.attrs.bold)
                } else {
                    this.$set(element.attrs, 'bold', true)
                } 
            } else if(/^i$/.test(attribute)) {
                if('italic' in element.attrs) {
                    this.$set(element.attrs, 'italic', !element.attrs.italic)
                } else {
                    this.$set(element.attrs, 'italic', true)
                } 
            } else if(/^u$/.test(attribute)) {
                if('underline' in element.attrs) {
                    const activate = !element.attrs.underline
                    if(activate) {
                        if('strikethrough' in element.attrs) {
                            if(element.attrs.strikethrough) {
                                this.$set(element.attrs, 'strikethrough', false)
                            }
                        }

                        this.$set(element.attrs, 'underline', true)
                    } else {
                        this.$set(element.attrs, 'underline', false)
                    }
                } else {
                    this.$set(element.attrs, 'underline', true)
                } 
            } else if(/^s$/.test(attribute)) {
                if('strikethrough' in element.attrs) {
                    const activate = !element.attrs.strikethrough
                    if(activate) {
                        if('underline' in element.attrs) {
                            if(element.attrs.underline) {
                                this.$set(element.attrs, 'underline', false)
                            }
                        }

                        this.$set(element.attrs, 'strikethrough', true)
                    } else {
                        this.$set(element.attrs, 'strikethrough', false)
                    }
                } else {
                    this.$set(element.attrs, 'strikethrough', true)
                } 
            } else if(/^increase$/.test(attribute)) {
                if('fontSize' in element.attrs) {
                    // Maximum size is 30px

                    if(element.attrs.fontSize + 1 <= 30) {
                        this.$set(element.attrs, 'fontSize', ++element.attrs.fontSize)
                    }
                } else {
                    this.$set(element.attrs, 'fontSize', 17)
                }
            } else if(/^decrease$/.test(attribute)) {
                if('fontSize' in element.attrs) {
                    // Minimum size is 10 px

                    if(element.attrs.fontSize - 1 >= 10) {
                        this.$set(element.attrs, 'fontSize', --element.attrs.fontSize)
                    }
                } else {
                    this.$set(element.attrs, 'fontSize', 15)
                }
            } else if(/^font-family-(.*)/.test(attribute)) {
                const selectedFamily = attribute.replace("font-family-", "")
                console.log(selectedFamily)

                if('fontFamily' in element.attrs) {
                    if(selectedFamily !== element.attrs.fontFamily) {
                        this.$set(element.attrs, 'fontFamily', selectedFamily)
                    } else {
                        this.$delete(element.attrs, 'fontFamily')
                    }
                } else {
                    this.$set(element.attrs, 'fontFamily', selectedFamily)
                }
            }
        },

        renderDocument(createElement) {
            const renderArray = []

            for(var index=0; index<this.document.length; ++index) {
                renderArray.push(createElement(this.document[index].insert, {
                    attrs: { id: this.document[index].id, contenteditable: true, tabIndex: index },
                    class: this.typeAttributes(this.document[index].attrs),
                    on: { focus: this.selectContentEditable }
                }, this.renderNodes(this.document[index].content, createElement)))
            }

            return renderArray
        },

        renderNodes(nodes, createElement) {
            let contentNode = ''
            if(typeof nodes === 'object' && Array.isArray(nodes)) {
                if(nodes.length >= 1) {
                    contentNode = []
                    nodes.forEach(node => {
                        if(typeof node === 'object' && node !== null) {
                            if(node.insert === 'span') {
                                contentNode.push(createElement(node.insert, {
                                    attrs: { id: node.id },
                                    class: this.toogleAttributes(node.attrs)
                                }, this.subNodes(node.content, createElement)))
                            } else if(node.insert === 'a') {
                                contentNode.push(
                                    createElement(node.insert, {
                                        attrs: { id: node.id },
                                        href: this.renderAttribute(node.attrs.link),
                                        class: this.toogleAttributes(node.attrs)
                                    }, this.subNodes(node.content, createElement))
                                )
                            } else if(node.insert === 'embed') {
                                contentNode.push(createElement(node.insert, { 
                                    attrs: { id: node.id },
                                    src: this.renderAttribute(node.attrs.source),
                                    type: this.renderAttribute(node.attrs.type),
                                    width: this.renderAttribute(node.attrs.width),
                                    height: this.renderAttribute(node.attrs.height)
                                }))
                            } else {
                                contentNode.push(
                                    createElement(node.insert, {
                                        attrs: { id: node.id },
                                        class: this.toogleAttributes(node.attrs)
                                    }, this.subNodes(node.content, createElement))
                                )
                            }
                        } else {
                            contentNode.push(createElement('span', {}, node))
                        }
                    })
                }
            } else {
                contentNode = nodes
            }

            return contentNode
        },

        typeAttributes(nodeAttrs) {
            return [
                { 'text-left': this.checkAttribute(nodeAttrs, 'align', 'left') },
                { 'text-right': this.checkAttribute(nodeAttrs, 'align', 'right') },
                { 'text-center': this.checkAttribute(nodeAttrs, 'align', 'center') },
                { 'text-justify': this.checkAttribute(nodeAttrs, 'align', 'justify') }
            ]
        },

        checkAttribute(node, attr, value = '') {
            let checkAttr = false
            
            if(value === '') {
                checkAttr = (typeof node === 'object' && attr in node) ? node[attr] : false
            } else {
                checkAttr = (typeof node === 'object' && attr in node && node[attr] === value)
            }

            return checkAttr
        },
        
        fontStylingAttributes(node, attr, prefix) {
            let styleObject = {}
            const styleClass = (typeof node === 'object' && attr in node) ? `${prefix}-${node[attr]}` : null
            
            if(styleClass !== null) {
                styleObject[styleClass] = true
            } else {
                styleObject = null
            }

            return styleObject
        },

        toogleAttributes(nodeAttrs) {
            const nodeAttributes = [
                { 'text-bold': this.checkAttribute(nodeAttrs, 'bold') },
                { 'text-italic': this.checkAttribute(nodeAttrs, 'italic') },
                { 'text-underline': this.checkAttribute(nodeAttrs, 'underline') },
                { 'text-strikethrough': this.checkAttribute(nodeAttrs, 'strikethrough') },
            ]

            const fontSizeObject = this.fontStylingAttributes(nodeAttrs, 'fontSize', 'font-size')
            if(fontSizeObject !== null) {
                nodeAttributes.push(fontSizeObject)
            }

            const fontFamilyObject = this.fontStylingAttributes(nodeAttrs, 'fontFamily', 'font-family')
            if(fontFamilyObject !== null) {
                nodeAttributes.push(fontFamilyObject)
            }

            return nodeAttributes
        },

        subNodes(nodes, createElement) {
            let content = nodes
            if(typeof nodes === 'object' && Array.isArray(nodes)) {
                content = this.renderNodes(nodes, createElement)
            }
            return content
        },

        renderAttribute(nodeAttrs) {
            return (nodeAttrs !== null) ? nodeAttrs : ''
        },

        selectContentEditable() {
            this.selectedElementIndex = parseInt(event.target.getAttribute("tabIndex"))
        },

        enterNewBlock() {
            const newBlock = {
                id: `block-${this.document.length + 1}-${ this.generateID(5) }`,
                insert: this.type,
                content: (this.type !== 'p') ? '' : []
            }

            this.document.push(newBlock)

            setTimeout(() => {
                document.getElementById(newBlock.id).focus()
            })
        },

        moveElement(firstElementIndex, secondElementIndex) {
            const domElements = [this.document[firstElementIndex], this.document[secondElementIndex]]
            this.document.splice(firstElementIndex, 2, domElements[1], domElements[0])

            document.getElementById(this.document[firstElementIndex].id).tabIndex = secondElementIndex
            document.getElementById(this.document[secondElementIndex].id).tabIndex = firstElementIndex
        },

        moveSelectedBlockUp() {
            if(typeof this.selectedElementIndex === "number") {
                if(this.selectedElementIndex > 0) {
                    this.moveElement(this.selectedElementIndex - 1, this.selectedElementIndex)
                    this.selectedElementIndex = null
                }
            }
        },

        moveSelectedBlockDown() {
            if(typeof this.selectedElementIndex === "number") {
                if(this.selectedElementIndex < this.document.length-1) {
                    this.moveElement(this.selectedElementIndex, this.selectedElementIndex + 1)
                    this.selectedElementIndex = null
                }
            }
        },

        deleteSelectedBlock() {
            if(typeof this.selectedElementIndex === "number") {
                if(this.selectedElementIndex >= 0 && this.selectedElementIndex < this.document.length) {
                    this.document.splice(this.selectedElementIndex, 1)
                    this.selectedElementIndex = null
                }
            }
        },
    },

    render(createElement) {
        this.document = this.currentDocument

        return createElement('div', { attrs: {
            id: 'editor-content'
        }, class: 'editor-content' }, this.renderDocument(createElement))
    },

}
</script>

<style scoped>

[contenteditable] {
    padding: 10px;
}

[contenteditable]:focus {
    outline: 2px solid #E0E0E0;
}

/* Text Editor - Text Alignments */

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

.text-justify {
    text-align: justify;
}

/* Text Editor - Font Styling */

.text-bold {
    font-weight: bold;
}

.text-italic {
    font-style: italic;
}

.text-underline {
    text-decoration: underline;
}

.text-strikethrough {
    text-decoration: line-through;
}

/* Text Editor - Font Families */

.font-family-arial {
    font-family: var(--Arial);
}

.font-family-titillium-web {
    font-family: var(--TitilliumWebFont);
}

.font-family-old-standard-tt {
    font-family: var(--OldStandardTTFont);
}

.font-family-alegreya {
    font-family: var(--AlegreyaFont);
}

.font-family-oswald {
    font-family: var(--Oswald);
}

.font-family-lobster {
    font-family: var(--Lobster);
}

.font-family-abrial-fat-face {
    font-family: var(--AbrialFatFace);
}

.font-family-cambria {
    font-family: var(--Cambria);
}

.font-family-crimson-text {
    font-family: var(--CrimsonTextFont);
}


/* Text Editor = font sizes */

.font-size-10 {
    font-size: 10px;
}

.font-size-11 {
    font-size: 11px;
}

.font-size-12 {
    font-size: 12px;
}

.font-size-13 {
    font-size: 13px;
}

.font-size-14 {
    font-size: 14px;
}

.font-size-15 {
    font-size: 15px;
}

.font-size-16 {
    font-size: 16px;
}

.font-size-17 {
    font-size: 17px;
}

.font-size-18 {
    font-size: 18px;
}

.font-size-19 {
    font-size: 19px;
}

.font-size-20 {
    font-size: 20px;
}

.font-size-21 {
    font-size: 21px;
}

.font-size-22 {
    font-size: 22px;
}

.font-size-23 {
    font-size: 23px;
}

.font-size-24 {
    font-size: 24px;
}

.font-size-25 {
    font-size: 25px;
}

.font-size-26 {
    font-size: 26px;
}

.font-size-27 {
    font-size: 27px;
}

.font-size-28 {
    font-size: 28px;
}

.font-size-29 {
    font-size: 29px;
}

.font-size-30 {
    font-size: 30px;
}

</style>