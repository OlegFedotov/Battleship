import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBattlefieldComponent } from './custom-battlefield.component';

describe('CustomBattlefieldComponent', () => {
  let component: CustomBattlefieldComponent;
  let fixture: ComponentFixture<CustomBattlefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBattlefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBattlefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
