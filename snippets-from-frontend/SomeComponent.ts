import { uniqBy } from 'lodash';

type FileEventTarget = EventTarget & { files: FileList };

@Component({
    selector: 'app-some-component',
    template: `
        <div>
            <form [formGroup]="form">
                <input
                    type="email"
                    inputmode="email"
                    formControlName="email" />

                <textarea
                    rows="5"
                    formControlName="message"
                ></textarea>
            </form>

            <div>
                <input
                    type="file"
                    class="hidden-input"
                    multiple="multiple"
                    accept=".png,.gif,.jpg,.pdf"
                    #fileInput
                    (change)="fileChangeHandler($event)" />

                <button (click)="addFiles()">Upload files</button>
            </div>

            <button (click)="sendFeedback()">Send feedback</button>
        </div>
    `
})
export class SomeComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput: ElementRef;

    private _destroyed = new Subject();

    private files: File[] = [];

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private someService: SomeService,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            message: ['', Validators.required],
        });
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    sendFeedback(): void {
        this.makeFormTouched();

        if (this.form.invalid) {
            return;
        }

        const payload = this.form.getRawValue();

        const formData = new FormData();
        if (this.files && this.files.length > 0) {
            this.files.forEach(file => {
                formData.append('files', file, file?.name);
            });
        }

        Object.keys(payload).forEach(key => {
            formData.append(key, payload[key]);
        });

        this.someService
            .sendFeedback(formData)
            .pipe(takeUntil(this._destroyed))
            .subscribe(resp => {
                console.log(resp);
            });
    }

    fileChangeHandler(event: Event): void {
        const { target } = event as Event & { target: FileEventTarget };
    
        if (target.files && target.files.length > 0) {
          this.files = uniqBy(this.files.concat(Array.from(target.files)), 'name');
          this.resetInput();
        }
    }

    private makeFormTouched(): void {
        Object.keys(this.form.controls).forEach(controlName => {
            this.form.get(controlName).markAsTouched();
        });
    }

    private resetInput(): void {
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }
}