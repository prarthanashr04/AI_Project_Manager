import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Task } from "../models/task.model";
import { computed, inject } from "@angular/core";
import { firstValueFrom } from 'rxjs';
import { TaskService } from '../services/task-service';

type TaskState = {
    tasks: Task[]
}

const initialState: TaskState = {
    tasks: []
};

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        todoTasks: computed(() =>
            store.tasks()
                .filter((task) => task.status === 'TODO')
                .sort((a, b) => a.position - b.position)
        ),

        inProgressTasks: computed(() =>
            store.tasks()
                .filter((task) => task.status === 'IN_PROGRESS')
                .sort((a, b) => a.position - b.position)
        ),

        doneTasks: computed(() =>
            store.tasks()
                .filter((task) => task.status === 'DONE')
                .sort((a, b) => a.position - b.position)
        ),
        taskStats: computed(() => ({
            total: store.tasks().length,
            todoCount: store.tasks().filter(t => t.status == 'TODO').length,
            inProgressCount: store.tasks().filter(t => t.status == 'IN_PROGRESS').length,
            doneCount: store.tasks().filter(t => t.status == 'DONE').length,
            completionPercentage: store.tasks().length === 0
                ? 0
                : Math.round((store.tasks().filter(t => t.status == 'DONE').length / store.tasks().length) * 100)
        })),
        criticalTasks: computed(() =>
            store.tasks().filter(task => task.priority == 'CRITICAL')
        ),
        overdueTasks: computed(() =>
            store.tasks().filter(task => task.dueDate && task.dueDate < new Date() && task.status != 'DONE')
        )
    })),
    withMethods((
        store,
        taskApi = inject(TaskService)
    ) => ({
        deleteTask(taskId: number) {
            patchState(store, {
                tasks: store.tasks().filter(task => task.id != taskId)
            })
        },
        getTaskById(taskId: number) {
            return store.tasks().find(t => t.id === taskId);
        },
        async loadTasks(projectId: number) {
            try {
                const tasks: Task[] = await firstValueFrom(
                    taskApi.getProjectTasks(projectId)
                );

                patchState(store, { tasks });
            } catch (error) {
                console.error('Unable to load tasks', error);
                patchState(store, { tasks: [] });
            }
        },

        async createTask(projectId: number, task: Task) {
            const createdTask = await firstValueFrom(
                taskApi.createTask(projectId, task)
            );

            patchState(store, {
                tasks: [...store.tasks(), createdTask]
            });
        },

        async updateTask(projectId: number, task: Task) {
            const updatedTask = await firstValueFrom(
                taskApi.updateTask(projectId, task)
            );

            patchState(store, {
                tasks: store.tasks().map((existingTask) =>
                    existingTask.id === updatedTask.id
                        ? updatedTask
                        : existingTask
                )
            });
        },

        async reorderTasks(
            projectId: number,
            changedTasks: Task[]
        ) {
            const changedTaskIds = new Set(
                changedTasks.map((task) => task.id)
            );

            patchState(store, {
                tasks: [
                    ...store.tasks().filter(
                        (task) => !changedTaskIds.has(task.id)
                    ),
                    ...changedTasks,
                ],
            });

            try {
                await firstValueFrom(
                    taskApi.reorderTasks(
                        projectId,
                        changedTasks.map((task) => ({
                            id: task.id,
                            status: task.status,
                            position: task.position,
                        }))
                    )
                );
            } catch (error) {
                console.error('Unable to save task order', error);

                const tasks: Task[] = await firstValueFrom(
                    taskApi.getProjectTasks(projectId)
                );

                patchState(store, { tasks });
            }
        },
    }))
)
