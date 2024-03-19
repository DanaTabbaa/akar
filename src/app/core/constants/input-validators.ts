import { Validators } from "@angular/forms";
import { EMAILREGEX, IDENTITYREGEX, MOBILEREGEX, SPACEREGEX, TEXTFORMATREGEX } from "./constant";

export let NAME_VALIDATORS=['', Validators.compose([  Validators.minLength(2),Validators.maxLength(100)])];
export let EMAIL_VALIDATORS=['', Validators.compose([Validators.email, Validators.pattern(EMAILREGEX)])];
export let MOBILE_VALIDATORS = ['', [ Validators.pattern(MOBILEREGEX) ]]
export let NAME_REQUIRED_VALIDATORS=['', Validators.compose([ Validators.required,Validators.minLength(2),Validators.maxLength(100)])];
export let PHONE_VALIDATORS = ['', Validators.compose([ Validators.pattern(MOBILEREGEX) ])]
export let FAX_VALIDATORS = ['', Validators.compose([ Validators.pattern(MOBILEREGEX) ])]
export let REQUIRED_VALIDATORS = ['', Validators.compose([ Validators.required])]
export let EMAIL_REQUIRED_VALIDATORS=['', Validators.compose([Validators.required,Validators.email, Validators.pattern(EMAILREGEX)])];
export let MOBILE_REQUIRED_VALIDATORS = ['', Validators.compose([Validators.required, Validators.pattern(MOBILEREGEX)])]
export let Phone_REQUIRED_VALIDATORS = ['', Validators.compose([Validators.required, Validators.pattern(MOBILEREGEX)])]
export let IDENTITY_REQUIRED_VALIDATORS = ['', Validators.compose([Validators.required, Validators.pattern(IDENTITYREGEX)])]
export let TEXT_FORMAT_VALIDATORS =['',Validators.compose([Validators.pattern(TEXTFORMATREGEX)])]
