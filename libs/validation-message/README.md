# @protoarch.angular/validation-message

**ValidationMessageModule** gives you possibility to localize form validators and it automatically puts localized validator error message to markup (if there is one).
Fully compatable with angular [reactive form validators](https://angular.io/guide/reactive-forms#step-2-making-a-field-required).

Before (dirty \*ngIf markup):

```html
<input
    id="name"
    name="name"
    class="form-control"
    required
    minlength="4"
    appForbiddenName="bob"
    [(ngModel)]="hero.name"
    #name="ngModel"
/>
<div *ngIf="name.errors.minlength">Name must be at least 4 characters long.</div>
```

After (clean markup with auto inserting error messages):

```html
<input
    prtValidationMessage
    name="email"
    type="email"
    class="form-control"
    formControlName="email"
    [(ngModel)]="model.email"
/>
```

-   [Demo project](https://github.com/Romanchuk/angular-i18next-demo)
-   [Live demo](https://romanchuk.github.io/angular-i18next-demo/)

## Installation

1. > npm install @protoarch.angular/validation-message
2. Import **ValidationMessageModule** to module where you expect to enable error message to form fields
3. Set **prtValidationMessage directive** to any form fields

## Providers

### I18NextValidationMessageModule

Bridge for "@protoarch.angular/validation-message" for translate error messages via i18next.

Requirements:

1. > npm install i18next angular-i18next
2. import **I18NextValidationMessageModule** insteand of ValidationMessageModule

### Custom providers

You can implement your own provider. Check source code of **I18NextValidationMessageModule** as example

### Migration

Since v2 @protoarch.angular/validation-message includes providers
