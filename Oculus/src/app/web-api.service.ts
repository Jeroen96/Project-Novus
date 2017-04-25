import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WebApiService {
  public routeName: Subject<string> = new Subject<string>();

  constructor() {
  }

  updateRouteName(name: string) {
    this.routeName.next(name);
    window.document.title = name;
  }

}
