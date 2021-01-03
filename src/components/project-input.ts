import Cmp from "./base-component.js";
import { Autobind as autobind } from "../decorators/autobind.js";
import * as Validation from "../util/validation.js";
import {projectstate} from "../state/project-state.js";

export class ProjectInput extends Cmp<HTMLDivElement, HTMLInputElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.renderContent();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle, required: true, minLength: 5
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDesription, required: true, minLength: 5
        };
        const numberValidatable: Validation.Validatable = {
            value: enteredPeople, required: true, min: 1, max: 5
        };
        if (!Validation.isValid(titleValidatable) ||
            !Validation.isValid(descriptionValidatable) ||
            !Validation.isValid(numberValidatable)) {
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

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault(); //would trigger htttp event

        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectstate.addProject(title, desc, people);
            this.clearInputs();
        }
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(): void {}
}
