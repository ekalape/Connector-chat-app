import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

fdescribe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should make post request', () => {
    const spy = spyOn(httpClient, "post")
    service.login("dddd@hhh", "dddd");
    expect(spy).toHaveBeenCalled()
  });
});
