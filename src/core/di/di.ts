/**
 * A simple typescript dependency injector
 * @author Mark Harding
 */

import { Binding } from './binding';

export class Di{

    static bindings = {};
    static factories = {};

    static get(alias){
      if(Di.bindings[alias]){
        let binding = Di.bindings[alias];
        if(binding.isFactory()){
          if(!Di.factories[alias])
            Di.factories[alias] = binding.getFunction(Di)();
          return Di.factories[alias];
        } else {
          return binding.getFunction(Di)();
        }
      }
      return null;
    }

    static bind(alias : string, func : Function, options : any){
      options = Object.assign({
        factory: false,
        immutable: false
      }, options);

      let binding = new Binding();
      binding.setFunction(func)
        .setFactory(options.factory)
        .setImmutable(options.immutable);
      Di.bindings[alias] = binding;
    }

}
