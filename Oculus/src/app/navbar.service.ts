import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class NavbarService {
  visible: boolean;
  public routeName: Subject<string> = new Subject<string>();

  constructor() { this.visible = true; }

  setName(name: string) {
    this.routeName.next(name);
    window.document.title = name;
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

}
