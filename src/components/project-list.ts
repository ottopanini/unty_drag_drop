/// <reference path="base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/project-state.ts"/>
/// <reference path="../models/project.ts"/>
/// <reference path="../models/drag-drop.ts"/>

namespace App {

    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DropTarget {
        assignedProjects: Project[];

        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`);
            this.assignedProjects = [];

            this.configure();
            this.renderContent();
        }

        @Autobind
        dragOverHandler(event: DragEvent): void {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault(); //allow drop
                const listEl = this.element.querySelector('ul')!;
                listEl.classList.add('droppable');
            }
        }

        @Autobind
        dragLeaveHandler(_: DragEvent): void {
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.remove('droppable');
        }

        @Autobind
        dropHandler(event: DragEvent): void {
            let projectId = event.dataTransfer!.getData('text/plain');
            projectstate.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.remove('droppable');
        }

        private renderProjects() {
            const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
            listEl.innerHTML = '';
            for (const assignedProject of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul')!.id, assignedProject);
            }
        }

        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);

            projectstate.addListener((projects:Project[]) => {
                this.assignedProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === ProjectStatus.Active;
                    }
                    return project.status === ProjectStatus.Finished;
                });
                this.renderProjects();
            });
        }

        renderContent() {
            this.element.querySelector('ul')!.id = `${this.type}-project-list`;
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
        }
    }
}