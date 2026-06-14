import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Task, TaskStatus } from "../models/task.model";
import { computed } from "@angular/core";

type TaskState = {
    tasks: Task[]
}

const initialState: TaskState = {
    tasks: [
        {
            id: 1,
            title: 'Design UI',
            description: 'Create modern UI designs',
            status: 'TODO',
            projectId: 1,
            priority: 'HIGH',
            assignee: 'John Doe',
            dueDate: new Date('2026-06-15'),
            labels: ['Design', 'Frontend'],
            estimatedHours: 8
        },
        {
            id: 2,
            title: 'Create API',
            description: 'Build REST API endpoints',
            status: 'IN_PROGRESS',
            projectId: 1,
            priority: 'CRITICAL',
            assignee: 'Jane Smith',
            dueDate: new Date('2026-05-25'),
            labels: ['Backend'],
            estimatedHours: 16
        },
        {
            id: 3,
            title: 'Deploy App',
            description: 'Deploy to production',
            status: 'DONE',
            projectId: 1,
            priority: 'MEDIUM',
            assignee: 'Bob Johnson',
            dueDate: new Date('2026-05-20'),
            labels: ['DevOps'],
            estimatedHours: 4
        }
    ]
}

export const TaskStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        todoTasks: computed(() =>
            store.tasks().filter(task => task.status == 'TODO')
        ),
        inProgressTasks: computed(() =>
            store.tasks().filter(task => task.status == 'IN_PROGRESS')
        ),
        doneTasks: computed(() =>
            store.tasks().filter(task => task.status == 'DONE')
        ),
        taskStats: computed(() => ({
            total: store.tasks().length,
            todoCount: store.tasks().filter(t => t.status == 'TODO').length,
            inProgressCount: store.tasks().filter(t => t.status == 'IN_PROGRESS').length,
            doneCount: store.tasks().filter(t => t.status == 'DONE').length,
            completionPercentage: Math.round((store.tasks().filter(t => t.status == 'DONE').length / store.tasks().length) * 100)
        })),
        criticalTasks: computed(() =>
            store.tasks().filter(task => task.priority == 'CRITICAL')
        ),
        overdueTasks: computed(() =>
            store.tasks().filter(task => task.dueDate && task.dueDate < new Date() && task.status != 'DONE')
        )
    })),
    withMethods((store) => ({
        addTask(task: Task) {
            patchState(store, {
                tasks: [
                    ...store.tasks(),
                    task
                ]
            }
            )
        },
        updateTaskStatus(taskId: number, newStatus: TaskStatus) {
            patchState(store, {
                tasks: store.tasks().map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )

            });

        },
        deleteTask(taskId: number) {
            patchState(store, {
                tasks: store.tasks().filter(task => task.id != taskId)
            })
        },
        updateTask(taskId: number, updates: Partial<Task>) {
            patchState(store, {
                tasks: store.tasks().map(task =>
                    task.id === taskId ? { ...task, ...updates } : task
                )
            });
        },

        getTaskById(taskId: number) {
            return store.tasks().find(t => t.id === taskId);
        }
    }))
)