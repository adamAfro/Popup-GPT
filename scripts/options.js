// @ts-check
watchSettings()

async function watchSettings() {

    /** @type {{prompts: Prompt[]}} */
    const { prompts = [] } = await getPrompts()

    /** @type HTMLUListElement *///@ts-ignore
    const list = document.getElementById('prompts')
    list.innerHTML = print(prompts)
    
    /** @type HTMLElement[] *///@ts-ignore
    const elements = Array.from(list.children)
    const inputs = elements.map(getInputs)

    for (const input of inputs)// @ts-ignore
        addEventListeners(input)
    
    const addition = document.getElementById('addition')
    addition?.addEventListener('click', () => add(prompts, list))
}

async function add(/**@type {Prompt[]}*/prompts, /**@type {HTMLUListElement}*/list) {

    const lastId = await getLastId()
    const newPrompt = {
        // @ts-ignore
        id: lastId + 1, title: '', content: '' 
    }

    list.insertAdjacentHTML('afterbegin', print([newPrompt]))
    
    prompts.unshift(newPrompt)
    browser.storage.local.set({ prompts })
    
    /** @type HTMLElement *///@ts-ignore
    const li = list.firstElementChild
    if (li) 
        addEventListeners(getInputs(li))
}

function getInputs(/**@type {HTMLElement}*/container) {

    return {

        /** @type HTMLInputElement *///@ts-ignore
        id: container.querySelector('input[name="id"]'),
        
        /** @type HTMLInputElement *///@ts-ignore
        title: container.querySelector('input[name="title"]'),
        
        /** @type HTMLTextAreaElement *///@ts-ignore
        content: container.querySelector('textarea[name="content"]'),
        
        /** @type HTMLButtonElement *///@ts-ignore
        removal: container.querySelector('button[name="removal"]')
    }
}

async function getLastId() {

    /** @type {{prompts: Prompt[]}} */
    const { prompts = [] } = await getPrompts()

    return Math.max(...prompts.map(({ id }) => id), 0)
}


/** @param {Prompt[]} prompts */
function print(prompts, template = document.getElementById('prompt-template')) {

    let html = ''
    for (const { id, title, content } of prompts) {

        html += `<li>` + template?.innerHTML
            .replace('{id}', id.toString())
            .replace('{title}', title)
            .replace('{content}', content) + "</li>"
    }

    return html
}

function addEventListeners(/**@type {PromptInputs}*/inputs) {

    inputs.content.addEventListener('change', async () => {

        const { prompts = [] } = await getPrompts()
        const index = prompts
            .findIndex(p => p.id == Number(inputs.id.value))

        prompts[index].content = inputs.content.value

        await updatePrompts(prompts)
        
    })

    inputs.title.addEventListener('change', async () => {

        const { prompts = [] } = await getPrompts()
        const index = prompts
            .findIndex(p => p.id == Number(inputs.id.value))

        prompts[index].title = inputs.title.value

        await updatePrompts(prompts)
        
    })

    inputs.removal.addEventListener('click', async () => {

        const { prompts = [] } = await getPrompts()
        const index = prompts
            .findIndex(p => p.id == Number(inputs.id.value))

        prompts.splice(index, 1)
        inputs.removal.parentElement?.parentElement?.remove()

        await updatePrompts(prompts)
        
    })
}

/** @return {Promise<{prompts: Prompt[]}>} */
async function getPrompts() {

    return await browser.storage.local.get('prompts')
}

async function updatePrompts(/**@type Prompt[]*/ prompts) {
    
    await browser.contextMenus.removeAll()
    await browser.storage.local.set({ prompts })
    for (const prompt of prompts)
        await setPrompt(prompt)
}

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