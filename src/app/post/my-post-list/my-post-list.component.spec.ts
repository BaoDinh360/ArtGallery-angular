import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostListComponent } from './my-post-list.component';

describe('MyPostListComponent', () => {
  let component: MyPostListComponent;
  let fixture: ComponentFixture<MyPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPostListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
