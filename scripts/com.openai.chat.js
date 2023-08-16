// @ts-check

document.documentElement.style.minWidth = "32em";
document.documentElement.style.minHeight = "32em";

(async () => {
    
    /** @type {{prompt:number}} */
    const { prompt } = await browser.storage.local.get('prompt')

    /** @type {{prompts: Prompt[]}} */
    const { prompts = [] } = await browser.storage.local.get('prompts')

    /** @type {{selection: string}} */
    const { selection } = await browser.storage.local.get('selection')

    await browser.storage.local.remove('prompt')
    await browser.storage.local.remove('selection')

    const query = prompts.find(p => p.id == prompt)?.content
    if (!query)
        return

        
    /** @type HTMLInputElement *///@ts-ignore
    const input = document.getElementById('prompt-textarea')

    await sleep(Math.random() * 1000 + 1000)

    /** @type HTMLButtonElement *///@ts-ignore
    const button = input.nextElementSibling

    if (!input || !button)
        return

    input.focus()
    input.value = query + '\n\n' + selection
    input.dispatchEvent(new Event('input', { bubbles: true }))

    button.click()

})()

async function sleep(timeout = 1000) {

    return new Promise((ok) => setTimeout(ok, timeout))
}