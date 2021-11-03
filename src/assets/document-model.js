export default async function() {
    return await [
        {
            id: 'block-1-FdsvfdULHNH',
            insert: 'h1',
            content: 'Lorem Ipsum',
            attrs: {
                align: 'center'
            }
        },
        {
            id: 'block-l1-wsqw2TsTcCT',
            insert: 'p',
            content : [
                {
                    id: 'inline-21-cfers',
                    insert: 'ul',
                    content: [
                        { id: 'inline-22-tgrsa', insert: 'li', content: 'Cras justo odio' },
                        { id: 'inline-22-krsas', insert: 'li', content: 'Dapibus ac facilisis in' },
                        { id: 'inline-22-trsta', insert: 'li', content: 'Morbi leo risus' },
                        { id: 'inline-22-hwear', insert: 'li', content: 'Porta ac consectetur ac' },
                        { id: 'inline-22-6hfes', insert: 'li', content: 'Vestibulum at eros' }
                    ]
                }
            ],
            attrs: {
                align: 'left'
            }
        },
        {
            id: 'block-l1-wsn4oTsTcCT',
            insert: 'p',
            content : 'This generator allows to generate random text for testing purposes. If you are the QA Engineer, you, probably, have needed at least once to paste any dummy text to test the field in the site, or to test any function, or feature, etc. It takes time to find any random text with exact symbols or words you need. But with our generator you can create random text in several seconds. Usually, the most often used dummy text is the text which begins with "Lorem Ipsum". We use this text for our generator too. All our generators are created by testers, so we truly believe that this random symbols generator will save your time.',
            attrs: {
                align: 'left'
            }
        }
    ]
}