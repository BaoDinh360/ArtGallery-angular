import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSearchFilterComponent } from './post-search-filter.component';

describe('PostSearchFilterComponent', () => {
  let component: PostSearchFilterComponent;
  let fixture: ComponentFixture<PostSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSearchFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
