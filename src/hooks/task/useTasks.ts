import { useState, DragEvent } from 'react';
import { useTaskStore } from '../../stores';
import Swal from 'sweetalert2';
import { TaskStatus } from '../../interfaces';

interface Options {
    status: TaskStatus;
}

export const useTasks = ({ status }: Options) => {
    const isDragging = useTaskStore((state) => !!state.draggingTaskId);
    const onTaskDrop = useTaskStore((state) => state.onTaskDrop);
    const addTask = useTaskStore((state) => state.addTask);
    const [onDragOver, setOnDragOver] = useState(false);

    const handleAddTask = async () => {
        const resp = await Swal.fire({
            title: 'Nueva tarea',
            input: 'text',
            inputLabel: 'Nombre de la tarea',
            inputPlaceholder: 'Ingrese nombre de la tarea',
            showCancelButton: true,
            inputValidator(value) {
                if (!value) {
                    return 'Debe ingresar un nombre para la tarea';
                }
            },
        });

        if (!resp.isConfirmed) return;
        addTask(resp.value, status);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setOnDragOver(true);
    };
    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setOnDragOver(false);
    };
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setOnDragOver(false);
        onTaskDrop(status);
    };

    return {
        isDragging,
        onDragOver,

        handleAddTask,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    };
};
