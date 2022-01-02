import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

export interface Person {
  id: number;
  name: string;
}

@Component({
  selector: 'person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {

  public route: string = `${environment.api}/person`;
  public loading: boolean = false;
  public people: Person[] = [];

  public id?: number;
  public name: string = '';

  constructor(private _httpClient: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.loading = true;
    this._httpClient.get(this.route).subscribe({
      next: (response: any) => {
        this.people = response.data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  onClickAddUpdate(): void {
    if (!this.id) {
      this._httpClient
        .post(`${this.route}/create`, { name: this.name })
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
        .put(`${this.route}/${this.id}`, { name: this.name })
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

  onClickEdit(Person: Person): void {
    this.id = Person.id;
    this.name = Person.name;
  }

  clearForm(): void {
    this.id = undefined;
    this.name = '';
  }
}