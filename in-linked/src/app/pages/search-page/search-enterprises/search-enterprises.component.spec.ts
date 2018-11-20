import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnterprisesComponent } from './search-enterprises.component';

describe('SearchEnterprisesComponent', () => {
  let component: SearchEnterprisesComponent;
  let fixture: ComponentFixture<SearchEnterprisesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEnterprisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEnterprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
