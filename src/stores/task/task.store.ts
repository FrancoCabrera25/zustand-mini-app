import { create, StateCreator } from 'zustand';
import { Task, TaskStatus } from '../../interfaces';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
//import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';
interface TaskState {
    tasks: Record<string, Task>;
    draggingTaskId?: string;
    getTaskByStatus: (status: TaskStatus) => Task[];
    addTask: (title: string, status: TaskStatus) => void;
    setDraggingTaskId: (taskId: string) => void;
    removeDraggingTaskId: () => void;
    changeTaskStatus: (taskId: string, status: TaskStatus) => void;
    onTaskDrop: (status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState, [['zustand/immer', never]]> = (set, get) => ({
    tasks: {
        'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'done' },
        'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'open' },
        'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'in-progress' },
        'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' },
        'ABC-5': { id: 'ABC-5', title: 'Task 5', status: 'open' },
        'ABC-6': { id: 'ABC-6', title: 'Task 6', status: 'open' },
    },
    getTaskByStatus: (status: TaskStatus) => {
        return Object.values(get().tasks).filter((task) => task.status === status);
    },

    addTask: (title: string, status: TaskStatus) => {
        const newTask = { id: uuidv4(), title, status };

        //immer middlewers
        set((state) => {
            state.tasks[newTask.id] = newTask;
        });
        //con immer
        // set(
        //     produce((state: TaskState) => {
        //         state.tasks[newTask.id] = newTask;
        //     })
        // );
        //sin immer
        // set((state) => ({
        //     tasks: {
        //         ...state.tasks,
        //         [newTask.id]: newTask
        //     },
        // }));
    },

    setDraggingTaskId: (taskId: string) => {
        set({ draggingTaskId: taskId });
    },
    removeDraggingTaskId: () => {
        set({ draggingTaskId: undefined });
    },
    changeTaskStatus: (taskId: string, status: TaskStatus) => {
        const task = {...get().tasks[taskId] };
        task.status = status;
        set((state) => ({
            tasks: {
                ...state.tasks,
                [taskId]: task,
            },
        }));

        // set(state => {
        //     state.tasks[taskId] = {
        //         ...task
        //     };
        // })
    },
    onTaskDrop: (status: TaskStatus) => {
        const taskId = get().draggingTaskId;

        if (!taskId) return;

        get().changeTaskStatus(taskId, status);
        get().removeDraggingTaskId();
    },
});

export const useTaskStore = create<TaskState>()(devtools(persist(immer(storeApi), { name: 'task-store' })));
