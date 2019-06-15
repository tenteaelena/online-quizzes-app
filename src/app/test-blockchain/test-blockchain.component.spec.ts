import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBlockchainComponent } from './test-blockchain.component';

describe('TestBlockchainComponent', () => {
  let component: TestBlockchainComponent;
  let fixture: ComponentFixture<TestBlockchainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBlockchainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
