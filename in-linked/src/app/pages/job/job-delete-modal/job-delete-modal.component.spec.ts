import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDeleteModalComponent } from './job-delete-modal.component';

describe('JobDeleteModalComponent', () => {
  let component: JobDeleteModalComponent;
  let fixture: ComponentFixture<JobDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
