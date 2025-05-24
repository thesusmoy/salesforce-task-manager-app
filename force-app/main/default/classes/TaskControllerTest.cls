@isTest
public class TaskControllerTest {
    @testSetup
    static void setup() {
        Task__c t = new Task__c(Title__c='Test Task', Description__c='Test Desc', Status__c='Not Started', Due_Date__c=Date.today());
        insert t;
    }

    @isTest
    static void testGetTasks() {
        List<Task__c> tasks = TaskController.getTasks();
        System.assert(tasks.size() > 0, 'Should return at least one task');
    }

    @isTest
    static void testCreateTask() {
        Task__c t = new Task__c(Title__c='New Task', Description__c='Desc', Status__c='In Progress', Due_Date__c=Date.today().addDays(1));
        Task__c created = TaskController.createTask(t);
        System.assertNotEquals(null, created.Id, 'Task should be created');
    }

    @isTest
    static void testUpdateTask() {
        Task__c t = [SELECT Id, Title__c FROM Task__c LIMIT 1];
        t.Title__c = 'Updated';
        Task__c updated = TaskController.updateTask(t);
        System.assertEquals('Updated', updated.Title__c, 'Title should be updated');
    }

    @isTest
    static void testDeleteTask() {
        Task__c t = new Task__c(Title__c='To Delete', Description__c='Desc', Status__c='Completed', Due_Date__c=Date.today());
        insert t;
        TaskController.deleteTask(t.Id);
        Task__c deleted = [SELECT Id FROM Task__c WHERE Id = :t.Id LIMIT 1];
        System.assertEquals(null, deleted, 'Task should be deleted');
    }
}
