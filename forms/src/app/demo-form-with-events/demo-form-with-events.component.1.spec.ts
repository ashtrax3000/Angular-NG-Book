import {
  TestBed,
  ComponentFixture,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  dispatchEvent,
  ConsoleSpy
} from '../utils';

import { DemoFormWithEventsComponent } from './demo-form-with-events.component';

describe('DemoFormWithEventsComponent (Long)', () => {
  let component: DemoFormWithEventsComponent;
  let fixture: ComponentFixture<DemoFormWithEventsComponent>;

  let originalConsole, fakeConsole;
  let el, input, form;

  beforeEach(async(() => {
    // replace the real window.console with our spy
    fakeConsole = new ConsoleSpy();
    originalConsole = window.console;
    (<any>window).console = fakeConsole;

    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ DemoFormWithEventsComponent ]
    })
    .compileComponents();
  }));

  // restores the real console
  afterAll(() => (<any>window).console = originalConsole);

  it('validates and triggers events', fakeAsync( () => {
    fixture = TestBed.createComponent(DemoFormWithEventsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    form = fixture.debugElement.query(By.css('form')).nativeElement;
    fixture.detectChanges();

    input.value = '';
    dispatchEvent(input, 'input');
    fixture.detectChanges();
    tick();

    // no value on sku field, all error messages are displayed
    let msgs = el.querySelectorAll('.ui.error.message');
    expect(msgs[0].innerHTML).toContain('SKU is invalid');
    expect(msgs[1].innerHTML).toContain('SKU is required');

    // displays no errors when sku has a value
    input.value = 'XYZ';
    dispatchEvent(input, 'input');
    fixture.detectChanges();
    tick();

    msgs = el.querySelectorAll('.ui.error.message');
    expect(msgs.length).toEqual(0);

    fixture.detectChanges();
    dispatchEvent(form, 'submit');
    tick();

    // checks for the form submitted message
    expect(fakeConsole.logs).toContain('you submitted value: XYZ');
  }));

});
