// @ts-check
browser.contextMenus
    .onClicked.addListener(itemsHandler)
browser.storage.local.get('prompts')
    .then(({ prompts = [] }) => prompts.map(setPrompt))

/** @ts-ignore */
let lastPromptId = 0
async function setPrompt({id = 0, title = 'OpenAI GPT Chat' } = {}) {

    const PROMPT_LENGTH = 24
    if (title.length > PROMPT_LENGTH)
        title = title.slice(0, PROMPT_LENGTH - 3) + '...'
    
    if (!id)
        id = lastPromptId + 1, lastPromptId = id;

    await browser.contextMenus.create({
        id: id.toString(), title, contexts: ['all']
    })
}

async function itemsHandler(/**@type ContextMenuInfo*/context) {

    const id = context.menuItemId

    browser.permissions.request({ origins: ['https://chat.openai.com/*'] })
    browser.storage.local.set({ 
        prompt: id,
        selection: context.selectionText 
    })
      
    await browser.action.openPopup()
}