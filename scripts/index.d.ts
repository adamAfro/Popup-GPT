declare const browser: any;


type MenuItem = { 
    id?: string, title: string, contexts?: string[] 
}


type Prompt = { 
    id: number, title: string, content: string 
}

type PromptInputs = {
    id: HTMLInputElement, 
    title: HTMLInputElement, 
    content: HTMLTextAreaElement, 
    removal: HTMLButtonElement
}

type ContextMenuInfo = {
    menuItemId: string,
    selectionText: string
}