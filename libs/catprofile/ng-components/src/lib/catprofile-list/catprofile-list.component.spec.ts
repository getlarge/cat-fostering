import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatProfileListComponent } from './catprofile-list.component';

describe('NgCatprofileComponentsComponent', () => {
  let component: CatProfileListComponent;
  let fixture: ComponentFixture<CatProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatProfileListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CatProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
