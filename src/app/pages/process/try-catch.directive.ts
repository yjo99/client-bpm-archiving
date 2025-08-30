import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
    selector: '[ngTry]'
})
export class TryCatchDirective {
    private hasView = false;
    private context: TryCatchContext = new TryCatchContext();

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set ngTry(expression: any) {
        this.context.$implicit = this.context.control = expression;

        if (!this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef, this.context);
            this.hasView = true;
        }
    }

    static ngTemplateContextGuard(dir: TryCatchDirective, ctx: any): ctx is TryCatchContext {
        return true;
    }
}

class TryCatchContext {
    public $implicit: any = null;
    public control: any = null;
    public error: any = null;
}