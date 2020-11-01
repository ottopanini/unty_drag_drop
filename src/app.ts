
function Autobind(_: any, _2: string, propertyDescriptor: PropertyDescriptor) {
    const orginalMethod = propertyDescriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = orginalMethod.bind(this);
            return boundFn;
        }
    }

    return adjDescriptor;
}


class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if (enteredTitle.trim().length === 0 || enteredDesription.trim().length === 0 || enteredPeople.trim().length === 0) {
            alert('invalid input, please try again');
            return;
        } else {
            return [enteredTitle, enteredDesription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault(); //would trigger htttp event

        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title + " " + desc + " " + people);
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler);

    }


    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

new ProjectInput();
