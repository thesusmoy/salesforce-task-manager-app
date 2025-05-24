public with sharing class TaskService {
    public static List<Task__c> getTasks() {
        return [SELECT Id, Title__c, Description__c, Status__c, Due_Date__c FROM Task__c ORDER BY Due_Date__c ASC];
    }

    public static Task__c createTask(Task__c task) {
        insert task;
        return task;
    }

    public static Task__c updateTask(Task__c task) {
        update task;
        return task;
    }

    public static void deleteTask(Id taskId) {
        delete [SELECT Id FROM Task__c WHERE Id = :taskId];
    }
}
