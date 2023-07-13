import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarActionsComponent } from './toolbar-actions.component';

describe('ToolbarActionsComponent', () => {
  let component: ToolbarActionsComponent;
  let fixture: ComponentFixture<ToolbarActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
