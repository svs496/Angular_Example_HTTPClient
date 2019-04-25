// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TaskService } from './task.service';
import { ITask } from '../model/task.model';


describe('#TaskService httpClient call testing', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    // Inject the http service and test controller for each test
    service = TestBed.get(TaskService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('#getTask', () => {
    /// Tests #1 begin ///
    it('HttpClient.getTasks() returns observable of <ITASK[]>', () => {
      const mockResponse: ITask[] = [
        {
          "taskId": 5,
          "parentTaskId": 0,
          "taskName": "Testing HttpClient",
          "startDate": new Date('04/26/2019'),
          "endDate": new Date('05/26/2019'),
          "priority": 10,
          "status": 1,
          "parentTaskName": ''
        },
        {
          "taskId": 6,
          "parentTaskId": 0,
          "taskName": "Test task 2",
          "startDate": new Date('04/26/2019'),
          "endDate": new Date('05/26/2019'),
          "priority": 10,
          "status": 1,
          "parentTaskName": ''
        }
      ];
      // Make an HTTP GET request
      service.getTasks()
        .subscribe(data => {
          // When observable resolves, result should match test data
          expect(data).toEqual(mockResponse)
        }
        );

      // The following `expectOne()` will match the request's URL.
      // If no requests or multiple requests matched that URL
      // `expectOne()` would throw.
      const req = httpTestingController.expectOne('http://localhost:5000/api/task');

      // Assert that the request is a GET.
      expect(req.request.method).toEqual('GET');

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(mockResponse);

    });
    /// Tests #2 begin ///
    it('can test for 404 error', () => {
      const emsg = 'deliberate 404 error';

      service.getTasks().subscribe(
        data => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task');

      // Respond with mock error
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });
    /// Tests #3 begin ///
    it('can test for network error', () => {
      const emsg = 'simulated network error';

      service.getTasks().subscribe(
        data => fail('should have failed with the network error'),
        (error: HttpErrorResponse) => {
          expect(error.error.message).toEqual(emsg, 'message');
        }
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task');

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const mockError = new ErrorEvent('Network error', {
        message: emsg,
      });

      // Respond with mock error
      req.error(mockError);
    });
    /// Tests #4 begin ///
    it('should be OK returning no tasks', () => {

      service.getTasks().subscribe(
        tasks => expect(tasks.length).toEqual(0, 'should have empty tasks array'),
        fail
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task');
      req.flush([]); // Respond with no heroes
    });

    /// Tests #5 begin ///
    it('HttpClient.getTaskById(id) returns observable of <ITASK>', () => {

      service.getTaskById(1).subscribe((data: any) => {
        expect(data.taskName).toBe('Get this task');
      });

      const req = httpTestingController.expectOne('http://localhost:5000/api/task/1');
      expect(req.request.method).toBe('GET');

      req.flush({
        taskName: 'Get this task'
      });

    });
    /// Tests #6 begin ///

  });

  describe('#EditTask', () => {

    it('should update a task and return it', () => {

      const updateTask: ITask = {
        "taskId": 1,
        "parentTaskId": 0,
        "taskName": "Testing HttpClient",
        "startDate": new Date('04/26/2019'),
        "endDate": new Date('05/26/2019'),
        "priority": 10,
        "status": 1,
        "parentTaskName": ''
      };

      service.editTask(updateTask.taskId, updateTask).subscribe(
        data => expect(data).toEqual(updateTask, 'should return the task'),
        fail
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task/1');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(JSON.stringify(updateTask));

      // Expect server to return the task after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateTask });
      req.event(expectedResponse);
    });


  });

  describe('#AddNewTask', () => {
    it('should add new task', () => {
      const newTask: ITask = {
        "taskId": 100,
        "parentTaskId": 0,
        "taskName": "Testing HttpClient",
        "startDate": new Date('04/26/2019'),
        "endDate": new Date('05/26/2019'),
        "priority": 10,
        "status": 1,
        "parentTaskName": ''
      };

      service.addTask(newTask).subscribe(
        data => expect(data).toEqual(newTask, 'should add new task'),
        fail
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task/');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(JSON.stringify(newTask));

      // Expect server to return the task after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: newTask });
      req.event(expectedResponse);
    });
  });

  describe('#DeleteTask', () => {
    it('should add delete task by TaskID', () => {


      service.deleteTask(3).subscribe(
        data => expect(data).toBe(3),
        fail
      );

      const req = httpTestingController.expectOne('http://localhost:5000/api/task/3');
      expect(req.request.method).toEqual('DELETE');

      req.flush(3);

    });
  });



});