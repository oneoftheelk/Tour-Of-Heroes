import { Injectable } from '@angular/core';
import { Hero } from './hero'
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(() => this.log('Fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(() => this.log(`Fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(() => this.log(`Updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`Added hero with id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id
    const url = `${this.heroesUrl}/${id}`

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(() => this.log(`Deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([])
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(() => this.log(`Found heroes matching '${term}'`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      this.log(`${operation} Failed: ${error.body.error}`)
      return of(result as T)
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }
}
