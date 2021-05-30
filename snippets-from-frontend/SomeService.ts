@Injectable({ providedIn: 'root' })
export class SomeService {
    constructor(
        private http: HttpClient,
    ) {}

    sendFeedback(payload: FormData): Observable<any> {
        return this.http.post(`${environment.apiUrl}/feedback`, payload);
    }
}