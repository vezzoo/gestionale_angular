import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextMaskModule } from 'angular2-text-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './base/components/toolbar/toolbar.component';
import { CardComponent } from './base/components/card/card.component';
import { CategoryComponent } from './base/components/category/category.component';
import { FormContainer } from './base/components/form-container/form-container.component';
import { SectionTitleComponent } from './base/components/section-title/section-title.component';
import { CartDetailComponent } from './base/components/cart-detail/cart-detail.component';
import { AddHeaderInterceptor } from './base/guards/addHeader.interceptor';
import { MaterialModule } from './material.module';
import { AuthComponent } from './modules/auth/auth.component';
import { HomeComponent } from './modules/home/home.component';
import { CashDeskComponent } from './modules/cash-desk/cash-desk.component';
import { CashDeskModalComponent } from './modules/cash-desk/cash-desk-modal/cash-desk-modal.component';
import { UsersManagementComponent } from './modules/users-management/users-management.component';
import { StorageComponent } from './modules/storage/storage.component';
import { StorageEditModalComponent } from './modules/storage/storage-edit-modal/storage-edit-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularResizedEventModule } from 'angular-resize-event';
import { TranslateErrorPipe } from './base/pipes/translateError.pipe';
import { NormalizePricePipe } from './base/pipes/normalizePrice.pipe';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    CashDeskComponent,
    CashDeskModalComponent,
    UsersManagementComponent,
    StorageComponent,
    StorageEditModalComponent,
    ToolbarComponent,
    CardComponent,
    CategoryComponent,
    FormContainer,
    SectionTitleComponent,
    CartDetailComponent,
    NormalizePricePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    HttpClientModule,
    NgbModule,
    AngularResizedEventModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true,
    },
    TranslateErrorPipe,
    NormalizePricePipe,
    DecimalPipe,
  ],
})
export class AppModule {}
