import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WikipediaService} from '../../../../../core/wikipedia/services/wikipedia.service';
import {environment} from '../../../../../../environments/environment';

/**
 * Displays wikipedia dialog
 */
@Component({
  selector: 'app-wikipedia-dialog',
  templateUrl: './wikipedia-dialog.component.html',
  styleUrls: ['./wikipedia-dialog.component.scss']
})
export class WikipediaDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Term to be displayed */
  term = '';
  /** Wikipedia article */
  article;
  /** Extract to the given term */
  extract;
  /** URL to given term */
  alternateURL;
  /** Action */
  action = '';

  //
  // Static methods
  //

  /**
   * Returns m characters minimum + the consecutive n sentences of a given text
   * @param text text
   * @param n number of sentences
   * @param m minimum characters
   */
  static getFirstSentences(text: string, n: number, m: number): string {
    const separator = '. ';

    return text.slice(0, m) // Take first m characters
      + text.slice(m) // Take everything after first m characters
        .split(separator) // Split into array of sentences
        .slice(0, n) // Take first n sentences
        .join(separator) // Link sentences back together
        .replace(/\.\s*/g, '. ') // Add blanks after period if needed
      + '.';
  }

  /**
   * Constructor
   * @param data dialog data
   * @param dialogRef dialog reference
   * @param wikipediaService wikipedia service
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<WikipediaDialogComponent>,
              private wikipediaService: WikipediaService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
    this.initializeExtract();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.term.replace(/_/g, ' ');
    this.term = this.data.term;
    this.article = this.data.article;
    this.extract = this.data.extract;
    this.alternateURL = this.data.alternateURL;
    this.action = this.data.action;
  }

  /**
   * Initializes extract
   */
  private initializeExtract() {
    if (this.alternateURL != null) {
      this.extract = 'Mehr auf [https://fridaysforfuture.de/forderungen/](https://fridaysforfuture.de/forderungen/)';
    } else if (this.extract == null) {
      const extractEmitter = new EventEmitter<{ pageURL: string, extract: string }>();
      extractEmitter.subscribe(result => {

        if (result != null && result.extract != null) {
          const extract = WikipediaDialogComponent.getFirstSentences(result.extract, 2, 100);
          console.log(`extract ${extract}`);
          const more = result.pageURL != null ? ` Mehr auf [Wikipedia](` + result.pageURL.replace(' ', '%20') + `)` : ``;

          this.extract = extract + more;
        } else {
          this.extract = `Das Extrakt kann nicht abgerufen werden`;
        }
      });
      this.wikipediaService.getExtract(this.term, 'de', environment.API_TIMEOUT, environment.API_DELAY, extractEmitter);
    } else if (this.article != null) {
      const more = ` Mehr auf [Wikipedia](` + this.article.replace(' ', '%20') + `)`;
      this.extract = this.extract + more;
    }
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  confirm() {
    this.dialogRef.close();
  }
}
