/**
 * dependency injector binding
 * @author Mark Harding
 */

export class Binding {

  private factory : boolean = false;
  private immutable : boolean = false;
  private func : Function;


  public setFactory(factory : boolean) : this{
    this.factory = factory;
    return this;
  }

  public isFactory() : boolean{
    return this.factory;
  }

  public setImmutable(immutable : boolean) : this{
    this.immutable = immutable;
    return this;
  }

  public isImmutable() : boolean{
    return this.immutable;
  }

  public setFunction(func : Function) : this{
    this.func = func;
    return this;
  }

  public getFunction() : Function{
    return this.func;
  }

}
