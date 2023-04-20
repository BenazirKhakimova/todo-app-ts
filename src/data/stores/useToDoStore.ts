import create, { State, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { generateId } from "../helpers";

interface Task {
    id: string;
    title: string;
    createdAt: number;
}

interface ToDoStore {
    tasks: Task[];
    createTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    removeTask: (id: string) => void;
}

const isToDoStore = (object: any): object is ToDoStore => {
    return "tasks" in object;
};

const localStorageUpdate =
    <T extends State>(config: StateCreator<T>): StateCreator<T> =>
    (set, get, api) =>
        config(
            (nexState, ...args) => {
                if (isToDoStore(nexState)) {
                    window.localStorage.setItem(
                        "tasks",
                        JSON.stringify(nexState)
                    );
                }
                set(nexState, ...args);
            },
            get,
            api
        );

const getTasks = () => {
    try {
        const currentTasks = JSON.parse(
            window.localStorage.getItem("tasks") || "[]"
        );
        return currentTasks.tasks;
    } catch (error) {
        window.localStorage.setItem("tasks", "[]");
    }
    return [];
};

export const useToDoStore = create<ToDoStore>(
    localStorageUpdate(
        devtools((set, get) => ({
            tasks: getTasks(),
            createTask: (title) => {
                const { tasks } = get();

                const newTask = {
                    id: generateId(),
                    title,
                    createdAt: Date.now(),
                };

                set({
                    tasks: [newTask, ...tasks],
                });
            },
            updateTask: (id: string, title: string) => {
                const { tasks } = get();

                set({
                    tasks: tasks.map((task) => ({
                        ...task,
                        title: task.id === id ? title : task.title,
                    })),
                });
            },
            removeTask: (id) => {
                const { tasks } = get();

                set({
                    tasks: tasks.filter((task) => task.id !== id),
                });
            },
        }))
    )
);
