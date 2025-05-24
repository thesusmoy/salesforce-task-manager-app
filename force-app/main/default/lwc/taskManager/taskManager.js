import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import createTask from '@salesforce/apex/TaskController.createTask';
import updateTask from '@salesforce/apex/TaskController.updateTask';
import deleteTask from '@salesforce/apex/TaskController.deleteTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Title', fieldName: 'Title__c' },
    { label: 'Description', fieldName: 'Description__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'Edit', name: 'edit' },
                { label: 'Delete', name: 'delete' },
            ],
        },
    },
];

export default class TaskManager extends LightningElement {
    @track tasks;
    @track showModal = false;
    @track modalTitle = '';
    @track task = {};
    @track isEdit = false;
    columns = COLUMNS;
    statusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
    ];

    @wire(getTasks)
    wiredTasks({ error, data }) {
        if (data) {
            this.tasks = data;
        } else if (error) {
            this.showToast('Error', 'Failed to load tasks', 'error');
        }
    }

    handleNewTask() {
        this.task = {};
        this.isEdit = false;
        this.modalTitle = 'New Task';
        this.showModal = true;
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        if (action.name === 'edit') {
            this.task = { ...row };
            this.isEdit = true;
            this.modalTitle = 'Edit Task';
            this.showModal = true;
        } else if (action.name === 'delete') {
            deleteTask({ taskId: row.Id })
                .then(() => {
                    this.showToast('Success', 'Task deleted', 'success');
                    return this.refreshTasks();
                })
                .catch(() => {
                    this.showToast('Error', 'Failed to delete task', 'error');
                });
        }
    }

    handleTitleChange(event) {
        this.task.Title__c = event.target.value;
    }
    handleDescriptionChange(event) {
        this.task.Description__c = event.target.value;
    }
    handleStatusChange(event) {
        this.task.Status__c = event.detail.value;
    }
    handleDueDateChange(event) {
        this.task.Due_Date__c = event.target.value;
    }

    handleCancel() {
        this.showModal = false;
    }

    handleSave() {
        if (this.isEdit) {
            updateTask({ task: this.task })
                .then(() => {
                    this.showToast('Success', 'Task updated', 'success');
                    this.showModal = false;
                    return this.refreshTasks();
                })
                .catch(() => {
                    this.showToast('Error', 'Failed to update task', 'error');
                });
        } else {
            createTask({ task: this.task })
                .then(() => {
                    this.showToast('Success', 'Task created', 'success');
                    this.showModal = false;
                    return this.refreshTasks();
                })
                .catch(() => {
                    this.showToast('Error', 'Failed to create task', 'error');
                });
        }
    }

    refreshTasks() {
        return getTasks().then((data) => {
            this.tasks = data;
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
            })
        );
    }
}
