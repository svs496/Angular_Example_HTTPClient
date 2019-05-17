import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskThumbnailComponent } from './task-thumbnail.component';

describe('TaskThumbnailComponent', () => {
  let component: TaskThumbnailComponent;
  let fixture: ComponentFixture<TaskThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
