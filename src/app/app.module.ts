import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthService} from './services/auth.service';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {LoginGuard} from './guards/login.guard';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {PizzaPartyComponent} from './pizza-party/pizza-party.component';
import {MatDialogModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {AddQuestionsFormComponent} from './components/add-questions-form/add-questions-form.component';
import {IndexComponent} from './components/index/index.component';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { DeleteQuizComponent } from './dialogs/delete-quiz/delete-quiz.component';
import { EditQuizComponent } from './dialogs/edit-quiz/edit-quiz.component';
import { TakeQuizComponent } from './components/take-quiz/take-quiz.component';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { QuestionComponent } from './dialogs/question/question.component';
import { QuizComponent } from './dialogs/quiz/quiz.component';
import {NgbCarouselConfig, NgbCarouselModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TestBlockchainComponent } from './test-blockchain/test-blockchain.component';

export const firebaseConfig = {
  /*firebase configuration*/
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    PageNotFoundComponent,
    PizzaPartyComponent,
    SideMenuComponent,
    AddQuestionsFormComponent,
    IndexComponent,
    QuizListComponent,
    DeleteQuizComponent,
    EditQuizComponent,
    TakeQuizComponent,
    QuestionComponent,
    QuizComponent,
    TestBlockchainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    NgbModule,
    NgbModule.forRoot(),
    NgbCarouselModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
      {path: 'sign-up', component: SignUpComponent, canActivate: [LoginGuard]},
      {path: 'page-not-found', component: PageNotFoundComponent},
      {path: 'add-quiz', component: AddQuestionsFormComponent, canActivate: [AuthGuard]},
      {path: 'index', component: IndexComponent, canActivate: [AuthGuard]},
      {path: 'your-quizzes', component: QuizListComponent, canActivate:[AuthGuard]},
      {path: 'take-quiz', component: TakeQuizComponent, canActivate: [AuthGuard]},
      {path: 'test-blockchain', component: TestBlockchainComponent},//test
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'}
    ], {useHash: true})
  ],
  providers: [AuthService, AuthGuard, LoginGuard, AddQuestionsFormComponent],
  bootstrap: [AppComponent],
  entryComponents: [PizzaPartyComponent, DeleteQuizComponent, EditQuizComponent, QuizComponent, QuestionComponent]
})
export class AppModule {
}
