import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {STACK_PERSISTENCE_POUCHDB} from '../core/entity/entity.module';
import {StacksPersistenceService} from '../core/entity/services/stack/persistence/stacks-persistence.interface';
import {ROUTE_CARDS} from '../app.routes';
import {VariantService} from '../core/util/services/variant.service';
import {Variant} from '../core/util/model/variant.enum';
import {Stack} from '../core/entity/model/stack/stack.model';
import {GamesService} from '../core/entity/services/game/games.service';
import {environment} from '../../environments/environment';
import {LogService} from '../core/log/services/log.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

/**
 * Checks if it is necessary to show game page
 */
@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {

  /** Helper subject used to finish other subscriptions */
  private unsubscribeSubject = new Subject();

  /**
   * Constructor
   * @param stacksPersistenceService stacks persistence service
   * @param router router
   */
  constructor(@Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private router: Router) {
  }

  /**
   * Checks if the guarded route can be activated
   * @param next activated toute
   * @param state router state
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    LogService.trace(`GameGuard#canActivate`);
    return new Promise((resolve) => {
      this.stacksPersistenceService.stackSubject.pipe(
        takeUntil(this.unsubscribeSubject)).subscribe((value) => {
        LogService.trace(`GameGuard stackSubject > `);

        if (value != null) {
          const stack = value as Stack;
          if (GamesService.existsGame(stack)) {
            switch (VariantService.getVariant()) {
              case Variant.SCIDDLE: {
                this.router.navigate([`/${ROUTE_CARDS}/${stack.id}`]).then();
                this.unsubscribe();
                resolve(false);
                break;
              }
              case Variant.S4F: {
                this.router.navigate([`/${ROUTE_CARDS}`]).then();
                this.unsubscribe();
                resolve(false);
                break;
              }
            }
          } else {
            // No game exists on this stack
            LogService.debug('No game exists on this stack');

            this.unsubscribe();
            resolve(true);
          }
        } else {
          // No stack initialized yet
          LogService.debug('No stack initialized yet');
          this.unsubscribe();
          resolve(true);
        }
      });

      this.stacksPersistenceService.databaseErrorSubject.pipe(
        takeUntil(this.unsubscribeSubject)).subscribe(() => {
        LogService.trace(`GameGuard databaseErrorSubject > `);

        this.unsubscribe();
        resolve(true);
      });

      // Load stack
      switch (VariantService.getVariant()) {
        case Variant.SCIDDLE: {
          const id = next.paramMap.get('id');

          if (id != null) {
            this.stacksPersistenceService.findStackByID(id);
          } else {
            // No id has been passed
            this.unsubscribe();
            resolve(true);
          }
          break;
        }
        case Variant.S4F: {
          this.stacksPersistenceService.findStackByID(environment.DEFAULT_STACK.toString());
          break;
        }
      }
    });
  }

  /**
   * Unsubscribes from subjects
   */
  private unsubscribe() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
