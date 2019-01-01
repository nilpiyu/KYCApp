# ng2-font-awesome

a reusable font-awesome span

## usage

## importing in [angular-seed (mgechev)](https://github.com/mgechev/angular-seed) project

project.config.ts:
```
  import { ExtendPackages } from './seed.config.interfaces';
  ...

  let additionalPackages: ExtendPackages[] = [{
    name: 'ng2-font-awesome',
    path: 'node_modules/ng2-font-awesome/index.js'
  }];
  
  this.addPackagesBundles(additionalPackages);
```

## bundling with [systemjs builder](https://github.com/systemjs/builder)



## importing the module

```
import { FontAwesomeModule} from 'ng2-font-awesome';
```

### template usage

the following usages all will do fine:

```html
<font-awesome [faIcon]="'fa fa-cubes'"></font-awesome>
<font-awesome [faIcon]="'fa-cubes'"></font-awesome>
<font-awesome [faIcon]="'cubes'"></font-awesome>
```

output:

![alt text](https://github.com/gforceg/ng2-font-awesome/raw/master/screen-shot.png)

