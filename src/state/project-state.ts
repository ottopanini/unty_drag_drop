
namespace App {
    type Listener<T> = (items: T[]) => void;

    class State<T> {
        private listeners: Listener<T>[] = [];

        addListener(listener: Listener<T>) {
            this.listeners.push(listener);
        }

        submit(item: T[]) {
            for (const listenerFn of this.listeners) {
                listenerFn(item.slice());
            }
        }
    }

    export class ProjectState extends State<Project> {
        private projects: Project[] = [];
        private static instance: ProjectState;

        private constructor() {
            super();
        }

        static getInstance() {
            if (!ProjectState.instance) {
                ProjectState.instance = new ProjectState();
            }

            return ProjectState.instance;
        }

        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);

            this.projects.push(newProject);
            this.submit(this.projects);
        }

        moveProject(id: string, newStatus: ProjectStatus) {
            let project = this.projects.find(project => project.id === id);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.submit(this.projects);
            }
        }
    }

    export const projectstate = ProjectState.getInstance();
}
