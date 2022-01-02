import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../person-list/person-list.component';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

interface ContactType {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  id_person: number;
  id_contact_type: number;
  content: string;
  contact_type: ContactType;
  person: Person;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  public loading: boolean = false;
  public route: string = `${environment.api}/contact`;

  public contactTypeOptions: ContactType[] = [];
  public person?: Person;
  public idPerson?: number;
  public id?: number;
  public idContactType?: number;
  public content?: string;

  public contacts: Contact[] = [];

  constructor(
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idPerson = +(this._route.snapshot.paramMap.get('personId') || 0);

    this.getPerson();
    this.getContactTypeOptions();
    this.getList();
  }

  getPerson(): void {
    this.loading = true;

    this._httpClient
      .get(`${environment.api}/person/${this.idPerson}`)
      .subscribe({
        next: (response: any) => {
          this.person = response.data;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  getContactTypeOptions(): void {
    this.loading = true;

    this._httpClient
      .get(`${environment.api}/contact-type`)
      .subscribe({
        next: (response: any) => {
          this.contactTypeOptions = response.data;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  getList(): void {
    this.loading = true;

    const params: HttpParams = new HttpParams().set('id_person', this.idPerson as any);

    this._httpClient
      .get(`${environment.api}/contact`, { params })
      .subscribe({
        next: (response: any) => {
          this.contacts = response.data;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  onClickAddUpdate(): void {
    if (!this.id) {
      this._httpClient
        .post(`${this.route}/create`, {
          id_person: this.idPerson,
          id_contact_type: this.idContactType,
          content: this.content,
        })
        .subscribe({
          next: (response: any) => {
            this.getList();
            this._snackBar.open(response.message, '', { duration: 2000 });
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        });
    } else {
      this._httpClient
        .put(`${this.route}/${this.id}`, {
          id_contact_type: this.idContactType,
          content: this.content,
        })
        .subscribe({
          next: (response: any) => {
            this.getList();
            this._snackBar.open(response.message, '', { duration: 2000 });
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        });
    }

    this.clearForm();
  }

  onClickDelete(id: number): void {
    this._httpClient
      .delete(`${this.route}/${id}`)
      .subscribe({
        next: (response: any) => {
          this.getList();
          this._snackBar.open(response.message, '', { duration: 2000 });
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
  }

  onClickEdit(contact: Contact): void {
    this.id = contact.id;
    this.idContactType = contact.id_contact_type;
    this.content = contact.content;
  }

  clearForm(): void {
    this.id = undefined;
    this.idContactType = undefined;
    this.content = '';
  }
}
