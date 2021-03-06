import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType, Headers }  from '@angular/http';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { GDReq } from './generating-request'

@Injectable()
export class GeneratingRequestService {
  urlBase: String = "http://localhost:8888/";
  constructor(private http: Http) { }


  generatingPDF(data: String): Observable<Blob> {

    let gdReq: GDReq = new GDReq(data);


    var headers = new Headers();
    headers.append('Accept', 'application/pdf');

    var options = new RequestOptions({
      headers: headers,
      responseType: ResponseContentType.ArrayBuffer
    });

    return this.http.post(this.urlBase + 'gen/docpdf', gdReq, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }



  private extractData(res: Response) {
    var mediaType = 'application/pdf';
    var body = new Blob([res.blob()], { type: mediaType });
    return body || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
