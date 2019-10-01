import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlestateComponent } from './battlestate.component';

describe('BattlestateComponent', () => {
  let component: BattlestateComponent;
  let fixture: ComponentFixture<BattlestateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlestateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
