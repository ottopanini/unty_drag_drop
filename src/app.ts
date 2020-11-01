class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        console.log(this.templateElement);
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        console.log(this.hostElement);
        const importedNode = document.importNode(this.templateElement.content, true);
        console.log(importedNode);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        console.log(this.element);
        this.element.id = 'user-input';
        this.attach();
        console.log(this.hostElement);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();
