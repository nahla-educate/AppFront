import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

export interface RegisterData {

  userMail: string;
  userPassword: string;
}

export class AuthData {
  userMail: string | undefined;
  userPassword: string | undefined;
}

export interface AuthenticationResponse {
  token: string;
  message: string;
  user: AuthData;
  // Other properties if needed
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `http://localhost:8080/api/auth`;
  private userSubject: BehaviorSubject<AuthData | null>;
  public user: Observable<AuthData | null>;
  private token: string | null = null;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    const storedUser = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<AuthData | null>(storedUser ? JSON.parse(storedUser) : null);
    this.user = this.userSubject.asObservable();
  }

  setToken(token: string): void {
    this.token = token;
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  register(registerData: RegisterData): Observable<any> {
    const registerUrl = `${this.apiUrl}/signup`;
    return this.http.post<any>(registerUrl, registerData);
  }

  authenticate(authenticationRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, authenticationRequest);
  }
  

  loginyes(data: any):Observable<any>{
    console.log("I'am server");
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  login(loginPayload: AuthData): Observable<boolean> {
    return this.http.post<AuthenticationResponse>(this.apiUrl + '/login', loginPayload).pipe(
      map(data => {
        this.localStorageService.store('authenticationToken', data.token);
        this.localStorageService.store('user', data.user);
        this.userSubject.next(data.user); // Update the userSubject with the logged-in user
        console.log(data.user);
        return true;
      })
    );
  }
}
