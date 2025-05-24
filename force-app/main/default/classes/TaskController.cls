public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return TaskService.getTasks();
    }

    @AuraEnabled
    public static Task__c createTask(Task__c task) {
        return TaskService.createTask(task);
    }

    @AuraEnabled
    public static Task__c updateTask(Task__c task) {
        return TaskService.updateTask(task);
    }

    @AuraEnabled
    public static void deleteTask(Id taskId) {
        TaskService.deleteTask(taskId);
    }
}
