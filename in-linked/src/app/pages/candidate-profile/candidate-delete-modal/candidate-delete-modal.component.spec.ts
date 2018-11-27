import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDeleteModalComponent } from './candidate-delete-modal.component';

describe('CandidateDeleteModalComponent', () => {
  let component: CandidateDeleteModalComponent;
  let fixture: ComponentFixture<CandidateDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
