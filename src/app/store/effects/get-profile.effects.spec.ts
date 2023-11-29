import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GetProfileEffects } from './get-profile.effects';

describe('GetProfileEffects', () => {
  let actions$: Observable<any>;
  let effects: GetProfileEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetProfileEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GetProfileEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
