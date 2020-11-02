enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string,
                public title: string,
                public description: string,
                public people: number,
                public status: ProjectStatus) {
    }
}

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;
    private constructor() {
    }

    static getInstance() {
        if (!ProjectState.instance) {
            ProjectState.instance = new ProjectState();
        }

        return ProjectState.instance;
    }

    addListener(listener: Listener) {
        this.listeners.push(listener);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);

        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

const projectstate = ProjectState.getInstance();

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function isValid(validatableInput: Validatable): boolean {
    let valid = true;
    if (validatableInput.required) {
        valid = valid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.toString().trim().length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        valid = valid && validatableInput.value.toString().trim().length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        valid = valid && validatableInput.value <= validatableInput.max;
    }

    return valid;
}

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


class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = [];

        projectstate.addListener((projects:Project[]) => {
            this.assignedProjects = projects.filter(project => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            });
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const assignedProject of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = assignedProject.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }

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

        const titleValidatable: Validatable = {
            value: enteredTitle, required: true, minLength: 5
        };
        const descriptionValidatable: Validatable = {
            value: enteredDesription, required: true, minLength: 5
        };
        const numberValidatable: Validatable = {
            value: enteredPeople, required: true, min: 1, max: 5
        };
        if (!isValid(titleValidatable) ||
                !isValid(descriptionValidatable) ||
                !isValid(numberValidatable)) {
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
            projectstate.addProject(title, desc, people);
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
new ProjectList('active');
new ProjectList('finished');
