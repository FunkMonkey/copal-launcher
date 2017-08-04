import Rx from 'rxjs/Rx';

export default class AutoBoundSubject extends Rx.Subject {
  constructor() {
    super();
    this.next = this.next.bind( this );
    this.error = this.error.bind( this );
    this.complete = this.complete.bind( this );
  }
}
